import dayjs from 'dayjs';

const humanizeDate = (date) => dayjs(date).format('D MMM');

const sortPointDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export {humanizeDate,sortPointDay, sortPointPrice};
