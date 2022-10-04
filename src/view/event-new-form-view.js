import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {BLANC_POINT} from '../const.js';
import {isDataSubmitDisabled} from '../utils/point.js';
import he from 'he';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createEventNewFormTemplate = (point, offersByType, allDestinationNames, offerTypes) => {
  const {
    basePrice,
    type,
    dateFrom,
    dateTo,
    destination,
    offers,
    isDisabled,
    isSaving,
    isDeleting
  } = point;

  const {
    name,
    description,
    pictures,
  } = destination;

  const createTypeTemplate = (pointType, checked) => (
    `<div class="event__type-item">
    <input id="event-type-${pointType}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${pointType}" ${checked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__type-label event__type-label--${pointType}" for="event-type-${pointType}">${pointType}</label>
    </div>`
  );

  const createPointTypeTemplate = () => {
    const typesTemplate = offerTypes.map((element) => createTypeTemplate(element.type, element.type === point.type)).join('');

    const icon = type
      ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">`
      : '';

    return (`
      <div class="event__type-wrapper">
        <label class="event__type event__type-btn" for="event-type-toggle">
          <span class="visually-hidden">Choose event type</span>
          ${icon}
        </label>
        <input class="event__type-toggle visually-hidden" id="event-type-toggle" type="checkbox" ${isDisabled ? 'disabled' : ''}>
        <div class="event__type-list">
          <fieldset class="event__type-group" ${isDisabled ? 'disabled' : ''}>
            <legend class="visually-hidden">Event type</legend>
            ${typesTemplate}
          </fieldset>
        </div>
      </div>
    `);
  };

  const allOffers = offersByType.offers;

  const eventTypeTemplate = createPointTypeTemplate(allOffers, type);

  const offersTemplate = allOffers.map((offer) =>
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${offer.id}"  data-id="${offer.id}" type="checkbox" name="event-offer-${type} ${isDisabled ? 'disabled' : ''}"
    ${offers.some((selectedOffer) => selectedOffer.id === offer.id) ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${type}-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`
  ).join('');

  const createOffersTemplate = () => (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${offersTemplate}
      </div>
    </section>`
  );

  const createDestinationListTemplate = (selectedCity) =>
    `<label class="event__label  event__type-output" for="event-destination-2">
    ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-2" type="text" name="event-destination" value="${selectedCity}" list="destination-list-2" required ${isDisabled ? 'disabled' : ''}>
    <datalist id="destination-list-2">
    ${allDestinationNames.map((destinationName) => `
    <option value="${destinationName.name}" id="${destinationName.id}" ${selectedCity === destinationName.name ? 'selected' : ''}></option>`
  ).join('')}
  </datalist>`;

  const destinationListTemplate = createDestinationListTemplate(he.encode(name));

  const createDescriptionTemplate = () => {
    const template = pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

    return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${template}
        </div>
      </div>
    </section>`;
  };

  return (
    ` <form class="event event--edit" action="#" method="post">
      <header class="event__header">
      ${eventTypeTemplate}
        <div class="event__field-group  event__field-group--destination">
        ${destinationListTemplate}
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}" ${isDisabled ? 'disabled' : ''}>
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDataSubmitDisabled(dateTo, dateFrom) || isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
      </header>
      <section class="event__details">
        ${allOffers[0] ? createOffersTemplate() : ''}
        ${description ? createDescriptionTemplate() : ''}
      </section>
    </form>`
  );
};

export default class EventNewFormView extends AbstractStatefulView{
  #datepicker = null;

  constructor(point = BLANC_POINT, getOffersByType, getDestination, getAllDestinationNames, getOffersType) {
    super();
    this._state = EventNewFormView.parsePointToState(point);

    this.getOffersByType = getOffersByType;
    this.getDestination = getDestination;

    this.allDestinationNames = getAllDestinationNames();

    this.offersType = getOffersType();

    this.allOffersList = getOffersByType(point.type);

    this.#setInnerHandlers();
    this.#startDateDatepicker();
    this.#endDateDatepicker();
  }

  get template() {
    return createEventNewFormTemplate(this._state, this.getOffersByType(this._state.type), this.allDestinationNames, this.offersType, this.allOffersList);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  #startDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #endDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #startDateDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('.event__input--time[name=event-start-time]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onFocus: this.#startDateChangeHandler,
        enableTime: true,
        'time_24hr': true,
      }
    );
  };

  #endDateDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('.event__input--time[name=event-end-time]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onFocus: this.#endDateChangeHandler,
        enableTime: true,
        'time_24hr': true,
      }
    );
  };

  #setInnerHandlers = () => {
    Array.from(this.element.querySelectorAll('.event__type-input'))
      .forEach((offerType) => offerType.addEventListener('click', this.#offerTypeToggleHandler));

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

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

    const allDestinationNames = this.allDestinationNames.map((element) => element.name);
    const isNameExist = allDestinationNames.includes(evt.target.value);

    if (!isNameExist) {
      this.element.querySelector('.event__input--destination').setCustomValidity('Please, choose destination from current list');
    }

    const id = this.allDestinationNames.find((element) => element.name === evt.target.value).id;
    this.updateElement({
      destination: this.getDestination(id),
    });
  };

  #selectedOffersToggleHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.checked) {
      const offers = this._state.offers;
      const allOffers = this.getOffersByType(this._state.type);
      const selectedOffer = allOffers.offers.find((offer) => Number(evt.target.dataset.id) === offer.id);

      offers.push(selectedOffer);
      this.updateElement({
        offers: offers,
      });
    }
    else {
      this.updateElement({
        offers: this._state.offers.filter((offer) => offer.id !== Number(evt.target.dataset.id))
      });
    }
  };

  reset = (point) => {
    this.updateElement(
      EventNewFormView.parsePointToState(point),
    );
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#startDateDatepicker();
    this.#endDateDatepicker();

    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EventNewFormView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EventNewFormView.parseStateToPoint(this._state));
  };

  static parsePointToState = (point) => ({
    ...point,
  });

  static parseStateToPoint = (state) => {
    const point = { ...state };

    return point;
  };
}


