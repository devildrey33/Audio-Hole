import * as THREE from "three"
import Experience from '../Experience.js'
import Spirals from './Spirals.js';
import Sun from './Sun.js';
import RaysToHole from "./RaysToHole.js";
import HMLBars from './HMLBars.js';
import HMLOsciloscope from './HMLOsciloscope.js';
import BPMEffects from './BPMEffects/BPMEffects.js';
import gsap from 'gsap';
import { RoughEase } from "gsap/EasePack";
//import DebugEffects from '../Utils/DebugEffect.js';
import Background from './Background.js';

//import VoronoiBackground from './VoronoiBackground.js';


export default class World {
    constructor() {
        this.experience = new Experience();
        this.canvas     = this.experience.canvas;
        this.scene      = this.experience.scene;
        this.resources  = this.experience.resources;
        this.camera     = this.experience.camera.instance;
        this.sizes      = this.experience.sizes;
        this.time       = this.experience.time;
        // World ready
        this.ready      = false;
        // setup
        this.setup();     

    }        



    setup() {
        this.group = new THREE.Group();
        this.scene.add(this.group);
        // Setup gsap plugins
        gsap.registerPlugin(RoughEase);
        // Create a gsap timeline
        gsap.ticker.remove(gsap.updateRoot);
        this.timeline = gsap.timeline();

        this.spirals = new Spirals(this);

        this.sun     = new Sun(this);

        this.raysToHole = new RaysToHole();

        this.hmlBars = new HMLBars(this);

        this.hmlOsciloscope = new HMLOsciloscope(this);

        this.bpmEffects = new BPMEffects(this);
        // Current song channels
        this.songChannels = this.bpmEffects.songChannels[this.experience.currentSong];

        this.background = new Background(this);
    }

    // All resources are loaded
    resourcesLoaded() {
        this.background.updateBackground();
        this.ready = true;
    }

    update() {
//        if (this.ready === true) {
//        }
        const delta = this.time.delta / 1000;
            
        this.timeline.time(this.experience.audioAnalizer.channelSong.song.currentTime);

        this.background.update(delta);

        this.spirals.update(delta);
        this.sun.update(delta);
        this.raysToHole.update();
        this.hmlOsciloscope.update(delta);
        this.hmlBars.update(delta);

        // Rotate all elements in the group
        this.group.rotation.z += this.time.delta / 7500;
    }


    asociateChannels (){
        // Asociate song channels with his world object
        this.songChannels = this.bpmEffects.songChannels[this.experience.currentSong];
        this.hmlBars.material.uniforms.uAudioTexture.value = this.songChannels.LateralBars1.bufferCanvasLinear.texture;
        this.hmlBars.material.uniforms.uAudioTexture2.value = this.songChannels.LateralBars2.bufferCanvasLinear.texture;
        this.hmlOsciloscope.material.uniforms.uAudioTexture.value = this.songChannels.LateralOsciloscope.bufferCanvasLinear.texture;
        this.sun.material.uniforms.uAudioTexture.value = this.songChannels.Sun.bufferCanvasLinear.texture;
        this.spirals.material.uniforms.uAudioTexture.value = this.songChannels.SpiralBars.bufferCanvasLinear.texture;
        this.spirals.material.uniforms.uAudioTexture2.value = this.songChannels.SpiralOsciloscope.bufferCanvasLinear.texture;    
    }

    setupSong() {
        this.asociateChannels();

        // Recalculate animations
        this.timeline.kill();
        this.timeline = gsap.timeline();

        this.bpmEffects.RecalculateAnimations(this.timeline);  
//        this.hmlBars.RecalculateAnimations(this.timeline);   
//        this.hmlOsciloscope.RecalculateAnimations(this.timeline);
    }
}