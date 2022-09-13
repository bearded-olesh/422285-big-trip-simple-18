import AbstractView from '../framework/view/abstract-view.js';

const createEventListItemTemplate = () => '<li class="trip-events__item"></li>';

export default class EventListItemView extends AbstractView{
  get template() {
    return createEventListItemTemplate();
  }
}


