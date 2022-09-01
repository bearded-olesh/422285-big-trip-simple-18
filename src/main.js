import Filters from './view/filters.js';
import {render} from './render.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteMainElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');
const boardPresenter = new BoardPresenter();

render(new Filters(), filtersElement);
boardPresenter.init(siteMainElement);
