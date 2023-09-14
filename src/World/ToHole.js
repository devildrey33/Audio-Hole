//import * as THREE from "three"
//import Experience from "../Experience";
import Arrowciloscope from "./Arrowciloscope";


export default class ToHole {
    numArrows = 50;

    constructor() {
//        this.experience = new Experience();
//        this.time  = this.experience.time;
//        this.world = world;
        this.setup();
    }

    setup() {
        this.Arrowciloscopes = [];
        for (let i = 0; i < this.numArrows; i++) {
            this.Arrowciloscopes.push(new Arrowciloscope())
        }
    }

    update() {
        for (let i = 0; i < this.numArrows; i++) {
            this.Arrowciloscopes[i].update();
        }
    }
}