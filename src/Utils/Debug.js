import * as dat from 'lil-gui'
import Experience from '../Experience.js'

export default class Debug {
    constructor() {
        this.experience = new Experience();
        this.setup();
    }

    setup() {
        this.gui = new dat.GUI({ 
            width : 300, 
            container : this.experience.htmlElements.elementExperience 
        });

        this.setupAudioChannels();

        this.setupSpirals();
        this.setupSun();
        this.setupLateralBars();
        this.setupLateralOsciloscope();
        
//        this.setupPostProcessing();
//        this.setupBloom();

        this.setupPostProcessingPmndrs();
        this.setupBloomPmndrs();
        this.setupGodRaysPmndrs();
//        this.setupShockWavePmndrs();
        this.setupColorCorrectionPmndrs();

/*        let buba = { value : "Buba1" }
        const bubas = {
            Buba1 : "fuckOff1",
            Buba2 : "fuckOff2",
            Buba3 : "fuckOff3",
            Buba4 : "fuckOff4",
            Buba5 : "fuckOff5"
        }

        this.gui.add(buba, 'value', bubas).name("Bubaface").onChange(() => {
            this.experience.world.background2.name = buba.value;
            this.experience.world.background2.updateBackground();
        });

        this.bubapacity = 0.125;
        this.gui.add(this, 'bubapacity').min(0.025).max(1).name("Bubapacity").onChange(() => {
            this.experience.world.background2.material.uniforms.uAlpha.value = this.bubapacity;
        });*/
    }

    setupLateralBars(open = false) {
        this.lateralBars = this.experience.world.hmlBars;
        this.lateralBarsUI = this.gui.addFolder("Lateral Bars").open(open);
        
        this.lateralBarsUI.add(this.experience.options, 'barsAudioStrength').min(0).max(8).step(0.1).name("Audio strength").onChange(() => {
            this.lateralBars.material.uniforms.uAudioStrength.value = this.experience.options.barsAudioStrength;
        });
        this.lateralBarsUI.add(this.experience.options, 'barsAudioZoom').min(0).max(8).step(0.1).name("Audio zoom").onChange(() => {
            this.lateralBars.material.uniforms.uAudioZoom.value = this.experience.options.barsAudioZoom;
        });
        this.lateralBarsUI.add(this.experience.options, 'barsSpeed').min(0.01).max(8).step(0.1).name("Speed").onChange(() => {
            this.lateralBars.material.uniforms.uSpeed.value = this.experience.options.barsSpeed;
        });
    
    }

    setupLateralOsciloscope(open = false) {
        this.lateralOsciloscope = this.experience.world.hmlOsciloscope;
        this.lateralOsciloscopeUI = this.gui.addFolder("Lateral Osciloscope").open(open);

        this.lateralOsciloscopeUI.add(this.experience.options, 'hmsOsciloscopeAudioStrength').min(0).max(8).step(0.1).name("Audio strength").onChange(() => {
            this.lateralOsciloscope.material.uniforms.uAudioStrength.value = this.experience.options.hmsOsciloscopeAudioStrength;
        });
        this.lateralOsciloscopeUI.add(this.experience.options, 'hmsOsciloscopeSpeed').min(0.01).max(8).step(0.1).name("Speed").onChange(() => {
            this.lateralOsciloscope.material.uniforms.uSpeed.value = this.experience.options.hmsOsciloscopeSpeed;
        });
    
    }

