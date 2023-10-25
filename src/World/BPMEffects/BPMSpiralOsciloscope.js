import BPMEffect from "./BPMEffect.js";
import * as THREE from "three"


export default class BPMSpiralOsciloscope extends BPMEffect {
    constructor({audioStrength = 0.4, thickness = 0.05, color = new THREE.Color(1, 1, 1), ease = "none", yoyo = true}) {
        super();
        this.dest = [ audioStrength, thickness, color.r, color.g, color.b ];
        
        this.name   = "SpiralOsciloscope";
        this.params = `(${audioStrength}, ${thickness})`;

        this.ease = ease;
        this.yoyo = yoyo;
    }

    setupAnimation(tl, start, end) {
        this.start = start;
        this.end   = end;

        this.spiralUniforms = this.experience.world.spirals.material.uniforms;
        this.sunUniforms = this.experience.world.sun.material.uniforms;

        const bpmMS = this.experience.song.bpmMS;
        let startMS = (start * bpmMS) / 1000;
        let endMS   = ((end * bpmMS) / 1000) - startMS;        
        
        this.origin = [ this.spiralUniforms.uAudioStrengthSin.value, this.spiralUniforms.uThicknessSin.value,
            this.spiralUniforms.uColorSin.value.r, this.spiralUniforms.uColorSin.value.g, this.spiralUniforms.uColorSin.value.b
        ];

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
        This.spiralUniforms.uAudioStrengthSin.value = this.targets()[0][0];
        This.spiralUniforms.uThicknessSin.value     = this.targets()[0][1];
        This.spiralUniforms.uColorSin.value         = new THREE.Color(this.targets()[0][2], this.targets()[0][3], this.targets()[0][4]);
        This.sunUniforms.uColorSin.value = This.spiralUniforms.uColorSin.value;
        This.onUpdateProgress(this._tTime, this._tDur);        
    }

}