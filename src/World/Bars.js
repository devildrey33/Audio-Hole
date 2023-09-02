import Experience from "../Experience";
import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import BarsVertexShader from "../Shaders/Bars/BarsVertex.glsl"
import BarsFragmentShader from "../Shaders/Bars/BarsFragment.glsl"
//import BarsDepthVertexShader from "../Shaders/Bars/BarsDepthVertexShader.glsl"

/*
 * Bars are merged and they are using ShaderMaterial
 */

export default class Bars {
    
    constructor(world) {
        this.experience      = new Experience();
        this.audioAnalizer   = this.experience.audioAnalizer;
        this.scene           = this.experience.scene;
        this.world           = world;
        
        // Could be a square but makes no sense with the floor
        this.createBars(256,1);
    }

    visible(show) {
        if (show === true) this.scene.add(this.bars);
        else               this.scene.remove(this.bars);
    }

    createBars(width, height) {
        if (typeof(this.bars) !== "undefined") {
            this.scene.remove(this.bars);
            this.geometry.dispose();
            this.material.dispose();
        }

        let   size       = width * height;

        let cubeGeometries = [];

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uAudioTexture  : { value : this.audioAnalizer.bufferCanvasLinear.texture },
                uAudioStrength : { value : this.experience.options.barsAudioStrength },
//                uTime         : { value : 0 }
            },
            vertexShader    : BarsVertexShader,
            fragmentShader  : BarsFragmentShader,
            transparent     : true
        });


//        let counter = 0;

        for (let z = 0; z < height; z++) {
            for (let x = 0; x < width; x++) {
                const geometry = new THREE.BoxGeometry(0.09, 0.1, 0.09);

                const nx = (-(width * 0.5) + x) * 0.1;
                const nz = (-(height * 0.5) + z) * 0.1;

                geometry.translate(nx, 0, nz);

                cubeGeometries.push(geometry);
            }
        }

        const numPos = 24;
        this.idArray  = new Float32Array(size * numPos);        
        this.geometry = BufferGeometryUtils.mergeGeometries(cubeGeometries);
        let count = 0;
        // fill each cube with his id
        for (let g = 0; g < size * numPos; g+= numPos) {
            for (let n = 0; n < numPos; n++) {
                this.idArray[g + n] = count / size;
            }            
            count++;
        }
        this.geometry.setAttribute('aId', new THREE.BufferAttribute(this.idArray, 1));

        // clear cube geometries used to create the merged geometry
        for (let i = 0; i < size; i++) {
            cubeGeometries[i].dispose();
        }

        this.mesh = new THREE.Mesh(this.geometry, this.material);
//        this.mesh.castShadow = this.experience.debugOptions.shadows;

        this.mesh.position.set(-3, 0.0, -15);

//        this.mesh.rotation.y = Math.PI * 0.5;
        this.mesh.rotation.x = -Math.PI * 0.5;
        this.mesh.rotation.z = Math.PI * 0.5;
        this.mesh.rotation.y = Math.PI;
        this.mesh.name = "Bars";


        this.scene.add(this.mesh);
    }

    
    update() {
    }

}