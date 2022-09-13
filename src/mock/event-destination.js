import {
  getRandomInt, getRandomArrayElement
} from '../utils/common.js';

const DESTINATION_DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Fusce tristique felis at fermentum pharetra.',
  'In rutrum ac purus sit amet tempus.'
];

const DESTINATION_NAME = [
  'Tokio', 'London', 'Paris'
];

const DESTINATION_COUNT = 10;

export const generateEventDestination = (id) => {
  const fotoId = getRandomInt(1, 10);

  return {
    id: id,
    description: getRandomArrayElement(DESTINATION_DESCRIPTION),
    name: getRandomArrayElement(DESTINATION_NAME),
    pictures: [{
      src: `http://picsum.photos/300/200?r=${fotoId}`,
      description: 'Chamonix parliament building'
    }]
  };
};

const generateDestinationArray = () => Array.from({
  length: DESTINATION_COUNT,
}, (_, k) => generateEventDestination(k + 1));

const destinationArray = generateDestinationArray();

export const getRandomDestination = () => getRandomArrayElement(destinationArray);

export const getDestination = (id) => destinationArray.filter((element) => element.id === id)[0];
