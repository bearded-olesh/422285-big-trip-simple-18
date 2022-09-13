import AbstractView from '../framework/view/abstract-view.js';

const createEventEventListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class EventListView extends AbstractView {
  get template() {
    return createEventEventListTemplate();
  }
}
