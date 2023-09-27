import Experience from "../../Experience.js";
import * as THREE from 'three'
import gsap from "gsap";
import BPMEffect from "./BPMEffect.js";

export default class BPMColorCorrection extends BPMEffect {

    constructor({channel = "R", pow = 3, mul = 2, add = 0.05, ease = "none", yoyo = false }) {
        super();
        
        this.ease = ease;
        this.yoyo = yoyo;

        this.name = "ColorCorrection";
        this.params = `(${channel}, ${pow}, ${mul}, ${add})`;

        this.channel = channel;
        this.dest = [pow, mul, add];

//        this.setupAnimation();
    }


    setupAnimation(tl, start, end) {
        this.start = start;
        this.end   = end;

        this.colorCorrectionEffect = this.experience.renderer.colorCorrectionEffect;
        this.powOrigin  = this.colorCorrectionEffect.uniforms.get("powRGB").value;
        this.mulOrigin  = this.colorCorrectionEffect.uniforms.get("mulRGB").value;
        this.addOrigin  = this.colorCorrectionEffect.uniforms.get("addRGB").value;

        const bpmMS = this.experience.song.bpmMS;
        let startMS = (start * bpmMS) / 1000;
        let endMS   = ((end * bpmMS) / 1000) - startMS;

        switch (this.channel) {
            case "r" :
            case "R" : 
            default :
                this.origin = [ this.powOrigin.x , this.mulOrigin.x, this.addOrigin.x]; 
                this.onUpdate = this.onUpdateR;
                break;
            case "g" :
            case "G" : 
                this.origin = [ this.powOrigin.y , this.mulOrigin.y, this.addOrigin.y]; 
                this.onUpdate = this.onUpdateG;
                break;
            case "b" :
            case "B" : 
                this.origin = [ this.powOrigin.z , this.mulOrigin.z, this.addOrigin.z]; 
                this.onUpdate = this.onUpdateB;
                break;
        }


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
//        console.log(tween);
    }

    onUpdateR(This) {
        This.colorCorrectionEffect.uniforms.get("powRGB").value.x = this.targets()[0][0];
        This.colorCorrectionEffect.uniforms.get("mulRGB").value.x = this.targets()[0][1];
        This.colorCorrectionEffect.uniforms.get("addRGB").value.x = this.targets()[0][2];

        This.onUpdateProgress(this._tTime, this._tDur);        
    }

    onUpdateG(This) {
        This.colorCorrectionEffect.uniforms.get("powRGB").value.y = this.targets()[0][0];
        This.colorCorrectionEffect.uniforms.get("mulRGB").value.y = this.targets()[0][1];
        This.colorCorrectionEffect.uniforms.get("addRGB").value.y = this.targets()[0][2];

        This.onUpdateProgress(this._tTime, this._tDur);        
    }

    onUpdateB(This) {
        This.colorCorrectionEffect.uniforms.get("powRGB").value.z = this.targets()[0][0];
        This.colorCorrectionEffect.uniforms.get("mulRGB").value.z = this.targets()[0][1];
        This.colorCorrectionEffect.uniforms.get("addRGB").value.z = this.targets()[0][2];

        This.onUpdateProgress(this._tTime, this._tDur);        
    }

}