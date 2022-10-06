const BLANC_POINT = {
  basePrice: 250,
  dateFrom: '2022-10-10T22:55:56.845Z',
  dateTo: '2022-10-17T22:55:56.845Z',
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  offers: [],
  type: 'taxi',
};

const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  OFFLINE: 'Offline',
};

const SortType = {
  DAY: 'day',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  OFFLINE: 'OFFLINE',
};

const EmptyListTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.OFFLINE]: 'No connection',
};

export {BLANC_POINT, FilterType, SortType, UserAction, UpdateType, EmptyListTextType};
