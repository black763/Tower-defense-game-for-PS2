let background = new Image("assets/fundo/background.png", VRAM);
let startButton = new Image("assets/intro/start.png", VRAM);


export default class StartScreen {
    constructor() {
        this.isActive = true;
        this.buttonX = 189;
        this.buttonY = 163;
    }

    draw() {
        if (background && background.ready()) {
            background.draw(0, 0);
        }

        if (startButton && startButton.ready()) {
            startButton.draw(this.buttonX, this.buttonY);
        }
    }

    checkStart() {
        const pad = Pads.get(0);

        if (pad.justPressed(Pads.START)) {
            this.isActive = false;
        }
    }
}