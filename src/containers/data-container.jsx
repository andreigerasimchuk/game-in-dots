import React, { Component } from 'react';
import Winners from '../components/winners';
import Game from '../components/game/game';
import { getWinners, getGameModes } from '../services/api';
import '../index.scss';

export default class DataContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winners: [],
      gameModes: {},
    };
  }

  componentDidMount() {
    Promise.all([
      getWinners(),
      getGameModes(),
    ])
      .then((response) => {
        const [winners, gameModes] = response;

        this.setState({ winners, gameModes });
      });
  }

  render() {
    const {
      gameModes,
      winners,
    } = this.state;

    return (
      <div className="container">
        <div className="game-box">
          <Game
            gameModes={gameModes}
          />
        </div>
        <div className="winners-box">
          <Winners winners={winners} />
        </div>
      </div>
    );
  }
}
