let zombieSSpriteSheet = new Image("assets/zombles/zombieS_spritesheet.png", RAM);

export default class ZombieS {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 0.3;
        this.health = 360;
        this.state = 'left';

        this.leftFrames = [
            { x: 0, y: 0, width: 29, height: 67, endx: 25, endy: 67 },
            { x: 25, y: 0, width: 31, height: 67, endx: 56, endy: 67 },
            { x: 56, y: 0, width: 29, height: 67, endx: 85, endy: 67 },
            { x: 85, y: 0, width: 29, height: 67, endx: 114, endy: 67 },
            { x: 0, y: 67, width: 31, height: 67, endx: 31, endy: 133 }, 
            { x: 31, y: 67, width: 25, height: 67, endx: 60, endy: 133 }
        ];

        this.currentFrame = 0;
        this.frameCounter = 0;
        this.frameSpeed = 10; 
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
        if (zombieSSpriteSheet && zombieSSpriteSheet.ready() && this.leftFrames.length > 0) {
            const frame = this.leftFrames[this.currentFrame];

            if (frame) {
                zombieSSpriteSheet.startx = frame.x;
                zombieSSpriteSheet.starty = frame.y;
                zombieSSpriteSheet.width = frame.width;
                zombieSSpriteSheet.height = frame.height;
                zombieSSpriteSheet.endx = frame.endx;
                zombieSSpriteSheet.endy = frame.endy;
                zombieSSpriteSheet.draw(this.x, this.y);
            }
        }
    }

    isOutOfScreen() {
        return this.x + this.width < 0;
    }
}