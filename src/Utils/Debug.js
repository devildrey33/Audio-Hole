import * as dat from 'lil-gui'
import options from '../Config/options.js'
import Experience from '../Experience.js'

export default class Debug {
    constructor() {
        this.experience = new Experience();
        this.setup();
    }

    setup() {
        this.gui = new dat.GUI({ width : 300 });

        this.setupBloom(true);
        this.setupGodRays(true);
    }

    setupBloom(open = false) {
        this.bloom = this.experience.renderer.bloomPass;

        this.bloomUI = this.gui.addFolder("Bloom (post processing)").open(open);
        this.bloomUI.add(this.experience.options, 'bloomIntensity').min(-5.0).max(5).step(0.1).name("Intensity").onChange(() => {
            this.bloom.intensity = this.experience.options.bloomIntensity;
        });
        this.bloomUI.add(this.experience.options, 'bloomThreshold').min(-500.0).max(500).step(0.1).name("Threshold").onChange(() => {
            this.bloom.luminanceMaterial.threshold = this.experience.options.bloomThreshold;
        });
        this.bloomUI.add(this.experience.options, 'bloomSmoothing').min(-500.0).max(500).step(0.1).name("Smoothing").onChange(() => {
            this.bloom.luminanceMaterial.smoothing = this.experience.options.bloomSmoothing;
        });
        this.bloomUI.add(this.experience.options, 'bloomRadius').min(-10.0).max(10).step(0.1).name("Radius").onChange(() => {
            this.bloom.mipmapBlurPass.radius = this.experience.options.bloomRadius;
        });

    }

    setupGodRays(open = false) {
        this.godRays = this.experience.renderer.godRaysPass;

        this.godRaysUI = this.gui.addFolder("God Rays (post processing)").open(open);
        this.godRaysUI.add(this.experience.options, 'godRaysDensity').min(-5.0).max(5).step(0.1).name("Density").onChange(() => {
            this.godRays.godRaysMaterial.density = this.experience.options.godRaysDensity;
        });
        this.godRaysUI.add(this.experience.options, 'godRaysDecay').min(0).max(1).step(0.01).name("Decay").onChange(() => {
            this.godRays.godRaysMaterial.decay = this.experience.options.godRaysDecay;
        });
        this.godRaysUI.add(this.experience.options, 'godRaysWeigth').min(-5.0).max(5).step(0.1).name("Weigth").onChange(() => {
            this.godRays.godRaysMaterial.weight = this.experience.options.godRaysWeigth;
        });
        this.godRaysUI.add(this.experience.options, 'godRaysExposure').min(-5.0).max(5).step(0.1).name("Exposure").onChange(() => {
            this.godRays.godRaysMaterial.weight = this.experience.options.godRaysExposure;
        });
        this.godRaysUI.add(this.experience.options, 'godRaysClampMax').min(-5.0).max(5).step(0.1).name("Max Intensity").onChange(() => {
            this.godRays.godRaysMaterial.clampMax = this.experience.options.godRaysClampMax;
        });
        this.godRaysUI.add(this.experience.options, 'godRaysSamples').min(1).max(200).step(1).name("Samples").onChange(() => {
            this.godRays.godRaysMaterial.samples = this.experience.options.godRaysSamples;
        });
    
    }


}