import {render, replace} from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventListItemView from '../view/event-list-item-view.js';
import EventListView from '../view/event-list-view.js';

import EventEditFormView from '../view/event-edit-form-view.js';

import EventEmptyListView from '../view/event-empty-list-view.js';

export default class EventPresenter {
  #eventListComponent = new EventListView();

  #eventsContainer = null;
  #pointsModel = null;

  #points = [];

  constructor(eventsContainer, pointsModel) {
    this.#eventsContainer = eventsContainer;

    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
    this.getOffersByType = this.#pointsModel.getOffersByType;
  }

  init = () => {
    render(this.#eventListComponent, this.#eventsContainer);

    this.#renderEvents();
  };

  #renderEvent = (point) => {
    const offersByType = this.getOffersByType(point.type);
    const eventComponent = new EventView(point);
    const eventEditFormComponent = new EventEditFormView(point, offersByType);

    const renderEventItem = (component) => {
      const eventListItemElement = new EventListItemView();

      render(eventListItemElement, this.#eventListComponent.element);
      render(component, eventListItemElement.element);
    };

    renderEventItem(eventComponent);

    function replacePointToForm() {
      replace(eventEditFormComponent, eventComponent);
    }

    const replaceFormToPoint = () => {
      replace(eventComponent, eventEditFormComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    eventComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    eventEditFormComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    eventEditFormComponent.setEditClickHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });
  };

  #renderEvents = () => {
    if (this.#points.length === 0) {
      render(new EventEmptyListView(), this.#eventsContainer);
    }

    this.#points.forEach(this.#renderEvent);
  };

}
