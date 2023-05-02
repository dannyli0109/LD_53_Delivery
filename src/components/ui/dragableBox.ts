import { WIDTH } from "../../const";
import { Tween } from "../../lib/tween/tween.esm";
import { Engine } from "../../main";
import { Box } from "./box";
import { UIElement } from "./uiElement";

export class DragableBox extends Box implements UIElement {
    private _pressed: boolean = false;
    private _offsetX: number = 0;
    private _offsetY: number = 0;
    constructor(visible: boolean, onHover: () => void = () => {}, onUnhover: () => void = () => {}) {
        super(visible, onHover, onUnhover);
    }

    onUpdate() {
        super.onUpdate();
        if (this._pressed) {
            // clamp position
            let x = Engine.instance.mouseX - this._offsetX;
            let y = Engine.instance.mouseY - this._offsetY;
            if (x > Engine.instance.width - this._gameObject.w / 2) {
                x = Engine.instance.width - this._gameObject.w / 2;
            }             
            if (x < this._gameObject.w / 2) {
                x = this._gameObject.w / 2;
            }   

            if (y > Engine.instance.height - this._gameObject.h / 2) {
                y = Engine.instance.height - this._gameObject.h / 2;
            }

            if (y < this._gameObject.h / 2) {
                y = this._gameObject.h / 2;
            }
            this._gameObject.setPosition(x, y);
        }
    }

    pressed(): boolean {
        if (!this.collide()) return false;
        if (!Engine.dragging) {     
            Engine.dragging = this._gameObject;       
            this._pressed = true;
            this._offsetX = Engine.instance.mouseX - this._gameObject.x;
            this._offsetY = Engine.instance.mouseY - this._gameObject.y;
        }
        else if (Engine.dragging && Engine.dragging != this._gameObject) {
            return false;
        }
        return true;
    }

    override collide(): boolean {
        if (super.collide() || this._pressed) {
            return true;
        }
        return false;
    }
    
    released() {
        if (this._pressed) {
            this._pressed = false;
            Engine.dragging = null;
            console.log(2);
        }
    }
}