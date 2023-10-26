import BPMEffect from "./BPMEffect.js";
import options from "../../Config/options.js";

export default class BPMSpiralBars extends BPMEffect {
    constructor({ 
        originAudioStrength = options.spiralAudioStrength, 
        originThickness     = options.spiralThickness, 
        originMirrors       = options.spiralMirrors,
        destAudioStrength   = options.spiralAudioStrength, 
        destThickness       = options.spiralThickness, 
        destMirrors         = options.spiralMirrors,        
        ease                = "none", 
        yoyo                = true 
    }) {
        super();
        this.dest = [ destAudioStrength , destThickness, destMirrors ];
        this.origin = [ originAudioStrength, originThickness, originMirrors ];
        
        this.name = "SpiralBars";
        this.params = `(${destAudioStrength}, ${destThickness}, ${destMirrors})`;

        this.ease = ease;
        this.yoyo = yoyo;
    }


    setupAnimation(tl, start, duration) {
        this.start     = start;
        this.duration  = duration;

        this.spiralUniforms = this.experience.world.spirals.material.uniforms;        

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
        This.spiralUniforms.uAudioStrength.value = this.targets()[0][0];
        This.spiralUniforms.uThickness.value     = this.targets()[0][1];
//        This.spiralUniforms.uMirrors.value       = this.targets()[0][2];
        This.spiralUniforms.uMirrors.value       = Math.floor(this.targets()[0][2]);

        This.onUpdateProgress(this._tTime, this._tDur);        
    }

}