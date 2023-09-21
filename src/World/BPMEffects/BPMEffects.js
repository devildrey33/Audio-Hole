import Experience from "../../Experience.js";
import BPMColorCorrection from "./BPMColorCorrection.js"
import * as THREE from 'three'
import BPMGodRays from "./BPMGodRays.js";
import gsap from "gsap";

const songsEffects = [
    // 00 - Cyberpunk
    [ ],
    // 01 - Kill City Kills
    [ 
        {   // first yell
            start : 33, end : 42, 
            effect : new BPMGodRays({ density : 2.3, weigth : 0.8 })
        },
        {   // end first yell and begin of a second mini yell
            start : 49, end : 50, 
            effect : new BPMGodRays({ density : 2.6, weigth : 0.9 })
        } 
    ],
    // 02 - Batle trance
    [],
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
    [],
    // 10 -
    [],
]

export default class BPMEffects {
    constructor() {
        this.experience = new Experience();
//        gsap.ticker.remove(gsap.updateRoot);
        this.timeline = gsap.timeline();
    }

    updateEffects() {
        this.timeline.kill();
        this.timeline = gsap.timeline();
        const currentSong = this.experience.currentSong;
        songsEffects[currentSong].forEach(element => {
            element.effect.setupAnimation(this.timeline, element.start, element.end);            
        });
    }

    update() {
        this.timeline.time(this.experience.audioAnalizer.song.currentTime);
    }
}