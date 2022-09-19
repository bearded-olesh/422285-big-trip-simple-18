const OFFER_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const BLANC_POINT = {
  basePrice: null,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: null,
};

const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future'
};

const SortType = {
  DAY: 'day',
  PRICE: 'price',
};

export {OFFER_TYPES, BLANC_POINT, FilterType, SortType};
