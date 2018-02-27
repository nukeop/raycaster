class BootState extends Phaser.State {
  init() {
    console.log('Entering boot state');
  }

  create() {
    this.game.stage.smoothed = false;
    this.state.start('Load');
  }
}

export default BootState;
