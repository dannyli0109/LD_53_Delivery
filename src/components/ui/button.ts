import { Engine } from "../../main";
import { Box } from "./box";
import { UIElement } from "./uiElement";

export class Button extends Box implements UIElement {
    private _text: string;
    private _onPressed: () => void;
    constructor(text: string, onPressed: () => void = () => {}) {
        super(true);
        this._text = text;
        this._onPressed = onPressed;
    }

    onUpdate() {
        super.onUpdate();
        Engine.instance.textFont(Engine.font)
        Engine.instance.textSize(16);
        Engine.instance.fill(0);
        Engine.instance.textAlign(Engine.instance.CENTER, Engine.instance.CENTER);
        Engine.instance.text(this._text, this._gameObject.x, this._gameObject.y);
    }

    override pressed(): boolean {
        if (this.collide()) {
            this._onPressed();
            return true;
        }
        return false;
    }
}