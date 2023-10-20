import * as THREE from "three"
import Experience from "../Experience";
import SpiralsVertexShader from "../Shaders/Spirals/SpiralsVertex.glsl"
import SpiralsFragmentShader from "../Shaders/Spirals/SpiralsFragment.glsl"

export default class Spirals {
    constructor(world) {
        this.experience    = new Experience();
        this.scene         = this.experience.scene;
        this.time          = this.experience.time;
        this.audioAnalizer = this.experience.audioAnalizer;
        this.world         = world;
        this.setup();
    }

    
    setup() {
        this.geometry = new THREE.CylinderGeometry( 0.01, 2, 64, 256, 1, true );
//        this.geometry = new THREE.PlaneGeometry(3, 3);

//        console.log(this.experience.debugOptions.perlinSunColorFrequency);
        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uAudioTexture      : { value : this.audioAnalizer.channelSong.bufferCanvasLinear.texture },
                uAudioTexture2     : { value : this.audioAnalizer.channelVocal.bufferCanvasLinear.texture },
//                uAudioTexture3     : { value : this.audioAnalizer.channelDrum.bufferCanvasLinear.texture },
                uAudioStrength     : { value : this.experience.options.spiralAudioStrength },
                uAudioZoom         : { value : this.experience.options.spiralAudioZoom },
                uAudioStrengthSin  : { value : this.experience.options.spiralAudioStrengthSin },
                uAudioZoomSin      : { value : this.experience.options.spiralAudioZoomSin },
                uAudioValue        : { value : 0 },
                uAudioValue2       : { value : 0 },
                uTime              : { value : 0 },
                uFrequency         : { value : this.experience.options.spiralFrequency },
                uSpeed             : { value : this.experience.options.spiralSpeed },
                uThickness         : { value : this.experience.options.spiralThickness },
                uFrequencySin      : { value : this.experience.options.spiralFrequencySin },
                uSpeedSin          : { value : this.experience.options.spiralSpeedSin },
                uThicknessSin      : { value : this.experience.options.spiralThicknessSin },
                uColorSin          : { value : this.experience.options.spiralColorSin }
            },
            vertexShader    : SpiralsVertexShader,
            fragmentShader  : SpiralsFragmentShader,
            transparent     : true, 
            side            : THREE.DoubleSide,
//            depthFunc       : THREE.AlwaysDepth,
/*            depthWrite      : false,*/
//            blending        : THREE.AdditiveBlending

        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = Math.PI * -0.5;
        //this.mesh.rotation.z = Math.PI * 1.0;
/*        this.mesh.position.y = 0;
        this.mesh.position.x = -12;
        this.mesh.position.z = -2;*/
        this.mesh.name = "Spirals";
//        this.mesh.castShadow =  this.experience.debugOptions.shadows;


//        this.group = new THREE.Group();
        this.mesh.position.set(0, 0, -32);
//        this.group.add(this.mesh);
        this.world.group.add(this.mesh);

    }

    update(delta) {
        // get an average advance value
       //const advance = this.time.delta / 1000;
        // update rotation on the cilynder
        this.mesh.rotation.y += delta;
        // update audio value on spiral
        this.material.uniforms.uAudioValue.value  = (this.world.songChannels.SpiralBars.averageFrequency[4] * 4);
        this.material.uniforms.uAudioValue2.value = (this.world.songChannels.SpiralOsciloscope.averageFrequency[0]) + (this.audioAnalizer.channelVocal.averageFrequency[1] / 64) + (this.audioAnalizer.channelVocal.averageFrequency[2]);//        this.material.uniforms.uAudioValue.value = 1.0;
        // update time on spiral
        this.material.uniforms.uTime.value += delta;   
        // Set osciloscope line thickness applying the low sound average frequency
//        this.material.uniforms.uThicknessSin.value = 0.01 + ((this.audioAnalizer.averageFrequency[2] / 255) * 0.05);

    }
}