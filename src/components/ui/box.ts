import { Component } from "../../component";
import { Engine } from "../../main";
import { UIElement } from "./uiElement";

export class Box extends Component implements UIElement{
    protected _visible: boolean;
    protected _onHover: () => void;
    protected _onUnhover: () => void;
    protected _hovered: boolean = false;
    constructor(visible: boolean, onHover: () => void = () => {}, onUnhover: () => void = () => {}) {
        super();
        this._visible = visible;
        this._onHover = onHover;
        this._onUnhover = onUnhover;
    }

    onUpdate() {
        if (this.collide() && !this._hovered) {
            this._onHover();
            this._hovered = true;
        }

        if (!this.collide() && this._hovered) {
            this._onUnhover();
            this._hovered = false;
        }
        if (this._visible) {
            Engine.instance.rectMode(Engine.instance.CENTER)
            Engine.instance.fill(255)
            if (this.collide()) {
                Engine.instance.fill(200, 200, 200)
            }
            Engine.instance.rect(this._gameObject.x, this._gameObject.y, this._gameObject.w, this._gameObject.h);
        }
    }

    collide() {
        if (Engine.instance.mouseX >= this._gameObject.x - this._gameObject.w / 2 && Engine.instance.mouseX < this._gameObject.x + this._gameObject.w / 2 && Engine.instance.mouseY >= this._gameObject.y - this._gameObject.h / 2 && Engine.instance.mouseY < this._gameObject.y + this._gameObject.h / 2) {
            return true
        }
        return false
    }


    pressed() {
        if (!this.collide()) return false; 
        return true;
    }

    released() {
        
    }
}