import {render} from '../render.js';
import EventView from '../view/event-view.js';
import EventListItemView from '../view/event-list-item-view.js';
import EventListView from '../view/event-list-view.js';

import EventEditFormView from '../view/event-edit-form-view.js';

export default class EventPresenter {
  eventListComponent = new EventListView();

  init = (eventsContainer, pointModel) => {
    this.eventsContainer = eventsContainer;

    this.pointModel = pointModel;
    this.points = [...this.pointModel.getPoints()];
    this.getDestination = this.pointModel.getDestination;

    this.getOffer = this.pointModel.getOffer;
    this.getOffersByType = this.pointModel.getOffersByType;

    const renderEventItem = (component) => {
      const eventListItemElement = new EventListItemView();

      render(eventListItemElement, this.eventListComponent.getElement());
      render(component, eventListItemElement.getElement());
    };

    render(this.eventListComponent, this.eventsContainer);

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const destination = this.getDestination(point.destination);
      const offers = point.offers.map(this.getOffer);
      const offersByType = this.getOffersByType(point.type);

      renderEventItem(new EventView(point, destination, offers));
      renderEventItem(new EventEditFormView(point, destination, offers, offersByType));
    }
  };
}
