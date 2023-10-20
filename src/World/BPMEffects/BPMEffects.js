import Experience from "../../Experience.js";

import KillCityKills from "./Songs/KillCityKills.js"
import NothingsOver from "./Songs/NothingsOver.js";
import OneChance from "./Songs/OneChance.js";
import QuantumOcean from "./Songs/QuantumOcean.js";
import SixFeetUnder from "./Songs/SixFeetUnder.js";
import TheDeep from "./Songs/TheDeep.js";
import Alone from "./Songs/Alone.js";
import Lost from "./Songs/Lost.js";


export default class BPMEffects {
    constructor() {
        this.experience    = new Experience();
        this.audioAnalizer = this.experience.audioAnalizer;
    
        this.killCityKills = new KillCityKills(this.audioAnalizer);
        this.nothingsOver  = new NothingsOver(this.audioAnalizer);
        this.oneChance     = new OneChance(this.audioAnalizer);
        this.quantumOcean  = new QuantumOcean(this.audioAnalizer);
        this.sixFeetUnder  = new SixFeetUnder(this.audioAnalizer);
        this.theDeep       = new TheDeep(this.audioAnalizer);
        this.alone         = new Alone(this.audioAnalizer);
        this.lost          = new Lost(this.audioAnalizer)
    
        this.songChannels = [
            this.killCityKills.channels,
            this.nothingsOver.channels,
            this.oneChance.channels,
            this.quantumOcean.channels,
            this.sixFeetUnder.channels,
            this.theDeep.channels,
            this.alone.channels,
            this.lost.channels
        ];

        this.songsEffects = [
            this.killCityKills.effects,
            this.nothingsOver.effects,
            this.oneChance.effects,
            this.quantumOcean.effects,
            this.sixFeetUnder.effects,
            this.theDeep.effects,
            this.alone.effects,
            this.lost.effects
        ]
    }

    /* 
     * Setups all the animations of the current song in the specified timeline
     */
    RecalculateAnimations(timeline) {
        const currentSong = this.experience.currentSong;
        this.songsEffects[currentSong].forEach(element => {
            element.effect.setupAnimation(timeline, element.start, element.end);            
        });
    }

}

