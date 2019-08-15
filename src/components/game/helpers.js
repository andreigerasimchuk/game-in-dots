import { SQUARE_STATUSES } from './constants';

export const getRandomSquareIndex = (min, max, exclusions = []) => {
  if (exclusions.length === max) {
    return null;
  }

  const randomValue = min + Math.random() * (max + 1 - min);
  const currentRandomValue = Math.floor(randomValue);

  return exclusions.includes(currentRandomValue)
    ? randomInteger(min, max, exclusions)
    : currentRandomValue;
};

export const buildGameDataLayer = (mode) => {
  const lines = [];
  let id = 1;

  for (let line = 0; line < mode.field; line++) {
    const columns = [];

    for (let column = 0; column < mode.field; column++) {
      columns.push({
        id,
        line,
        column,
        color: SQUARE_STATUSES.empty,
      });

      id++;
    }

    lines.push(columns);
  }

  return lines;
};
