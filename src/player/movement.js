import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Keyboard } from '../input/keyboard.js';

export class Player {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.keyboard = new Keyboard();

        // Paramètres de mouvement
        this.walkSpeed = 10;
        this.runSpeed = 18;
        this.jumpForce = 5;
        this.canJump = false;

        this._initPhysics();
        this._initVisuals();
    }

    _initPhysics() {
        // On crée une capsule ou un cylindre pour la collision (mieux que le cube pour monter les pentes)
        const radius = 0.5;
        const height = 2;
        this.shape = new CANNON.Cylinder(radius, radius, height, 16);
        
        this.body = new CANNON.Body({
            mass: 70, // Poids d'un perso normal
            shape: this.shape,
            fixedRotation: true, // Empêche le perso de rouler comme une bûche
            material: new CANNON.Material({ friction: 0.1 })
        });

        this.body.position.set(0, 5, 0); // Spawn en l'air
        this.world.addBody(this.body);

        // Détection du sol pour le saut
        this.body.addEventListener("collide", (e) => {
            if (Math.abs(e.contact.ni.y) > 0.5) this.canJump = true;
        });
    }

    _initVisuals() {
        // Un placeholder stylé en attendant les modèles .obj/.fbx
        const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.scene.add(this.mesh);
    }

    update(deltaTime) {
        const speed = this.keyboard.keys.shift ? this.runSpeed : this.walkSpeed;
        const moveVector = new THREE.Vector3(0, 0, 0);

        // Calcul de la direction
        if (this.keyboard.keys.forward) moveVector.z -= 1;
        if (this.keyboard.keys.backward) moveVector.z += 1;
        if (this.keyboard.keys.left) moveVector.x -= 1;
        if (this.keyboard.keys.right) moveVector.x += 1;

        if (moveVector.length() > 0) {
            moveVector.normalize();
            // On applique la vélocité sur X et Z sans toucher à la gravité sur Y
            this.body.velocity.x = moveVector.x * speed;
            this.body.velocity.z = moveVector.z * speed;
        } else {
            // Friction naturelle pour s'arrêter net
            this.body.velocity.x *= 0.9;
            this.body.velocity.z *= 0.9;
        }

        // Gestion du saut
        if (this.keyboard.keys.jump && this.canJump) {
            this.body.velocity.y = this.jumpForce;
            this.canJump = false;
        }

        // Synchronisation du Mesh (Visual) avec le Body (Physics)
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
}
