export default class SoundManager {
    constructor() {
        this.currentTrack = null;
        this.musicLoop();
    }

    playBackgroundMusic(path) {
        this.currentTrack = Sound.load(path);
        Sound.play(this.currentTrack, true);
    }

    setBackgroundVolume(volume) {
        if (this.currentTrack) {
            Sound.setVolume(this.currentTrack, volume);
        }
    }

    musicLoop() {
        os.setInterval(() => {
            if (this.currentTrack && !Sound.isPlaying(this.currentTrack)) {
                Sound.play(this.currentTrack, true);
            }
        }, 100);
    }
}