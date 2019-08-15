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
    <div className="game-title-box">
      <select
        value={currentNameGameMode}
        onChange={handleChangeMode}
        className="game-title-select"
      >
        {modeOptions}
      </select>
      <input className="game-title-input" placeholder="Input your name" />
      <button
        type="button"
        onClick={handleClickPlay}
        className="game-title-button"
      >
        {relaunch ? 'replay' : 'PLAY'}
      </button>
    </div>
  );
};

export default GameMenu;
