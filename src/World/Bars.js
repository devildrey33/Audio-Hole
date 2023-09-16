import Experience from "../Experience";
import * as THREE from 'three'

import BarsVertexShader from "../Shaders/Bars/BarsVertex.glsl"
import BarsFragmentShader from "../Shaders/Bars/BarsFragment.glsl"

export default class Bars {
    constructor(world) {
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
                uAudioStrength : { value : this.experience.options.barsAudioStrength },
                uAudioZoom     : { value : this.experience.options.barsAudioZoom },
                uAudioValue    : { value : 0 },
                uSpeed         : { value : this.experience.options.barsSpeed },
                uTime          : { value : 0 }
            },
            vertexShader    : BarsVertexShader,
            fragmentShader  : BarsFragmentShader,
            transparent     : true,
            side            : THREE.DoubleSide,
//            depthWrite      : false
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh2 = new THREE.Mesh(this.geometry, this.material);

        this.mesh.rotation.y = Math.PI * 0.5;
        this.mesh.position.set(-500, 0, -1024 * 4);

        this.mesh2.rotation.y = Math.PI * 0.5;
        this.mesh2.position.set(500, 0, -1024 * 4);
//        this.mesh.rotation.z = Math.PI * 0.5;
//        this.mesh.position.copy(this.position);

        this.scene.add(this.mesh);        
        this.scene.add(this.mesh2);        
    }


    update() {        
        this.material.uniforms.uTime.value += this.time.delta / 100;

        this.material.uniforms.uAudioValue.value = 0.01 + (this.audioAnalizer.averageFrequency[2] / 64);

        
        this.mesh.scale.y  = 0.5 + (1.0 + Math.cos(this.time.current / 3000))  * (this.material.uniforms.uAudioValue.value * 0.5);
        this.mesh2.scale.y = this.mesh.scale.y;

    }

}