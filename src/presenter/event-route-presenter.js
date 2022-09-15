import {render} from '../framework/render.js';
import {updateItem} from '../utils/common.js';
import EventListView from '../view/event-list-view.js';

import EventEmptyListView from '../view/event-empty-list-view.js';

import PointPresenter from './point-presenter.js';
export default class EventPresenter {
  #eventListComponent = new EventListView();

  #eventsContainer = null;
  #pointsModel = null;

  #points = [];

  #pointPresenter = new Map();

  constructor(eventsContainer, pointsModel) {
    this.#eventsContainer = eventsContainer;

    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
  }

  init = () => {
    render(this.#eventListComponent, this.#eventsContainer);

    this.#renderEventsList();
  };

  #renderEvent = (point) => {
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
    render(new EventEmptyListView(), this.#eventsContainer);
  };

  #renderEvents = () => {
    this.#points.forEach(this.#renderEvent);
  };

  #renderEventsList = () => {
    if (this.#points.length === 0) {
      this.#renderNoEvents();
    }
    this.#renderEvents();
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };
}

