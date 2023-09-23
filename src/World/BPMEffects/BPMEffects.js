import Experience from "../../Experience.js";
import BPMColorCorrection from "./BPMColorCorrection.js"
import * as THREE from 'three'
import BPMGodRays from "./BPMGodRays.js";
import BPMBloom from "./BPMBloom.js";
import gsap from "gsap";





export default class BPMEffects {
    constructor() {
        this.experience = new Experience();
    }

    songsEffects = [
        // 00 - Cyberpunk
        [ ],
        // 01 - Kill City Kills
        [ 
            {   // first yell
                start : 33, end : 41, 
                effect : new BPMGodRays({ density : 2.3, weigth : 0.8 })
            },
            {   // end first yell and begin of a second mini yell
                start : 49, end : 51, 
                effect : new BPMGodRays({ density : 2.6, weigth : 0.9 })
            },
            {   // 
                start : 73, end : 77, 
                effect : new BPMBloom({ intensity : 0.8, radius : 1.65 })
            },
            {   // 
                start : 73, end : 77, 
                effect : new BPMGodRays({ density : 1.8, weigth : 0.65 })
            },
            {   // 
                start : 89, end : 93, 
                effect : new BPMBloom({ intensity : 1.48, radius : 1.15 })
            },
            {   // 
                start : 89, end : 93, 
                effect : new BPMGodRays({ density : 1.48, weigth : 0.55 })
            },
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

    RecalculateAnimations(timeline) {
        const currentSong = this.experience.currentSong;
        this.songsEffects[currentSong].forEach(element => {
            element.effect.setupAnimation(timeline, element.start, element.end);            
        });
    }
}

