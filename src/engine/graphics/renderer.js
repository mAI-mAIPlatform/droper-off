import * as THREE from 'three';

export class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        
        // Caméra : Champ de vision de 75° (classique pour un TPS/FPS)
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            2000
        );
        this.camera.position.set(0, 5, 10);

        // Rendu WebGL avec optimisation
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Ambiance
        this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.002); // Brouillard bleu ciel
        this.scene.background = new THREE.Color(0x87ceeb);
    }

    /**
     * Crée l'environnement de base (Lumières + Sol temporaire)
     */
    createEnvironment() {
        // Lumière ambiante pour déboucher les ombres
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Lumière directionnelle (Le Soleil)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunLight.position.set(50, 100, 50);
        sunLight.castShadow = true;
        
        // Optimisation de la zone d'ombre
        sunLight.shadow.camera.left = -100;
        sunLight.shadow.camera.right = 100;
        sunLight.shadow.camera.top = 100;
        sunLight.shadow.camera.bottom = -100;
        sunLight.shadow.mapSize.set(2048, 2048);
        
        this.scene.add(sunLight);

        // Sol de test
        const groundGeometry = new THREE.PlaneGeometry(500, 500);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x348C31 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}
