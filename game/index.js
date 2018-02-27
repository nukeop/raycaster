import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

import _ from 'lodash';

import States from './data/states.yaml';

class Game extends Phaser.Game {
  constructor() {
    super({
      width: 640,
      height: 480,
      renderer: Phaser.AUTO,
      antialias: false
    });

    console.log("Loading states...");
    let context = require.context("./states", true, /\.jsx?/);
    _.forEach(States.states, state => {
      console.log(`Loading state ${state.name}...`);
      let module = context(state.path).default;
      this.state.add(state.name, module);
    });

    this.state.start(States.start);
  }
}

new Game();
