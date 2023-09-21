import Experience from "../Experience";
import * as THREE from 'three'
import RaysVertexShader from "../Shaders/Rays/RaysVertex.glsl"
import RaysFragmentShader from "../Shaders/Rays/RaysFragment.glsl"


export default class Arrowciloscope {
/*    colors = [
        new THREE.Color(139, 0, 0),
        new THREE.Color(255, 140, 0),
        new THREE.Color(255, 215, 0),
        new THREE.Color(255, 165, 0),
        new THREE.Color(240, 128, 128),
        new THREE.Color(165, 42, 42),
        new THREE.Color(255, 105, 180),
        new THREE.Color(255, 218, 185),
        new THREE.Color(255, 69, 0),
        new THREE.Color(255, 255, 102),
    ];*/

    constructor() {
        this.experience           = new Experience();
        this.scene                = this.experience.scene;
        this.sizes                = this.experience.sizes;
        this.audioAnalizer        = this.experience.audioAnalizer;

        this.createRandValues();

        this.setup();
    }

    createRandValues() {
        //this.color = this.colors[Math.floor(Math.random() * 10)];
        this.color = new THREE.Color(Math.random(), Math.random(), Math.random());
        this.speed = 0.3 + Math.random() * 1;
//        this.speed = 0.03 + Math.random() * 0.2;
        this.size  = 0.01 + Math.random() * 0.2;
        this.rotationSpeed = Math.random() * 0.005 ;

        this.angle = Math.PI - Math.random(Math.PI * 2);
        this.radius = 0.4 + Math.random() * 2.8;
        this.position = new THREE.Vector3(Math.cos(this.angle * this.radius) , Math.sin(this.angle * this.radius), 10);

//        console.log(this.color);
    }

    appyRandValues() {
        this.material.uniforms.uColor.value = this.color;
        this.material.uniforms.uSize.value = this.size;
        this.mesh.position.copy(this.position);
    }

    setup() {

        
        this.geometry = new THREE.PlaneGeometry(3, 0.2);

        this.material = new THREE.ShaderMaterial({
            uniforms : {
/*                uAudioTexture  : { value : this.audioAnalizer.bufferCanvasLinear.texture },
                uAudioStrength : { value : this.experience.options.osciloscopeAudioStrength },
                uAudioZoom     : { value : this.experience.options.osciloscopeAudioZoom },*/
                uAudioValue    : { value : 0 },
                uSize          : { value : this.size },
                uColor         : { value : this.color }
//                uTime         : { value : 0 }
            },
            vertexShader    : RaysVertexShader,
            fragmentShader  : RaysFragmentShader,
            transparent     : true,
            side            : THREE.DoubleSide,
//            depthWrite      : false
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.rotation.x = Math.PI * 0.5;
        this.mesh.rotation.z = Math.PI * 0.5;
        this.mesh.position.copy(this.position);

        this.scene.add(this.mesh);

    }

/*    resize() {
    }*/

    update() {
        this.mesh.position.z -= this.speed;
        this.angle += this.rotationSpeed;
        this.radius -= this.rotationSpeed * 0.5;
        this.mesh.position.x = Math.cos(this.angle * this.radius);
        this.mesh.position.y = Math.sin(this.angle * this.radius);
        
        this.material.uniforms.uAudioValue.value = 0.01 + (this.audioAnalizer.averageFrequency[4] / 64);

        if (this.mesh.position.z < - 60) {
            this.createRandValues();
            this.appyRandValues();
        }

    }
    

}