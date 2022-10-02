import AbstractView from '../framework/view/abstract-view.js';
import {EmptyListTextType} from '../const.js';

const createEventEmptyListTemplate = (filterType) => {
  const emptyListTextValue = EmptyListTextType[filterType];

  return (
    `<p class="trip-events__msg">
      ${emptyListTextValue}
    </p>`);
};

export default class EventEmptyListView extends AbstractView{
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEventEmptyListTemplate(this.#filterType);
  }
}
