export const getRandomSquareIndex = (min, max, exclusions = []) => {
  const randomValue = min + Math.random() * (max + 1 - min);
  const currentRandomValue = Math.floor(randomValue);

  return exclusions.includes(currentRandomValue)
    ? getRandomSquareIndex(min, max, exclusions)
    : currentRandomValue;
};
