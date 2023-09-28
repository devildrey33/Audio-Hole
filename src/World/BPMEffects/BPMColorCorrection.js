import Experience from "../../Experience.js";
import * as THREE from 'three'
import gsap from "gsap";
import BPMEffect from "./BPMEffect.js";

export default class BPMColorCorrection extends BPMEffect {

    constructor({originPow = [3, 3, 3], originMul = [2, 2, 2], originAdd = [0.05, 0.05, 0.05],
                 destPow   = [3, 3, 3], destMul   = [2, 2, 2], destAdd   = [0.05, 0.05, 0.05],
                 ease = "none", yoyo = false }) {
        super();
        
        this.ease = ease;
        this.yoyo = yoyo;

        this.name = "ColorCorrection";
        this.params = `(...)`;

        this.dest = [
            destPow[0], destPow[1], destPow[2], 
            destMul[0], destMul[1], destMul[2], 
            destAdd[0], destAdd[1], destAdd[2]
        ];
        this.origin = [ 
            originPow[0], originPow[1], originPow[2], 
            originMul[0], originMul[1], originMul[2], 
            originAdd[0], originAdd[1], originAdd[2]
        ];

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

    onUpdate(This) {
        This.colorCorrectionEffect.uniforms.get("powRGB").value.x = this.targets()[0][0];
        This.colorCorrectionEffect.uniforms.get("powRGB").value.y = this.targets()[0][1];
        This.colorCorrectionEffect.uniforms.get("powRGB").value.z = this.targets()[0][2];
        This.colorCorrectionEffect.uniforms.get("mulRGB").value.x = this.targets()[0][3];
        This.colorCorrectionEffect.uniforms.get("mulRGB").value.y = this.targets()[0][4];
        This.colorCorrectionEffect.uniforms.get("mulRGB").value.z = this.targets()[0][5];
        This.colorCorrectionEffect.uniforms.get("addRGB").value.x = this.targets()[0][6];
        This.colorCorrectionEffect.uniforms.get("addRGB").value.y = this.targets()[0][7];
        This.colorCorrectionEffect.uniforms.get("addRGB").value.z = this.targets()[0][8];
        This.onUpdateProgress(this._tTime, this._tDur);        
    }

/*    onUpdateR(This) {
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
    }*/

}