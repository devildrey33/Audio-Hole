import Experience from "../Experience";
import * as THREE from 'three'

import HMLBarsVertexShader from "../Shaders/HMLBars/HMLBarsVertex.glsl"
import HMLBarsFragmentShader from "../Shaders/HMLBars/HMLBarsFragment.glsl"

export default class Bars {
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
                uAudioStrength : { value : this.experience.options.barsAudioStrength },
                uAudioZoom     : { value : this.experience.options.barsAudioZoom },
                uAudioValue    : { value : 0 },
                uSpeed         : { value : this.experience.options.barsSpeed },
                uTime          : { value : 0 }
            },
            vertexShader    : HMLBarsVertexShader,
            fragmentShader  : HMLBarsFragmentShader,
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

    RecalculateAnimations(timeline) {
        const bpmMS = this.experience.song.bpmMS;
        let startMS = (0 * bpmMS) / 1000;
        let endMS   = ((2 * bpmMS) / 1000) - startMS;
        
        timeline.to(
            [ 0, 0 ], {
                ease     : "linear",
                duration : bpmMS / 1000,
                data     : this,
                endArray : [ 1, 1 ],
                yoyo     : true,
                repeat   : -1,
                onUpdate() { 
                    this.vars.data.mesh.position.x = 500 + (this.targets()[0][0] * this.vars.data.audioAnalizer.averageFrequency[0]);
                    this.vars.data.mesh2.position.x = -500 + -(this.targets()[0][1] * this.vars.data.audioAnalizer.averageFrequency[0])
                }
            },
            0
        );
    }

}