import { Engine } from "../../main";
import { Box } from "./box";
import { UIElement } from "./uiElement";

export class DropBox extends Box implements UIElement {
    private _onDrop: () => void;
    constructor(visible: boolean, onDrop: () => void = () => {}) {
        super(visible);
        this._onDrop = onDrop;
    }

    released(): void {
        if (this.collide() && Engine.dragging) {
            this._onDrop();
            console.log(1);
            Engine.dragging = null;
        }
    }
}