import { Box } from "./components/ui/box";
import { Button } from "./components/ui/button";
import { DialogBox } from "./components/ui/dialogBox";
import { DragableBox } from "./components/ui/dragableBox";
import { DropBox } from "./components/ui/dropBox";
import { Sprite } from "./components/ui/sprtie";
import { Tooltip } from "./components/ui/tooltip";
import { HEIGHT, MUSIC_BEATS, PACKAGE_PRICES, PACKAGE_SIZES, WIDTH } from "./const";
import { GameObject } from "./gameObject";
import { Easing, Tween } from "./lib/tween/tween.esm";
import { Engine } from "./main";
import { Scene } from "./scene";
import { TextComp } from "./components/ui/text";

export namespace Gameplay {
    export function createDialog(text: string, sceneIndex: number, cb: () => void = () => { }) {
        let w = 600;
        let h = 70;
        let padding = 20;
        // w - padding, h / 2 + padding + h + padding
        // h / 2 + padding + h + padding
        let go = new GameObject(w - padding, h / 2 + padding, w, h, 100);
        go.addComponent(new DialogBox(text, 20, true, 24, cb));
        let portrait = new GameObject(w / 2 - h / 2, 0, h, h);
        // random string from 01 to 12
        let portraitIndex = Math.floor(Math.random() * 12) + 1;
        portrait.addComponent(new Sprite(`Icons_${portraitIndex < 10 ? '0' + portraitIndex : portraitIndex}.png`));
        go.addChild(portrait);
        Engine.scenes[sceneIndex].addGameObject(go);
    }

    export function createSelfDialog(text: string,sceneIndex: number, cb: () => void = () => { }) {
        let w = 600;
        let h = 70;
        let padding = 20;
        let go = new GameObject(w / 2 + padding, h / 2 + padding + h + padding, w, h, 100);
        go.addComponent(new DialogBox(text, 20, true, 24, cb));
        Engine.scenes[sceneIndex].addGameObject(go);
    }

    export function createTooltip(text: string, sceneIndex: number, x: number = 0, y: number = 0, w: number = 100, h: number = 100) {
        if (Engine.tooltip) {
            Engine.tooltip.destroy();
        }
        Engine.tooltip = new GameObject(x, y, w, h);
        Engine.tooltip.addComponent(new Tooltip(text));
        Engine.scenes[sceneIndex].addGameObject(Engine.tooltip);
    }

    export function createPackage(sceneIndex: number, itemIndex: number){
       let size = PACKAGE_SIZES[itemIndex]
        let box = new GameObject(600, 200, size, size, 1);

        box.addComponent(new Sprite('package.png'));
        let tween = new Tween({y: box.y, rot: -300, scale: size * 0.6}, Engine.group);
        tween.to({y: 350 - size / 2, rot: 0, scale: size}, 800);
        tween.onUpdate((obj) => {
            box.setPosition(box.x, obj.y);
            box.w = obj.scale;
            box.h = obj.scale;
        });
        tween.onComplete(() => {
            box.addComponent(new DragableBox(false, () => {
              Gameplay.createTooltip(Engine.PACKAGE_DESCS[itemIndex], 1, 192, 300, 155, 120);
            }, () => {
              if (Engine.tooltip) {
                Engine.tooltip.destroy();
              }
            }));
        })
        tween.easing(Easing.Bounce.Out)
        tween.start();
        Engine.scenes[sceneIndex].addGameObject(box);
    }

    export function receivePackageScene(): Scene {
        let scene = new Scene();
        Engine.scenes.push(scene);
        Engine.font = Engine.instance.loadFont('SmileySans-Oblique.ttf');

        // randomly pick 11 packages, without duplicates
        let packageIndexes = [];
        while (packageIndexes.length < 11) {
            let randomIndex = Math.floor(Math.random() * Engine.PACKAGE_DESCS.length);
            if (!packageIndexes.includes(randomIndex)) {
                packageIndexes.push(randomIndex);
            }
        }
        Engine.packageIndexes = packageIndexes;

        let bg = new GameObject(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0);
        bg.addComponent(new Sprite('bg.png'));
        scene.addGameObject(bg);

        let gold = new GameObject(80, 20, 100, 50);
        let textComp = new TextComp(`${Engine.LANGUAGE.HINT_1[Engine.lanIndex]}: 0 / 11`);
        gold.addComponent(textComp);
        scene.addGameObject(gold);
        Engine.parcelToDeliverText = textComp;
        
    
        let interior = new GameObject(250, HEIGHT - 148, 400, 148 * 2);
        // interior.addComponent(new Box(true));
        interior.addComponent(new Sprite('table.png'));
        scene.addGameObject(interior);
    
        let area = new GameObject(550, HEIGHT - 120 / 2, 140, 100, 1);
        area.addComponent(new DropBox(true, () => {
          if (Engine.dragging) {
            let dragableBox = Engine.dragging;
            let tween = new Tween({w: Engine.dragging.w, h: Engine.dragging.h}, Engine.group);
            Engine.parcelToDeliver++;
            Engine.parcelToDeliverText.text = `${Engine.LANGUAGE.HINT_1[Engine.lanIndex]}: ${Engine.parcelToDeliver} / 11`;
            tween.to({w: 0, h: 0}, 500);
            tween.onUpdate((obj) => {
              dragableBox.w = obj.w;
              dragableBox.h = obj.h;
            });
            tween.onComplete(() => {
              dragableBox.destroy();
              Gameplay.nextItem();
            });
            tween.easing(Easing.Quadratic.Out)
            tween.start();
          }
        }));
        area.addComponent(new TextComp(Engine.LANGUAGE.DropHere[Engine.lanIndex]));
        scene.addGameObject(area);
    
        nextItem();
        return scene;
    }

