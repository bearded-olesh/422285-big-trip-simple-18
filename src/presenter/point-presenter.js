import {
  render,
  replace,
  remove
} from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditFormView from '../view/event-edit-form-view.js';

import EventListItemView from '../view/event-list-item-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;

  #pointComponent = null;
  #pointEditFormComponent = null;

  #point = null;

  #pointsModel = null;

  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  constructor(pointListContainer, pointsModel, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;

    this.#pointsModel = pointsModel;
    this.getOffersByType = this.#pointsModel.getOffersByType;

    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditFormComponent = this.#pointEditFormComponent;

    const offersByType = this.getOffersByType(point.type);
    this.#pointComponent = new EventView(point);
    this.#pointEditFormComponent = new EventEditFormView(point, offersByType);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointEditFormComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditFormComponent.setEditClickHandler(this.#handleClick);

    const eventListItemElement = new EventListItemView();

    if (prevPointComponent === null || prevPointEditFormComponent === null) {
      render(this.#pointComponent, eventListItemElement.element);
      render(eventListItemElement, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditFormComponent, prevPointEditFormComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditFormComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditFormComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm() {
    replace(this.#pointEditFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
  };

  #handleClick = () => {
    this.#replaceFormToPoint();
  };
}
