let zombleSpriteSheet = new Image("assets/zombles/zombie_spritesheet.png", RAM);

export default class Zomble {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 0.4;
        this.health = 100;
        this.state = 'left';

        this.leftFrames = [
            { x: 0, y: 0, width: 28, height: 67, endx: 28, endy: 67 }, // 1
            { x: 28, y: 0, width: 34, height: 67, endx: 62, endy: 67 }, // 2
            { x: 62, y: 0, width: 35, height: 67, endx: 97, endy: 67 }, // 3
            { x: 97, y: 0, width: 28, height: 67, endx: 125, endy: 67 }, // 4
            { x: 0, y: 67, width: 29, height: 67, endx: 29, endy: 133 }, // 5
            { x: 29, y: 67, width: 29, height: 67, endx: 62, endy: 133 } // 6
        ];

        this.currentFrame = 0;
        this.frameCounter = 0;
        this.frameSpeed = 8;
    }

    isDead() {
        return this.health <= 0;
    }

    update() {
        this.x -= this.speed;

        this.frameCounter++;
        if (this.frameCounter >= this.frameSpeed) {
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % this.leftFrames.length;
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
        }
    }

    draw() {
        if (zombleSpriteSheet && zombleSpriteSheet.ready() && this.leftFrames.length > 0) {
            const frame = this.leftFrames[this.currentFrame];

            if (frame) {
                zombleSpriteSheet.startx = frame.x;
                zombleSpriteSheet.starty = frame.y;
                zombleSpriteSheet.width = frame.width;
                zombleSpriteSheet.height = frame.height;
                zombleSpriteSheet.endx = frame.endx;
                zombleSpriteSheet.endy = frame.endy;
                zombleSpriteSheet.draw(this.x, this.y);
            }
        }
    }

    isOutOfScreen() {
        return this.x + this.width < 0;
    }
}