import Experience from "../../Experience";
import gsap from "gsap";

export default class BPMGodRays {
    constructor({ density = 0.9, weigth = 0.3 }) {
        this.density = density;
        this.weigth  = weigth;
    }

    setupAnimation(tl, start, end) {
        this.experience = new Experience();
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
                duration : endMS,
                data     : this.godRaysEffect.godRaysMaterial,
                endArray : [ this.density, this.weigth ],
                yoyo     : true,
                repeat   : 1,
                onUpdate() { 
                    console.log(this, this.targets()[0])
                    this.vars.data.density = this.targets()[0][0];
                    this.vars.data.weight  = this.targets()[0][1];
                }
            },
            startMS
        )
//        console.log(tween);
    }
}