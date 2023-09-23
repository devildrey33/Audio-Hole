import Experience from "../../Experience";
import BPMEffect from "./BPMEffect";

export default class BPMBloom extends BPMEffect {
    constructor({ intensity = 0.8, radius = 0.98 }) {
        super();
        this.name      = `BPMBloom`;
        this.params    = `(${intensity}, ${radius})`; 
        this.intensity = intensity;
        this.radius    = radius;
    }

    setupAnimation(tl, start, end) {
        this.start = start;
        this.end = end;

//        this.experience = new Experience();
        this.bloomEffect = this.experience.renderer.bloomEffect;
        const bpmMS = this.experience.song.bpmMS;
        let startMS = (start * bpmMS) / 1000;
        let endMS   = ((end * bpmMS) / 1000) - startMS;
//        console.log(this.bloomEffect.intensity, this.bloomEffect.mipmapBlurPass.radius);
        //this.timeline = gsap.timeline({ delay : startMS });
        this.tween = tl.to(
            [ this.bloomEffect.intensity, this.bloomEffect.mipmapBlurPass.radius ], 
            { 
//                delay    : startMS,
//                callbackScope : this,
                duration   : endMS,
                endArray   : [ this.intensity, this.radius ],
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
        )/*.to([this.intensity, this.radius],
            {
                duration : bpmMS / 500,
                data     : this.bloomEffect,
                endArray : [ this.bloomEffect.intensity, this.bloomEffect.mipmapBlurPass.radius ],
                onUpdate() { 
                    console.log(this.vars.data, this.targets()[0])
                    this.vars.data.intensity = this.targets()[0][0];
                    this.vars.data.mipmapBlurPass.radius  = this.targets()[0][1];
                }

        });*/

        console.log(this.tween);
    }

    onUpdate(This) {
        //                    console.log(this.vars.data, this.targets()[0])
        This.bloomEffect.intensity = this.targets()[0][0];
        This.bloomEffect.mipmapBlurPass.radius  = this.targets()[0][1];
        This.onUpdateProgress(this._tTime, this._tDur);        
    }
}