import {render} from './render.js';
import {generateFilters} from './mock/filter.js';
import FilterView from './view/filter-view.js';

import PointsModel from './model/points-model.js';

import TripPresenter from './presenter/trip-presenter.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripFiltersElement = tripControlsElement.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();

const filters = generateFilters(pointsModel.points);

render(new FilterView(filters), tripFiltersElement);

const tripPresenter = new TripPresenter(tripEventsElement, pointsModel);
tripPresenter.init();
