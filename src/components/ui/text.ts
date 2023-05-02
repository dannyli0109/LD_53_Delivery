import { Font } from "p5";
import { Component } from "../../component";
import { Engine } from "../../main";

export class TextComp extends Component {
    private _font: Font;
    private _fontSize: number;
    public text: string
    constructor(text: string) {
        super();
        this.text = text;
    }

    onUpdate() {
        Engine.instance.textFont(Engine.font)
        Engine.instance.textSize(16);
        Engine.instance.fill(0);
        Engine.instance.textAlign(Engine.instance.CENTER, Engine.instance.CENTER);
        Engine.instance.text(this.text, this._gameObject.x, this._gameObject.y);
    }
}