    setupAudioChannels(open = false) {
        this.world = this.experience.world;
        this.audioAnalizer = this.experience.audioAnalizer;
        this.audioChannels = this.gui.addFolder("Audio Channels").open(open);
        
        this.fftOptions = {
            "32768" : 32768, "16384" : 16384, "8192" : 8192, 
            "4096" : 4096, "2048" : 2048, "1024" : 1024, "512" : 512
        }

        this.fftSize = { value : this.experience.options.audioFFTSize }

        this.channelOptions = {
            All   : 0,
            Bass  : 1,
            Drum  : 2,
            Other : 3,
            Piano : 4,
            Vocal : 5,
        };
        this.LateralBar1        = { value : 'Other' }
        this.LateralBar2        = { value : 'Bass' }
        this.LateralOsciloscope = { value : 'Drum' }
        this.Sun1               = { value : 'Vocal' }
        this.Sun2               = { value : 'Vocal' } 
        this.SpiralBars         = { value : 'All' }
        this.SpiralOsciloscope  = { value : 'Vocal' }

        this.audioChannels.add(this.LateralBar1, 'value', this.channelOptions).name("Lateral bars 1").onChange(() => {
            this.world.hmlBars.material.uniforms.uAudioTexture.value = this.audioAnalizer.channels[this.LateralBar1.value].bufferCanvasLinear.texture;
        });
        this.audioChannels.add(this.LateralBar2, 'value', this.channelOptions).name("Lateral bars 2").onChange(() => {
            this.world.hmlBars.material.uniforms.uAudioTexture2.value = this.audioAnalizer.channels[this.LateralBar2.value].bufferCanvasLinear.texture;
        });
        this.audioChannels.add(this.LateralOsciloscope, 'value', this.channelOptions).name("Lateral osciloscope").onChange(() => {
            this.world.hmlOsciloscope.material.uniforms.uAudioTexture.value = this.audioAnalizer.channels[this.LateralOsciloscope.value].bufferCanvasLinear.texture;
        });
        this.audioChannels.add(this.Sun1, 'value', this.channelOptions).name("Sun").onChange(() => {
            this.world.sun.material.uniforms.uAudioTexture.value = this.audioAnalizer.channels[this.Sun1.value].bufferCanvasLinear.texture;
        });
        this.audioChannels.add(this.Sun2, 'value', this.channelOptions).name("Sun rays").onChange(() => {
            this.world.sun.material.uniforms.uAudioTexture.value = this.audioAnalizer.channels[this.Sun2.value].bufferCanvasLinear.texture;
        });
        this.audioChannels.add(this.SpiralBars, 'value', this.channelOptions).name("Spiral bars").onChange(() => {
            this.world.spirals.material.uniforms.uAudioTexture.value = this.audioAnalizer.channels[this.SpiralBars.value].bufferCanvasLinear.texture;
        });
        this.audioChannels.add(this.SpiralOsciloscope, 'value', this.channelOptions).name("Spiral osciloscope").onChange(() => {
            this.world.spirals.material.uniforms.uAudioTexture2.value = this.audioAnalizer.channels[this.SpiralOsciloscope.value].bufferCanvasLinear.texture;
        });

        this.audioChannels.add(this.fftSize, 'value', this.fftOptions).name("Fast fourier transform size").onChange(() => {
            this.experience.audioAnalizer.setFFTSize(this.fftSize.value);
            this.experience.world.asociateChannels();
        });
    }

    setupPostProcessingPmndrs(open = false) {
        this.postProcessingPmndrs = this.gui.addFolder("Post processing (Pmndrs)").open(open);
    }

/*    setupShockWavePmndrs(open = false) {
        if (open === true) this.postProcessingPmndrs.open(true);
        this.shockWavePmndrs = this.experience.renderer.shockWaveEffect;
        this.shockWavePmndrsUI = this.postProcessingPmndrs.addFolder("ShockWave").open(open);

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

    }*/

    setupBloomPmndrs(open = false) {
        if (open === true) this.postProcessingPmndrs.open(true);
        this.bloomPmndrs = this.experience.renderer.bloomEffect;
//        console.log(this.bloomPmndrs);

        this.bloomPmndrsUI = this.postProcessingPmndrs.addFolder("Bloom").open(open);
        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsIntensity').min(-3.0).max(3).step(0.01).name("Intensity").onChange(() => {
            this.bloomPmndrs.intensity = this.experience.options.bloomPmndrsIntensity;
        });
        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsThreshold').min(-35.0).max(35).step(0.01).name("Threshold").onChange(() => {
            this.bloomPmndrs.luminanceMaterial.uniforms.threshold.value = this.experience.options.bloomPmndrsThreshold;
        });
        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsSmoothing').min(-35.0).max(35).step(0.01).name("Smoothing").onChange(() => {
            this.bloomPmndrs.luminanceMaterial.uniforms.smoothing.value = this.experience.options.bloomPmndrsSmoothing;
        });
        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsRadius').min(-3.0).max(3).step(0.01).name("Radius").onChange(() => {
            this.bloomPmndrs.mipmapBlurPass.radius = this.experience.options.bloomPmndrsRadius;
        });
