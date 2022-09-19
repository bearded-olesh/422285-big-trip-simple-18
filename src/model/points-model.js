import {generatePoints} from '../mock/event-point.js';
import {getDestination, getAllDestinationNames} from '../mock/event-destination.js';
import {getOffer, getOffersByType} from '../mock/event-offer.js';


const getEnrichedPoints = () => generatePoints().map((point) => ({
  basePrice: point.basePrice,
  dateFrom: point.dateFrom,
  dateTo: point.dateTo,
  destination: getDestination(point.destination),
  id: point.id,
  offers: point.offers.map(getOffer),
  type: point.type,
}));


export default class PointsModel {
  #points = getEnrichedPoints();

  get points() {
    return this.#points;
  }

  getOffersByType = (type) => getOffersByType(type);
  getDestination = (id) => getDestination(id);
  getAllDestinationNames = () => getAllDestinationNames();
}
