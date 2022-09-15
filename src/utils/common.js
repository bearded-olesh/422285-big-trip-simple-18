import dayjs from 'dayjs';
const getRandomInt = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (elements) => elements[getRandomInt(0, elements.length - 1)];

const getRandomSubArray = (elements) => elements.filter(() => Math.random() < 0.5);

const getMultipleRandom = (arr, num) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const isFutureDate = (date) => dayjs().isBefore(dayjs(date), 'day') || dayjs().isSame(dayjs(date), 'day');

export {getRandomInt, getRandomArrayElement, getRandomSubArray, getMultipleRandom, updateItem, isFutureDate};
