
import { Engine } from "../../main";
import { Component } from "../../component";
import * as p5 from "p5";

export class Sprite extends Component {
    private _image: p5.Image;
    constructor(imagePath: string) {
        super();
        this._image = Engine.instance.loadImage(imagePath);
    }

    override onUpdate() {
        Engine.instance.noSmooth();
        Engine.instance.push();
        Engine.instance.angleMode(Engine.instance.DEGREES);
        Engine.instance.imageMode(Engine.instance.CENTER);
        Engine.instance.translate(this._gameObject.x, this._gameObject.y);
        Engine.instance.rotate(this._gameObject.rotation);
        Engine.instance.image(this._image, 0, 0, this._gameObject.w, this._gameObject.h);
        Engine.instance.pop();
    }    

}