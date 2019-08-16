import React from 'react';
import PropTypes from 'prop-types';
import toCase from 'to-case';
import './index.scss';

const GameMenu = ({
  currentNameGameMode,
  gameModes,
  handleChangeMode,
  handleClickPlay,
  relaunch,
  handleChangeInput,
  userName,
}) => {
  const modeOptions = Object.keys(gameModes || {})
    .map((key) => (
      <option
        value={key}
        key={key}
      >
        {toCase.lower(key)}
      </option>
    ));

  return (
    <div className="game-title-box">
      {currentNameGameMode && (<select
        value={currentNameGameMode}
        onChange={handleChangeMode}
        className="game-title-select"
      >
        {modeOptions}
      </select>)}

      <input
        value={userName}
        className="game-title-input"
        placeholder="Input your name"
        onChange={handleChangeInput}
      />
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

GameMenu.defaultProps = {
  currentNameGameMode: PropTypes.string,
  gameModes: PropTypes.shape({}),
  handleChangeMode: PropTypes.func,
  handleClickPlay: PropTypes.func,
  handleChangeInput: PropTypes.func,
  relaunch: PropTypes.bool,
  userName: PropTypes.string,
};

GameMenu.propTypes = {
  currentNameGameMode: PropTypes.string,
  gameModes: PropTypes.shape({}),
  handleChangeMode: PropTypes.func,
  handleClickPlay: PropTypes.func,
  handleChangeInput: PropTypes.func,
  relaunch: PropTypes.bool,
  userName: PropTypes.string,
};

export default GameMenu;
