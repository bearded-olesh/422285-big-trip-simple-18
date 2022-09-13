import {render, remove} from '../framework/render.js';
import {updateItem} from '../utils/common.js';
import {FilterType} from '../const.js';
import EventListView from '../view/event-list-view.js';

import EventEmptyListView from '../view/event-empty-list-view.js';

import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #eventListComponent = new EventListView();

  #eventsContainer = null;
  #pointsModel = null;

  #points = [];

  #pointPresenter = new Map();

  #noEventComponent = null;
  #filterType = FilterType.EVERYTHING;

  constructor(eventsContainer, pointsModel) {
    this.#eventsContainer = eventsContainer;

    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
  }

  init = () => {
    render(this.#eventListComponent, this.#eventsContainer);

    this.#renderPointList();
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

    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
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

