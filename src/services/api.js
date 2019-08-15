import dateFns from 'date-fns';
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

export const sendWinner = (name) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      winner: name,
      date: dateFns.format(new Date(), 'HH:MM; DD MMM YYYY'),
    }),
  };

  return fetch(`${BASE_API_URL}/winners`, requestOptions)
    .then((response) => response.json());
};
