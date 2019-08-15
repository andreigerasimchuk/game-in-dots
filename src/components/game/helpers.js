import { SQUARE_STATUSES } from './constants';

export const getRandomSquareIndex = (min, max, exclusions = []) => {
  if (exclusions.length === max) {
    return null;
  }

  const randomValue = min + Math.random() * (max + 1 - min);
  const currentRandomValue = Math.floor(randomValue);

  return exclusions.includes(currentRandomValue)
    ? getRandomSquareIndex(min, max, exclusions)
    : currentRandomValue;
};

export const buildGameDataLayer = (mode) => {
  const lines = [];
  let id = 1;

  for (let line = 0; line < mode.field; line += 1) {
    const columns = [];

    for (let column = 0; column < mode.field; column += 1) {
      columns.push({
        id,
        line,
        column,
        color: SQUARE_STATUSES.empty,
      });

      id += 1;
    }

    lines.push(columns);
  }

  return lines;
};
