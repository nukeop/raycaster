import Map from '../data/map.yaml';

const MAP_SCALE = 8;

class MainState extends Phaser.State {
  init() {
    console.log('Entering main state');
  }

  create() {
    this.rt = this.game.add.bitmapData(320, 240, 'rt');
    this.maprt = this.game.add.bitmapData(320, 240, 'maprt');
    this.map = Map.map;
    this.map = _.map(this.map, row => {
      return row.split(' ');
    });

    this.rt.addToWorld(0, 0);
    this.maprt.addToWorld(320, 0, 0, 0, MAP_SCALE, MAP_SCALE);

    this.player = {
      x: 8,
      y: 3,
      dir: 0,
      rot: 0,
      speed: 0,
      moveSpeed: 0.18,
      rotSpeed: 6 * Math.PI/180
    };

    _.forEach(this.map, (row, i) => {
      _.forEach(row, (col, j) => {
        switch(col) {
          case '1':
          this.maprt.setPixel(j, i, 255, 255, 255);
          break;
          case '2':
          this.maprt.setPixel(j, i, 128, 128, 0)
        }
      });
    });
  }

  move() {
    let moveStep = this.player.speed * this.player.moveSpeed;
    this.player.rot += this.player.dir * this.player.rotSpeed;
    var newX = this.player.x + Math.cos(this.player.rot) * moveStep;
    var newY = this.player.y + Math.sin(this.player.rot) * moveStep;
    this.player.x = newX;
    this.player.y = newY;
  }

  render() {
    this.maprt.setPixel(this.player.x, this.player.y, 0, 128, 255);
  }
}

export default MainState;
