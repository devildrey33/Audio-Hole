import Experience from "../Experience";
import * as THREE from 'three'
import HMLOsciloscopeVertexShader from "../Shaders/HMLOsciloscope/HMLOsciloscopeVertex.glsl"
import HMLOsciloscopeFragmentShader from "../Shaders/HMLOsciloscope/HMLOsciloscopeFragment.glsl"


export default class HMLOsciloscope {

    constructor(timeline) {
        this.experience           = new Experience();
        this.scene                = this.experience.scene;
        this.audioAnalizer        = this.experience.audioAnalizer;
        this.time                 = this.experience.time;
        this.timeline             = timeline;

        this.setup();
    }

    setup() {
        this.geometry = new THREE.PlaneGeometry(2048 * 4, 1280);

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uAudioTexture  : { value : this.audioAnalizer.channelVocal.bufferCanvasLinear.texture },
                uAudioStrength : { value : this.experience.options.hmsOsciloscopeAudioStrength },
                uAudioValue    : { value : new THREE.Vector4(0.0, 0.0, 0.0, 0.0) },
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
        this.mesh.position.set(150, 750, -1024 * 4);

        this.mesh2.rotation.z = -Math.PI * 0.5 ;
        this.mesh2.rotation.x = -Math.PI * 0.5 ;
        this.mesh2.position.set(150, -750, -1024 * 4);
//        this.mesh.rotation.z = Math.PI * 0.5;
//        this.mesh.position.copy(this.position);

        this.scene.add(this.mesh);
        this.scene.add(this.mesh2);

    }

    update() {        
        this.material.uniforms.uTime.value += this.time.delta / 100;

        this.material.uniforms.uAudioValue.value = new THREE.Vector4(
            this.audioAnalizer.channelVocal.averageFrequency[0] / 196, 
            this.audioAnalizer.channelVocal.averageFrequency[1] / 196,
            this.audioAnalizer.channelVocal.averageFrequency[2] / 196,
            this.audioAnalizer.channelVocal.averageFrequency[4] / 196
        );
//        this.material.uniforms.uAudioValue.value = (this.audioAnalizer.averageFrequency[4] / 64);

//        this.mesh.scale.y  =  0.5 + (1.0 + Math.sin(this.time.current / 3000))* 2 * (this.material.uniforms.uAudioValue.value * 0.5);
//        this.mesh2.scale.y = this.mesh.scale.y;
        
    }

    
    RecalculateAnimations(timeline) {
        const bpmMS = this.experience.song.bpmMS;
        let startMS = (0 * bpmMS) / 1000;
        let endMS   = ((2 * bpmMS) / 1000) - startMS;
        
        timeline.to(
            [ 1, 1 ], {
                ease     : "linear",
                duration : bpmMS / 1000,
                data     : this,
                endArray : [ 0, 0 ],
                yoyo     : true,
                repeat   : -1,
                onUpdate() { 
                    this.vars.data.mesh.position.y = 750 + (this.targets()[0][0] * this.vars.data.audioAnalizer.averageFrequency[0] * 2);
                    this.vars.data.mesh2.position.y = -750 + -(this.targets()[0][1] * this.vars.data.audioAnalizer.averageFrequency[0] * 2)
                }
            },
            0
        );
    }
}