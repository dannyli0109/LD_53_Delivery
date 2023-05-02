import { Image } from "p5";
import { Component } from "../../component";
import { Engine } from "../../main";
import { Box } from "./box";
import { UIElement } from "./uiElement";

export class DialogBox extends Box implements UIElement {
    private _text: string;
    private _padding: number;
    private _border: boolean;
    private _fontSize: number;
    private _cb: () => void;
    private _index: number = 0;
    private _frame: number = 0;
    private _atTheEnd: boolean = false;
    private _image: Image;
    // private _protrait: Image;

    constructor(text: string, padding: number = 20, border: boolean = true, fontSize: number = 24, cb: () => void = () => {}){
        super(true);
        this._text = text;
        this._padding = padding;
        this._border = border;
        this._fontSize = fontSize;
        this._cb = cb;
        this._image = Engine.instance.loadImage('arrow.png');
        // this._protrait = Engine.instance.loadImage('Icons_01.png');
    }
    onUpdate() {
        super.onUpdate();
        Engine.instance.rectMode(Engine.instance.CENTER)
        Engine.instance.fill(255)
        Engine.instance.rect(this._gameObject.x, this._gameObject.y, this._gameObject.w, this._gameObject.h)

        Engine.instance.textAlign(Engine.instance.CENTER, Engine.instance.CENTER)
        Engine.instance.textFont(Engine.font)
        Engine.instance.textSize(this._fontSize)
        Engine.instance.textLeading(this._fontSize)
        Engine.instance.fill(0)
        Engine.instance.stroke(0)
        Engine.instance.strokeWeight(1)

        let textToShow = this._text.split('').slice(0, this._index).join('')
        Engine.instance.text(textToShow, this._gameObject.x, this._gameObject.y, this._gameObject.w - this._padding, this._gameObject.h - this._padding)

        if (this._frame % 4 === 0) {
            this._index++
        }

        if (this._index > this._text.split('').length || this._atTheEnd) {
            this._index = this._text.split('').length
            this._atTheEnd = true;
        }

        if (this._atTheEnd) {
            // blink faster
            // if (this._frame % 60 > 30) {
            //     Engine.instance.image(this._image, this._gameObject.x - 32 / 2, this._gameObject.y + this._gameObject.h / 2 - 32 - 32 / 2, 32, 32)
            // }
        }

        // Engine.instance.image(this._protrait, this._gameObject.x - this._gameObject.w / 2, this._gameObject.y - this._gameObject.h / 2, this._gameObject.h, this._gameObject.h)


        this._frame++
    }

    finished() {
        return this._atTheEnd;
    }


    pressed(): boolean {
        // if (!this.collide()) return false;
        if (this._atTheEnd) {
            this._cb();
            this._gameObject.destroy();
        }
        else {
            this._index = this._text.length;
        }
        return true;
    }

}