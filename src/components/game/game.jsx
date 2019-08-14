import React, { Component } from 'react';
import { SQUARE_STATUSES } from './constants';
import { getRandomSquareIndex, buildGameDataLayer } from './helpers';
import './index.scss';

export class Game extends Component {
  state = {
    gameVisualLayer: [],
    gameDataLayer: [],
    selectedSquareIds: [],
    gameStatusMessage: '',
    userPoints: 0,
    computerPoints: 0,
    isPlay: true,
    currentSquareId: null,
  };

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

  buildVisualGameLayer(gameDataLayer) {
    return gameDataLayer.map((line, lineIndex) => {
      const currentLine = line.map((square, squareIndex) => {
        return (
          <div
            className={`square square-color-${square.color}`} key={squareIndex}
            onClick={() => this.onHandleSquareClick(square)}
          ></div >
        );
      });

      return <div key={lineIndex} className='square-line'>{currentLine}</div>;
    });
  }

  startGame(mode) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.checkStatusSquare(this.state.currentSquareId));
      }, mode.delay);
    })
      .then(() => this.checkStatusGame())
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

        const gameDataLayer = this.state.gameDataLayer.map(line => {
          return line.map(square => {
            if (square.id === currentSquareIndex) {
              square.color = SQUARE_STATUSES.waiting;
            }

            return square;
          });
        });

        const gameVisualLayer = this.buildVisualGameLayer(gameDataLayer);

        return this.setState({
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

    const currentGameDataLayer = gameDataLayer.map(line => {
      return line.map(square => {
        if (square.id === squareId && square.color === SQUARE_STATUSES.waiting) {
          square.color = SQUARE_STATUSES.computerSelected;
          computerPoints++;
        } else if (square.id === squareId && square.color === SQUARE_STATUSES.userSelected) {
          userPoints++;
        }

        return square;
      });
    });

    const gameVisualLayer = this.buildVisualGameLayer(currentGameDataLayer);

    return this.setState({
      gameVisualLayer,
      gameDataLayer: currentGameDataLayer,
      userPoints,
      computerPoints,
    });
  }

  checkStatusGame() {
    const { userPoints, computerPoints } = this.state;
    let { isPlay, gameStatusMessage } = this.state;

    if (userPoints === 2 || computerPoints === 2) {
      clearInterval(this.setInterval);
      gameStatusMessage = (userPoints === 2) ? 'YOU WIN' : 'COMPUTER WIN';
      isPlay = false;
    }

    return this.setState({ gameStatusMessage, isPlay });
  }

  componentDidMount() {
    const mode = {
      field: 5,
      delay: 2000,
    };

    const gameDataLayer = buildGameDataLayer(mode);
    const gameVisualLayer = this.buildVisualGameLayer(gameDataLayer);

    this.setState({ gameVisualLayer, gameDataLayer });
    this.setInterval = setInterval(() => this.startGame(mode), mode.delay);
  }

  componentWillUnmount() {
    clearInterval(this.setInterval);
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
