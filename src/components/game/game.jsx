import React, { Component } from 'react';
import Menu from './menu';
import { buildGameDataLayer, getRandomSquareIndex } from './helpers';
import { SQUARE_STATUSES } from './constants';
import './index.scss';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlay: false,
      gameVisualLayer: null,
      gameDataLayer: null,
      currentNameGameMode: null,
      currentGameMode: null,
      relaunch: false,
      gameStatusMessage: '',
      selectedSquareIds: [],
      userPoints: 0,
      computerPoints: 0,
      currentSquareId: null,
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

  onHandleSquareClick(square) {
    const { gameDataLayer } = this.state;
    const currentColor = gameDataLayer[square.line][square.column].color;

    if (currentColor === SQUARE_STATUSES.waiting) {
      gameDataLayer[square.line][square.column].color = SQUARE_STATUSES.userSelected;

      const gameVisualLayer = this.buildVisualGameLayer(gameDataLayer);

      this.setState({ gameVisualLayer, gameDataLayer });
    }
  }


  buildVisualGameLayer = (gameDataLayer) => gameDataLayer.map((line, lineIndex) => {
    const currentLine = line.map((square, squareIndex) => (
      <div
        className={`square square-color-${square.color}`}
        key={squareIndex}
        onClick={() => this.onHandleSquareClick(square)}
      />
    ));

    return <div key={lineIndex} className="square-line">{currentLine}</div>;
  })

  buildGame(gameMode) {
    const gameDataLayer = buildGameDataLayer(gameMode);
    const gameVisualLayer = this.buildVisualGameLayer(gameDataLayer);

    clearInterval(this.setInterval);

    this.setState({
      gameVisualLayer,
      gameDataLayer,
      userPoints: 0,
      computerPoints: 0,
      selectedSquareIds: [],
      currentSquareId: null,
      isPlay: false,
    });
  }

  checkStatusSquare(squareId) {
    let { userPoints, computerPoints } = this.state;
    const { isPlay, gameDataLayer } = this.state;

    if (!squareId || !isPlay) {
      return;
    }

    const currentGameDataLayer = gameDataLayer.map((line) => line.map((square) => {
      const currentSquare = { ...square };

      if (square.id === squareId && square.color === SQUARE_STATUSES.waiting) {
        currentSquare.color = SQUARE_STATUSES.computerSelected;
        computerPoints += 1;
      } else if (square.id === squareId && square.color === SQUARE_STATUSES.userSelected) {
        userPoints += 1;
      }

      return currentSquare;
    }));

    const gameVisualLayer = this.buildVisualGameLayer(currentGameDataLayer);

    this.setState({
      gameVisualLayer,
      gameDataLayer: currentGameDataLayer,
      userPoints,
      computerPoints,
    });
  }

  checkStatusGame(field) {
    const { userPoints, computerPoints } = this.state;
    let { isPlay, gameStatusMessage, relaunch } = this.state;

    const maxCountPoints = Math.floor((field * field) / 2);

    if (userPoints === maxCountPoints || computerPoints === maxCountPoints) {
      clearInterval(this.setInterval);
      gameStatusMessage = (userPoints === maxCountPoints) ? 'YOU WIN' : 'COMPUTER WIN';
      isPlay = false;
      relaunch = true;
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
          gameDataLayer,
          selectedSquareIds,
        } = this.state;

        if (!isPlay) {
          return;
        }

        const fieldSize = mode.field * mode.field;
        const currentSquareIndex = getRandomSquareIndex(
          1,
          fieldSize,
          selectedSquareIds,
        );

        const currentGameDataLayer = gameDataLayer.map((line) => line.map((square) => {
          const currentSquare = { ...square };
          if (square.id === currentSquareIndex) {
            currentSquare.color = SQUARE_STATUSES.waiting;
          }

          return currentSquare;
        }));

        const gameVisualLayer = this.buildVisualGameLayer(currentGameDataLayer);

        this.setState({
          gameVisualLayer,
          gameDataLayer: currentGameDataLayer,
          selectedSquareIds: [...selectedSquareIds, currentSquareIndex],
          currentSquareId: currentSquareIndex,
        });
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
      gameVisualLayer,
    } = this.state;

    const handleChangeMode = (event) => {
      const gameMode = gameModes[event.target.value];

      this.buildGame(gameMode);

      this.setState({
        currentNameGameMode: event.target.value,
        currentGameMode: gameMode,
      });
    };

    const handleClickPlay = () => {
      if (isPlay) {
        return;
      }

      this.setInterval = setInterval(() => this.startGame(currentGameMode), currentGameMode.delay);
      this.setState({ isPlay: true });
    };

    return (
      <div>
        <Menu
          isPlay={isPlay}
          relaunch={relaunch}
          gameModes={gameModes}
          currentGameMode={currentGameMode}
          currentNameGameMode={currentNameGameMode}
          handleChangeMode={handleChangeMode}
          handleClickPlay={handleClickPlay}
        />
        <div className="game-message">
          {gameStatusMessage}
        </div>
        <div className="game-field">
          {gameVisualLayer}
        </div>
      </div>
    );
  }
}
