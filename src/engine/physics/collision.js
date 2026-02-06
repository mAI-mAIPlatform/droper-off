import * as CANNON from 'cannon-es';

export class PhysicsWorld {
    constructor() {
        this.world = new CANNON.World();
        
        // Gravité terrestre standard (9.82 m/s²)
        this.world.gravity.set(0, -9.82, 0);

        // Algorithme de détection de collision large (SAP est performant pour les grandes maps)
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        
        // Permet d'éviter de calculer les objets qui ne bougent pas
        this.world.allowSleep = true;

        // Configuration du solveur (plus d'itérations = plus de précision pour les constructions)
        this.world.solver.iterations = 10;
        this.world.defaultContactMaterial.friction = 0.1;

        this._initMaterials();
        this._createStaticGround();
    }

    _initMaterials() {
        // Définition des matériaux physiques (pour varier la friction entre bois, métal, etc.)
        this.materials = {
            ground: new CANNON.Material("ground"),
            player: new CANNON.Material("player")
        };

        const contactMaterial = new CANNON.ContactMaterial(
            this.materials.ground,
            this.materials.player,
            {
                friction: 0.5,
                restitution: 0.0, // Pas de rebond pour le joueur
                contactEquationStiffness: 1e8,
                contactEquationRelaxation: 3
            }
        );
        this.world.addContactMaterial(contactMaterial);
    }

    _createStaticGround() {
        // Corps physique du sol (doit correspondre au mesh visuel)
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({
            mass: 0, // Masse 0 = objet statique (ne bouge jamais)
            shape: groundShape,
            material: this.materials.ground
        });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(groundBody);
    }

    update(deltaTime) {
        // On utilise un pas de temps fixe (fixedStep) pour une simulation stable
        this.world.step(1 / 60, deltaTime, 3);
    }
}
