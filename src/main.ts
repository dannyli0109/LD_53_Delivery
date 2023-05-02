import { HEIGHT, WIDTH } from './const';
import { Scene } from './scene';
import { Sprite } from './components/ui/sprtie';
import './style.css'

import './global.js';
import 'p5/lib/addons/p5.sound';
import p5 from 'p5';

import { Font } from "p5";
import { Box } from './components/ui/box';
import { GameObject } from './gameObject';
import { DragableBox } from './components/ui/dragableBox';
import { Easing, Group, Tween } from './lib/tween/tween.esm';
import { DialogBox } from './components/ui/dialogBox';
import { Gameplay } from './gameplay';
import { DropBox } from './components/ui/dropBox';
import { TextComp } from './components/ui/text.js';


export namespace Engine {
  export let instance: p5
  export let group = new Group();
  export let font: Font;
  export let scenes: Scene[] = [];
  export let sceneIndex = 0;
  export let tooltip: GameObject;
  export let dragging: GameObject;
  export let music: p5.SoundFile;
  export let hitSound: p5.SoundFile;
  export let dropIndex = 0;
  export let beatIndex = 0;
  export let boxes: GameObject[] = [];
  export let boxeTween: any[] = [];
  export let text: TextComp;
  export let gold: number = 0;
  export let parcelToDeliver: number = 0;
  export let parcelToDeliverText: TextComp;
  export let lanIndex: number = 0;

  export const LANGUAGE: { [key: string]: string[] } = {
    Package_Desc_1: [
      "令人兴奋的书籍\n（母猪的产后护理）\n$50",
      "Book with Thrilling Content\n(Postnatal Care for Sows)\n$50"
    ],
    Package_Desc_2: [
      "保健用品\n（英式搅屎棍）\n$110",
      "Healthcare Product\n(English-style Dung Stirrer)\n$110"
    ],
    Package_Desc_3: [
      "苍蝇拍八尺夫人版\n$50",
      "Flyswatter - Eight-foot Lady Edition\n$50"
    ],
    Package_Desc_4: [
      "韩式护膝\n$150",
      "Knee Protector - Korean Style\n$150"
    ],
    Package_Desc_5: [
      "美式成人尿布\n$150",
      "Adult Diaper - American Style\n$150"
    ],
    Package_Desc_6: [
      "清爽饮用水\n$110",
      "Refreshing Water\n$110"
    ],
    Package_Desc_7: [
      "圣经\n$50",
      "Bible\n$50"
    ],
    Package_Desc_8: [
      "豪华汽车蜡\n（含24K黄金）\n$500",
      "Luxury Car Wax\n(24K Gold Infused)\n$500"
    ],
    Package_Desc_9: [
      "美食犬粮\n（黑松露和鹅肝口味）\n$200",
      "Gourmet Dog Food\n(Truffle and Foie Gras Flavor)\n$200"
    ],
    Package_Desc_10: [
      "智能手机投影仪\n（高清分辨率）\n$80",
      "Smartphone Projector\n(HD Resolution)\n$80"
    ],
    Package_Desc_11: [
      "设计师口罩\n（古驰标志印花）\n$100",
      "Designer Face Mask\n(Gucci Logo Print)\n$100"
    ],
    Package_Desc_12: [
      "电动背部按摩器\n（按摩和加热功能）\n$120",
      "Electric Back Massager\n(Shiatsu and Heat Function)\n$120"
    ],
    Package_Desc_13: [
      "自拍环形灯\n（可调亮度）\n$30",
      "Selfie Ring Light\n(Adjustable Brightness)\n$30"
    ],
    Package_Desc_14: [
      "复古黑胶唱片\n（披头士专辑- Abbey Road）\n$50",
      "Vintage Vinyl Record\n(The Beatles - Abbey Road)\n$50"
    ],
    Start: [
        "开始",
        "Start"
    ],
    Score: [
        "分数",
        "Score"
    ],
    Dialog_1: [
        "你好，我想寄这个包裹",
        "Hey, I want to send this parcel"
    ],
    Dialog_2: [
        "好的，让我看看",
        "Sure, let me have a look"
    ],
    Restart: [
        "重新开始",
        "Restart"
    ],
    DropHere: [
        "把包裹放在这里",
        "Drop the parcel here"
    ],
    HINT_1: [
        "剩余包裹数量",
        "Parcels to deliver"
    ],
    Lang: [
        "中文",
        "English"
    ]
  };

export let PACKAGE_DESCS: string[] = [
    LANGUAGE.Package_Desc_1[Engine.lanIndex],
    LANGUAGE.Package_Desc_2[Engine.lanIndex],
    LANGUAGE.Package_Desc_3[Engine.lanIndex],
    LANGUAGE.Package_Desc_4[Engine.lanIndex],
    LANGUAGE.Package_Desc_5[Engine.lanIndex],
    LANGUAGE.Package_Desc_6[Engine.lanIndex],
    LANGUAGE.Package_Desc_7[Engine.lanIndex],
    LANGUAGE.Package_Desc_8[Engine.lanIndex],
    LANGUAGE.Package_Desc_9[Engine.lanIndex],
    LANGUAGE.Package_Desc_10[Engine.lanIndex],
    LANGUAGE.Package_Desc_11[Engine.lanIndex],
    LANGUAGE.Package_Desc_12[Engine.lanIndex],
    LANGUAGE.Package_Desc_13[Engine.lanIndex],
    LANGUAGE.Package_Desc_14[Engine.lanIndex],
]

