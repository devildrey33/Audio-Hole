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
import BPMLateralBars from "./BPMLateralBars.js";

const easeRough      = "rough({ template: none.out, strength: 1, points: 20, taper: none, randomize: true, clamp: false})";
const easeDistorsion = "rough({ strength: 1, points: 20, template: none.out, taper: in, randomize: false, clamp: true })";

export default class BPMEffects {
    constructor() {
        this.experience = new Experience();
        this.audioAnalizer = this.experience.audioAnalizer;
    
    
        this.songChannels = [
            { // 01 - Kill City Kills
                LateralBars1       : this.audioAnalizer.channelOther,
                LateralBars2       : this.audioAnalizer.channelBass,
                LateralOsciloscope : this.audioAnalizer.channelDrum,
                Sun                : this.audioAnalizer.channelVocal,
                SunRays            : this.audioAnalizer.channelVocal,
                SpiralBars         : this.audioAnalizer.channelSong,
                SpiralOsciloscope  : this.audioAnalizer.channelVocal
            },
            { // 02 - Nothing's Over
                LateralBars1       : this.audioAnalizer.channelOther,
                LateralBars2       : this.audioAnalizer.channelPiano,
                LateralOsciloscope : this.audioAnalizer.channelDrum,
                Sun                : this.audioAnalizer.channelVocal,
                SunRays            : this.audioAnalizer.channelVocal,
                SpiralBars         : this.audioAnalizer.channelSong,
                SpiralOsciloscope  : this.audioAnalizer.channelVocal
            },
            { // 03 - One Chance
                LateralBars1       : this.audioAnalizer.channelOther,
                LateralBars2       : this.audioAnalizer.channelBass,
                LateralOsciloscope : this.audioAnalizer.channelDrum,
                Sun                : this.audioAnalizer.channelVocal,
                SunRays            : this.audioAnalizer.channelVocal,
                SpiralBars         : this.audioAnalizer.channelSong,
                SpiralOsciloscope  : this.audioAnalizer.channelVocal
            },
            { // 04 - Quantum Ocean
                LateralBars1       : this.audioAnalizer.channelOther,
                LateralBars2       : this.audioAnalizer.channelPiano,
                LateralOsciloscope : this.audioAnalizer.channelDrum,
                Sun                : this.audioAnalizer.channelVocal,
                SunRays            : this.audioAnalizer.channelVocal,
                SpiralBars         : this.audioAnalizer.channelSong,
                SpiralOsciloscope  : this.audioAnalizer.channelVocal
            },
            { // 05 - Six feet under
                LateralBars1       : this.audioAnalizer.channelOther,
                LateralBars2       : this.audioAnalizer.channelBass,
                LateralOsciloscope : this.audioAnalizer.channelDrum,
                Sun                : this.audioAnalizer.channelVocal,
                SunRays            : this.audioAnalizer.channelVocal,
                SpiralBars         : this.audioAnalizer.channelSong,
                SpiralOsciloscope  : this.audioAnalizer.channelVocal
            },
            { // 06 - The deep
                LateralBars1       : this.audioAnalizer.channelOther,
                LateralBars2       : this.audioAnalizer.channelPiano,
                LateralOsciloscope : this.audioAnalizer.channelDrum,
                Sun                : this.audioAnalizer.channelVocal,
                SunRays            : this.audioAnalizer.channelVocal,
                SpiralBars         : this.audioAnalizer.channelSong,
                SpiralOsciloscope  : this.audioAnalizer.channelVocal
            },
            { // 07 - Alone
                LateralBars1       : this.audioAnalizer.channelOther,
                LateralBars2       : this.audioAnalizer.channelPiano,
                LateralOsciloscope : this.audioAnalizer.channelDrum,
                Sun                : this.audioAnalizer.channelVocal,
                SunRays            : this.audioAnalizer.channelVocal,
                SpiralBars         : this.audioAnalizer.channelSong,
                SpiralOsciloscope  : this.audioAnalizer.channelVocal
            },
            { // 08 - Lost
                LateralBars1       : this.audioAnalizer.channelOther,
                LateralBars2       : this.audioAnalizer.channelBass,
                LateralOsciloscope : this.audioAnalizer.channelDrum,
                Sun                : this.audioAnalizer.channelVocal,
                SunRays            : this.audioAnalizer.channelVocal,
                SpiralBars         : this.audioAnalizer.channelSong,
                SpiralOsciloscope  : this.audioAnalizer.channelVocal
            },
            { // 09 - Core dumped
                LateralBars1       : this.audioAnalizer.channelOther,
                LateralBars2       : this.audioAnalizer.channelBass,
                LateralOsciloscope : this.audioAnalizer.channelDrum,
                Sun                : this.audioAnalizer.channelVocal,
                SunRays            : this.audioAnalizer.channelVocal,
                SpiralBars         : this.audioAnalizer.channelSong,
                SpiralOsciloscope  : this.audioAnalizer.channelVocal
            },

        ];
    }

