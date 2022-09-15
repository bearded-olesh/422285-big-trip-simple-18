import {
  getRandomInt, getRandomSubArray, getRandomArrayElement
} from '../utils/common.js';

import dayjs from 'dayjs';
import { getOffersByType } from './event-offer.js';
import { getRandomDestination } from './event-destination.js';

const EVENT_TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const MAX_POINT_COUNT = 5;

const MIN_BASE_PRICE = 30;
const MAX_BASE_PRICE = 500;

const generatePrice = () => getRandomInt(MIN_BASE_PRICE, MAX_BASE_PRICE);

const generateDate = () => {
  const maxDaysGap = 4;
  const daysGap = getRandomInt(0, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

export const generatePoint = (id) => {
  const type = getRandomArrayElement(EVENT_TYPE);

  return {
    id: id,
    basePrice: generatePrice(),
    dateFrom: generateDate(),
    dateTo: generateDate(),
    destination: getRandomDestination().id,
    offers: getRandomSubArray(getOffersByType(type).offers).map((offer) => offer.id),
    type: type
  };
};

export const generatePoints = () => Array.from({
  length:  getRandomInt(0, MAX_POINT_COUNT),
}, (_, k) => generatePoint(k + 1));
