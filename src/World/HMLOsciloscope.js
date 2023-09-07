import Experience from "../Experience";
import * as THREE from 'three'
import HMLOsciloscopeVertexShader from "../Shaders/HMLOsciloscope/HMLOsciloscopeVertex.glsl"
import HMLOsciloscopeFragmentShader from "../Shaders/HMLOsciloscope/HMLOsciloscopeFragment.glsl"


export default class HMLOsciloscope {

    constructor() {
        this.experience           = new Experience();
        this.scene                = this.experience.scene;
        this.sizes                = this.experience.sizes;
        this.audioAnalizer        = this.experience.audioAnalizer;
        this.time                 = this.experience.time;

        this.setup();
    }

    setup() {
        this.geometry = new THREE.PlaneGeometry(1024, 50);

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uAudioTexture  : { value : this.audioAnalizer.bufferCanvasLinear.texture },
                uAudioStrength : { value : this.experience.options.hmsOsciloscopeAudioStrength },
//                uAudioZoom     : { value : this.experience.options.osciloscopeAudioZoom },*/
                uAudioValue    : { value : 0 },/*
                uSize          : { value : this.size },
                uColor         : { value : this.color }*/
                uTime         : { value : 0 }
            },
            vertexShader    : HMLOsciloscopeVertexShader,
            fragmentShader  : HMLOsciloscopeFragmentShader,
            transparent     : true,
            side            : THREE.DoubleSide,
//            depthWrite      : false
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.rotation.y = Math.PI * 0.5;
        this.mesh.position.set(48, -16, -512);
//        this.mesh.rotation.z = Math.PI * 0.5;
//        this.mesh.position.copy(this.position);

        this.scene.add(this.mesh);

    }

    update() {        
        this.material.uniforms.uTime.value += this.time.delta / 100;

        this.material.uniforms.uAudioValue.value = 0.01 + (this.audioAnalizer.averageFrequency[4] / 64);
    }
}