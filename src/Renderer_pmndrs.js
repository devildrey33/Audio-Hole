import * as THREE from 'three'
import Experience from "./Experience";
import { BloomEffect, EffectComposer, EffectPass, RenderPass, GodRaysEffect, BrightnessContrastEffect } from "postprocessing";
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export default class Renderer {
    // Costructor
    constructor(sunMesh, spiralsMesh) {
        // Get the experience instance
        this.experience = new Experience();
        this.canvas     = this.experience.canvas;
        this.sizes      = this.experience.sizes;
        this.scene      = this.experience.scene;
        this.camera     = this.experience.camera;
        this.time       = this.experience.time;

        this.setInstance(sunMesh, spiralsMesh);
    }

    setInstance(sunMesh, spiralsMesh) {

        this.instance = new THREE.WebGLRenderer({
            canvas          : this.canvas, 
            powerPreference : "high-performance",
            antialias       : false,
            stencil         : false,
            depth           : false
        })

        this.instance.outputColorSpace = THREE.SRGBColorSpace;
//        this.instance.outputEncoding = THREE.sRGBEncoding;
        this.instance.toneMapping = THREE.CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
//        this.instance.shadowMap.enabled = true;
//        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
//        this.instance.setClearColor('#050505');
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);


        this.effectComposer = new EffectComposer(this.instance);

        this.effectComposer.addPass(new RenderPass(this.scene, this.camera.instance));

/*        this.bloomPass = new BloomEffect({ mipmapBlur : true });
        //this.bloomPass.strength = this.experience.options.bloomStrength;   
        this.bloomPass.intensity = 1.5;
        this.bloomPass.luminanceMaterial.threshold = 0.9;
        this.bloomPass.luminanceMaterial.smoothing = 0.4;

        this.effectComposer.addPass(new EffectPass(this.camera.instance, this.bloomPass));*/

        this.godRaysPass = new GodRaysEffect(this.camera.instance, sunMesh);
        this.effectComposer.addPass(new EffectPass(this.camera.instance, this.godRaysPass));

/*        this.godRaysPass2 = new GodRaysEffect(this.camera.instance, spiralsMesh);
        this.effectComposer.addPass(new EffectPass(this.camera.instance, this.godRaysPass2));
        this.godRaysPass2.godRaysMaterial.exposure = 0.2;
        this.godRaysPass2.godRaysMaterial.density = 0.2;
//        this.godRaysPass2.godRaysMaterial.decay = 0.2;*/
        
        console.log(this.bloomPass, this.godRaysPass)

        // bloom pass
/*        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.sizes.width, this.sizes.height ), 1.5, 0.4, 0.85 );
        this.bloomPass.threshold = this.experience.options.bloomThreshold;
        this.bloomPass.strength  = this.experience.options.bloomStrength;
        this.bloomPass.radius    = this.experience.options.bloomRadius;        
        this.bloomPass.enabled   = this.experience.options.bloomEnabled;     

        this.effectComposer.addPass(this.bloomPass);*/
/*        this.brightnessContrastPass = new BrightnessContrastEffect();
        this.effectComposer.addPass(new EffectPass(this.camera.instance, this.brightnessContrastPass));

        this.brightnessContrastPass.contrast = 0.25;
        this.brightnessContrastPass.brightness = 0.25*/
    }

    /**
     * Function called on resize
    */
    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);

        
        this.effectComposer.setSize(this.sizes.width, this.sizes.height);
//        this.effectComposer.setPixelRatio(this.sizes.pixelRatio);
    }

    /**
     * Function called on update
    */
    update() {
        const advance = this.time.delta / 1000;
//        this.displacementPass.material.uniforms.uTime.value += advance;

        // Modify bloom strenght using low sound average frequency (bass) 
//        this.bloomPass.luminanceMaterial.smoothing = 1.0 + (this.experience.audioAnalizer.averageFrequency[2] / 255);
//        console.log(this.bloomPass.luminanceMaterial.uniforms.smoothing.value);
        // Set bloom radius using a sine wave and time to go from -1.5 to 3.5
//        this.bloomPass.radius = -1.5 + (Math.sin(this.time.elapsed / 10000) * 5.5);


        this.effectComposer.render();
        //this.instance.render(this.scene, this.camera.instance)
    }    
}
