import dayjs from 'dayjs';

const humanizePointDate = (date) => dayjs(date).format('D MMM');

const humanizePointEditDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const humanizePointRouteTime = (time) => dayjs(time).format('HH:mm');

const isDataSubmitDisabled = (dateTo, dateFrom) => dayjs(dateTo).diff(dayjs(dateFrom)) < 0;

const isDatesEqual = (pointA, pointB) => dayjs(pointA.dateFrom).isSame(pointB.dateFrom, 'D');

const isPriceEqual = (pointA, pointB) => pointA.basePrice === pointB.basePrice;


const sortPointDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export {sortPointDay, sortPointPrice, humanizePointEditDate, humanizePointRouteTime, humanizePointDate, isDataSubmitDisabled, isDatesEqual, isPriceEqual};
