let idleSpriteSheet = new Image("assets/personagem/idle_spritesheetS.png", RAM);
let attackSpriteSheet = new Image("assets/personagem/attack_spritesheetS.png", RAM);
let laserImage = new Image("assets/laser/laserS.png", RAM);

export default class NPC1S {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.state = 'idle';

        this.idleFrames = [
            { x: 0, y: 0, width: 86, height: 69, endx: 86, endy: 69 }, // 1
            { x: 86, y: 0, width: 86, height: 69, endx: 172, endy: 69 }, // 2
            { x: 0, y: 69, width: 86, height: 69, endx: 86, endy: 138 }, // 3
            { x: 86, y: 69, width: 86, height: 69, endx: 172, endy: 138 }, // 4
            { x: 0, y: 138, width: 86, height: 69, endx: 86, endy: 207 }, // 5
            { x: 86, y: 138, width: 86, height: 69, endx: 172, endy: 207 }, // 6
            { x: 172, y: 0, width: 86, height: 69, endx: 257, endy: 69 }, // 7
            { x: 172, y: 69, width: 86, height: 69, endx: 257, endy: 138 }, // 8
            { x: 172, y: 138, width: 86, height: 69, endx: 257, endy: 207 } // 9
        ];

        this.attackFrames = [
            { x: 0, y: 0, width: 86, height: 69, endx: 86, endy: 69 }, // 1
            { x: 0, y: 138, width: 86, height: 69, endx: 86, endy: 207 }, // 2
            { x: 86, y: 138, width: 86, height: 69, endx: 172, endy: 207 }, // 3
            { x: 172, y: 138, width: 86, height: 69, endx: 258, endy: 207 }, // 4
            { x: 0, y: 207, width: 86, height: 69, endx: 86, endy: 276 }, // 5
            { x: 86, y: 207, width: 86, height: 69, endx: 172, endy: 276 }, // 6
            { x: 172, y: 207, width: 86, height: 69, endx: 258, endy: 276 }, // 7
            { x: 258, y: 0, width: 86, height: 69, endx: 343, endy: 69 }, // 8
            { x: 258, y: 69, width: 86, height: 69, endx: 343, endy: 138 }, // 9
            { x: 86, y: 0, width: 86, height: 69, endx: 172, endy: 69 }, // 10
            { x: 172, y: 0, width: 86, height: 69, endx: 258, endy: 69 }, // 11
            { x: 0, y: 69, width: 86, height: 69, endx: 86, endy: 138 }, // 12
            { x: 86, y: 69, width: 86, height: 69, endx: 172, endy: 138 }, // 13
            { x: 172, y: 69, width: 86, height: 69, endx: 258, endy: 138 } // 14
        ];

        this.currentFrame = 0;
        this.frameCounter = 0;
        this.frameSpeed = 4;

        this.lasers = [];
        this.attackCooldown = 44;
        this.cooldownCounter = 0;

        this.health = 100;
        this.damageSpeed = 5;
    }
    
    isDead() {
        return this.health <= 0;
    }

    updateAttackArea() {
        this.attackArea = {
            x: this.x,
            y: this.y - 50,
            width: 640,
            height: 75
        };
    }

    update(zombies) {
        this.updateAttackArea();

        const zombleInRange = zombies.some(zomble => this.isZombleInAttackArea(zomble));

        if (zombleInRange) {
            this.state = 'attack';
            this.cooldownCounter++;
            if (this.cooldownCounter >= this.attackCooldown) {
                this.attack();
                this.cooldownCounter = 0;
            }
        } else {
            this.state = 'idle';
        }

        this.frameCounter++;
        if (this.frameCounter >= this.frameSpeed) {
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % 
                                (this.state === 'idle' ? this.idleFrames.length : this.attackFrames.length);
        }

        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const laser = this.lasers[i];
            laser.x += 5;
            laser.lifetime--;

            if (laser.x > 640 || laser.lifetime <= 0) {
                this.lasers.splice(i, 1);
                continue;
            }

            for (const zomble of zombies) {
                if (this.checkCollision(laser, zomble)) {
                    zomble.takeDamage(35);
                    this.lasers.splice(i, 1);
                    break;
                }
            }
        }
    }

    isZombleInAttackArea(zomble) {
        return (
            zomble.x < this.attackArea.x + this.attackArea.width &&
            zomble.x + zomble.width > this.attackArea.x &&
            zomble.y < this.attackArea.y + this.attackArea.height &&
            zomble.y + zomble.height > this.attackArea.y
        );
    }

    attack() {
        const laser = { 
            x: this.x + 40, 
            y: this.y + 16, 
            lifetime: 170
        };
        this.lasers.push(laser);
    }

    checkCollision(laser, zomble) {
        return (
            laser.x < zomble.x + zomble.width &&
            laser.x + laserImage.width > zomble.x &&
            laser.y < zomble.y + zomble.height &&
            laser.y + laserImage.height > zomble.y
        );
    }

    draw() {
        let currentAnimation, spriteSheet;
    
        if (this.state === 'idle') {
            currentAnimation = this.idleFrames;
            spriteSheet = idleSpriteSheet;
        } else {
            currentAnimation = this.attackFrames;
            spriteSheet = attackSpriteSheet;
        }

        if (spriteSheet && spriteSheet.ready() && currentAnimation.length > 0) {
            if (this.currentFrame >= currentAnimation.length) {
                this.currentFrame = 0;
            }
    
            const frame = currentAnimation[this.currentFrame];
            
            if (frame) {
                spriteSheet.startx = frame.x;
                spriteSheet.starty = frame.y;
                spriteSheet.width = frame.width;
                spriteSheet.height = frame.height;
                spriteSheet.endx = frame.endx;
                spriteSheet.endy = frame.endy;
                spriteSheet.draw(this.x, this.y);
            }
        }
    
        for (const laser of this.lasers) {
            if (laserImage && laserImage.ready()) {
                laserImage.draw(laser.x, laser.y);
            }
        }
    }
}