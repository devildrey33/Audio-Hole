import * as THREE from "three"
import Experience from "../Experience";
import BackgroundVertexShader from "../Shaders/Background/BackgroundVertex.glsl"
import BackgroundFragmentShader from "../Shaders/Background/BackgroundFragment.glsl"

export default class Background {
    constructor(world, name, width = 22400, height = 12600, x = 0, y = 0, z = -10000) {
        this.name = name;
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.world = world;
        this.setup(width, height, x, y, z);        
    }

    setup(width, height, x, y, z) {
        this.geometry = new THREE.PlaneGeometry(width, height);

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uTexture1      : { value : this.experience.resources.items[this.name] },
                uAlpha         : { value : 0.125 },
                uActualTexture : { value : 1 },
                uTime          : { value : 0 },
            },
            vertexShader    : BackgroundVertexShader,
            fragmentShader  : BackgroundFragmentShader,
            transparent     : true, 
//            side            : THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
//        this.mesh.rotation.z = -Math.PI;

        console.log(this.world.backgroundPosition);
        this.world.backgroundPosition++;

        this.mesh.position.set(x, y, z);
        this.mesh.name = this.name;
    
        this.scene.add(this.mesh);
    }

    updateBackground() {
        this.material.uniforms.uTime.value = 0;
        this.material.uniforms.uTexture1.value = this.experience.resources.items[this.name];
    }

    update(delta) {
        this.material.uniforms.uTime.value += delta;
    }

}