import BPMEffect from "./BPMEffect.js";

export default class BPMLateralBars extends BPMEffect {
    constructor({ 
        position      = 500, 
        ease          = "none", 
        yoyo          = true 
    }) {
        super();
        this.dest = [ position ];
        
        this.name = "LateralBars";
        this.params = `(${position})`;

        this.ease = ease;
        this.yoyo = yoyo;
    }


    setupAnimation(tl, start, duration) {
        this.start     = start;
        this.duration  = duration;

        this.lateralBars = this.experience.world.hmlBars;
       
        // Mesh2 is positive, mesh is negative
        this.origin = [ this.lateralBars.mesh2.position.x ];

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
        const value = this.targets()[0][0];
        This.lateralBars.mesh.position.x = -value;
        This.lateralBars.mesh2.position.x = value;

        This.onUpdateProgress(this._tTime, this._tDur);        
    }

}