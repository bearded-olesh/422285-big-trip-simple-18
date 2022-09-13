import dayjs from 'dayjs';

const humanizeDate = (date) => dayjs(date).format('D MMM');

export {humanizeDate};
