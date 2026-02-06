export class HUD {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'hud-container';
        document.body.appendChild(this.container);
        
        this._injectStyles();
        this._createElements();
    }

    _injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #hud-container {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                pointer-events: none; font-family: 'Inter', sans-serif;
            }
            .crosshair {
                position: absolute; top: 50%; left: 50%;
                width: 20px; height: 20px; border: 2px solid white;
                border-radius: 50%; transform: translate(-50%, -50%);
                mix-blend-mode: difference;
            }
            .health-bar {
                position: absolute; bottom: 30px; left: 30px;
                width: 250px; height: 20px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px); /* Effet Liquid Glass */
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px; overflow: hidden;
            }
            .health-fill {
                width: 100%; height: 100%;
                background: linear-gradient(90deg, #ff4b2b, #ff416c);
                transition: width 0.3s ease;
            }
            .stats {
                position: absolute; top: 20px; right: 20px;
                color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                font-weight: bold; font-size: 1.2rem;
            }
        `;
        document.head.appendChild(style);
    }

    _createElements() {
        this.container.innerHTML = `
            <div class="crosshair"></div>
            <div class="health-bar">
                <div id="hp-fill" class="health-fill"></div>
            </div>
            <div class="stats">
                <span id="player-count">👥 100</span> | <span id="kills">🎯 0</span>
            </div>
        `;
    }

    updateHealth(percent) {
        document.getElementById('hp-fill').style.width = `${percent}%`;
    }

    updateStats(players, kills) {
        document.getElementById('player-count').textContent = `👥 ${players}`;
        document.getElementById('kills').textContent = `🎯 ${kills}`;
    }
}
