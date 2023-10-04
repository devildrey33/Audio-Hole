import Experience from "../../Experience.js";
import BPMColorCorrection from "./BPMColorCorrection.js"
import * as THREE from 'three'
import BPMGodRays from "./BPMGodRays.js";
import BPMBloom from "./BPMBloom.js";
import gsap from "gsap";
import BPMSpiralsScale from "./BPMSpiralsScale.js";
import BPMSpiralsPosition from "./BPMSpiralsPosition.js";
import BPMSpiralBars from "./BPMSpiralBars.js";
import BPMSpiralOsciloscope from "./BPMSpiralOsciloscope.js";

const easeRough      = "rough({ template: none.out, strength: 1, points: 20, taper: none, randomize: true, clamp: false})";
const easeDistorsion = "rough({ strength: 1, points: 20, template: none.out, taper: in, randomize: false, clamp: true })";

export default class BPMEffects {
    constructor() {
        this.experience = new Experience();
    }

    songsEffects = [
        // 01 - Kill City Kills
        [ 
            {   // Slow color correction to blue
                start : 1, end : 30,
                effect : new BPMColorCorrection({ destPow : [3, 3, 8], destMul : [2, 2, 15], destAdd : [0.05, 0.05, 0.5] })
            },
            {   // batery
                start : 8.5, end : 9.0,
                effect : new BPMSpiralsScale({ scaleX : 2, scaleZ : 0.65, ease : "bounce" })
            },
            {   // batery
                start : 9, end : 9.5,
                effect : new BPMSpiralsScale({ scaleZ : 3, scaleX : 0.75, scaleY : 0.3, ease : "bounce" })
            },
            {   // bass changing rithm
                start : 24.75, end : 25.25,
                effect : new BPMSpiralsScale({ scaleX : 3.5, ease : "bounce" })
            },
/*            {
                start : 30, end : 32,
                effect : new BPMSpiralsPosition({ positionX : 0.2, ease : easeDistorsion })
            },*/
/*            {   // first yell
                start : 33, end : 41, 
                effect : new BPMGodRays({ density : 2.3, weigth : 0.8 })
            },
            {   // end first yell and begin of a second mini yell
                start : 49, end : 51, 
                effect : new BPMGodRays({ density : 2.6, weigth : 0.9 })
            },*/
            {   // 
                start : 73, end : 77, 
                effect : new BPMBloom({ destIntensity : 0.8, destRadius : 1.65, yoyo : true })
            },
/*            {   // 
                start : 74, end : 76, 
                effect : new BPMGodRays({ density : 1.8, weigth : 0.65 })
            },*/
            {   // 
                start : 89, end : 93, 
                effect : new BPMBloom({ destIntensity : 1.48, destRadius : 1.15, yoyo : true })
            },            
/*            {   // 
                start : 90, end : 92, 
                effect : new BPMGodRays({ density : 1.48, weigth : 0.55 })
            },*/
            {
                start : 113.5,  end : 115,
                effect : new BPMColorCorrection({
                    originPow : [3, 3, 8], originMul : [2, 2, 15] , originAdd : [0.05, 0.05, 0.5], 
                    destPow   : [8, 3, 8], destMul   : [15, 2, 15], destAdd   : [0.6, 0.05, 0.5],
                    yoyo : true 
                })
            },
            {
                start : 114,  end : 115,
                effect : new BPMSpiralsScale({ scaleX : 2.3, scaleZ : 0.75, ease : "" })
            },
            {
                start : 131, end : 146,
                effect : new BPMSpiralBars({ thickness : 0.75, audioStrength : 0.75, ease : "bounce-inOut" })
            },
            {   // 
                start : 144, end : 146, 
                effect : new BPMBloom({ intensity : 1.48, radius : 1.15, yoyo : true })
            },            
/*            {   // 
                start : 145, end : 145.5, 
                effect : new BPMGodRays({ density : 1.48, weigth : 0.55 })
            },
            {   // 
                start : 146, end : 146.5, 
                effect : new BPMGodRays({ density : 1.48, weigth : 0.55 })
            },
            {   // hey
                start : 275, end : 275.5, 
                effect : new BPMGodRays({ density : 1.48, weigth : 1.55 })
            },
            {   // hey
                start : 276, end : 276.5, 
                effect : new BPMGodRays({ density : 1.48, weigth : 1.55 })
            },

            {   // yell
                start : 454, end : 460, 
                effect : new BPMGodRays({ density : 2.5, weigth : 0.8 })
            },*/
            {   // yell
                start : 454, end : 460, 
                effect : new BPMSpiralOsciloscope({ audioStrength : .75, thickness : 0.2 })
            },
/*            {
                start : 520,  end : 521 ,
                effect : new BPMGodRays({ density : 2.6, weigth : 0.9 })
            },
            {
                start : 553,  end : 554 ,
                effect : new BPMGodRays({ density : 2.6, weigth : 0.9 })
            },*/
            { // invert first blue color correction to black
                start : 560,  end : 561 ,
                effect : new BPMColorCorrection({ 
                    originPow : [3, 3, 8], originMul : [2, 2, 15], originAdd : [0.05, 0.05, 0.5], 
                    destPow   : [3, 3, 3], destMul   : [2, 2, 2] , destAdd   : [0.05, 0.05, 0.05] 
                })
            }
        ],
        // 03 - Nothing's Over
        [],
        // 04 - One Chance
        [],
        // 05 - Quantum Ocean
        [],
        // 06 - Six feet under
        [],
        // 07 - The deep
        [],
        // 08 - Alone
        [],
        // 09 - Lost
        [
            { 
                start : 1.5, end : 2,
                effect : new BPMSpiralsScale({ scaleX : 2, scaleZ: 0.5, ease : "bounce" })
            },
            { 
                start : 9, end : 9.5,
                effect : new BPMSpiralsScale({ scaleX : 0.125, scaleZ: 2, ease : "bounce" })
            },
            { 
                start : 17, end : 17.5,
                effect : new BPMSpiralsScale({ scaleX : 2, scaleZ: 0.25, ease : "bounce" })
            },
            { 
                start : 24.5, end : 25,
                effect : new BPMSpiralsScale({ scaleX : 0.125, scaleZ: 2, ease : "bounce" })
            },
            { 
                start : 32.5, end : 33,
                effect : new BPMSpiralsScale({ scaleX : 2, scaleZ: 0.25, ease : "bounce" })
            },
            { 
                start : 40, end : 40.5,
                effect : new BPMSpiralsScale({ scaleX : 0.25, scaleZ: 2, ease : "bounce" })
            },
            { 
                start : 48, end : 48.5,
                effect : new BPMSpiralsScale({ scaleX : 2, scaleZ: 0.25, ease : "bounce" })
            },
            { 
                start : 56, end : 56.5,
                effect : new BPMSpiralsScale({ scaleX : 0.25, scaleZ: 2, ease : "bounce" })
            },
            { 
                start : 61, end : 66,
                effect : new BPMBloom({ destIntensity : 1.4, destRadius : -1.32 })
            },
            { 
                start : 72, end : 84.5,
                effect : new BPMBloom({ originIntensity : 1.4, originRadius : -1.32, destIntensity : 1.45, destRadius : 1.1 })
            },

        ],
        // 10 -
        [],
    ]

    RecalculateAnimations(timeline) {
        const currentSong = this.experience.currentSong;
        this.songsEffects[currentSong].forEach(element => {
            element.effect.setupAnimation(timeline, element.start, element.end);            
        });
    }
}

