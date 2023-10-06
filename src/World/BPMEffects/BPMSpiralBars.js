import BPMEffect from "./BPMEffect.js";
import options from "../../Config/options.js";

export default class BPMSpiralBars extends BPMEffect {
    constructor({ 
        audioStrength = options.spiralAudioStrength, 
        thickness     = options.spiralThickness, 
        ease          = "none", 
        yoyo          = true 
    }) {
        super();
        this.dest = [ audioStrength , thickness ];
        
        this.name = "SpiralBars";
        this.params = `(${audioStrength}, ${thickness})`;

        this.ease = ease;
        this.yoyo = yoyo;
    }


    setupAnimation(tl, start, end) {
        this.start = start;
        this.end   = end;

        this.spiralUniforms = this.experience.world.spirals.material.uniforms;

        const bpmMS = this.experience.song.bpmMS;
        let startMS = (start * bpmMS) / 1000;
        let endMS   = ((end * bpmMS) / 1000) - startMS;        
        
        this.origin = [ this.spiralUniforms.uAudioStrength.value, this.spiralUniforms.uThickness.value ];

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
        This.spiralUniforms.uAudioStrength.value = this.targets()[0][0];
        This.spiralUniforms.uThickness.value     = this.targets()[0][1];

        This.onUpdateProgress(this._tTime, this._tDur);        
    }

}