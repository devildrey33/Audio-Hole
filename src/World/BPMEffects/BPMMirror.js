import BPMEffect from "./BPMEffect.js";

export default class BPMMirror extends BPMEffect {
    constructor({ 
        enabled       = 0,  /* 0 disabled, 1 mirror width, 2 mirror height, 3 mirror width and height */
        ease          = "none", 
        yoyo          = false 
    }) {
        super();
        this.dest = [ 1 ];
        this.enabled = enabled;
        
        this.name = "LateralBars";
        this.params = `(${enabled})`;

        this.ease = ease;
        this.yoyo = yoyo;
    }


    setupAnimation(tl, start, end) {
        this.start = start;
        this.end   = end;

        this.mirrorEffect = this.experience.renderer.mirrorModeEffect;

        const bpmMS = this.experience.song.bpmMS;
        let startMS = (start * bpmMS) / 1000;
        let endMS   = ((end * bpmMS) / 1000) - startMS;        
        
        // Mesh2 is positive, mesh is negative
        this.origin = [ 0 ];

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
        const value = Math.floor(this.targets()[0][0]);
//        This.lateralBars.mesh.position.x = -value;
//        This.lateralBars.mesh2.position.x = value;
        if (value > 0) {
            if (This.enabled === 0) {
                if (This.experience.sizes.width > This.experience.sizes.height) {
                    This.mirrorEffect.uniforms.get("uEnabled").value = 0.1;
                }
                else {
                    This.mirrorEffect.uniforms.get("uEnabled").value = 0.2;
                }
            }
            else {
                if (This.experience.sizes.width > This.experience.sizes.height) {
                    This.mirrorEffect.uniforms.get("uEnabled").value = 1.0;    
                }
                else {
                    This.mirrorEffect.uniforms.get("uEnabled").value = 2.0;    
                }
            }
            This.mirrorEffect.uniforms.get("uStartTime").value = This.experience.audioAnalizer.channelSong.song.currentTime;
        }

        This.onUpdateProgress(this._tTime, this._tDur);        
    }

}