import {
  render,
  replace,
  remove
} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import {isDatesEqual, isPriceEqual} from '../utils/event.js';
import EventView from '../view/event-view.js';
import EventEditFormView from '../view/event-edit-form-view.js';

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

  #mode = Mode.DEFAULT;

  #changeData = null;
  #changeMode = null;

  constructor(pointListContainer, pointsModel, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;

    this.#pointsModel = pointsModel;
    this.getOffersByType = this.#pointsModel.getOffersByType;
    this.getDestination = this.#pointsModel.getDestination;
    this.getAllDestinationNames = this.#pointsModel.getAllDestinationNames;

    this.getOfferTypes = this.#pointsModel.getOfferTypes;

    this.getAllOffersList = this.#pointsModel.getAllOffersList;

    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditFormComponent = this.#pointEditFormComponent;

    this.#pointComponent = new EventView(this.#point);
    this.#pointEditFormComponent = new EventEditFormView(this.#point, this.getOffersByType, this.getDestination, this.getAllDestinationNames, this.getOfferTypes, this.getAllOffersList);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointEditFormComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditFormComponent.setEditClickHandler(this.#handleClick);

    this.#pointEditFormComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevPointComponent === null || prevPointEditFormComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
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
      this.#pointEditFormComponent.reset(this.#point);
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
      this.#pointEditFormComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate =
      !isDatesEqual(this.#point, update) ||
      !isPriceEqual(this.#point, update);

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceFormToPoint();
  };

  #handleClick = () => {
    this.resetView();
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
