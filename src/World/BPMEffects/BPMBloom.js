import Experience from "../../Experience";
import BPMEffect from "./BPMEffect";

export default class BPMBloom extends BPMEffect {
    constructor({ intensity = 0.8, radius = 0.98, ease = "none", yoyo = false }) {
        super();
        this.ease   = ease;
        this.yoyo   = yoyo;
        this.name   = `Bloom`;
        this.params = `(${intensity}, ${radius})`; 
        this.dest   = [ intensity, radius ];
    }

    setupAnimation(tl, start, end) {
        this.start = start;
        this.end   = end;
        this.bloomEffect = this.experience.renderer.bloomEffect;
        const bpmMS = this.experience.song.bpmMS;
        let startMS = (start * bpmMS) / 1000;
        let endMS   = ((end * bpmMS) / 1000) - startMS;
        this.origin = { i : this.bloomEffect.intensity, r : this.bloomEffect.mipmapBlurPass.radius };
        
        /*tl.fromTo(
            this.origin, 
            {
                i : this.bloomEffect.intensity,
                r : this.bloomEffect.mipmapBlurPass.radius 
            },
            {
                id               : this.id,
                ease             : this.ease,
                repeat           : (this.yoyo === true) ? 1 : 0,
                yoyo             : this.yoyo,
                duration         : endMS,
                endArray         : this.dest,
                onUpdate         : this.onUpdate, 
                onUpdateParams   : [ this ],
                onStart          : this.onStartBloom,
                onStartParams    : [ this ],
                onComplete       : this.onComplete,
                onCompleteParams : [ this ],
            },
            startMS

        )*/

        tl.to(
            this.origin, 
            { 
                id               : this.id,
                ease             : this.ease,
                repeat           : (this.yoyo === true) ? 1 : 0,
                yoyo             : this.yoyo,
                duration         : endMS,
                endArray         : this.dest,
                onUpdate         : this.onUpdate, 
                onUpdateParams   : [ this ],
                onStart          : this.onStartBloom,
                onStartParams    : [ this ],
                onComplete       : this.onComplete,
                onCompleteParams : [ this ],
            },
            startMS
        )

        this.tween = tl.getById(this.id);
        console.log(this.tween)
    }

    onStartBloom(This) {
//        This.tween.updateTo({ });
        This.origin = [This.bloomEffect.intensity, This.bloomEffect.mipmapBlurPass.radius];
        This.onStart(This);
        console.log("sb", this._targets[0], This.bloomEffect.intensity, This.bloomEffect.mipmapBlurPass.radius);
    }

    onUpdate(This) {
        This.bloomEffect.intensity             = this.targets()[0][0];
        This.bloomEffect.mipmapBlurPass.radius = this.targets()[0][1];
        console.log(This.bloomEffect.intensity, This.bloomEffect.mipmapBlurPass.radius);
        This.onUpdateProgress(this._tTime, this._tDur);        
    }
}