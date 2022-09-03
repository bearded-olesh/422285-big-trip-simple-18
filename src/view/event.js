import {createElement} from '../render.js';
import {humanizeDate} from '../utils.js';

const createEventTemplate = (point, destination, offers) => {
  const {
    basePrice,
    type,
    dateFrom,
    dateTo
  } = point;

  const {name} = destination;
  const startDate = dateFrom !== null ? humanizeDate(dateFrom) : '';
  const endDate = dateTo !== null ? humanizeDate(dateTo) : '';

  const offersTemplate = offers.map((offer) =>
    `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
    </li>`
  ).join('');


  return (
    ` <div class="event">
      <time class="event__date" datetime="2019-03-18">${startDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type[0].toUpperCase()}${type.slice(1)} ${name} </h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${startDate}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${endDate}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">:Offers</h4>
      <ul class="event__selected-offers">
      ${offersTemplate}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

export default class EventView {
  constructor(point, destination, offers) {
    this.point = point;
    this.destination = destination;
    this.offers = offers;
  }

  getTemplate() {
    return createEventTemplate(this.point, this.destination, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
