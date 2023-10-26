import Experience from "../../Experience";
import BPMEffect from "./BPMEffect";

export default class BPMBloom extends BPMEffect {
    constructor({ 
            originIntensity = 0.7, 
            originRadius = 0.98, 
            destIntensity = 0.7, 
            destRadius = 0.98, 
            ease = "none", 
            yoyo = false 
        }) {
        super();
        this.ease   = ease;
        this.yoyo   = yoyo;
        this.name   = `Bloom`;
        this.params = `(${destIntensity}, ${destRadius})`; 
        this.origin = [ originIntensity, originRadius ];
        this.dest   = [ destIntensity, destRadius ];
    }

    setupAnimation(tl, start, duration) {
        this.start     = start;
        this.duration  = duration;
        this.bloomEffect = this.experience.renderer.bloomEffect;


        tl.to(
            this.origin, 
            { 
                id               : this.id,
                ease             : this.ease,
                repeat           : (this.yoyo === true) ? 1 : 0,
                yoyo             : this.yoyo,
                duration         : this.duration,
                endArray         : this.dest,
                onUpdate         : this.onUpdate, 
                onUpdateParams   : [ this ],
                onStart          : this.onStartBloom,
                onStartParams    : [ this ],
                onComplete       : this.onComplete,
                onCompleteParams : [ this ],
            },
            this.start
        )

        this.tween = tl.getById(this.id);
//        console.log(this.tween)
    }

    onStartBloom(This) {
//        This.tween.updateTo({ });
//        This.origin = [This.bloomEffect.intensity, This.bloomEffect.mipmapBlurPass.radius];
        This.onStart(This);
//        console.log("sb", this._targets[0], This.bloomEffect.intensity, This.bloomEffect.mipmapBlurPass.radius);
    }

    onUpdate(This) {
        This.bloomEffect.intensity             = this.targets()[0][0];
        This.bloomEffect.mipmapBlurPass.radius = this.targets()[0][1];
//        console.log(This.bloomEffect.intensity, This.bloomEffect.mipmapBlurPass.radius);
        This.onUpdateProgress(this._tTime, this._tDur);        
    }
}