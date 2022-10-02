import {render, remove, RenderPosition} from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EventEmptyListView from '../view/event-empty-list-view.js';

import PointPresenter from './point-presenter.js';
import PointNewPresenter from './new-point-presenter.js';

import SortView from '../view/sort-view.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {sortPointDay, sortPointPrice} from '../utils/event.js';
import {filter} from '../utils/filter.js';


export default class TripPresenter {
  #eventListComponent = new EventListView();

  #eventsContainer = null;

  #pointsModel = null;
  #filterModel = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  #noEventComponent = null;

  #filterType = FilterType.EVERYTHING;

  #sortComponent = null;
  #currentSortType = SortType.DAY;

  constructor(eventsContainer, pointsModel, filterModel) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#eventListComponent.element, this.#pointsModel, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortPointDay);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointPrice);
    }

    return filteredPoints;
  }

  init = () => {
    render(this.#eventListComponent, this.#eventsContainer);

    this.#renderTrip();
    //this.#sortPoints(this.#currentSortType);
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback);
  };


  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#eventListComponent.element, this.#pointsModel, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);

    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();

    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({ resetSortType: true });
        this.#renderTrip();
        break;
    }
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  };

  #handleSortTypeChange = (sortType) => {
    if (!this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #renderNoPoints = () => {
    this.#noEventComponent = new EventEmptyListView(this.#filterType);
    render(this.#noEventComponent, this.#eventsContainer);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderTrip = () => {
    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoPoints();
    }

    this.#renderSort();
    this.#renderPoints(points);
  };

  #clearTrip = ({ resetSortType = false } = {}) => {
    this.#pointNewPresenter.destroy();

    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
    }

    remove(this.#sortComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
