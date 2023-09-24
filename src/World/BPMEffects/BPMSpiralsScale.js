import BPMEffect from "./BPMEffect.js";



export default class BPMSpiralsScale extends BPMEffect {
    constructor({scaleX = 1, scaleY = 1, scaleZ = 1, ease = "none", yoyo = true}) {
        super();
        this.dest = [ scaleX ,scaleY, scaleZ ];
        
        this.name = "BPMSpiralsScale";
        this.params = `(${scaleX}, ${scaleY}, ${scaleZ})`;

        this.ease = ease;
        this.yoyo = yoyo;
    }

    setupAnimation(tl, start, end) {
        this.start = start;
        this.end   = end;

        this.spiralsMesh = this.experience.world.spirals.mesh;

        const bpmMS = this.experience.song.bpmMS;
        let startMS = (start * bpmMS) / 1000;
        let endMS   = ((end * bpmMS) / 1000) - startMS;        
        
        this.origin = [ this.spiralsMesh.scale.x, this.spiralsMesh.scale.y, this.spiralsMesh.scale.x ];

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
        This.spiralsMesh.scale.x = this.targets()[0][0];
        This.spiralsMesh.scale.y = this.targets()[0][1];
        This.spiralsMesh.scale.z = this.targets()[0][2];

        This.onUpdateProgress(this._tTime, this._tDur);        
    }

}