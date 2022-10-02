import {remove, render, RenderPosition} from '../framework/render.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType, BLANC_POINT} from '../const.js';

import EventNewFormView from '../view/event-new-form-view.js';

export default class PointNewPresenter {
  #destroyCallback = null;

  #pointListContainer = null;
  #pointFormComponent = null;

  #point = null;
  #pointsModel = null;

  #changeData = null;

  constructor(pointListContainer, pointsModel, changeData) {
    this.#pointListContainer = pointListContainer;

    this.#pointsModel = pointsModel;
    this.getOffersByType = this.#pointsModel.getOffersByType;
    this.getDestination = this.#pointsModel.getDestination;
    this.getAllDestinationNames = this.#pointsModel.getAllDestinationNames;

    this.getOfferTypes = this.#pointsModel.getOfferTypes;

    this.getAllOffersList = this.#pointsModel.getAllOffersList;

    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#pointFormComponent !== null) {
      return;
    }

    this.#pointFormComponent = new EventNewFormView(
      this.#point = BLANC_POINT,
      this.getOffersByType,
      this.getDestination,
      this.getAllDestinationNames,
      this.getOfferTypes,
      this.getAllOffersList,
    );

    this.#pointFormComponent.setFormSubmitHandler ((point) => {
      this.#changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        {id: nanoid(), ...point},
      );
      this.destroy();
    });

    this.#pointFormComponent.setDeleteClickHandler(() => {
      this.destroy();
    });

    render(this.#pointFormComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#pointFormComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#pointFormComponent);
    this.#pointFormComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointFormComponent.reset(this.#point);
      this.destroy();
    }
  };
}

