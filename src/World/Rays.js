import Experience from "../Experience";
import * as THREE from 'three'
import RaysVertexShader from "../Shaders/Rays/RaysVertex.glsl"
import RaysFragmentShader from "../Shaders/Rays/RaysFragment.glsl"

/*
    NOT USED
*/ 

export default class Rays {
    constructor(world) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.time  = this.experience.time;
        this.setup();
    }

    setup() {
        // dispose old particles
        if (typeof this.fireFliesGeometry !== "undefined") {
            // remove rays from scene
            this.scene.remove(this.mesh);  
            // Dispose the material and geometry
            this.material.dispose();
            this.geometry.dispose();
        }


        const count = this.experience.options.raysCount;
        this.geometry      = new THREE.BufferGeometry();
        this.positionArray = new Float32Array(count * 3);
        this.speedArray    = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            this.speedArray[i] = 30 + Math.random() * 100;
            const angle  = Math.PI - Math.random(Math.PI * 2);
            const radius = 0.4 + Math.random() * 2.8;
            this.positionArray[i * 3 + 0] = Math.cos(angle * radius);
            this.positionArray[i * 3 + 1] = Math.sin(angle * radius);
            this.positionArray[i * 3 + 2] = -45 + Math.random() * 90;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positionArray, 3));
        this.geometry.setAttribute('aSpeed', new THREE.BufferAttribute(this.speedArray, 1));

        this.material = new THREE.ShaderMaterial({
//            transparent     : true,
            blending        : THREE.AdditiveBlending,   // Fusionate colors with the scene
            map             :  this.experience.resources.items.rayTexture,
//            depthWrite      : false,                    // deactivate depthWrite to show objects behind
            uniforms        : {
                uTexture        : { value : this.experience.resources.items.rayTexture },
                uTime           : { value : 0 },
            },
            vertexShader    : RaysVertexShader,
            fragmentShader  : RaysFragmentShader
        });

/*        this.material = new THREE.MeshBasicMaterial({ 
            map         : this.experience.resources.items.rayTexture,            
            transparent : true,
        })*/
    

        this.mesh = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.mesh);
    }

    update() {
        // get an average advance value
        const advance = this.time.delta / 1000;
        // update time on sun
        this.material.uniforms.uTime.value += advance;   
    }
}
