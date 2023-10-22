import BPMEffect from "./BPMEffect";


export default class BPMGodRays extends BPMEffect {
    constructor({ density = 0.9, weigth = 0.3, ease = "none", yoyo = true }) {
        super();
        this.ease = ease;
        this.yoyo = yoyo;
        this.dest =  [ density,  weigth ];
        this.name    = `GodRays`;
        this.params  = `(${density}, ${weigth})`;
    }

    setupAnimation(tl, start, end) {
        this.start = start;
        this.end   = end;
        
        this.godRaysEffect = this.experience.renderer.godRaysEffect;
        const bpmMS = this.experience.song.bpmMS;
        let startMS = (start * bpmMS) / 1000;
        let endMS   = ((end * bpmMS) / 1000) - startMS;
        this.origin = [ this.godRaysEffect.godRaysMaterial.density, this.godRaysEffect.godRaysMaterial.weight ];
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
                onStart          : this.onStart,
                onStartParams    : [ this ],
                onComplete       : this.onComplete,
                onCompleteParams : [ this ],
            },
            startMS
        )
    }


    onUpdate(This) {

        This.godRaysEffect.godRaysMaterial.density = this.targets()[0][0];
        This.godRaysEffect.godRaysMaterial.weight  = this.targets()[0][1];

        This.onUpdateProgress(this._tTime, this._tDur);        
    }
}