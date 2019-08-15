/* eslint-disable react/prop-types */
import React from 'react';


const GameMenu = ({
  currentNameGameMode, gameModes, handleChangeMode, handleClickPlay, relaunch,
}) => {
  const modeOptions = Object.keys(gameModes || {})
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
      <button type="button" onClick={handleClickPlay}>{relaunch ? 'replay' : 'PLAY'}</button>
    </div>
  );
};

export default GameMenu;
