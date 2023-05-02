import { Engine } from "../../main";
import { Box } from "./box";
import { UIElement } from "./uiElement";

export class Tooltip extends Box implements UIElement {
    private _text: string;
    private _textSize: number;
    constructor(text: string, textSize: number = 16){
        super(false);
        this._text = text;
        this._textSize = textSize;
    }

    onUpdate() {
        super.onUpdate();
        Engine.instance.textSize(this._textSize);
        Engine.instance.fill(0);
        Engine.instance.textAlign(Engine.instance.CENTER, Engine.instance.CENTER);
        Engine.instance.text(this._text, this._gameObject.x, this._gameObject.y);
    }
}