import { Howl, Howler } from 'howler';

export class SoundManager {
    constructor() {
        this.sounds = {};
        this.masterVolume = 0.5;

        this._loadSounds();
    }

    _loadSounds() {
        // Mapping des sons avec les fichiers dans assets/sounds/
        const library = {
            shoot: 'assets/sounds/shoot.wav',
            jump: 'assets/sounds/jump.wav',
            hit: 'assets/sounds/hit.wav',
            build: 'assets/sounds/build.wav', // Ajoute ce fichier plus tard
            footstep: 'assets/sounds/footstep.wav'
        };

        for (const [name, path] of Object.entries(library)) {
            this.sounds[name] = new Howl({
                src: [path],
                volume: this.masterVolume,
                preload: true
            });
        }
    }

    play(name, spatialPos = null) {
        if (!this.sounds[name]) return;

        const id = this.sounds[name].play();

        // Si on veut du son 3D (spatialisation)
        if (spatialPos) {
            this.sounds[name].pos(spatialPos.x, spatialPos.y, spatialPos.z, id);
            // On limite la portée du son
            this.sounds[name].pannerAttr({
                panningModel: 'HRTF',
                refDistance: 1,
                maxDistance: 100,
                rolloffFactor: 1
            }, id);
        }
    }

    setMasterVolume(val) {
        this.masterVolume = val;
        Howler.volume(val);
    }
}
