import * as dat from 'lil-gui'
import options from '../Config/options.js'
import Experience from '../Experience.js'
import { TetrahedralUpscaler } from 'postprocessing';

export default class Debug {
    constructor() {
        this.experience = new Experience();
        this.setup();
    }

    setup() {
        this.gui = new dat.GUI({ width : 300 });

        this.setupSpirals();
        this.setupSun();
        this.setupPostProcessing();
        this.setupBloom(true);

        this.setupPostProcessingPmndrs();
        this.setupBloomPmndrs();
        this.setupGodRaysPmndrs();
        this.setupShockWavePmndrs();
    }

    setupPostProcessing(open = false) {
        this.postProcessing = this.gui.addFolder("Post processing").open(open);
    }

    setupBloom(open = false) {
        if (open === true) this.postProcessing.open(true);
        this.bloom = this.experience.renderer.bloomPass;
        this.bloomUI = this.postProcessing.addFolder("Unreal Bloom").open(open);
        this.bloomUI.add(this.experience.options, 'bloomStrength').min(-15).max(15).step(0.01).name("Strength").onChange(() => {
            this.bloom.strength = this.experience.options.bloomStrength;
        });
        this.bloomUI.add(this.experience.options, 'bloomRadius').min(-15).max(15).step(0.01).name("Radius").onChange(() => {
            this.bloom.radius = this.experience.options.bloomRadius;
        });
        this.bloomUI.add(this.experience.options, 'bloomThreshold').min(0).max(1).step(0.001).name("Threshold").onChange(() => {
            this.bloom.threshold = this.experience.options.bloomThreshold;
        });
        this.bloomUI.add(this.experience.options, 'bloomEnabled').name("Enabled").onChange(() => {
            this.bloom.enabled = this.experience.options.bloomEnabled;
        });

    }

    setupPostProcessingPmndrs(open = false) {
        this.postProcessingPmndrs = this.gui.addFolder("Post processing (pmndrs)").open(open);
    }

    setupShockWavePmndrs(open = false) {
        if (open === true) this.postProcessingPmndrs.open(true);
        this.shockWavePmndrs = this.experience.renderer.shockWaveEffect;
        this.shockWavePmndrsUI = this.postProcessingPmndrs.addFolder("ShockWave (Pmndrs)").open(open);

        this.shockWavePmndrsUI.add(this.experience.options, 'shockWaveSpeed').min(0.1).max(15).step(0.01).name("Speed").onChange(() => {
            this.shockWavePmndrs.speed = this.experience.options.shockWaveSpeed;
        });
        this.shockWavePmndrsUI.add(this.experience.options, 'shockWaveMaxRadius').min(0.1).max(5).step(0.01).name("Max radius").onChange(() => {
            this.shockWavePmndrs.maxRadius = this.experience.options.shockWaveMaxRadius;
        });
        this.shockWavePmndrsUI.add(this.experience.options, 'shockWaveWaveSize').min(0.1).max(5).step(0.01).name("Wave size").onChange(() => {
            this.shockWavePmndrs.waveSize = this.experience.options.shockWaveWaveSize;
        });
        this.shockWavePmndrsUI.add(this.experience.options, 'shockWaveAmplitude').min(0.01).max(30).step(0.01).name("Amplitude").onChange(() => {
            this.shockWavePmndrs.amplitude = this.experience.options.shockWaveAmplitude;
        });

/*        // Shock wave (postprocessing)
    shockWaveSpeed                  : 2,
    shockWaveMaxRadius              : 1,
    shockWaveWaveSize               : 0.2,
    shockWaveAmplitude              : 0.05,*/

    }

    setupBloomPmndrs(open = false) {
        if (open === true) this.postProcessingPmndrs.open(true);
        this.bloomPmndrs = this.experience.renderer.bloomEffect;

        this.bloomPmndrsUI = this.postProcessingPmndrs.addFolder("Bloom (Pmndrs)").open(open);
        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsIntensity').min(-2.0).max(2).step(0.01).name("Intensity").onChange(() => {
            this.bloomPmndrs.intensity = this.experience.options.bloomPmndrsIntensity;
        });
        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsThreshold').min(-15.0).max(15).step(0.01).name("Threshold").onChange(() => {
            this.bloomPmndrs.luminanceMaterial.threshold = this.experience.options.bloomPmndrsThreshold;
        });
        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsSmoothing').min(-15.0).max(15).step(0.01).name("Smoothing").onChange(() => {
            this.bloomPmndrs.luminanceMaterial.smoothing = this.experience.options.bloomPmndrsSmoothing;
        });
        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsRadius').min(-2.0).max(2).step(0.01).name("Radius").onChange(() => {
            this.bloomPmndrs.mipmapBlurPass.radius = this.experience.options.bloomPmndrsRadius;
        });
        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsEnabled').name("Enabled").onChange(() => {
            if (this.experience.options.bloomPmndrsEnabled === true) 
                this.experience.renderer.effectComposer.addPass(this.experience.renderer.bloomPass);
            else 
                this.experience.renderer.effectComposer.removePass(this.experience.renderer.bloomPass);
        });

    }

    setupGodRaysPmndrs(open = false) {
        if (open === true) this.postProcessingPmndrs.open(true);
        this.godRaysPmndrs = this.experience.renderer.godRaysEffect;

        this.godRaysPmndrsUI = this.postProcessingPmndrs.addFolder("God Rays (Pmndrs)").open(open);
        this.godRaysPmndrsUI.add(this.experience.options, 'godRaysDensity').min(-5.0).max(5).step(0.1).name("Density").onChange(() => {
            this.godRaysPmndrs.godRaysMaterial.density = this.experience.options.godRaysDensity;
        });
        this.godRaysPmndrsUI.add(this.experience.options, 'godRaysDecay').min(0).max(1).step(0.01).name("Decay").onChange(() => {
            this.godRaysPmndrs.godRaysMaterial.decay = this.experience.options.godRaysDecay;
        });
        this.godRaysPmndrsUI.add(this.experience.options, 'godRaysWeigth').min(-5.0).max(5).step(0.1).name("Weigth").onChange(() => {
            this.godRaysPmndrs.godRaysMaterial.weight = this.experience.options.godRaysWeigth;
        });
        this.godRaysPmndrsUI.add(this.experience.options, 'godRaysExposure').min(-5.0).max(5).step(0.1).name("Exposure").onChange(() => {
            this.godRaysPmndrs.godRaysMaterial.weight = this.experience.options.godRaysExposure;
        });
        this.godRaysPmndrsUI.add(this.experience.options, 'godRaysClampMax').min(-5.0).max(5).step(0.1).name("Max intensity").onChange(() => {
            this.godRaysPmndrs.godRaysMaterial.clampMax = this.experience.options.godRaysClampMax;
        });
        this.godRaysPmndrsUI.add(this.experience.options, 'godRaysSamples').min(1).max(200).step(1).name("Samples").onChange(() => {
            this.godRaysPmndrs.godRaysMaterial.samples = this.experience.options.godRaysSamples;
        });
/*        this.godRaysUI.add(this.experience.options, 'godRaysEnabled').name("Enabled").onChange(() => {
            if (this.experience.options.godRaysEnabled === true) 
                this.experience.renderer.effectComposer.addPass(this.experience.renderer.godRaysPass);
            else 
                this.experience.renderer.effectComposer.removePass(this.experience.renderer.godRaysPass);
        });*/
    
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