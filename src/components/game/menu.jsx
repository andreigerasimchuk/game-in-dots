import React from 'react';


const GameMenu = ({
  currentNameGameMode, gameModes, handleChangeMode, handleClickPlay,
}) => {
  const modeOptions = Object.keys(gameModes)
    .map((key) => (
      <option
        value={key}
        key={key}
      >
        {key}
      </option>
    ));

  return (
    <div>
      <select value={currentNameGameMode} onChange={handleChangeMode}>
        {modeOptions}
      </select>
      <input />
      <button onClick={handleClickPlay}>PLAY</button>
    </div>
  );
};

export default GameMenu;
