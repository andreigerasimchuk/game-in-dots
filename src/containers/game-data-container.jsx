import React, { Component } from 'react';
import Menu from '../components/game/menu';

export default class GamaDataContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlay: false,
      currentNameGameMode: null,
      currentGameMode: null,
      relaunch: false,
    };
  }

  render() {
    return (
      <Menu
        isPlay={this.state.isPlay}
        relaunch={this.state.relaunch}
      />
    );
  }
}
