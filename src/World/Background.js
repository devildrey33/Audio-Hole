import * as THREE from "three"
import Experience from "../Experience";
import BackgroundVertexShader from "../Shaders/Background/BackgroundVertex.glsl"
import BackgroundFragmentShader from "../Shaders/Background/BackgroundFragment.glsl"

export default class Background {
    constructor(world) {

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.world = world;
        this.setup();        
    }

    setup() {
        this.geometry = new THREE.PlaneGeometry(16000 * 1.4, 9000 * 1.4);

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uTexture1      : { value : this.experience.resources.items["background1"] },
                uTexture2      : { value : this.experience.resources.items["background2"] },
                uTexture3      : { value : this.experience.resources.items["background3"] },
                uActualTexture : { value : 1 },
                uTime          : { value : 0 },
            },
            vertexShader    : BackgroundVertexShader,
            fragmentShader  : BackgroundFragmentShader,
            transparent     : true, 
//            side            : THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.z = -Math.PI * 0.5;
        this.mesh.position.set(0, 0, -10000);
        this.mesh.name = "Background";
    
        this.scene.add(this.mesh);
    }

    updateBackground() {
        this.material.uniforms.uTime.value = 0;
        this.material.uniforms.uTexture1.value = this.experience.resources.items["background1"];
        this.material.uniforms.uTexture2.value = this.experience.resources.items["background2"];
        this.material.uniforms.uTexture3.value = this.experience.resources.items["background3"];
    }

    update(delta) {
        this.material.uniforms.uTime.value += delta;
        this.mesh.rotation.z += delta / 75;
    }

}