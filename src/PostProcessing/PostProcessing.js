import * as THREE from 'three'
import Experience from "../Experience";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ColorCorrectionShader } from 'three/addons/shaders/ColorCorrectionShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GodRaysFakeSunShader, GodRaysDepthMaskShader, GodRaysCombineShader, GodRaysGenerateShader } from 'three/addons/shaders/GodRaysShader.js';
import Sizes from '../Utils/Sizes';

const godrayRenderTargetResolutionMultiplier = 1.0 / 4.0;

const sunPosition = new THREE.Vector3( 0, 1000, - 1000 );
const clipPosition = new THREE.Vector4();
const screenSpacePosition = new THREE.Vector3();

const postprocessing = { enabled: true };

const orbitRadius = 200;

const bgColor = 0x000511;
const sunColor = 0xffee00;

export default class PostProcessing {
    constructor(renderer) {
        this.experience = new Experience();
        this.sizes      = new Sizes();
        this.camera     = this.experience.camera.instance;
        this.scene      = this.experience.scene;
        this.renderer   = renderer;
        this.time       = this.experience.time;

        this.setupComposer();

//        this.setupGodRaysPass();
        this.setupBloomPass();
        this.setupColorCorrectionPass();
        this.enabled = true;
    }

    setupComposer() {
        this.effectComposer = new EffectComposer(this.renderer);
        this.effectComposer.setSize(this.sizes.width, this.sizes.height);
        this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // render pass
        this.renderPass = new RenderPass(this.scene, this.camera.instance);
        this.effectComposer.addPass(this.renderPass);
    }

    setupGodRaysPass() {
        this.sceneGr = new THREE.Scene();

        this.cameraGr = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, - 10000, 10000 );
        this.cameraGr.position.z = 100;
    
        this.sceneGr.add( this.cameraGr );

        this.materialDepth = new THREE.MeshDepthMaterial();

    
        this.rtTextureColors = new THREE.WebGLRenderTarget( this.sizes.width, this.sizes.height, { type: THREE.HalfFloatType } );
    
        // Switching the depth formats to luminance from rgb doesn't seem to work. I didn't
        // investigate further for now.
        // pars.format = LuminanceFormat;
    
        // I would have this quarter size and use it as one of the ping-pong render
        // targets but the aliasing causes some temporal flickering
    
        this.rtTextureDepth = new THREE.WebGLRenderTarget( this.sizes.width, this.sizes.height, { type: THREE.HalfFloatType } );
        this.rtTextureDepthMask = new THREE.WebGLRenderTarget( this.sizes.width, this.sizes.height, { type: THREE.HalfFloatType } );
    
        // The ping-pong render targets can use an adjusted resolution to minimize cost
    
        const adjustedWidth = this.sizes.width * godrayRenderTargetResolutionMultiplier;
        const adjustedHeight = this.sizes.height * godrayRenderTargetResolutionMultiplier;
        this.rtTextureGodRays1 = new THREE.WebGLRenderTarget( adjustedWidth, adjustedHeight, { type: THREE.HalfFloatType } );
        this.rtTextureGodRays2 = new THREE.WebGLRenderTarget( adjustedWidth, adjustedHeight, { type: THREE.HalfFloatType } );
    
        // god-ray shaders
    
        const godraysMaskShader = GodRaysDepthMaskShader;
        this.godrayMaskUniforms = THREE.UniformsUtils.clone( godraysMaskShader.uniforms );
        this.materialGodraysDepthMask = new THREE.ShaderMaterial( {
    
            uniforms: this.godrayMaskUniforms,
            vertexShader: godraysMaskShader.vertexShader,
            fragmentShader: godraysMaskShader.fragmentShader
    
        } );
    
        const godraysGenShader = GodRaysGenerateShader;
        this.godrayGenUniforms = THREE.UniformsUtils.clone( godraysGenShader.uniforms );
        this.materialGodraysGenerate = new THREE.ShaderMaterial( {
    
            uniforms: this.godrayGenUniforms,
            vertexShader: godraysGenShader.vertexShader,
            fragmentShader: godraysGenShader.fragmentShader
    
        } );
    
        const godraysCombineShader = GodRaysCombineShader;
        this.godrayCombineUniforms = THREE.UniformsUtils.clone( godraysCombineShader.uniforms );
        this.materialGodraysCombine = new THREE.ShaderMaterial( {
    
            uniforms: postprocessing.godrayCombineUniforms,
            vertexShader: godraysCombineShader.vertexShader,
            fragmentShader: godraysCombineShader.fragmentShader
    
        } );
    
