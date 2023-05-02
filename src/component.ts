import { GameObject } from "./gameObject";

export abstract class Component {
    protected _gameObject: GameObject;

    constructor() {
    }

    setGameObject(gameObject: GameObject){
        this._gameObject = gameObject;
    }

    abstract onUpdate();
}