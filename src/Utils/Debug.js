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

        this.setupSpirals(true);
        this.setupSun(true);
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
        this.godRaysUI.add(this.experience.options, 'godRaysClampMax').min(-5.0).max(5).step(0.1).name("Max intensity").onChange(() => {
            this.godRays.godRaysMaterial.clampMax = this.experience.options.godRaysClampMax;
        });
        this.godRaysUI.add(this.experience.options, 'godRaysSamples').min(1).max(200).step(1).name("Samples").onChange(() => {
            this.godRays.godRaysMaterial.samples = this.experience.options.godRaysSamples;
        });
    
    }

    setupSun(open = false) {
        this.sun = this.experience.world.sun;

        this.SunUI = this.gui.addFolder("Sun").open(open);        
        this.SunUI.add(this.experience.options, 'sunAudioStrengthSin').min(0).max(8).step(0.1).name("Audio strength").onChange(() => {
            this.sun.material.uniforms.uAudioStrengthSin.value = this.experience.options.sunAudioStrengthSin;
        });
        this.SunUI.add(this.experience.options, 'sunAudioStrengthFreq').min(0).max(8).step(0.1).name("Audio strength plasma").onChange(() => {
            this.sun.material.uniforms.uAudioStrengthFreq.value = this.experience.options.sunAudioStrengthFreq;
        });
        this.SunUI.add(this.experience.options, 'sunNoiseStrength').min(0).max(32).step(0.1).name("Perlin noise strength").onChange(() => {
            this.sun.material.uniforms.uNoiseStrength.value = this.experience.options.sunNoiseStrength;
        });
        this.SunUI.add(this.experience.options, 'sunNoiseSpeed').min(0).max(4).step(0.1).name("Perlin noise speed").onChange(() => {
            this.sun.material.uniforms.uNoiseSpeed.value = this.experience.options.sunNoiseSpeed;
        });
        /*
    sunAudioStrengthFreq            : 1.0,
    sunAudioStrengthSin             : 1.0,
    sunNoiseStrength                : 15,
    sunNoiseSpeed                   : 1,
*/
    }

    setupSpirals(open = false) {
        this.spirals = this.experience.world.spirals;

        this.spiralBarsUI = this.gui.addFolder("Spiral Bars").open(open);        
        this.spiralBarsUI.add(this.experience.options, 'spiralAudioStrength').min(0).max(8).step(0.1).name("Audio strength").onChange(() => {
            this.spirals.material.uniforms.uAudioStrength.value = this.experience.options.spiralAudioStrength;
        });
        this.spiralBarsUI.add(this.experience.options, 'spiralAudioZoom').min(0).max(8).step(0.1).name("Audio zoom").onChange(() => {
            this.spirals.material.uniforms.uAudioZoom.value = this.experience.options.spiralAudioZoom;
        });
        this.spiralBarsUI.add(this.experience.options, 'spiralFrequency').min(0).max(4).step(0.1).name("Frequency").onChange(() => {
            this.spirals.material.uniforms.uFrequency.value = this.experience.options.spiralFrequency;
        });
        this.spiralBarsUI.add(this.experience.options, 'spiralSpeed').min(0).max(4).step(0.01).name("Speed").onChange(() => {
            this.spirals.material.uniforms.uSpeed.value = this.experience.options.spiralSpeed;
        });
        this.spiralBarsUI.add(this.experience.options, 'spiralThickness').min(0.01).max(0.99).step(0.001).name("Thickness").onChange(() => {
            this.spirals.material.uniforms.uThickness.value = this.experience.options.spiralThickness;
        });

        this.spiralOsciloscopeUI = this.gui.addFolder("Spiral Osciloscope").open(open);
        this.spiralOsciloscopeUI.add(this.experience.options, 'spiralAudioStrengthSin').min(0).max(8).step(0.1).name("Audio strength").onChange(() => {
            this.spirals.material.uniforms.uAudioStrengthSin.value = this.experience.options.spiralAudioStrengthSin;
        });
        this.spiralOsciloscopeUI.add(this.experience.options, 'spiralAudioZoomSin').min(0).max(8).step(0.1).name("Audio zoom").onChange(() => {
            this.spirals.material.uniforms.uAudioZoomSin.value = this.experience.options.spiralAudioZoomSin;
        });
        this.spiralOsciloscopeUI.add(this.experience.options, 'spiralFrequencySin').min(0).max(4).step(0.1).name("Frequency").onChange(() => {
            this.spirals.material.uniforms.uFrequencySin.value = this.experience.options.spiralFrequencySin;
        });
        this.spiralOsciloscopeUI.add(this.experience.options, 'spiralSpeedSin').min(0).max(4).step(0.01).name("Speed").onChange(() => {
            this.spirals.material.uniforms.uSpeedSin.value = this.experience.options.spiralSpeedSin;
        });
/*        this.spiralOsciloscopeUI.add(this.experience.options, 'spiralThicknessSin').min(0).max(0.5).step(0.001).name("Thickness").onChange(() => {
            this.spirals.material.uniforms.uThicknessSin.value = this.experience.options.spiralThicknessSin;
        });*/

    }

}