export class Keyboard {
    constructor() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            shift: false, // Sprint
            build: false  // Mode construction
        };

        // Mapping pour supporter ZQSD et WASD (on pense à tout le monde)
        this.keyMap = {
            'KeyW': 'forward', 'KeyZ': 'forward', 'ArrowUp': 'forward',
            'KeyS': 'backward', 'ArrowDown': 'backward',
            'KeyA': 'left', 'KeyQ': 'left', 'ArrowLeft': 'left',
            'KeyD': 'right', 'ArrowRight': 'right',
            'Space': 'jump',
            'ShiftLeft': 'shift',
            'KeyE': 'build'
        };

        this._initListeners();
    }

    _initListeners() {
        window.addEventListener('keydown', (e) => this._handleKey(e.code, true));
        window.addEventListener('keyup', (e) => this._handleKey(e.code, false));
    }

    _handleKey(code, isPressed) {
        const action = this.keyMap[code];
        if (action) {
            this.keys[action] = isPressed;
        }
    }

    /**
     * Helper pour savoir si une direction est activée
     */
    hasMovement() {
        return this.keys.forward || this.keys.backward || this.keys.left || this.keys.right;
    }
}
