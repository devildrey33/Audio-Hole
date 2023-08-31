//import * as THREE from "three"
import Experience from '../Experience.js'
//import Arrowciloscope from './Arrowciloscope.js';
import Spirals from './Spirals.js';
import Sun from './Sun.js';
import ToHole from "./ToHole.js";

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

        this.ready = true;
    }        

    setup() {

        this.spirals = new Spirals(this);
        this.sun     = new Sun(this);
//        this.osciloscpe = new Arrowciloscope(new THREE.Color(200, 100, 0), 1, 0.1);
        this.toHole = new ToHole();
    }

    update() {
        if (this.ready === true) {
            this.spirals.update();
            this.sun.update();
            this.toHole.update();
        }
    }

}