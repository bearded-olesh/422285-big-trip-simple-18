import {render} from './render.js';
import SortView from './view/sort-view.js';
import FilterView from './view/filter-view.js';

import PointModel from './model/points-model.js';

import EventPresenter from './presenter/event-presenter.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripFiltersElement = tripControlsElement.querySelector('.trip-controls__filters');

render(new FilterView(), tripFiltersElement);
render(new SortView(), tripEventsElement);

const pointModel = new PointModel();

const eventPresenter = new EventPresenter();
eventPresenter.init(tripEventsElement, pointModel);
