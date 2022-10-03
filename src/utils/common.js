import dayjs from 'dayjs';

const isFutureDate = (date) => dayjs().isBefore(dayjs(date), 'day') || dayjs().isSame(dayjs(date), 'day');

export {isFutureDate};