/*        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsEnabled').name("Enabled").onChange(() => {
            if (this.experience.options.bloomPmndrsEnabled === true) 
                this.experience.renderer.effectComposer.addPass(this.experience.renderer.bloomPass);
            else 
                this.experience.renderer.effectComposer.removePass(this.experience.renderer.bloomPass);
        });*/

    }

    setupGodRaysPmndrs(open = false) {
        if (open === true) this.postProcessingPmndrs.open(true);
        this.godRaysPmndrs = this.experience.renderer.godRaysEffect;

        this.godRaysPmndrsUI = this.postProcessingPmndrs.addFolder("God Rays").open(open);
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

    setupColorCorrectionPmndrs(open = false) {
        if (open === true) this.postProcessingPmndrs.open(true);
        this.colorCorrectionPmndrs = this.experience.renderer.colorCorrectionEffect;

        this.colorCorrectionPmndrsUI = this.postProcessingPmndrs.addFolder("Color correction").open(open);        
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionPowRGB, 'x').min(0).max(15).step(0.1).name("Power R").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("powRGB").value.x = this.experience.options.colorCorrectionPowRGB.x;
        });
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionPowRGB, 'y').min(0).max(15).step(0.1).name("Power G").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("powRGB").value.y = this.experience.options.colorCorrectionPowRGB.y;
        });
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionPowRGB, 'z').min(0).max(15).step(0.1).name("Power B").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("powRGB").value.z = this.experience.options.colorCorrectionPowRGB.z;
        });

        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionMulRGB, 'x').min(0).max(15).step(0.1).name("Multiplier R").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("mulRGB").value.x = this.experience.options.colorCorrectionMulRGB.x;
        });
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionMulRGB, 'y').min(0).max(15).step(0.1).name("Multiplier G").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("mulRGB").value.y = this.experience.options.colorCorrectionMulRGB.y;
        });
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionMulRGB, 'z').min(0).max(15).step(0.1).name("Multiplier B").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("mulRGB").value.z = this.experience.options.colorCorrectionMulRGB.z;
        });

        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionAddRGB, 'x').min(0).max(1).step(0.01).name("Add extra R").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("addRGB").value.x = this.experience.options.colorCorrectionAddRGB.x;
        });
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionAddRGB, 'y').min(0).max(1).step(0.01).name("Add extra G").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("addRGB").value.y = this.experience.options.colorCorrectionAddRGB.y;
        });
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionAddRGB, 'z').min(0).max(1).step(0.01).name("Add extra B").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("addRGB").value.z = this.experience.options.colorCorrectionAddRGB.z;
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
        this.spiralBarsUI.add(this.experience.options, 'spiralMirrors').min(1).max(100).step(1).name("Mirrors").onChange(() => {
            this.spirals.material.uniforms.uMirrors.value = this.experience.options.spiralMirrors;
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
        this.spiralOsciloscopeUI.add(this.experience.options, 'spiralThicknessSin').min(0.01).max(0.99).step(0.001).name("Thickness").onChange(() => {
            this.spirals.material.uniforms.uThicknessSin.value = this.experience.options.spiralThicknessSin;
        });

/*        this.spiralOsciloscopeUI.add(this.experience.options, 'spiralThicknessSin').min(0).max(0.5).step(0.001).name("Thickness").onChange(() => {
            this.spirals.material.uniforms.uThicknessSin.value = this.experience.options.spiralThicknessSin;
        });*/

    }

}