    export function nextItem() {
        if (Engine.packageIndex >= Engine.packageIndexes.length) {
            Engine.changeScene(2);
        }
        Gameplay.createDialog(Engine.LANGUAGE.Dialog_1[Engine.lanIndex], 1, () => {
            Gameplay.createSelfDialog(Engine.LANGUAGE.Dialog_2[Engine.lanIndex], 1, () => {
                Gameplay.createPackage(1, Engine.packageIndexes[Engine.packageIndex++]);
            });
        });
    }

    export function mainMenuScene() {
        let scene = new Scene();
        Engine.scenes.push(scene);
        Engine.font = Engine.instance.loadFont('SmileySans-Oblique.ttf');

        let btnStart = new GameObject(WIDTH / 2, HEIGHT / 2 - 50, 200, 50, 1);
        // btnStart.addComponent(new Sprite('btnStart.png'));
        btnStart.addComponent(new Button(Engine.LANGUAGE.Start[Engine.lanIndex], () => {
            console.log("pressed")
            Engine.changeScene(1);
        }));

        let btnLanguage = new GameObject(WIDTH / 2, HEIGHT / 2 + 50, 200, 50, 1);
        // btnStart.addComponent(new Sprite('btnStart.png'));
        btnLanguage.addComponent(new Button(Engine.LANGUAGE.Lang[Engine.lanIndex], () => {
            Engine.lanIndex = (Engine.lanIndex + 1) % 2;
            Engine.reset();
            Engine.changeScene(0);
        }));

        scene.addGameObject(btnStart);
        scene.addGameObject(btnLanguage);
        return scene;
    }

