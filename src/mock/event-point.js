import {getRandomInt, getRandomSubArray, getRandomArrayElement} from '../utils';
import dayjs from 'dayjs';
import { getOffersByType } from './event-offer.js';

const EVENT_TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const POINT_COUNT = 5;

const MIN_BASE_PRICE = 30;
const MAX_BASE_PRICE = 500;

const getPrice = () => getRandomInt(MIN_BASE_PRICE, MAX_BASE_PRICE);

const generateDate = () => {
  const maxDaysGap = 1;
  const daysGap = getRandomInt(0, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

export const generatePoint = () => {
  const type = getRandomArrayElement(EVENT_TYPE);
  const offers = getRandomSubArray(getOffersByType(type).offers).map(({id}) => id);

  return {
    basePrice: getPrice(),
    dateFrom: generateDate(),
    dateTo: generateDate(),
    destination: 1,
    id: 1,
    offers: offers,
    type: type
  };
};


const pointsArray = Array.from({
  length: POINT_COUNT,
}, (_, k) => generatePoint(k + 1));


export const getPoints = () => pointsArray;