        const godraysFakeSunShader = GodRaysFakeSunShader;
        this.godraysFakeSunUniforms = THREE.UniformsUtils.clone( godraysFakeSunShader.uniforms );
        this.materialGodraysFakeSun = new THREE.ShaderMaterial( {
    
            uniforms: this.godraysFakeSunUniforms,
            vertexShader: godraysFakeSunShader.vertexShader,
            fragmentShader: godraysFakeSunShader.fragmentShader
    
        } );
    
        this.godraysFakeSunUniforms.bgColor.value.setHex( bgColor );
        this.godraysFakeSunUniforms.sunColor.value.setHex( sunColor );
    
        this.godrayCombineUniforms.fGodRayIntensity.value = 0.75;
    
        this.quad = new THREE.Mesh(
            new THREE.PlaneGeometry( 1.0, 1.0 ),
            this.materialGodraysGenerate
        );
        this.quad.position.z = - 9900;
        this.sceneGr.add( this.quad );
    }   

    // bloom pass
    setupBloomPass() {
        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.sizes.width, this.sizes.height ), 1.5, 0.4, 0.85 );
        this.bloomPass.threshold = this.experience.options.bloomThreshold;
        this.bloomPass.strength  = this.experience.options.bloomStrength + 1;
        this.bloomPass.radius    = this.experience.options.bloomRadius;        
        this.bloomPass.enabled   = this.experience.options.bloomEnabled;     

        this.effectComposer.addPass(this.bloomPass);           
    }

    setupColorCorrectionPass() {
        this.colorCorrectionPass = new ShaderPass( ColorCorrectionShader );
        this.colorCorrectionPass.uniforms.powRGB.value = new THREE.Vector3(3, 3, 4);
        this.colorCorrectionPass.uniforms.mulRGB.value = new THREE.Vector3(2, 2, 5);
        this.colorCorrectionPass.uniforms.addRGB.value = new THREE.Vector3(0.15, 0.15, 0.25);
        this.effectComposer.addPass(this.colorCorrectionPass);       
    }

    resize() {
        this.effectComposer.setSize(this.sizes.width, this.sizes.height);
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio);
    

        this.rtTextureColors.setSize( this.sizes.width, this.sizes.height );
        this.rtTextureDepth.setSize( this.sizes.width, this.sizes.height );
        this.rtTextureDepthMask.setSize( this.sizes.width, this.sizes.height );
    
        const adjustedWidth = this.sizes.width * godrayRenderTargetResolutionMultiplier;
        const adjustedHeight = this.sizes.height * godrayRenderTargetResolutionMultiplier;
        this.rtTextureGodRays1.setSize( adjustedWidth, adjustedHeight );
        this.rtTextureGodRays2.setSize( adjustedWidth, adjustedHeight );    

    }

    updateGodRays() {
        if ( this.enabled ) {

            clipPosition.x = sunPosition.x;
            clipPosition.y = sunPosition.y;
            clipPosition.z = sunPosition.z;
            clipPosition.w = 1;
    
            clipPosition.applyMatrix4( this.camera.matrixWorldInverse ).applyMatrix4( this.camera.projectionMatrix );
    
            // perspective divide (produce NDC space)
    
            clipPosition.x /= clipPosition.w;
            clipPosition.y /= clipPosition.w;
    
            screenSpacePosition.x = ( clipPosition.x + 1 ) / 2; // transform from [-1,1] to [0,1]
            screenSpacePosition.y = ( clipPosition.y + 1 ) / 2; // transform from [-1,1] to [0,1]
            screenSpacePosition.z = clipPosition.z; // needs to stay in clip space for visibilty checks
    
            // Give it to the god-ray and sun shaders
    
            this.godrayGenUniforms[ 'vSunPositionScreenSpace' ].value.copy( screenSpacePosition );
            this.godraysFakeSunUniforms[ 'vSunPositionScreenSpace' ].value.copy( screenSpacePosition );
    
            // -- Draw sky and sun --
    
            // Clear colors and depths, will clear to sky color
    
            renderer.setRenderTarget( postprocessing.rtTextureColors );
            renderer.clear( true, true, false );
    
            // Sun render. Runs a shader that gives a brightness based on the screen
            // space distance to the sun. Not very efficient, so i make a scissor
            // rectangle around the suns position to avoid rendering surrounding pixels.
    
            const sunsqH = 0.74 * window.innerHeight; // 0.74 depends on extent of sun from shader
            const sunsqW = 0.74 * window.innerHeight; // both depend on height because sun is aspect-corrected
    
            screenSpacePosition.x *= window.innerWidth;
            screenSpacePosition.y *= window.innerHeight;
    
            renderer.setScissor( screenSpacePosition.x - sunsqW / 2, screenSpacePosition.y - sunsqH / 2, sunsqW, sunsqH );
            renderer.setScissorTest( true );
    
            this.godraysFakeSunUniforms[ 'fAspect' ].value = window.innerWidth / window.innerHeight;
    
            this.scene.overrideMaterial = this.materialGodraysFakeSun;
            this.renderer.setRenderTarget( this.rtTextureColors );
            this.renderer.render( this.sceneGr, this.cameraGr );
    
            this.renderer.setScissorTest( false );
    
            // -- Draw scene objects --
    
            // Colors
    
            this.scene.overrideMaterial = null;
            this.renderer.setRenderTarget( this.rtTextureColors );
            this.renderer.render( this.scene, this.camera );
    
            // Depth
    
            this.scene.overrideMaterial = this.materialDepth;
            this.renderer.setRenderTarget( this.rtTextureDepth );
            this.renderer.clear();
            this.renderer.render( this.scene, this.camera );
    
            //
    
            this.godrayMaskUniforms[ 'tInput' ].value = this.rtTextureDepth.texture;
    
            this.sceneGr.overrideMaterial = this.materialGodraysDepthMask;
            this.renderer.setRenderTarget( postthisprocessing.rtTextureDepthMask );
            this.renderer.render( this.sceneGr, this.cameraGr );
    
            // -- Render god-rays --
    
            // Maximum length of god-rays (in texture space [0,1]X[0,1])
    
            const filterLen = 1.0;
    
            // Samples taken by filter
    
            const TAPS_PER_PASS = 6.0;
    
            // Pass order could equivalently be 3,2,1 (instead of 1,2,3), which
            // would start with a small filter support and grow to large. however
            // the large-to-small order produces less objectionable aliasing artifacts that
            // appear as a glimmer along the length of the beams
    
            // pass 1 - render into first ping-pong target
            this.filterGodRays( postprothiscessing.rtTextureDepthMask.texture, this.rtTextureGodRays2, this.getStepSize( filterLen, TAPS_PER_PASS, 1.0 ) );
    
            // pass 2 - render into second ping-pong target
            this.filterGodRays( this.rtTextureGodRays2.texture, this.rtTextureGodRays1, this.getStepSize( filterLen, TAPS_PER_PASS, 2.0 ) );
    
            // pass 3 - 1st RT
            this.filterGodRays( this.rtTextureGodRays1.texture, this.rtTextureGodRays2, this.getStepSize( filterLen, TAPS_PER_PASS, 3.0 ) );
    
            // final pass - composite god-rays onto colors
    
            this.godrayCombineUniforms[ 'tColors' ].value = this.rtTextureColors.texture;
            this.godrayCombineUniforms[ 'tGodRays' ].value = this.rtTextureGodRays2.texture;
    
            this.sceneGr.overrideMaterial = this.materialGodraysCombine;
    
            this.renderer.setRenderTarget( null );
            this.renderer.render( this.sceneGr, this.cameraGr );
            this.sceneGr.overrideMaterial = null;
    
        }
        else {
    
            renderer.setRenderTarget( null );
            renderer.clear();
            renderer.render( this.scene, this.camera );
    
        }
    }


    getStepSize( filterLen, tapsPerPass, pass ) {

        return filterLen * Math.pow( tapsPerPass, - pass );
    
    }
    
    filterGodRays( inputTex, renderTarget, stepSize ) {
    
        this.sceneGr.overrideMaterial = this.materialGodraysGenerate;
    
        this.godrayGenUniforms[ 'fStepSize' ].value = stepSize;
        this.godrayGenUniforms[ 'tInput' ].value = inputTex;
    
        this.renderer.setRenderTarget( renderTarget );
        this.renderer.render( this.sceneGr, this.cameraGr );
        this.sceneGr.overrideMaterial = null;
    
    }    

    update() {
        const advance = this.time.delta / 1000;
//        this.displacementPass.material.uniforms.uTime.value += advance;
//        this.updateGodRays();

        // Modify bloom strenght using low sound average frequency (bass) 
        this.bloomPass.strength = (this.experience.audioAnalizer.averageFrequency[2] / 255);
        // Set bloom radius using a sine wave and time to go from -1.5 to 3.5
        this.bloomPass.radius = -1.5 + (Math.sin(this.time.elapsed / 10000) * 5.5);

        this.effectComposer.render();
    }
}