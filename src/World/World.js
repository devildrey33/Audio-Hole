//import * as THREE from "three"
import Experience from '../Experience.js'
//import Arrowciloscope from './Arrowciloscope.js';
import Spirals from './Spirals.js';
import Sun from './Sun.js';
//import Rays from './Rays.js';
import ToHole from "./ToHole.js";
import Bars from './Bars.js';
import HMLOsciloscope from './HMLOsciloscope.js';
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
        this.toHole = new ToHole();

//        this.bars = new Bars3D(this);
        this.bars = new Bars(this);

        this.hmlOsciloscope = new HMLOsciloscope();

//        this.voronoiBackground = new VoronoiBackground();
    }

    // All resources are loaded
    resourcesLoaded() {
//        this.rays = new Rays();
    }

    update() {
        //if (this.ready === true) {
            this.spirals.update();
            this.sun.update();
//            this.rays.update();
            this.toHole.update();
            this.hmlOsciloscope.update();
            this.bars.update();
//            this.voronoiBackground.update();
//        }
    }


}