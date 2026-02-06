export class Mouse {
    constructor() {
        this.lookSensitivity = 0.002;
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ'); // Ordre de rotation pour FPS
        this.pitch = 0; // Haut/Bas
        this.yaw = 0;   // Gauche/Droite

        this._initListeners();
    }

    _initListeners() {
        // Active le verrouillage de la souris au clic sur le jeu
        window.addEventListener('mousedown', () => {
            if (document.pointerLockElement !== document.body) {
                document.body.requestPointerLock();
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === document.body) {
                this.yaw -= e.movementX * this.lookSensitivity;
                this.pitch -= e.movementY * this.lookSensitivity;

                // On limite la vue vers le haut et le bas (pas de 360° vertical !)
                this.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.pitch));
                
                this.euler.x = this.pitch;
                this.euler.y = this.yaw;
            }
        });
    }

    getRotation() {
        return this.euler;
    }
}
