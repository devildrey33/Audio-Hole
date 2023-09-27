import BPMEffect from "./BPMEffect.js";

/*
 * TODO rebuild as spiralsShake
 */ 

export default class BPMSpiralsPosition extends BPMEffect {
    constructor({positionX = 1, positionY = 1, positionZ = 1, ease = "none", yoyo = true}) {
        super();
        this.dest = [ positionX ,positionY, positionZ ];
        
        this.name = "SpiralsPosition";
        this.params = `(${positionX}, ${positionY}, ${positionZ})`;

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
        
        this.origin = [ this.spiralsMesh.position.x, this.spiralsMesh.position.y, this.spiralsMesh.position.x ];

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
        This.spiralsMesh.position.x = this.targets()[0][0];
        This.spiralsMesh.position.y = this.targets()[0][1];
        This.spiralsMesh.position.z = this.targets()[0][2];

        This.onUpdateProgress(this._tTime, this._tDur);        
    }

}