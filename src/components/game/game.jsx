import React, { Component } from 'react';
import { SQUARE_STATUSES } from './constants';
import { getRandomSquareIndex, buildGameDataLayer } from './helpers';
import './index.scss';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameVisualLayer: [],
      gameDataLayer: [],
      selectedSquareIds: [],
      gameStatusMessage: '',
      userPoints: 0,
      computerPoints: 0,
      isPlay: false,
      currentSquareId: null,
      gameMode: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const mode = nextProps.gameMode;
    const gameDataLayer = buildGameDataLayer(mode);

    const gameVisualLayer = this.buildVisualGameLayer(gameDataLayer);

    this.setState({ gameVisualLayer, gameDataLayer, isPlay: nextProps.isPlay });
    this.setInterval = setInterval(() => this.startGame(mode), mode.delay);
  }

  componentWillUnmount() {
    clearInterval(this.setInterval);
  }

  onHandleSquareClick(square) {
    const currentGameDataLayer = this.state.gameDataLayer;
    const currentColor = currentGameDataLayer[square.line][square.column].color;

    if (currentColor === SQUARE_STATUSES.waiting) {
      currentGameDataLayer[square.line][square.column].color = SQUARE_STATUSES.userSelected;

      const gameVisualLayer = this.buildVisualGameLayer(currentGameDataLayer);

      this.setState({
        gameVisualLayer,
        selectedSquareIds: [...this.state.selectedSquareIds, square.id],
      });
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

  startGame(mode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.checkStatusSquare(this.state.currentSquareId));
      }, mode.delay);
    })
      .then(() => this.checkStatusGame(mode.field))
      .then(() => {
        if (!this.state.isPlay) {
          return;
        }

        const fieldSize = mode.field * mode.field;
        const currentSquareIndex = getRandomSquareIndex(
          1,
          fieldSize,
          this.state.selectedSquareId,
        );

        const gameDataLayer = this.state.gameDataLayer.map((line) => line.map((square) => {
          if (square.id === currentSquareIndex) {
            square.color = SQUARE_STATUSES.waiting;
          }

          return square;
        }));

        const gameVisualLayer = this.buildVisualGameLayer(gameDataLayer);

        this.setState({
          gameVisualLayer,
          gameDataLayer,
          selectedSquareIds: [...this.state.selectedSquareIds, currentSquareIndex],
          currentSquareId: currentSquareIndex,
        });
      });
  }

  checkStatusSquare(squareId) {
    let { userPoints, computerPoints } = this.state;
    const { isPlay, gameDataLayer } = this.state;

    if (!squareId || !isPlay) {
      return;
    }

    const currentGameDataLayer = gameDataLayer.map((line) => line.map((square) => {
      if (square.id === squareId && square.color === SQUARE_STATUSES.waiting) {
        square.color = SQUARE_STATUSES.computerSelected;
        computerPoints += 1;
      } else if (square.id === squareId && square.color === SQUARE_STATUSES.userSelected) {
        userPoints += 1;
      }

      return square;
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
    let { isPlay, gameStatusMessage } = this.state;

    const maxCountPoints = Math.floor((field * field) / 2);

    if (userPoints === maxCountPoints || computerPoints === maxCountPoints) {
      clearInterval(this.setInterval);
      gameStatusMessage = (userPoints === maxCountPoints) ? 'YOU WIN' : 'COMPUTER WIN';
      isPlay = false;
    }

    return this.setState({ gameStatusMessage, isPlay });
  }

  render() {
    return (
      <div>
        <div>
          {this.state.gameStatusMessage}
        </div>
        <div>
          {this.state.gameVisualLayer}
        </div>
      </div>
    );
  }
}
