import Map from '../data/map.yaml';

const VIEWPORT_WIDTH = 320;
const VIEWPORT_HEIGHT = 240;

const TWOPI = Math.PI * 2;
const MAP_SCALE = 8;
const STRIP_WIDTH = 1;
const VIEW_DIST = 1;
const NUM_RAYS = VIEWPORT_WIDTH/STRIP_WIDTH;

class MainState extends Phaser.State {
  init() {
    console.log('Entering main state');
  }

  create() {
    this.rt = this.game.add.bitmapData(VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 'rt');
    this.maprt = this.game.add.bitmapData(VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 'maprt');
    this.map = Map.map;
    this.map = _.map(this.map, row => {
      return row.split(' ');
    });

    this.rt.addToWorld(0, 0);
    this.maprt.addToWorld(VIEWPORT_WIDTH, 0, 0, 0);

    this.player = {
      x: 8,
      y: 3,
      dir: 0,
      rot: 0,
      speed: 0,
      moveSpeed: 0.18,
      rotSpeed: 6 * Math.PI/180
    };

    this.wsad = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
  }

  redrawMap() {
    _.forEach(this.map, (row, i) => {
      _.forEach(row, (col, j) => {
        switch(col) {
          case '1':
          this.maprt.rect(j*MAP_SCALE, i*MAP_SCALE, MAP_SCALE,MAP_SCALE, '#ffffff');
          break;
          case '2':
          this.maprt.rect(j*MAP_SCALE, i*MAP_SCALE, MAP_SCALE,MAP_SCALE, '#ffdd21');
        }
      });
    });
  }

  isBlocking(x, y) {
    if(y < 0 || y >= this.map.length || x < 0 || x>= this.map[0].length) {
      return true;
    }
    return this.map[Math.floor(y)][Math.floor(x)] != 0;
  }

  move() {
    let moveStep = this.player.speed * this.player.moveSpeed;
    this.player.rot += this.player.dir * this.player.rotSpeed;
    this.player.rot %= TWOPI;
    if (this.player.rot < 0) {
      this.player.rot += TWOPI;
    }
    var newX = this.player.x + Math.cos(this.player.rot) * moveStep;
    var newY = this.player.y + Math.sin(this.player.rot) * moveStep;

    if (this.isBlocking(newX, newY)) {
      return;
    }

    this.player.x = newX;
    this.player.y = newY;
  }

  castRays() {
    var stripIdx = 0;
    for (var i=0; i < NUM_RAYS; i++) {
      var rayScreenPos = (-NUM_RAYS/2 + i) * STRIP_WIDTH;
      var rayViewDist = Math.sqrt(rayScreenPos*rayScreenPos + VIEW_DIST*VIEW_DIST);

      var rayAngle = Math.asin(rayScreenPos / rayViewDist);
      this.castRay(this.player.rot + rayAngle);
    }
  }

  castRay(angle) {
    var right = (angle > TWOPI * 0.75 || angle < TWOPI * 0.25);
    var up = (angle < 0 || angle > Math.PI);
    var angleSin = Math.sin(angle), angleCos = Math.cos(angle);
    var dist = 0;
    var xHit = 0, yHit = 0;
    var textureX;
    var wallX;
    var wallY;
    var slope = angleSin / angleCos;

    var dX = right ? 1 : -1;
    var dY = dX * slope;

    var x = right ? Math.ceil(this.player.x) : Math.floor(this.player.x);
    var y = this.player.y + (x - this.player.x) * slope;

    while (x >= 0 && x < this.map.length && y >= 0 && y < this.map[0].length) {
      var wallX = Math.floor(x + (right ? 0 : -1));
      var wallY = Math.floor(y);

      if (this.map[wallY][wallX] > 0) {
        var distX = x - this.player.x;
        var distY = y - this.player.y;

        dist = distX*distX + distY*distY;

        xHit = x;
        yHit = y;
        break;
      }

      x += dX;
      y += dY;
    }

    if (dist)
    this.maprt.line(this.player.x * MAP_SCALE, this.player.y * MAP_SCALE, xHit * MAP_SCALE, yHit * MAP_SCALE, '#f00');
  }

  render() {
    this.maprt.fill(32, 32, 32);
    this.redrawMap();
    this.maprt.rect(this.player.x*MAP_SCALE, this.player.y*MAP_SCALE, MAP_SCALE, MAP_SCALE, '#00ddff');
    this.castRays();
  }

  update() {
    this.wsad.up.isDown ? this.player.speed = 1 : null;
    this.wsad.down.isDown ? this.player.speed = -1 : null;
    !this.wsad.down.isDown && !this.wsad.up.isDown ? this.player.speed = 0 : null;

    this.wsad.right.isDown ? this.player.dir = 1 : null;
    this.wsad.left.isDown ? this.player.dir = -1 : null;
    !this.wsad.left.isDown && !this.wsad.right.isDown ? this.player.dir = 0 : null;
    this.move();
  }
}

export default MainState;
