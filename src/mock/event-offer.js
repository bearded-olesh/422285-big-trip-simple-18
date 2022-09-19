import {
  getRandomInt, getRandomArrayElement, getMultipleRandom
} from '../utils/common.js';

const OFFER_TITLE = [
  'Upgrade to a business class',
  'Switch to comfort class',
  'Add meal',
];

const OFFER_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const generateOffer = (id) => ({
  id: id,
  title: getRandomArrayElement(OFFER_TITLE),
  price: getRandomInt(20, 150)
});

const generateOfferArray = () => Array.from({
  length: 25,
}, (_, k) => generateOffer(k));

export const offerArray = generateOfferArray();

const generateOffersByType = (type) => ({
  'type': type,
  'offers': getMultipleRandom(offerArray, 5),
});

const generateOffersByTypeArray = () => OFFER_TYPES.map(generateOffersByType);

export const offersByTypeArray = generateOffersByTypeArray();

export const getOffer = (id) => offerArray.filter((element) => element.id === id)[0];

export const getOffersByType = (type) => offersByTypeArray.filter((element) => element.type === type)[0];
