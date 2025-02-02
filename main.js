import SoundManager from 'scripts/sound.js';
import StartScreen from 'scripts/start.js';
import Player from './player.js';
import LevelManager from './LevelManager.js';
import Texto from 'scripts/mesagem.js';

let font = new Font("fonts/Orbitron-Medium.ttf");
font.color = Color.new(252, 227, 3);

let fontds = new Font("fonts/LEMONMILK-Light.otf");
fontds.scale = 0.8f;

const soundManager = new SoundManager();
soundManager.playBackgroundMusic("assets/music/music.ogg");
soundManager.setBackgroundVolume(100);

const defenseSelect = new Image("assets/fundo/select defende.png", VRAM);
const defenseSelectS = new Image("assets/fundo/select defendeS.png", VRAM);

const background = new Image("assets/fundo/background.png", VRAM);
const mira = new Image("assets/mira/mira.png", VRAM);
const player1 = new Player(90, 69, 'leftStick', 0);
const startScreen = new StartScreen();
const texto = new Texto();

const levelManager = new LevelManager();
levelManager.configureLevel();
let { golds, zombles, zombieS } = levelManager.loadLevel();

let gameStarted = false;
let resources = 330;
let levelComplete = false;
let score = 0;

const free_mem = System.getMemoryStats();
const free_vram = Screen.getFreeVRAM();
const ram_usage = System.getMemoryStats();
const ramUse = (ram_usage.used / 1048576).toFixed(2);

os.setInterval(() => {
    Screen.clear();

    if (!gameStarted) {
        startScreen.draw();
        font.print(0, 0, `Score: ${score}`);
        font.print(0, 30, `Resources: ${resources}`);
        startScreen.checkStart();

        if (!startScreen.isActive) {
            gameStarted = true;
        }
    } else {
        background.draw(0, 0);
        defenseSelect.draw(573, 7);
        defenseSelectS.draw(500, 7);

        player1.resources = resources;
        player1.update(zombles.concat(zombieS));
        resources = player1.resources;
        player1.draw();
        mira.draw(player1.x - 10, player1.y + 4);

        font.print(0, 0, `Score: ${score}`);
        font.print(0, 30, `Resources: ${resources}`);

        for (let i = golds.length - 1; i >= 0; i--) {
            const gold = golds[i];
            gold.update();
            gold.draw();
            if (gold.checkCollision(player1.x, player1.y)) {
                resources += 30;
                golds.splice(i, 1);
            }
        }

        for (let i = zombles.length - 1; i >= 0; i--) {
            const zomble = zombles[i];
            zomble.update();
            zomble.draw();
            if (zomble.health <= 0) {
                zombles.splice(i, 1);
                score += 10;
                resources += 10;
            } else if (zomble.isOutOfScreen()) {
                zombles.splice(i, 1);
            }
        }

        for (let i = zombieS.length - 1; i >= 0; i--) {
            const zS = zombieS[i];
            zS.update();
            zS.draw();
            if (zS.health <= 0) {
                zombieS.splice(i, 1);
                score += 20;
                resources += 20;
            } else if (zS.isOutOfScreen()) {
                zombieS.splice(i, 1);
            }
        }

        if (zombles.length === 0 && zombieS.length === 0 && !levelComplete) {
            levelComplete = true;
            resources += player1.clearNPCs();
        }

        if (levelComplete) {
            texto.draw();

            const pad = Pads.get(0);
            if (pad.justPressed(Pads.START)) {
                levelComplete = false;
                levelManager.nextLevel();
                ({ golds, zombles, zombieS } = levelManager.loadLevel());
            }
        }
    }

    Screen.flip();
}, 0);