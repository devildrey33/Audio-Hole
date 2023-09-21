import Experience from "../../Experience.js";
import * as THREE from 'three'
import gsap from "gsap";

export default class BPMColorCorrection {

    constructor({
        Pow = new THREE.Vector3(3.0, 3.0, 3.0),
        Mul = new THREE.Vector3(1.0, 1.0, 1.0),
        Add = new THREE.Vector3(.05, .05, .05)
    }) {
        this.experience = new Experience();
        this.powDest    = Pow;
        this.mulDest    = Mul;
        this.addDest    = Add;
        this.colorCorrectionEffect = this.experience.renderer.colorCorrectionEffect;
        this.powOrigin  = this.colorCorrectionEffect.uniforms.get("powRGB");
        this.mulOrigin  = this.colorCorrectionEffect.uniforms.get("powMul");
        this.addOrigin  = this.colorCorrectionEffect.uniforms.get("addRGB");

//        this.setup();
    }

    setup() {

        //unhooks the GSAP ticker
//        gsap.ticker.remove(gsap.updateRoot);

/*        this.pow = this.powOrigin;
        this.mul = this.mulOrigin;
        this.add = this.addOrigin;*/
        let duration = (this.bpmEnd - this.bpmStart) * this.experience.song.bpmMS;
        let ease = "elastic";
        gsap.to(
            [ this.powOrigin, this.mulOrigin, this.addOrigin ], 
/*            [ // From
                { x : this.powOrigin.x , y : this.powOrigin.y, z : this.powOrigin.z },
                { x : this.mulOrigin.x , y : this.mulOrigin.y, z : this.mulOrigin.z },
                { x : this.addOrigin.x , y : this.addOrigin.y, z : this.addOrigin.z }
            ],*/
            [ // To
                { x : this.powDest.x , y : this.powDest.y, z : this.powDest.z, duration : duration, ease },
                { x : this.mulDest.x , y : this.mulDest.y, z : this.mulDest.z, duration : duration, ease },
                { x : this.addDest.x , y : this.addDest.y, z : this.addDest.z, duration : duration, ease }
            ]
        );
    }
    
    update(delta) {
        //sets the root time to 20 seconds manually
//        gsap.updateRoot(delta);
    }
}