  export let packageIndexes: number[] = [];
  export let packageIndex: number = 0;

  export function reset() {
    Engine.dropIndex = 0;
    Engine.beatIndex = 0;
    Engine.boxes = [];
    Engine.boxeTween = [];
    Engine.gold = 0;
    Engine.parcelToDeliver = 0;
    Engine.packageIndexes = [];
    Engine.packageIndex = 0;
    Engine.scenes = [];
    Gameplay.mainMenuScene();
    Gameplay.receivePackageScene();
    Gameplay.gameScene();
    Gameplay.scoreScene();

    PACKAGE_DESCS = [
      LANGUAGE.Package_Desc_1[Engine.lanIndex],
      LANGUAGE.Package_Desc_2[Engine.lanIndex],
      LANGUAGE.Package_Desc_3[Engine.lanIndex],
      LANGUAGE.Package_Desc_4[Engine.lanIndex],
      LANGUAGE.Package_Desc_5[Engine.lanIndex],
      LANGUAGE.Package_Desc_6[Engine.lanIndex],
      LANGUAGE.Package_Desc_7[Engine.lanIndex],
      LANGUAGE.Package_Desc_8[Engine.lanIndex],
      LANGUAGE.Package_Desc_9[Engine.lanIndex],
      LANGUAGE.Package_Desc_10[Engine.lanIndex],
      LANGUAGE.Package_Desc_11[Engine.lanIndex],
      LANGUAGE.Package_Desc_12[Engine.lanIndex],
      LANGUAGE.Package_Desc_13[Engine.lanIndex],
      LANGUAGE.Package_Desc_14[Engine.lanIndex],
    ]
  }


  export function changeScene(index: number) {
    if (index !== Engine.sceneIndex) {
      Engine.sceneIndex = index;
      Engine.scenes[Engine.sceneIndex].onEnterScene();
    }
  }
}

const sketch = (p: p5) => {
  // Game setup
  Engine.instance = p;
  // Engine.scene = new Scene();
  let test;
  let num = 0;
  let sound;

  // let box = new Box(0, 0, 200, 200);
  p.preload = () => {
    Gameplay.mainMenuScene();
    Gameplay.receivePackageScene();
    Gameplay.gameScene();
    Gameplay.scoreScene();
  }

  p.setup = () => {
    p.rectMode(p.CENTER)
    const canvas = p.createCanvas(WIDTH, HEIGHT)
    canvas.elt.id = 'game';
  };
  
  // Game loop
  p.draw = () => {
    p.background(255);

    Engine.scenes[Engine.sceneIndex].update();
    Engine.group.update()
    // p.push();
    // p.angleMode(p.DEGREES);
    // p.translate(100, 100)
    // p.rotate(num++);
    // p.imageMode(p.CENTER);
    // p.image(test, 0, 0, 100, 100)
    // p.pop();
  };

  p.mousePressed = (e) =>{
    Engine.scenes[Engine.sceneIndex].pressed();
  }

  p.mouseReleased = (e) => {
    Engine.scenes[Engine.sceneIndex].released();
  }

  // p.keyPressed = (e) => {
  //   Engine.scenes[Engine.sceneIndex].keyPressed();
  // }
};

new p5(sketch);
