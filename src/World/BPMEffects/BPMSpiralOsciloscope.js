import BPMEffect from "./BPMEffect.js";



export default class BPMSpiralOsciloscope extends BPMEffect {
    constructor({audioStrength = 0.4, audioZoom = 2, thickness = 0.05, ease = "none", yoyo = true}) {
        super();
        this.dest = [ audioStrength ,audioZoom, thickness ];
        
        this.name = "BPMSpiralOsciloscope";
        this.params = `(${audioStrength}, ${audioZoom}, ${thickness})`;

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
        
        this.origin = [ this.spiralUniforms.uAudioStrengthSin.value, this.spiralUniforms.uAudioZoomSin.value, this.spiralUniforms.uThicknessSin.value ];

        tl.to(
            this.origin, 
            { 
//                delay    : startMS,
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
        This.spiralUniforms.uAudioZoomSin.value     = this.targets()[0][1];
        This.spiralUniforms.uThicknessSin.value     = this.targets()[0][2];

        This.onUpdateProgress(this._tTime, this._tDur);        
    }

}