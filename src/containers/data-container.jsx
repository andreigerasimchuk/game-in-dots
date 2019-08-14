import React, { Component } from 'react';
import Winners from '../components/winners';
import GameMenu from '../components/game/menu';
import { Game } from '../components/game/game';
import { getWinners, getGameModes } from '../api/api';

export class DataContainer extends Component {
    state = {
        winners: [],
        gameModes: [],
        isPlay: false,
        currentNameGameMode: null,
        currentGameMode: {},
    };

    componentDidMount() {
        Promise.all([
            getWinners(),
            getGameModes(),
        ])
            .then(response => {
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
        this.setState({
            currentNameGameMode: event.target.value,
            currentGameMode: this.state.gameModes[event.target.value],
        });
    }

    handleClickPlay = () => {
        this.setState({ isPlay: true });
    }

    render() {
        return (
            <div>
                <div>
                    <GameMenu
                        currentNameGameMode={this.state.currentNameGameMode}
                        gameModes={this.state.gameModes}
                        handleChangeMode={this.handleChangeMode}
                        handleClickPlay={this.handleClickPlay}
                    />
                    <Game
                        isPlay={this.state.isPlay}
                        gameMode={this.state.currentGameMode}
                    />
                </div>
                <div>
                    <Winners winners={this.state.winners} />
                </div>
            </div>
        );
    }
}