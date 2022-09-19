import {
  getRandomInt, getRandomArrayElement
} from '../utils/common.js';

const DESTINATION_DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Fusce tristique felis at fermentum pharetra.',
  'In rutrum ac purus sit amet tempus.'
];

export const DESTINATION_NAMES = [
  'Tokio', 'London', 'Paris'
];

const generatePicture = (cityName) => ({
  src: `https://placekitten.com/300/200?image=${getRandomInt(1, 15)}`,
  description: `${cityName}Chamonix parliament building`
});

const generatePictureArray = (cityName) => Array.from({
  length: 3,
}, () => generatePicture(cityName));

export const generateEventDestination = (id, name) => ({
  id: id,
  description: getRandomArrayElement(DESTINATION_DESCRIPTION),
  name: name,
  pictures: generatePictureArray(name),
});

const generateDestinationArray = () => DESTINATION_NAMES.map((name, index) => generateEventDestination(index, name));

const destinationArray = generateDestinationArray();

export const getRandomDestination = () => getRandomArrayElement(destinationArray);

export const getDestination = (id) => destinationArray.filter((element) => element.id === id)[0];
export const getAllDestinationNames = () => destinationArray.map((destination) => ({id: destination.id, name: destination.name}));

