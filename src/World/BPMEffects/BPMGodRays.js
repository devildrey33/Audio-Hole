import BPMEffect from "./BPMEffect";

/* 
 * NOT USED
 */

export default class BPMGodRays extends BPMEffect {
    constructor({ density = 0.9, weigth = 0.3, ease = "none", yoyo = true }) {
        super();
        this.ease = ease;
        this.yoyo = yoyo;
        this.dest =  [ density,  weigth ];
        this.name    = `GodRays`;
        this.params  = `(${density}, ${weigth})`;
    }

    setupAnimation(tl, start, duration) {
        this.start     = start;
        this.duration  = duration;
        
        this.godRaysEffect = this.experience.renderer.godRaysEffect;

        this.origin = [ this.godRaysEffect.godRaysMaterial.density, this.godRaysEffect.godRaysMaterial.weight ];
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
                onStart          : this.onStart,
                onStartParams    : [ this ],
                onComplete       : this.onComplete,
                onCompleteParams : [ this ],
            },
            this.start
        )
    }


    onUpdate(This) {

        This.godRaysEffect.godRaysMaterial.density = this.targets()[0][0];
        This.godRaysEffect.godRaysMaterial.weight  = this.targets()[0][1];

        This.onUpdateProgress(this._tTime, this._tDur);        
    }
}