import NPC1 from 'scripts/npc1.js';
import NPC1S from 'scripts/npc1S.js';

export default class Player {
    constructor(x, y, controlScheme = 'leftStick', controller = 0) {
        x === undefined ? this.x += 0 : this.x = x;
        y === undefined ? this.y += 0 : this.y = y;
        this._angle = 0;
        this._move = false;
        this.controlScheme = controlScheme;
        this.controller = controller;
        this.npcs = [];
        this.resources = 0;
        this.showResourceMessage = false;
        this.pad = Pads.get();
    }

    movePlayer() {
        this.pad.update();

        const analogThreshold = 25;

        if (this.controlScheme === 'leftStick') {
            if (this.pad.justPressed(Pads.LEFT) || this.pad.lx < -analogThreshold) {
                if (this.x >= 75) {
                    this.x -= 75;
                }
            }
            
            if (this.pad.justPressed(Pads.RIGHT) || this.pad.lx > analogThreshold) {
                if (this.x <= 538) {
                    this.x += 75;
                }
            }

            if (this.pad.justPressed(Pads.UP) || this.pad.ly < -analogThreshold) {
                if (this.y >= 100) {
                    this.y -= 75;
                }
            }

            if (this.pad.justPressed(Pads.DOWN) || this.pad.ly > analogThreshold) {
                if (this.y <= 358) {
                    this.y += 75;
                }
            }
        }

        this.spawnNPC();
    }

    spawnNPC() {
        if (this.pad.justPressed(Pads.CROSS) && this.resources >= 100) {
            const npc = new NPC1(this.x, this.y);
            this.npcs.push(npc);
            this.resources -= 100;
            this.showResourceMessage = false;
        } else if (this.pad.justPressed(Pads.CROSS)) {
            this.showResourceMessage = true;
        }

        if (this.pad.justPressed(Pads.SQUARE) && this.resources >= 100) {
            const npcS = new NPC1S(this.x, this.y);
            this.npcs.push(npcS);
            this.resources -= 100;
            this.showResourceMessage = false;
        } else if (this.pad.justPressed(Pads.SQUARE)) {
            this.showResourceMessage = true;
        }
    }

    updateNPCs(zombies) {
        for (let i = this.npcs.length - 1; i >= 0; i--) {
            const npc = this.npcs[i];
            npc.update(zombies);

            if (npc.isDead()) {
                this.npcs.splice(i, 1);
            }
        }
    }

    draw() {
        for (const npc of this.npcs) {
            npc.draw();
        }
    }

    update(zombies) {
        this.movePlayer();
        this.updateNPCs(zombies);
    }

    clearNPCs() {
        const npcCount = this.npcs.length;
        this.npcs = [];
        return npcCount * 100;
    }
}