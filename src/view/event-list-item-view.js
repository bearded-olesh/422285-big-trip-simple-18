import {
  createElement
} from '../render.js';

const createEventListItemTemplate = () => '<li class="trip-events__item"></li>';

export default class EventListItemView {
  #element = null;

  get template() {
    return createEventListItemTemplate();
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


