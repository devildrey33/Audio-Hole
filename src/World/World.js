//import * as THREE from "three"
import Experience from '../Experience.js'
import Spirals from './Spirals.js';
import Sun from './Sun.js';
import RaysToHole from "./RaysToHole.js";
import HMLBars from './HMLBars.js';
import HMLOsciloscope from './HMLOsciloscope.js';
import BPMEffects from './BPMEffects/BPMEffects.js';

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
//        this.ready      = false;
        // setup
        this.setup();     

    }        



    setup() {
        this.spirals = new Spirals(this);
        this.sun     = new Sun(this);
        // Create empty temporal function to update rays (because whe need his texture)
//        this.rays    = { update : () => { } }
//        this.osciloscpe = new Arrowciloscope(new THREE.Color(200, 100, 0), 1, 0.1);
        this.raysToHole = new RaysToHole();

//        this.bars = new Bars3D(this);
        this.hmlBars = new HMLBars(this);

        this.hmlOsciloscope = new HMLOsciloscope();

        this.bpmEffects     = new BPMEffects();


//        this.voronoiBackground = new VoronoiBackground();
    }

    // All resources are loaded
    resourcesLoaded() {
//        this.rays = new Rays();
    }

    update() {
        //if (this.ready === true) {
            this.bpmEffects.update();

            this.spirals.update();
            this.sun.update();
//            this.rays.update();
            this.raysToHole.update();
            this.hmlOsciloscope.update();
            this.hmlBars.update();
//            this.voronoiBackground.update();
//        }
    }


}