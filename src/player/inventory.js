export class Inventory {
    constructor(hud) {
        this.hud = hud;
        this.slots = [null, null, null, null, null]; // 5 slots comme dans Fortnite
        this.activeIndex = 0;
        
        this.itemsData = {
            'ar': { name: 'Assault Rifle', icon: '🔫', damage: 30 },
            'shotgun': { name: 'Pump Shotgun', icon: '🔥', damage: 80 },
            'wood': { name: 'Wood', icon: '🪵', count: 100 }
        };

        this._initListeners();
        this._setupInitialStuff();
    }

    _initListeners() {
        // Changement d'arme avec les touches 1 à 5
        window.addEventListener('keydown', (e) => {
            const key = parseInt(e.key);
            if (key >= 1 && key <= 5) {
                this.selectSlot(key - 1);
            }
        });

        // Molette de la souris
        window.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) this.selectSlot((this.activeIndex + 1) % 5);
            else this.selectSlot((this.activeIndex - 1 + 5) % 5);
        });
    }

    _setupInitialStuff() {
        this.addItem('ar');
        this.addItem('wood');
    }

    addItem(type) {
        const emptySlot = this.slots.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
            this.slots[emptySlot] = { ...this.itemsData[type], type };
            console.log(`📦 Item ajouté : ${this.itemsData[type].name}`);
            this._updateUI();
        }
    }

    selectSlot(index) {
        this.activeIndex = index;
        const currentItem = this.slots[this.activeIndex];
        console.log(`🎮 Slot sélectionné : ${index + 1} (${currentItem ? currentItem.name : 'Vide'})`);
        this._updateUI();
    }

    _updateUI() {
        // On envoie les infos au HUD pour l'affichage "Liquid Glass"
        if (this.hud && this.hud.updateInventory) {
            this.hud.updateInventory(this.slots, this.activeIndex);
        }
    }

    getActiveItem() {
        return this.slots[this.activeIndex];
    }
}
