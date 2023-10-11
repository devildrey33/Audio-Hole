//import * as THREE from "three"
import Experience from "../Experience";
import Rays from "./Rays.js";


export default class RaysToHole {

    constructor() {
        this.experience = new Experience();
        this.numRays = this.experience.options.numRays;

//        this.time  = this.experience.time;
//        this.world = world;
        this.setup();
    }

    setup() {
        this.Rays = [];
        for (let i = 0; i < this.numRays; i++) {
            this.Rays.push(new Rays())
        }
    }

    update() {
        for (let i = 0; i < this.numRays; i++) {
            this.Rays[i].update();
        }
    }
}