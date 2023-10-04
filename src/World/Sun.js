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
        this.setupSun();
        this.setupLight();
    }

    
    setupSun() {
        this.geometry = new THREE.PlaneGeometry(12, 12);

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uAudioTexture      : { value : this.audioAnalizer.channelVocal.bufferCanvasLinear.texture },
                uTime              : { value : 0 },
                uAudioStrengthFreq : { value : this.experience.options.sunAudioStrengthFreq },
                uAudioStrengthSin  : { value : this.experience.options.sunAudioStrengthSin },
                uNoiseStrength     : { value : this.experience.options.sunNoiseStrength },
                uNoiseSpeed        : { value : this.experience.options.sunNoiseSpeed }
            },
            vertexShader    : SunVertexShader,
            fragmentShader  : SunFragmentShader,
            transparent     : true, 
//            side            : THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
//        this.mesh.rotation.z = -Math.PI;
        this.mesh.rotation.z = -Math.PI * 0.5;
        this.mesh.position.set(0, 0, -135);
//        this.mesh.position.set(20, 15, -135);
        this.mesh.name = "Sun";
    
        this.scene.add(this.mesh);
    }

    setupLight() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', this.experience.options.sunLightIntensity)
        this.sunLight.shadow.camera.far = 256;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.shadow.camera.bottom = -16;
        this.sunLight.shadow.camera.top    =  16;
        this.sunLight.shadow.camera.left   = -16;
        this.sunLight.shadow.camera.right  =  16;
        this.sunLight.position.set(0, 0, -134);      
        this.sunLight.castShadow = true;
        this.scene.add(this.sunLight)  
    }

    update() {
        // get an average advance value
        const advance = this.time.delta / 1000;
        // update time on sun
        this.material.uniforms.uTime.value += advance;   
    }    
}