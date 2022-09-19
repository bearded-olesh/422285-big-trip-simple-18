import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  humanizeDate
} from '../utils/event.js';
import {offerArray} from '../mock/event-offer.js';

const createEventEditFormTemplate = (point, offersByType, allDestinationNames) => {
  const {
    basePrice,
    type,
    dateFrom,
    dateTo,
    destination,
    offers,
  } = point;

  const {
    name,
    description,
    pictures,
  } = destination;


  const startDate = dateFrom !== null ? humanizeDate(dateFrom) : '';
  const endDate = dateTo !== null ? humanizeDate(dateTo) : '';

  const createTypeTemplate = (pointType, checked) => (`
  <div class="event__type-item">
    <input id="event-type-${pointType}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${pointType}" ${checked ? 'checked' : ''}>
    <label class="event__type-label event__type-label--${pointType}" for="event-type-${pointType}">${pointType}</label>
  </div>
  `);

  const createPointTypeTemplate = () => {
    const OFFER_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
    const typesTemplate = OFFER_TYPES.map((items) => createTypeTemplate(items, items === type)).join('');
    const icon = type
      ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">`
      : '';

    return (`
      <div class="event__type-wrapper">
        <label class="event__type event__type-btn" for="event-type-toggle">
          <span class="visually-hidden">Choose event type</span>
          ${icon}
        </label>
        <input class="event__type-toggle visually-hidden" id="event-type-toggle" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${typesTemplate}
          </fieldset>
        </div>
      </div>
    `);
  };

  const eventTypeTemplate = createPointTypeTemplate();

  const allOffers = offersByType.offers;

  const offersTemplate = allOffers.map((offer) =>
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${offer.id}" data-id="${offer.id}" type="checkbox" name="event-offer-${type}"
    ${offers.some((selectedOffer) => selectedOffer.id === offer.id) ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${type}-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`
  ).join('');

  const photoTemplate = pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

  const createDestinationListTemplate = (selectedCity) =>
    `<label class="event__label  event__type-output" for="event-destination-2">
    ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-2" type="text" name="event-destination" value="${selectedCity}" list="destination-list-2">
    <datalist id="destination-list-2">
    ${allDestinationNames.map((destinationName) => `
    <option value="${destinationName.name}" id="${destinationName.id}" ${selectedCity === destinationName.name ? 'selected' : ''}></option>`
  ).join('')}
  </datalist>`;

  const destinationListTemplate = createDestinationListTemplate(name);

  return (
    ` <form class="event event--edit" action="#" method="post">
      <header class="event__header">

      ${eventTypeTemplate}

        <div class="event__field-group  event__field-group--destination">
          ${destinationListTemplate}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">

          ${offersTemplate}

          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>
          <div class="event__photos-container">
            <div class="event__photos-tape">

            ${photoTemplate}

            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};

export default class EventEditFormView extends AbstractStatefulView{
  constructor(point, getOffersByType, getDestination, getAllDestinationNames) {
    super();
    this._state = EventEditFormView.parsePointToState(point);

    this.getOffersByType = getOffersByType;
    this.getDestination = getDestination;
    this.allDestinationNames = getAllDestinationNames();

    this.#setInnerHandlers();
  }

  get template() {
    return createEventEditFormTemplate(this._state, this.getOffersByType(this._state.type), this.allDestinationNames);
  }

  static parsePointToState = (point) => ({
    ...point,
  });

  static parseStateToPoint = (state) => {
    const point = { ...state };

    return point;
  };

  #setInnerHandlers = () => {
    Array.from(this.element.querySelectorAll('.event__type-input'))
      .forEach((offerType) => offerType.addEventListener('click', this.#offerTypeToggleHandler));

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

    this.element.querySelector('.event__input--time[name=event-start-time]').addEventListener('change', this.#dueDateChangeHandler);
    this.element.querySelector('.event__input--time[name=event-end-time]').addEventListener('change', this.#dateToChangeHandler);

    Array.from(this.element.querySelectorAll('.event__offer-checkbox'))
      .forEach((eventType) => eventType.addEventListener('change', this.#selectedOffersToggleHandler));
  };

  #offerTypeToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.value) { return; }

    const id = this.allDestinationNames.filter((element) => element.name === evt.target.value)[0].id;
    this.updateElement({
      destination: this.getDestination(id),
    });
  };

  //6.1.5
  #selectedOffersToggleHandler = () => {
    const selectedOffers = [];

    Array.from(this.element.querySelectorAll('.event__offer-checkbox'))
      .forEach((checkbox) => checkbox.checked ? selectedOffers.push(offerArray[Number(checkbox.dataset.id)]) : '');

    this.updateElement({
      offers: selectedOffers,
    });
  };

  reset = (point) => {
    this.updateElement(
      EventEditFormView.parsePointToState(point),
    );
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #dueDateChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      dateFrom: evt.target.value,
    });
  };

  #dateToChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      dateTo: evt.target.value,
    });
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EventEditFormView.parseStateToPoint(this._state));
  };

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };
}

