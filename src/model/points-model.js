import Observable from '../framework/observable.js';
import {generatePoints} from '../mock/event-point.js';
import {getDestination, getAllDestinationNames} from '../mock/event-destination.js';
import {getOffer, getOffersByType, getOfferTypes, getAllOffersList} from '../mock/event-offer.js';


const getEnrichedPoints = () => generatePoints().map((point) => ({
  basePrice: point.basePrice,
  dateFrom: point.dateFrom,
  dateTo: point.dateTo,
  destination: getDestination(point.destination),
  id: point.id,
  offers: point.offers.map(getOffer),
  type: point.type,
}));

export default class PointsModel extends Observable {
  #points = getEnrichedPoints();

  get points() {
    return this.#points;
  }

  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addPoint = (updateType, update) => {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  };

  getOffersByType = (type) => getOffersByType(type);
  getDestination = (id) => getDestination(id);
  getAllDestinationNames = () => getAllDestinationNames();

  getOfferTypes = () => getOfferTypes();

  getAllOffersList = () => getAllOffersList();
}