    /* 
     * Setups all the animations of the current song in the specified timeline
     */
    RecalculateAnimations(timeline) {
        const currentSong = this.experience.currentSong;
        this.songsEffects[currentSong].forEach(element => {
            element.effect.setupAnimation(timeline, element.start, element.end);            
        });
    }


    songsEffects = [
       /************************
        * 01 - Kill City Kills *
        ************************/
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
            {   // batery
                start : 12, end : 12.5,
                effect : new BPMSpiralsScale({ scaleX : 0.375, ease : "bounce" })
            },
            {   // bass changing rithm
                start : 24.75, end : 25.25,
                effect : new BPMSpiralsScale({ scaleX : 3.5, ease : "bounce" })
            },

            {   // first yell
                start : 33, end : 41, 
                effect : new BPMSpiralOsciloscope({ audioStrength : .75, thickness : 0.2, color : new THREE.Color(0,1,0) })
            },
            {   // end first yell and begin of a second mini yell
                start : 49, end : 51, 
                effect : new BPMSpiralOsciloscope({ audioStrength : 1.5, thickness : 0.25, color : new THREE.Color(1,0,0) })
            },
            {   // 
                start : 73, end : 77, 
                effect : new BPMBloom({ destIntensity : 0.8, destRadius : 1.65, yoyo : true })
            },
            {   // 
                start : 89, end : 93, 
                effect : new BPMBloom({ destIntensity : 1.48, destRadius : -1.15, yoyo : true })
            },            
            {   // right
                start : 113.5,  end : 115,
                effect : new BPMColorCorrection({
                    originPow : [3, 3, 8], originMul : [2, 2, 15] , originAdd : [0.05, 0.05, 0.5], 
                    destPow   : [8, 3, 8], destMul   : [15, 2, 15], destAdd   : [0.6, 0.05, 0.5],
                    yoyo : true 
                })
            },
            {   // right
                start : 114,  end : 114.5,
                effect : new BPMLateralBars({ position : 50, ease : "bounce" })
            },
            {   // right
                start : 114,  end : 114.25,
                effect : new BPMSpiralsScale({ scaleX : 2.3, scaleZ : 0.75, ease : "bounce-inOut" })
            },
            {   // 
                start : 144, end : 146, 
                effect : new BPMBloom({ destIntensity : 1.48, destRadius : 1.15, yoyo : true })
            },            
            {
                start : 144.5, end : 145,
                effect : new BPMSpiralBars({ thickness : 0.40, audioStrength : 0.75, ease : "bounce" })
            },
            {
                start : 145.5, end : 146,
                effect : new BPMSpiralBars({ thickness : 0.40, audioStrength : 0.75, ease : "bounce" })
            },            
            {   // right
                start : 243.5,  end : 245,
                effect : new BPMColorCorrection({
                    originPow : [3, 3, 8], originMul : [2, 2, 15] , originAdd : [0.05, 0.05, 0.5], 
                    destPow   : [8, 3, 8], destMul   : [15, 2, 15], destAdd   : [0.6, 0.05, 0.5],
                    yoyo : true 
                })
            },
            {   // right
                start : 244,  end : 244.5,
                effect : new BPMLateralBars({ position : 50, ease : "bounce" })
            },
            {   // right
                start : 244,  end : 244.25,
                effect : new BPMSpiralsScale({ scaleX : 2.3, scaleZ : 0.75, ease : "bounce-inOut" })
            },

            {   // hey
                start : 274, end : 274.75,
                effect : new BPMSpiralsScale({ scaleX : 3.5, ease : "bounce" })
            },
            {   // hey
                start : 274.75, end : 275.5,
                effect : new BPMSpiralsScale({ scaleZ : 2.75, ease : "bounce" })
            },

            {   // mayday
                start : 312.5, end : 313.5, 
                effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
            },
            {   // mayday
                start : 314.5, end : 315.5,
                effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
            },
            {   // oneday
                start : 322.5, end : 324,
                effect : new BPMBloom({ destIntensity : 3, destRadius : 1.35, yoyo : true })
            },


            {   // yell
                start : 356, end : 364, 
                effect : new BPMSpiralOsciloscope({ audioStrength : .75, thickness : 0.25, color : new THREE.Color(0,0.5,0.75) })
            },

            {
                start : 390, end : 400,
                effect : new BPMSpiralBars({ thickness : 0.40, audioStrength : 0.75, ease : "" })
            },

            {   // Guitar solo (ends 423)
                start : 390, end : 394, 
                effect : new BPMBloom({ destIntensity : -1.5, destRadius : 0.65, yoyo : false })
            },            
            {   // Guitar solo (ends 423)
                start : 404, end : 408, 
                effect : new BPMBloom({ originIntensity : -1.5, originRadius : 0.65, destIntensity : 2, destRadius : 1.12,  yoyo : false })
            },            
            {   // Guitar solo (ends 423)
                start : 419, end : 423, 
                effect : new BPMBloom({ originIntensity : 2, originRadius : 1.12, yoyo : false })
            },            
            {   // batery
                start : 430, end : 430.5,
                effect : new BPMSpiralsScale({ scaleX : 2, scaleZ : 0.65, ease : "bounce" })
            },
            {   // batery
                start : 430.5, end : 431,
                effect : new BPMSpiralsScale({ scaleZ : 3, scaleX : 0.75, scaleY : 0.3, ease : "bounce" })
            },
            {   // batery
                start : 434.5, end : 435,
                effect : new BPMSpiralsScale({ scaleX : 0.375, ease : "bounce" })
            },

            {   // yell
                start : 454, end : 460, 
                effect : new BPMSpiralOsciloscope({ audioStrength : .75, thickness : 0.2, color : new THREE.Color(1,0,0) })
            },

            {   // mayday
                start : 475, end : 476, 
                effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
            },
            {   // mayday
                start : 477.5, end : 478.5,
                effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
            },
            {   // oneday
                start : 485.5, end : 487,
                effect : new BPMBloom({ destIntensity : 3, destRadius : 1.35, yoyo : true })
            },

            


            {   // yell
                start : 520, end : 521, 
                effect : new BPMSpiralOsciloscope({ audioStrength : 1.5, thickness : 0.2, color : new THREE.Color(1,0,0) })
            },
            {   // yell
                start : 535, end : 540, 
                effect : new BPMSpiralOsciloscope({ audioStrength : .75, thickness : 0.3, color : new THREE.Color(0,0,1) })
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
        // 02 - Nothing's Over
        [],
        // 03 - One Chance
        [],
        // 04 - Quantum Ocean
        [],
        // 05 - Six feet under
        [],
        // 06 - The deep
        [],
        // 07 - Alone
        [],
        // 08 - Lost
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
        // 09 -
        [],
        // 10 -
        [],
    ]

}

