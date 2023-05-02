import { GameObject } from "./gameObject";

export class Scene {
    private _gameObjects: GameObject[] = [];
    public onEnterScene: () => void;
    public onUpdate: () => void;

    constructor(onEnterScene: () => void = () => {}, onUpdate: () => void = () => {}) {
        this.onEnterScene = onEnterScene;
        this.onUpdate = onUpdate;
    }

    addGameObject(gameObject: GameObject) {
        this._gameObjects.push(gameObject);
    }

    removeGameObject(gameObject: GameObject) {
        this._gameObjects = this._gameObjects.filter(element => element !== gameObject);
    }

    update() {
        // sort game objects by layer
        this.onUpdate();
        this._gameObjects.sort((a, b) => a.layer - b.layer);
        this._gameObjects.forEach(element => {
            element.onUpdate();
        });

    }

    pressed() {
        let shouldBreak = false;
        this._gameObjects.forEach(element => {
            element.children.forEach(child => {
                child.components.forEach(component => {
                    if (component['pressed'] && !shouldBreak) {
                        if (component['pressed']()) {
                            // shouldBreak = true;
                        }
                    }
                });
            });
            element.components.forEach(component => {
                if (component['pressed'] && !shouldBreak) {
                    if (component['pressed']()) {
                        // shouldBreak = true;
                    }
                }
            })
        });
    }

    released() {
        this._gameObjects.forEach(element => {
            element.children.forEach(child => {
                child.components.forEach(component => {
                    if (component['released']) {
                        component['released']();
                    }
                });
            });
            element.components.forEach(component => {
                if (component['released']) {
                    component['released']();
                }
            });
        });
    }
}