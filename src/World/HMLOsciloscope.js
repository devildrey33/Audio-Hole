import Experience from "../Experience";
import * as THREE from 'three'
import HMLOsciloscopeVertexShader from "../Shaders/HMLOsciloscope/HMLOsciloscopeVertex.glsl"
import HMLOsciloscopeFragmentShader from "../Shaders/HMLOsciloscope/HMLOsciloscopeFragment.glsl"


export default class HMLOsciloscope {

    constructor() {
        this.experience           = new Experience();
        this.scene                = this.experience.scene;
        this.audioAnalizer        = this.experience.audioAnalizer;
        this.time                 = this.experience.time;

        this.setup();
    }

    setup() {
        this.geometry = new THREE.PlaneGeometry(2048 * 4, 350);

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uAudioTexture  : { value : this.audioAnalizer.bufferCanvasLinear.texture },
                uAudioStrength : { value : this.experience.options.hmsOsciloscopeAudioStrength },
                uAudioValue    : { value : 0 },
                uSpeed         : { value : this.experience.options.hmsOsciloscopeSpeed },
                uTime          : { value : 0 }
            },
            vertexShader    : HMLOsciloscopeVertexShader,
            fragmentShader  : HMLOsciloscopeFragmentShader,
            transparent     : true,
            side            : THREE.DoubleSide,
//            depthWrite      : false
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh2 = new THREE.Mesh(this.geometry, this.material);

        this.mesh.rotation.z = -Math.PI * 0.5 ;
        this.mesh.rotation.x = -Math.PI * 0.5 ;
//        this.mesh.rotation.y = Math.PI * 0.5;
        this.mesh.position.set(0, 750, -1024 * 4);

        this.mesh2.rotation.z = -Math.PI * 0.5 ;
        this.mesh2.rotation.x = -Math.PI * 0.5 ;
        this.mesh2.position.set(0, -750, -1024 * 4);
//        this.mesh.rotation.z = Math.PI * 0.5;
//        this.mesh.position.copy(this.position);

        this.scene.add(this.mesh);
        this.scene.add(this.mesh2);

    }

    update() {        
        this.material.uniforms.uTime.value += this.time.delta / 100;

        this.material.uniforms.uAudioValue.value = (this.audioAnalizer.averageFrequency[4] / 64);

        this.mesh.scale.y  =  1.1 + Math.sin(this.time.current / 3000) * 3;
        this.mesh2.scale.y = this.mesh.scale.y;
        
    }
}