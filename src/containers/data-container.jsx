import React, { Component } from 'react';
import Winners from '../components/winners';
import GameMenu from '../components/game/menu';
import Game from '../components/game/game';
import { getWinners, getGameModes } from '../api/api';

export default class DataContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winners: [],
      gameModes: [],
      isPlay: false,
      currentNameGameMode: null,
      currentGameMode: {},
    };
  }

  componentDidMount() {
    Promise.all([
      getWinners(),
      getGameModes(),
    ])
      .then((response) => {
        const [winners, gameModes] = response;
        const [currentNameGameMode] = Object.keys(gameModes);

        this.setState({
          winners,
          gameModes,
          currentNameGameMode,
          currentGameMode: gameModes[currentNameGameMode],
        });
      });
  }

  handleChangeMode = (event) => {
    const { gameModes } = this.state;
    this.setState({
      currentNameGameMode: event.target.value,
      currentGameMode: gameModes[event.target.value],
    });
  }

  handleClickPlay = () => {
    this.setState({ isPlay: true });
  }

  render() {
    const {
      currentNameGameMode,
      gameModes,
      isPlay,
      winners,
      currentGameMode,
    } = this.state;

    return (
      <div>
        <div>
          <GameMenu
            currentNameGameMode={currentNameGameMode}
            gameModes={gameModes}
            handleChangeMode={this.handleChangeMode}
            handleClickPlay={this.handleClickPlay}
          />
          <Game
            isPlay={isPlay}
            gameMode={currentGameMode}
          />
        </div>
        <div>
          <Winners winners={winners} />
        </div>
      </div>
    );
  }
}
