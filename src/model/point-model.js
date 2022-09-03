import {getPoints} from '../mock/event-point.js';
import {getDestination} from '../mock/event-destination.js';
import {getOffer, getOffersByType} from '../mock/event-offer.js';


export default class PointModel {
  points = getPoints();
  getPoints = () => this.points;
  getDestination = (id) => getDestination(id);
  getOffer = (id) => getOffer(id);
  getOffersByType = (type) => getOffersByType(type);
}
