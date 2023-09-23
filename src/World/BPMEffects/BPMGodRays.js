import Experience from "../../Experience";
import gsap from "gsap";
import BPMEffect from "./BPMEffect";
//import { BPMEffect } from "./BPMEffects.js"

export default class BPMGodRays extends BPMEffect {
    constructor({ density = 0.9, weigth = 0.3 }) {
        super();
        this.density = density;
        this.weigth  = weigth;
        this.name    = `BPMGodRays`;
        this.params  = `(${density}, ${weigth})`;
    }

    setupAnimation(tl, start, end) {
        this.start = start;
        this.end   = end;
//        this.experience = new Experience();
        this.godRaysEffect = this.experience.renderer.godRaysEffect;
        const bpmMS = this.experience.song.bpmMS;
        let startMS = (start * bpmMS) / 1000;
        let endMS   = ((end * bpmMS) / 1000) - startMS;
//        console.log(startMS, endMS);
        //this.timeline = gsap.timeline({ delay : startMS });
        tl.to(
            [ this.godRaysEffect.godRaysMaterial.density, this.godRaysEffect.godRaysMaterial.weight ], 
            { 
//                delay    : startMS,
                duration   : endMS,
                endArray   : [ this.density, this.weigth ],
                yoyo       : true,
                repeat     : 1,
                onUpdate   : this.onUpdate,
                onUpdateParams : [ this ],
                onStart    : this.onStart,
                onStartParams : [ this ],
                onComplete : this.onComplete,
                onCompleteParams : [ this ],
            },
            startMS
        )
//        console.log(tween);
    }

    onUpdate(This) {

        This.godRaysEffect.godRaysMaterial.density = this.targets()[0][0];
        This.godRaysEffect.godRaysMaterial.weight  = this.targets()[0][1];

        This.onUpdateProgress(this._tTime, this._tDur);        
    }
}