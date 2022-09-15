import {render, remove, RenderPosition} from '../framework/render.js';
import {updateItem} from '../utils/common.js';
import {FilterType} from '../const.js';
import EventListView from '../view/event-list-view.js';
import EventEmptyListView from '../view/event-empty-list-view.js';

import PointPresenter from './point-presenter.js';

import SortView from '../view/sort-view.js';
import {SortType} from '../const.js';
import {sortPointDay, sortPointPrice} from '../utils/event.js';

export default class TripPresenter {
  #eventListComponent = new EventListView();

  #eventsContainer = null;
  #pointsModel = null;

  #points = [];

  #pointPresenter = new Map();

  #noEventComponent = null;

  #filterType = FilterType.EVERYTHING;

  #sortComponent = new SortView();
  #currentSortType = null;
  #sourcedPoints = [];

  constructor(eventsContainer, pointsModel) {
    this.#eventsContainer = eventsContainer;

    this.#pointsModel = pointsModel;
  }

  init = () => {
    render(this.#eventListComponent, this.#eventsContainer);

    this.#points = [...this.#pointsModel.points];
    this.#sourcedPoints = [...this.#pointsModel.points];

    this.#renderPointList();
    this.#renderSort();

    this.#sortPoints(this.#currentSortType);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#eventListComponent.element, this.#pointsModel, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);

    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  //5.1.5
  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);

    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.#points.sort(sortPointDay);
        break;
      case SortType.PRICE:
        this.#points.sort(sortPointPrice);
        break;
      default:
        this.points = [...this.sourcedPoints];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderNoEvents = () => {
    this.#noEventComponent = new EventEmptyListView(this.#filterType);
    render(this.#noEventComponent, this.#eventsContainer);
  };

  #renderPoints = () => {
    this.#points.forEach(this.#renderPoint);
  };

  #renderPointList = () => {
    if (this.#points.length === 0) {
      this.#renderNoEvents();
    }
    this.#renderPoints();
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
    }
  };
}

