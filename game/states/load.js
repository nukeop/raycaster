class LoadState extends Phaser.State {
  init() {
    console.log('Entering load state');
  }

  preload() {

  }

  create() {
    this.state.start('Main');
  }
}

export default LoadState;
