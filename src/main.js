import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic 6Lfpk427Dt1n6A';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripFiltersElement = tripControlsElement.querySelector('.trip-controls__filters');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel);

const handleNewPointFormClose = () => {
  newPointButton.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPresenter.createPoint(handleNewPointFormClose);
  newPointButton.disabled = true;
};

filterPresenter.init();
tripPresenter.init();

pointsModel.init()
  .finally(() => {
    newPointButton.addEventListener('click', handleNewPointButtonClick);
  });
