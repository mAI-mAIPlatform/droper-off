import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Building {
    constructor(scene, world, playerTransform) {
        this.scene = scene;
        this.world = world;
        this.playerTransform = playerTransform; // Position du joueur
        
        this.gridSize = 4; // Taille d'un mur/sol
        this.buildDistance = 6;
        this.currentMode = 'wall'; // 'wall' ou 'floor'

        this._initListeners();
    }

    _initListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyR') this.placeStructure();
        });
    }

    placeStructure() {
        if (document.pointerLockElement !== document.body) return;

        // Calcul de la position devant le joueur alignée sur la grille
        const pos = new THREE.Vector3();
        this.playerTransform.getWorldPosition(pos);
        const dir = new THREE.Vector3();
        this.playerTransform.getWorldDirection(dir);

        // On projette le point de pose
        const buildPos = new THREE.Vector3(
            Math.round((pos.x + dir.x * this.buildDistance) / this.gridSize) * this.gridSize,
            Math.round((pos.y + 1) / this.gridSize) * this.gridSize,
            Math.round((pos.z + dir.z * this.buildDistance) / this.gridSize) * this.gridSize
        );

        this._createWall(buildPos);
    }

    _createWall(position) {
        // 1. Visuel (Three.js)
        const geometry = new THREE.BoxGeometry(this.gridSize, this.gridSize, 0.2);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513, 
            transparent: true, 
            opacity: 0.8 
        });
        const wall = new THREE.Mesh(geometry, material);
        wall.position.copy(position);
        this.scene.add(wall);

        // 2. Physique (Cannon-es)
        const shape = new CANNON.Box(new CANNON.Vec3(this.gridSize/2, this.gridSize/2, 0.1));
        const body = new CANNON.Body({ mass: 0, shape: shape }); // masse 0 = statique
        body.position.copy(position);
        this.world.addBody(body);
        
        console.log("🧱 Structure posée en :", position);
    }
}
