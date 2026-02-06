import * as THREE from 'three';
import { BotMovement } from './bot_movement.js';

export class BotManager {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.bots = [];
        this.maxBots = 10; // On commence doucement pour les perfs
        
        this._initSpawning();
    }

    _initSpawning() {
        for (let i = 0; i < this.maxBots; i++) {
            this.spawnBot();
        }
        console.log(`🤖 ${this.maxBots} bots ont rejoint la partie.`);
    }

    spawnBot() {
        // Position de spawn aléatoire sur la map (ex: entre -50 et 50)
        const x = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        const y = 10; // Spawn en l'air pour tester la gravité

        const bot = {
            id: `bot_${Math.random().toString(36).substr(2, 9)}`,
            visual: this._createBotMesh(),
            physics: this._createBotPhysics(x, y, z),
            controller: new BotMovement(),
            health: 100,
            isDead: false
        };

        bot.visual.userData.isBot = true; // Pour le système de tir (Raycasting)
        bot.visual.userData.botId = bot.id;

        this.bots.push(bot);
    }

    _createBotMesh() {
        const geo = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
        const mat = new THREE.MeshStandardMaterial({ color: 0xff4444 }); // Rouge pour les ennemis
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        this.scene.add(mesh);
        return mesh;
    }

    _createBotPhysics(x, y, z) {
        // On réutilise la logique physique du joueur (Cylinder/Capsule)
        // Note: Ici on pourrait importer CANNON, mais on passe par le "world" reçu
        // (Logique simplifiée pour l'exemple)
        return { position: new THREE.Vector3(x, y, z), velocity: new THREE.Vector3() };
    }

    updateAll(deltaTime) {
        this.bots.forEach(bot => {
            if (bot.isDead) return;

            // 1. L'IA décide d'un mouvement
            bot.controller.update(bot, deltaTime);

            // 2. Sync visuelle
            bot.visual.position.copy(bot.physics.position);
        });
    }

    handleHit(botId, damage) {
        const bot = this.bots.find(b => b.id === botId);
        if (bot) {
            bot.health -= damage;
            console.log(`💥 Bot ${botId} touché ! HP: ${bot.health}`);
            if (bot.health <= 0) this.eliminate(bot);
        }
    }

    eliminate(bot) {
        bot.isDead = true;
        this.scene.remove(bot.visual);
        console.log(`💀 Bot ${bot.id} a été éliminé.`);
    }
}
