import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Menu from './menu';
import { getRandomSquareIndex } from './helpers';
import { SQUARE_STATUSES } from './constants';
import './index.scss';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlay: false,
      currentNameGameMode: null,
      currentGameMode: null,
      relaunch: false,
      gameStatusMessage: '',
      userPoints: 0,
      computerPoints: 0,
      currentSquareId: null,
      userName: '',
      gameData: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { gameModes } = nextProps;
    const [currentNameGameMode] = Object.keys(gameModes);
    const currentGameMode = gameModes[currentNameGameMode];

    this.buildGame(currentGameMode);

    this.setState({
      currentNameGameMode,
      currentGameMode,
      gameModes,
    });
  }

  componentWillUnmount() {
    clearInterval(this.setInterval);
  }

  buildGame(gameMode) {
    const modeField = gameMode.field;
    const size = modeField * modeField;

    const currentGameData = [];

    for (let index = 0; index < size; index += 1) {
      currentGameData.push({
        selected: false,
        color: 'white',
        id: index,
      });
    }

    clearInterval(this.setInterval);

    this.setState({
      userPoints: 0,
      computerPoints: 0,
      currentSquareId: null,
      isPlay: false,
      gameData: currentGameData,
    });
  }

  checkStatusSquare(squareId) {
    let { userPoints, computerPoints } = this.state;
    const { isPlay, gameData } = this.state;

    if (!squareId || !isPlay) {
      return;
    }

    const currentGameData = [...gameData];

    if (gameData[squareId].color === SQUARE_STATUSES.waiting) {
      currentGameData[squareId].color = SQUARE_STATUSES.computerSelected;
      currentGameData[squareId].selected = true;
      computerPoints += 1;
    } else if (gameData[squareId].color === SQUARE_STATUSES.userSelected) {
      userPoints += 1;
    }

    this.setState({
      userPoints,
      computerPoints,
      gameData: currentGameData,
    });
  }

  checkStatusGame(field) {
    const { userPoints, computerPoints, userName } = this.state;
    let { isPlay, gameStatusMessage, relaunch } = this.state;

    const maxCountPoints = Math.floor((field * field) / 2);

    if (userPoints === maxCountPoints || computerPoints === maxCountPoints) {
      clearInterval(this.setInterval);
      gameStatusMessage = (userPoints === maxCountPoints) ? `YOU WIN ${userName}` : 'COMPUTER WIN';
      isPlay = false;
      relaunch = true;

      if (userPoints === maxCountPoints) {
        const { userWin } = this.props;
        userWin(userName);
      }
    }

    return this.setState({ gameStatusMessage, isPlay, relaunch });
  }

  startGame(mode) {
    new Promise((resolve) => {
      setTimeout(() => {
        const { currentSquareId } = this.state;
        resolve(this.checkStatusSquare(currentSquareId));
      }, mode.delay);
    })
      .then(() => this.checkStatusGame(mode.field))
      .then(() => {
        const {
          isPlay,
          gameData,
        } = this.state;

        if (!isPlay) {
          return;
        }

        const selectedSquareIds = gameData.reduce((acc, item, index) => {
          if (item.selected) {
            acc.push(index);
          }

          return acc;
        }, []);

        const fieldSize = mode.field * mode.field;
        const generatedIndex = getRandomSquareIndex(
          1,
          fieldSize,
          selectedSquareIds,
        );

        if (generatedIndex) {
          gameData[generatedIndex].color = SQUARE_STATUSES.waiting;
          this.setState({
            currentSquareId: generatedIndex,
            gameData,
          });
        }
      });
  }

  render() {
    const {
      isPlay,
      relaunch,
      gameModes,
      currentGameMode,
      currentNameGameMode,
      gameStatusMessage,
      userName,
      gameData,
    } = this.state;

    const handleChangeMode = (event) => {
      const gameMode = gameModes[event.target.value];

      this.buildGame(gameMode);

      this.setState({
        currentNameGameMode: event.target.value,
        currentGameMode: gameMode,
      });
    };

    const handleChangeInput = (event) => {
      this.setState({ userName: event.target.value });
    };

    const handleClickPlay = () => {
      if (isPlay && !relaunch) {
        return;
      }

      if (!userName) {
        alert('Input your name!');
        return;
      }

      this.buildGame(currentGameMode);
      this.setInterval = setInterval(() => this.startGame(currentGameMode), currentGameMode.delay);
      this.setState({ isPlay: true, relaunch: false });
    };

    const onHandleSquareClick = (square, index) => {
      const currentSquare = { ...square };
      const currentDataGame = [...gameData];

      if (square.color === SQUARE_STATUSES.waiting) {
        currentSquare.color = SQUARE_STATUSES.userSelected;
        currentSquare.selected = true;
        currentDataGame[index] = currentSquare;

        this.setState({ gameData: currentDataGame });
      }
    };

    return (
      <div className="game">
        <Menu
          isPlay={isPlay}
          relaunch={relaunch}
          gameModes={gameModes}
          currentGameMode={currentGameMode}
          currentNameGameMode={currentNameGameMode}
          handleChangeMode={handleChangeMode}
          handleClickPlay={handleClickPlay}
          userName={userName}
          handleChangeInput={handleChangeInput}
        />
        <div className="game-message">
          {gameStatusMessage}
        </div>
        <div className="game-field">
          {currentGameMode && gameData.map((item, key) => <div
            className={`row row-color-${item.color}`}
            onClick={() => onHandleSquareClick(item, key)}
            key={key}
            style={{ width: `calc(100%/${currentGameMode.field})`, height: `calc(100%/${currentGameMode.field})` }}
          />)}
        </div>
      </div>
    );
  }
}

Game.defaultProps = {
  gameModes: PropTypes.shape(),
  userWin: PropTypes.func,
};

Game.propTypes = {
  gameModes: PropTypes.shape({}),
  userWin: PropTypes.func,
};

export default Game;
