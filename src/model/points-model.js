import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;

  #points = [];
  #offers = [];
  #destinations = [];

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get offers () {
    return this.#offers;
  }

  get destinations () {
    return this.#destinations;
  }

  init = async () => {
    try {
      const points = await this.#pointsApiService.points;
      this.#offers = await this.#pointsApiService.offers;
      this.#destinations = await this.#pointsApiService.destinations;
      this.#points = points.map(this.#adaptToClient);
      //console.log(points)
    } catch(err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  };


  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
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

  #adaptToClient = (point) => {

    const destination = this.#destinations.find((element) => element.id === point.destination);
    const generatePointDestination = () => ({
      id: point.destination,
      name: destination.name,
      description: destination.description,
      pictures: destination.pictures,
    });

    const generateOffers = () => (this.#offers.filter((element) => element.type === point.type)[0].offers);

    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      destination: generatePointDestination(),
      offers: generateOffers().filter((offer) => point.offers.indexOf(offer.id) !== -1),
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];

    return adaptedPoint;
  };

  getDestination = (id) => this.#destinations.filter((element) => element.id === id)[0];
  getAllDestinationNames = () => this.#destinations.map((destination) => ({id: destination.id, name: destination.name}));
  getOfferTypes = () => this.#offers.map((offer) => ({type: offer.type}));
  getOffersByType = (type) => this.#offers.filter((element) => element.type === type)[0];
  getAllOffersList = () => this.#offers;
}
