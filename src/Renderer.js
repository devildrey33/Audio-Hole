import * as THREE from 'three'
import Experience from "./Experience";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ColorCorrectionShader } from 'three/addons/shaders/ColorCorrectionShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
//import DisplacementVertexShader from "./Shaders/PostProcessing/Displacement/DisplacementVertexShader.glsl"
//import DisplacementFragmentShader from "./Shaders/PostProcessing/Displacement/DisplacementFragmentShader.glsl"
//import { GodraysPass } from 'three-good-godrays';
//import { GodraysPass } from 'https://unpkg.com/three-good-godrays@0.4.2/build/three-good-godrays.esm.js';
//import { GodRaysFakeSunShader, GodRaysDepthMaskShader, GodRaysCombineShader, GodRaysGenerateShader } from 'three/addons/shaders/GodRaysShader.js';
import GodRays from './PostProcessing/GodRays.js'

export default class Renderer {
    // Costructor
    constructor() {
        // Get the experience instance
        this.experience = new Experience();
        this.canvas     = this.experience.canvas;
        this.sizes      = this.experience.sizes;
        this.scene      = this.experience.scene;
        this.camera     = this.experience.camera;
        this.time       = this.experience.time;

        this.setInstance();
    }

    // PostProcessing Displacement Pass
/*    DisplacementPass = {
        uniforms: {
            tDiffuse   : { value : null },
            uTime      : { value : 0 },
            uAmplitude : { value : null },
            uFrequency : { value : null }
        },
        vertexShader   : DisplacementVertexShader,
        fragmentShader : DisplacementFragmentShader
    }*/

    /**
     * Create the renderer instance and set his configuration
    */
    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas      : this.canvas, 
            antialias   : this.experience.options.antialias
        })
        
//        this.instance.physicallyCorrectLights = true;
//        this.instance.useLegacyLights = true;
        this.instance.outputColorSpace = THREE.SRGBColorSpace;
//        this.instance.outputEncoding = THREE.sRGBEncoding;
        this.instance.toneMapping = THREE.CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
//        this.instance.shadowMap.enabled = true;
//        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        this.instance.setClearColor('#050505');
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);

        /**
         * Post processing
         */
        this.effectComposer = new EffectComposer(this.instance);
        this.effectComposer.setSize(this.sizes.width, this.sizes.height);
        this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // render pass
        this.renderPass = new RenderPass(this.scene, this.camera.instance);
        this.effectComposer.addPass(this.renderPass);


        this.setupGodRays();

//        const godraysPass = new GodraysPass(pointLight, this.camera.instance);
        // If this is the last pass in your pipeline, set `renderToScreen` to `true`
//        godraysPass.renderToScreen = true;
//        composer.addPass(godraysPass);

        this.godRaysPass = new ShaderPass( GodRays );
        this.effectComposer.addPass(this.godRaysPass);           

        // bloom pass
        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.sizes.width, this.sizes.height ) );
        this.bloomPass.threshold = this.experience.options.bloomThreshold;
        this.bloomPass.strength  = this.experience.options.bloomStrength;
        this.bloomPass.radius    = this.experience.options.bloomRadius;        
        this.bloomPass.enabled   = this.experience.options.bloomEnabled;     
        this.effectComposer.addPass(this.bloomPass);           

        // Color correction pass
        this.colorCorrectionPass = new ShaderPass( ColorCorrectionShader );
        this.colorCorrectionPass.uniforms.powRGB.value = new THREE.Vector3(3, 3, 4);
        this.colorCorrectionPass.uniforms.mulRGB.value = new THREE.Vector3(2, 2, 5);
        this.colorCorrectionPass.uniforms.addRGB.value = new THREE.Vector3(0.15, 0.15, 0.25);
        this.effectComposer.addPass(this.colorCorrectionPass);       

    }
    
    setupGodRays() {
        
    }
    /**
     * Function called on resize
    */
    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);

        
        this.effectComposer.setSize(this.sizes.width, this.sizes.height);
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio);
    }

    /**
     * Function called on update
    */
    update() {
        const advance = this.time.delta / 1000;
//        this.displacementPass.material.uniforms.uTime.value += advance;

        // Modify bloom strenght using low sound average frequency (bass) 
//        this.bloomPass.strength = (this.experience.audioAnalizer.averageFrequency[4] / 255);
        // Set bloom radius using a sine wave and time to go from -1.5 to 3.5
//        this.bloomPass.radius = (Math.sin(this.time.elapsed / 10000) * 1.25);

//        console.log(this.bloomPass.radius);


        this.effectComposer.render();
        //this.instance.render(this.scene, this.camera.instance)
    }
}