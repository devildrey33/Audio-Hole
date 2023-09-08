import Experience from "../Experience";
import * as THREE from 'three'
import VoronoiBackgroundVertexShader from "../Shaders/VoronoiBackground/VoronoiBackgroundVertex.glsl"
import VoronoiBackgroundFragmentShader from "../Shaders/VoronoiBackground/VoronoiBackgroundFragment.glsl"
import BufferCanvas from "../Utils/BufferCanvas";

export default class VoronoiBackground {
    constructor(world) {     
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.time  = this.experience.time;
        this.setup();
    }

    setup() { 
        const width = this.experience.options.voronoiBackgroundCount;
        const height = 1;
        // Create an audio texture using a memory canvas
        this.bufferCanvas         = new BufferCanvas(width, height);
        this.bufferCanvas.texture = new THREE.CanvasTexture(this.bufferCanvas.canvas);
        this.imageData            = this.bufferCanvas.context.createImageData(width, height);
        // Paint random values into the texture
        for (let x = 0; x < width; x++) {
            let pos = x * 4;
            this.imageData.data[pos + 0] = (0.25 + Math.random() * 0.5) * 255; // x 
            this.imageData.data[pos + 1] = Math.random() * 255; // y
            this.imageData.data[pos + 2] = Math.random() * 255; // color variation
            this.imageData.data[pos + 3] = Math.random() * 255; // more random?
        }
        this.bufferCanvas.context.putImageData(this.imageData, 0, 0, 0, 0, width, height);
        this.bufferCanvas.texture.needsUpdate = true;


        this.geometry = new THREE.CylinderGeometry( 750, 750, 1000, 32, 1, true );

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uPointsTexture     : { value : this.bufferCanvas.texture },
                uTime              : { value : 0 },
                uSpeed             : { value : this.experience.options.voronoiBackgroundSpeed },
                uThickness         : { value : this.experience.options.voronoiBackgroundThickness },
                uCount             : { value : this.experience.options.voronoiBackgroundCount }
            },
            vertexShader    : VoronoiBackgroundVertexShader,
            fragmentShader  : VoronoiBackgroundFragmentShader,
            transparent     : true, 
            side            : THREE.DoubleSide,
//            depthFunc       : THREE.AlwaysDepth,
/*            depthWrite      : false,*/
//            blending        : THREE.AdditiveBlending

        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
        console.log("te"); 
    }

    update() {        
        this.material.uniforms.uTime.value += this.time.delta;
    }
}