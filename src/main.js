import * as THREE from 'three';
import Stats from 'stats.js';
import { Engine } from './engine/graphics/renderer.js';
import { PhysicsWorld } from './engine/physics/collision.js';
import { Player } from './player/movement.js';
import { BotManager } from './bots/bot_manager.js';
import { HUD } from './ui/hud.js';

/**
 * CONFIG & SETUP ⚙️
 */
class DroperGame {
    constructor() {
        this.canvas = document.querySelector('#game-canvas');
        this.stats = new Stats();
        this.isRunning = false;

        // Init modules
        this.physics = new PhysicsWorld();
        this.engine = new Engine(this.canvas);
        this.player = new Player(this.engine.scene, this.physics.world);
        this.bots = new BotManager(this.engine.scene, this.physics.world);
        this.ui = new HUD();

        this._init();
    }

    _init() {
        // Ajout du moniteur de FPS (indispensable en dev)
        document.body.appendChild(this.stats.dom);

        // Gestion du resize
        window.addEventListener('resize', () => this.onResize());

        // Setup environnement (Lumière, Sol, Ciel)
        this.engine.createEnvironment();

        // Let's go !
        this.isRunning = true;
        this.animate();
        
        console.log("🚀 Droper est en ligne ! Bonne chance pour le Top 1.");
    }

    onResize() {
        this.engine.resize(window.innerWidth, window.innerHeight);
    }

    /**
     * GAME LOOP 🔄
     * C'est ici que tout se passe à chaque frame
     */
    animate() {
        if (!this.isRunning) return;

        this.stats.begin();

        const deltaTime = this.engine.clock.getDelta();

        // 1. Update Physique
        this.physics.update(deltaTime);

        // 2. Update Joueur & IA
        this.player.update(deltaTime);
        this.bots.updateAll(deltaTime);

        // 3. Render Image
        this.engine.render();

        this.stats.end();

        requestAnimationFrame(() => this.animate());
    }
}

// Lancement du jeu au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    new DroperGame();
});
