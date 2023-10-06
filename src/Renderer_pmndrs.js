import * as THREE from 'three'
import Experience from "./Experience";
import { BloomEffect, EffectComposer, EffectPass, RenderPass, GodRaysEffect, /*ShockWaveEffect,*/ ToneMappingEffect, ToneMappingMode } from "postprocessing";
//import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import ColorCorrectionEffect from "./PostProcessing/ColorCorrectionEffect.js"

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
        this.instance.toneMapping = THREE.NoToneMapping;
//        this.instance.toneMapping = THREE.CineonToneMapping;
//        this.instance.toneMappingExposure = 1.75;

//        this.instance.shadowMap.enabled = true;
//        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
//        this.instance.setClearColor('#050505');
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);


        this.effectComposer = new EffectComposer(this.instance, {
               frameBufferType: THREE.HalfFloatType
        });
//        this.effectComposer.autoRenderToScreen = true;

        this.effectComposer.addPass(new RenderPass(this.scene, this.camera.instance));

        this.bloomEffect = new BloomEffect({ mipmapBlur : true, levels : 5 });
        //this.bloomPass.strength = this.experience.options.bloomStrength;   
        this.bloomEffect.intensity = this.experience.options.bloomPmndrsIntensity;
        this.bloomEffect.luminanceMaterial.uniforms.threshold.value = this.experience.options.bloomPmndrsThreshold;
        this.bloomEffect.luminanceMaterial.uniforms.smoothing.value = this.experience.options.bloomPmndrsSmoothing;
        this.bloomEffect.mipmapBlurPass.radius = this.experience.options.bloomPmndrsRadius;
        this.bloomPass = new EffectPass(this.camera.instance, this.bloomEffect);
//        this.bloomPass.dithering = false;
        this.effectComposer.addPass(this.bloomPass);

/*        this.godRaysPass2 = new GodRaysEffect(this.camera.instance, spiralsMesh);
        this.effectComposer.addPass(new EffectPass(this.camera.instance, this.godRaysPass2));
        this.effectComposer.addPass(this.godRaysPass2);        */

        this.godRaysEffect = new GodRaysEffect(this.camera.instance, sunMesh);
        this.godRaysPass = new EffectPass(this.camera.instance, this.godRaysEffect);
        this.effectComposer.addPass(this.godRaysPass);

        this.godRaysEffect.godRaysMaterial.density  = this.experience.options.godRaysDensity;
        this.godRaysEffect.godRaysMaterial.decay = this.experience.options.godRaysDecay;
        this.godRaysEffect.godRaysMaterial.weight = this.experience.options.godRaysWeigth;
        this.godRaysEffect.godRaysMaterial.exposure = this.experience.options.godRaysExposure;
        this.godRaysEffect.godRaysMaterial.clampMax = this.experience.options.godRaysClampMax;
        this.godRaysEffect.godRaysMaterial.samples = this.experience.options.godRaysSamples;


/*        this.shockWaveEffect = new ShockWaveEffect(this.camera.instance, new THREE.Vector3(0, 0, -10));
        this.shockWavePass = new EffectPass(this.camera.instance, this.shockWaveEffect);
        this.shockWaveEffect.speed = this.experience.options.shockWaveSpeed;
        this.shockWaveEffect.maxRadius = this.experience.options.shockWaveMaxRadius;
        this.shockWaveEffect.waveSize = this.experience.options.shockWaveWaveSize;
        this.shockWaveEffect.amplitude = this.experience.options.shockWaveAmplitude;
        this.effectComposer.addPass(this.shockWavePass);*/


        this.colorCorrectionEffect = new ColorCorrectionEffect();
        this.colorCorrectionEffect.uniforms.get("powRGB").value = this.experience.options.colorCorrectionPowRGB;
        this.colorCorrectionEffect.uniforms.get("mulRGB").value = this.experience.options.colorCorrectionMulRGB;
        this.colorCorrectionEffect.uniforms.get("addRGB").value = this.experience.options.colorCorrectionAddRGB;
        this.colorCorrectionPass = new EffectPass(this.camera.instance, this.colorCorrectionEffect);
        this.effectComposer.addPass(this.colorCorrectionPass);
//        console.log(this.colorCorrectionEffect, this.colorCorrectionPass);

//        this.colorCorrectionEffect.uniforms.powRGB.value = new THREE.Vector3(2, 2, 3);


        this.toneMappingEffect = new ToneMappingEffect();
        this.toneMappingEffect.mode = ToneMappingMode.OPTIMIZED_CINEON;
        this.toneMappingEffect.exposure = 1.75;
        this.toneMappingPass = new EffectPass(this.camera.instance, this.toneMappingEffect);
        this.effectComposer.addPass(this.toneMappingPass);

//        console.log(this.colorCorrectionPass);

/*        this.godRaysPass2.godRaysMaterial.exposure = 0.2;
        this.godRaysPass2.godRaysMaterial.density = 0.2;
        this.godRaysPass2.godRaysMaterial.decay = 0.2;*/
//        console.log(this.bloomPass, this.godRaysPass)

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
//        this.bloomEffect.intensity = (1.4 + (Math.sin(this.time.elapsed / 10000))) * 0.5;
//        console.log(this.bloomEffect.intensity);
//console.log(this.bloomPass.radius);
        const audioValue = (this.experience.audioAnalizer.channelVocal.averageFrequency[1] / 255);
        this.godRaysEffect.godRaysMaterial.weight = 0.3 + audioValue;
        this.godRaysEffect.godRaysMaterial.density = 0.96 + audioValue;
//console.log(this.experience.audioAnalizer.channels[4].averageFrequency[4]);
        this.effectComposer.render();
        //this.instance.render(this.scene, this.camera.instance)
    }    
}
