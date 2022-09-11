import {
  createElement
} from '../render.js';

const createEventEventListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class EventListView {
  #element = null;

  get template() {
    return createEventEventListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
