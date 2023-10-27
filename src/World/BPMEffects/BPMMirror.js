import * as THREE from 'three'
import BPMEffect from "./BPMEffect.js";

export default class BPMMirror extends BPMEffect {
    constructor({ 
        animationIn   = 0.5, 
        animationOut  = 0.5, 
        displacement  = 0.125,
        ease          = "none", 
        yoyo          = false 
    }) {
        super();
        this.dest = [ 1 ];
        this.animationIn = animationIn;
        this.animationOut = animationOut;
        this.displacement = displacement;
        
        this.name = "MirrorMode";
        this.params = `(${animationIn, animationOut})`;

        this.ease = ease;
        this.yoyo = yoyo;
    }


    setupAnimation(tl, start, duration) {
        this.start     = start;
        this.duration  = duration;

        this.mirrorEffect = this.experience.renderer.mirrorModeEffect;
        
        // Mesh2 is positive, mesh is negative
        this.origin = [ 0 ];

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
        const value = (this.targets()[0][0]);
        if (value > 0) {
            This.mirrorEffect.init(This.start, This.start + This.duration, This.experience.sizes.width, This.experience.sizes.height, This.animationIn, This.animationOut, This.displacement);
        }
//       This.suicide(value, This);

        This.onUpdateProgress(this._tTime, this._tDur);        
    }


    /* This is a suicide function of one use 
        I need to do this to avoid initializating more than one time the mirrorEffect
        .... nah
     */
    /*suicide(value, This) {
        if (value > 0) {
            This.mirrorEffect.init(This.start, This.start + This.duration, This.experience.sizes.width, This.experience.sizes.height, This.animationIn, This.animationOut);
            console.log ( This.experience.audioAnalizer.channelSong.song.currentTime, This.start, This.start + This.duration)
            This.suicide = () => {}
        }

    }*/
}