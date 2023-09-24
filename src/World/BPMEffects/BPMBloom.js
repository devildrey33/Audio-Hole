import Experience from "../../Experience";
import BPMEffect from "./BPMEffect";

export default class BPMBloom extends BPMEffect {
    constructor({ intensity = 0.8, radius = 0.98, ease = "none", yoyo = false }) {
        super();
        this.ease = ease;
        this.yoyo = yoyo;
        this.name      = `BPMBloom`;
        this.params    = `(${intensity}, ${radius})`; 
        this.intensity = intensity;
        this.radius    = radius;
    }

    setupAnimation(tl, start, end) {
        this.start = start;
        this.end   = end;
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
                ease             : this.ease,
                repeat           : (this.yoyo === true) ? 1 : 0,
                yoyo             : this.yoyo,
                duration   : endMS,
                endArray   : [ this.intensity, this.radius ],
                onUpdate   : this.onUpdate, 
                onUpdateParams : [ this ],
                onStart    : this.onStart,
                onStartParams : [ this ],
                onComplete : this.onComplete,
                onCompleteParams : [ this ],
            },
            startMS
        )
    }

    onUpdate(This) {
        This.bloomEffect.intensity             = this.targets()[0][0];
        This.bloomEffect.mipmapBlurPass.radius = this.targets()[0][1];
        This.onUpdateProgress(this._tTime, this._tDur);        
    }
}