import * as THREE from "three"
import Experience from "../Experience";
import SunVertexShader from "../Shaders/Sun/SunVertex.glsl"
import SunFragmentShader from "../Shaders/Sun/SunFragment.glsl"

export default class Sun {
    constructor(world) {
        this.experience    = new Experience();
        this.scene         = this.experience.scene;
        this.time          = this.experience.time;
        this.audioAnalizer = this.experience.audioAnalizer;
        this.world         = world;
        this.setup();
    }

    
    setup() {
        this.geometry = new THREE.PlaneGeometry(12, 12);

//        console.log(this.experience.debugOptions.perlinSunColorFrequency);
        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uAudioTexture      : { value : this.audioAnalizer.bufferCanvasLinear.texture },
                uTime              : { value : 0 },
                uAudioStrengthFreq : { value : 1.0 },
                uAudioStrengthSin  : { value : 1.0 },
                uRadiusFreq        : { value : 0.4 },
                uRadiusSin         : { value : 0.25 },
                uNoiseStrength     : { value : 15 },
                uNoiseSpeed        : { value : 1 }
            },
            vertexShader    : SunVertexShader,
            fragmentShader  : SunFragmentShader,
//            transparent     : true, 
//            side            : THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
//        this.mesh.rotation.z = -Math.PI;
        this.mesh.rotation.z = -Math.PI * 0.5;
        this.mesh.position.set(0, 0, -185);
//        this.mesh.position.set(20, 15, -135);
        this.mesh.name = "Sun";
    
        this.scene.add(this.mesh);
    }

    update() {
        // get an average advance value
        const advance = this.time.delta / 1000;
        // update time on sun
        this.material.uniforms.uTime.value += advance;   
    }    
}