import BPMEffect from "./BPMEffect.js";


/* Use always with yoyo, or make scales origin and dest */
export default class BPMSpiralsScale extends BPMEffect {
    constructor({scaleX = 1, scaleY = 1, scaleZ = 1, ease = "bounce", yoyo = true}) {
        super();
        this.dest = [ scaleX ,scaleY, scaleZ ];
        
        this.name = "SpiralsScale";
        this.params = `(${scaleX}, ${scaleY}, ${scaleZ})`;

        this.ease = ease;
        this.yoyo = yoyo;
    }

    setupAnimation(tl, start, duration) {
        this.start     = start;
        this.duration  = duration;

        this.spiralsMesh = this.experience.world.spirals.mesh;

        this.origin = [ this.spiralsMesh.scale.x, this.spiralsMesh.scale.y, this.spiralsMesh.scale.x ];

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
        This.spiralsMesh.scale.x = this.targets()[0][0];
        This.spiralsMesh.scale.y = this.targets()[0][1];
        This.spiralsMesh.scale.z = this.targets()[0][2];

        This.onUpdateProgress(this._tTime, this._tDur);        
    }

}