let levelCompleteMessage = new Image("assets/intro/mesagem.png", RAM);

export default class Texto {
    constructor() {
        this.posicaoX = 189;
        this.posicaoY = 163;
    }

    draw() {
        if (levelCompleteMessage && levelCompleteMessage.ready()) {
            levelCompleteMessage.draw(this.posicaoX, this.posicaoY);
        }
    }
}