    export function gameScene() {
        let sceneTime = 0;
        let keyIsDown = false;
        let indicator = new GameObject(WIDTH / 2, 300, WIDTH, 10);
        indicator.addComponent(new Box(true));

        let qBtn = new GameObject(WIDTH / 4, HEIGHT - 100, 50, 50);
        qBtn.addComponent(new Button('Q'));

        let wBtn = new GameObject(WIDTH / 2, HEIGHT - 100, 100, 100);
        wBtn.addComponent(new Button('W'));

        let eBtn = new GameObject(WIDTH / 4 * 3, HEIGHT - 100, 150, 150);
        eBtn.addComponent(new Button('E'));

        let gold = new GameObject(WIDTH - 50, 10, 100, 50);
        let textComp = new TextComp(`${Engine.LANGUAGE.Score[Engine.lanIndex]}: 0`);
        gold.addComponent(textComp);
        Engine.text = textComp;
        let scene = new Scene(() => {
            Engine.music.play();
        }, () => {
            let timeBefore = sceneTime;
            sceneTime += Engine.instance.deltaTime;

  

            if (timeBefore < MUSIC_BEATS[Engine.dropIndex] - 600 && sceneTime >= MUSIC_BEATS[Engine.dropIndex] - 600) {
                let itemIndex = Engine.packageIndexes[Engine.dropIndex];
                Engine.dropIndex++;
                let box = new GameObject(Engine.instance.width / 2, 0, PACKAGE_SIZES[itemIndex], PACKAGE_SIZES[itemIndex]);
                box.addComponent(new Sprite('package.png'))
                Engine.boxes.push(box);
                let tween = new Tween({ y: 0 }, Engine.group);
                tween.to({ y: 600 }, 1200);
                tween.onUpdate((obj) => {
                    box.setPosition(box.x, obj.y);
                });
                Engine.boxeTween.push(tween);

                // tween.onComplete(() => {
                //     // box.destroy();
                // });
                tween.start();
                scene.addGameObject(box);
                
            }

            if (timeBefore < MUSIC_BEATS[Engine.beatIndex] && sceneTime >= MUSIC_BEATS[Engine.beatIndex]) {
                Engine.beatIndex++;
                let w = indicator.w;
                let h = indicator.h;
                let tween = new Tween({ w: indicator.w, h: indicator.h }, Engine.group);
                tween.to({ w: indicator.w * 3, h: indicator.h * 3 }, 100);
                tween.onUpdate((obj) => {
                    indicator.w = obj.w;
                    indicator.h = obj.h;
                });
                tween.onComplete(() => {
                    let tween = new Tween({ w: indicator.w, h: indicator.h }, Engine.group);
                    tween.to({ w: w, h: h }, 100);
                    tween.onUpdate((obj) => {
                        indicator.w = obj.w;
                        indicator.h = obj.h;
                    });
                    tween.start();
                });
                tween.start();
            }

            // check if space is pressed
            // q is 81
            // e is 69
            // w is 87

            const onKeyDown = (code: number) => {
                if (!keyIsDown) {
                    Engine.hitSound.play();
                    
                    // output the min difference between scene time and music beats
                    let min = 100000;
                    let minIndex = 0;
                    let tor = 100;
                    for (let i = 0; i < MUSIC_BEATS.length; i++) {
                        let diff = Math.abs(sceneTime - MUSIC_BEATS[i]);
                        if (diff < min) {
                            min = diff;
                            minIndex = i;
                        }
                    }
                    if (min < tor) {
                        // console.log("hit")
                        let packageFit = false;
                        let itemIndex = Engine.packageIndexes[minIndex];
                        if (code == 81 && PACKAGE_SIZES[itemIndex] == 50) {
                            Engine.gold += PACKAGE_PRICES[itemIndex];
                            Engine.text.text = `${Engine.LANGUAGE.Score[Engine.lanIndex]}: ${Engine.gold}`;
                            packageFit = true;
                        }
                        if (code == 87 && PACKAGE_SIZES[itemIndex] == 100) {
                            Engine.gold += PACKAGE_PRICES[itemIndex];
                            Engine.text.text = `${Engine.LANGUAGE.Score[Engine.lanIndex]}: ${Engine.gold}`;
                            packageFit = true;
                        }
                        if (code == 69 && PACKAGE_SIZES[itemIndex] == 150) {
                            Engine.gold += PACKAGE_PRICES[itemIndex];
                            Engine.text.text = `${Engine.LANGUAGE.Score[Engine.lanIndex]}: ${Engine.gold}`;

                            packageFit = true;
                        }

                        if (Engine.boxes[minIndex] && packageFit) {
                            let loc = {x: 0, y: 0};
                            if (code == 81) {
                                loc.x = WIDTH / 4;
                            }
                            else if (code == 87) {
                                loc.x = WIDTH / 2;
                            }
                            else if (code == 69) {
                                loc.x = WIDTH / 4 * 3;
                            }
                            loc.y = HEIGHT - 50 / 2 - 100;

                            if (Engine.boxeTween[minIndex]) {
                                Engine.boxeTween[minIndex].stop();
                            }

                            let distance = Math.sqrt(Math.pow(Engine.boxes[minIndex].x - loc.x, 2) + Math.pow(Engine.boxes[minIndex].y - loc.y, 2));

                            let tween = new Tween({ x: Engine.boxes[minIndex].x, y: Engine.boxes[minIndex].y }, Engine.group);
                            tween.to({ x: loc.x, y: loc.y }, distance / 600 * 1000);
                            tween.onUpdate((obj) => {
                                Engine.boxes[minIndex].setPosition(obj.x, obj.y);
                            });
                            tween.onComplete(() => {
                                Engine.boxes[minIndex].destroy();
                            });
                            tween.start();
                            // Engine.boxes[minIndex].destroy();
                        }  
                    }
                    keyIsDown = true;
                }
            }
            if (Engine.instance.keyIsDown(81)) {
                onKeyDown(81);
            }
            else if (Engine.instance.keyIsDown(87)) {
                onKeyDown(87);
            }
            else if (Engine.instance.keyIsDown(69)) {
                onKeyDown(69);
            }
            else {
                keyIsDown = false;
            }

            if (sceneTime >= 36000) {
                Engine.changeScene(3);
            }
        });
        scene.addGameObject(indicator);
        scene.addGameObject(qBtn);
        scene.addGameObject(wBtn);
        scene.addGameObject(eBtn);
        scene.addGameObject(gold);
        Engine.scenes.push(scene);
        Engine.font = Engine.instance.loadFont('SmileySans-Oblique.ttf');
        Engine.music = Engine.instance.loadSound('test.mp3');
        Engine.hitSound = Engine.instance.loadSound('synth.wav');
    }

    export function scoreScene() {
        let scoreText = new GameObject(WIDTH / 2, HEIGHT / 2 - 50, 200, 100, 1);
        let textComp = new TextComp(`${Engine.LANGUAGE.Score[Engine.lanIndex]}: ${Engine.gold}`);
        scoreText.addComponent(textComp);
        let scene = new Scene(() => {
            textComp.text = `${Engine.LANGUAGE.Score[Engine.lanIndex]}: ${Engine.gold}`;
        });
        Engine.scenes.push(scene);
        Engine.font = Engine.instance.loadFont('SmileySans-Oblique.ttf');

        let btn = new GameObject(WIDTH / 2, HEIGHT / 2 + 50, 200, 100, 1);
        // btn.addComponent(new Sprite('btn.png'));
        btn.addComponent(new Button(Engine.LANGUAGE.Restart[Engine.lanIndex], () => {
            Engine.reset();
            Engine.changeScene(0);
        }));
        scene.addGameObject(btn);
        scene.addGameObject(scoreText);
        return scene;
    }
}