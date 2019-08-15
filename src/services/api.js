import { BASE_API_URL } from './constants';

export const getWinners = () => {
  const requestOptions = {
    method: 'GET',
  };

  return fetch(`${BASE_API_URL}/winners`, requestOptions)
    .then((response) => response.json());
};

export const getGameModes = () => {
  const requestOptions = {
    method: 'GET',
  };

  return fetch(`${BASE_API_URL}/game-settings`, requestOptions)
    .then((response) => response.json());
};
