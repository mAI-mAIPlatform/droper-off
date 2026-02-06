import * as THREE from 'three';

export class Shooting {
    constructor(scene, camera, world) {
        this.scene = scene;
        this.camera = camera;
        this.world = world;
        
        this.raycaster = new THREE.Raycaster();
        this.canShoot = true;
        this.fireRate = 0.15; // Un tir toutes les 150ms
        this.damage = 25;
        this.range = 500;

        this._initListeners();
    }

    _initListeners() {
        window.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.shoot(); // Clic gauche
        });
    }

    shoot() {
        if (!this.canShoot || document.pointerLockElement !== document.body) return;

        this.canShoot = false;

        // On tire depuis le centre de l'écran
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const hit = intersects[0];
            this._createImpactEffect(hit.point);
            
            // Logique de dégâts (à relier aux bots plus tard)
            if (hit.object.userData.isBot) {
                console.log("🎯 Hit ! Dégâts infligés :", this.damage);
            }
        }

        // Cooldown
        setTimeout(() => { this.canShoot = true; }, this.fireRate * 1000);
    }

    _createImpactEffect(point) {
        // Un petit flash visuel au point d'impact
        const geo = new THREE.SphereGeometry(0.1, 8, 8);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const impact = new THREE.Mesh(geo, mat);
        impact.position.copy(point);
        this.scene.add(impact);

        // Disparition automatique après 100ms
        setTimeout(() => { this.scene.remove(impact); }, 100);
    }
}
