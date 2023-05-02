import { Component } from "./component";
import { Engine } from "./main";

export class GameObject {
    components: Component[] = [];
    children: GameObject[] = []; 
    parent: GameObject = null;
    
    protected _x: number;
    protected _y: number;
    protected _w: number;
    protected _h: number;
    protected _layer: number;
    protected _rotation: number = 0;

    constructor(x: number, y: number, w: number, h: number, layer: number = 0) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this._layer = layer;
    }

    onUpdate () {
        this.components.forEach(component => {
            component.onUpdate();
        });
        this.children.forEach(child => {
            child.onUpdate();
        });
    }

    addComponent(component: Component) {
        this.components.push(component);
        component.setGameObject(this);
    }

    addChild(child: GameObject) {
        this.children.push(child);
        child.parent = this;
    }

    getPosition() {
        if (this.parent == null) {
            return {x: this._x, y: this._y};
        }
        else {
            let parentPos = this.parent.getPosition();
            return {x: this._x + parentPos.x, y: this._y + parentPos.y};
        }
    }

    setPosition(x: number, y: number) {
        if (this.parent == null) {
            this._x = x;
            this._y = y;
        }
        else {
            let parentPos = this.parent.getPosition();
            this._x = x - parentPos.x;
            this._y = y - parentPos.y;
        }
    }

    public get x() {
        if (this.parent == null) {
            return this._x;
        }
        else {
            let parentPos = this.parent.getPosition();
            return this._x + parentPos.x;
        }
    }

    public get y() {
        if (this.parent == null) {
            return this._y;
        }
        else {
            let parentPos = this.parent.getPosition();
            return this._y + parentPos.y;
        }
    }

    public get w() {
        return this._w;
    }

    public get h() {
        return this._h;
    }

    public get rotation() {
        return this._rotation;
    }

    public set rotation(val: number) {
        this._rotation = val;
    }

    // public set x(val: number) {
    //     this._x = val;
    // }

    // public set y(val: number) {
    //     this._y = val;
    // }

    public set w(val: number) {
        this._w = val;
    }

    public set h(val: number) {
        this._h = val;
    }

    public get layer() {
        return this._layer;
    }

    destroy() {
        this.components = [];
        this.children.forEach(child => {
            child.destroy();
        });
        Engine.scenes[Engine.sceneIndex].removeGameObject(this);
    }
}