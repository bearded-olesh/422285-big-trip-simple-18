import {render} from '../render.js';
import EventView from '../view/event-view.js';
import EventListItemView from '../view/event-list-item-view.js';
import EventListView from '../view/event-list-view.js';

import EventEditFormView from '../view/event-edit-form-view.js';

export default class EventPresenter {
  #eventListComponent = new EventListView();

  #eventsContainer = null;
  #pointsModel = null;

  #points = [];

  init = (eventsContainer, pointsModel) => {
    this.#eventsContainer = eventsContainer;

    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
    this.getOffersByType = this.#pointsModel.getOffersByType;

    render(this.#eventListComponent, this.#eventsContainer);

    for (let i = 0; i < this.#points.length; i++) {
      const point = this.#points[i];
      const offersByType = this.getOffersByType(point.type);

      this.#renderEvent(point, offersByType);
    }
  };

  #renderEvent = (point, offersByType) => {
    const eventComponent = new EventView(point);
    const eventEditFormComponent = new EventEditFormView(point, offersByType);

    const renderEventItem = (component) => {
      const eventListItemElement = new EventListItemView();

      render(eventListItemElement, this.#eventListComponent.element);
      render(component, eventListItemElement.element);
    };

    renderEventItem(eventComponent);

    function replacePointToForm() {
      eventComponent.element.replaceWith(eventEditFormComponent.element);
    }

    const replaceFormToPoint = () => {
      eventEditFormComponent.element.replaceWith(eventComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    eventComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    document.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    eventEditFormComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });
  };
}
