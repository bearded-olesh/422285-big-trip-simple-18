import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripFiltersElement = tripControlsElement.querySelector('.trip-controls__filters');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
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

newPointButton.addEventListener('click', handleNewPointButtonClick);

filterPresenter.init();
tripPresenter.init();
