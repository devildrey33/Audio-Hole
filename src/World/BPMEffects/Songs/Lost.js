import BPMBloom from "../BPMBloom.js";
import BPMSpiralsScale from "../BPMSpiralsScale.js";


export default class Lost {
    constructor(audioAnalizer) {        
        this.channels = {
            LateralBars1       : audioAnalizer.channelOther,
            LateralBars2       : audioAnalizer.channelBass,
            LateralOsciloscope : audioAnalizer.channelDrum,
            Sun                : audioAnalizer.channelVocal,
            SunRays            : audioAnalizer.channelVocal,
            SpiralBars         : audioAnalizer.channelSong,
            SpiralOsciloscope  : audioAnalizer.channelVocal
        }
    }

    effects = [
        { 
            start : 1.5, end : 2,
            effect : new BPMSpiralsScale({ scaleX : 2, scaleZ: 0.5, ease : "bounce" })
        },
        { 
            start : 9, end : 9.5,
            effect : new BPMSpiralsScale({ scaleX : 0.125, scaleZ: 2, ease : "bounce" })
        },
        { 
            start : 17, end : 17.5,
            effect : new BPMSpiralsScale({ scaleX : 2, scaleZ: 0.25, ease : "bounce" })
        },
        { 
            start : 24.5, end : 25,
            effect : new BPMSpiralsScale({ scaleX : 0.125, scaleZ: 2, ease : "bounce" })
        },
        { 
            start : 32.5, end : 33,
            effect : new BPMSpiralsScale({ scaleX : 2, scaleZ: 0.25, ease : "bounce" })
        },
        { 
            start : 40, end : 40.5,
            effect : new BPMSpiralsScale({ scaleX : 0.25, scaleZ: 2, ease : "bounce" })
        },
        { 
            start : 48, end : 48.5,
            effect : new BPMSpiralsScale({ scaleX : 2, scaleZ: 0.25, ease : "bounce" })
        },
        { 
            start : 56, end : 56.5,
            effect : new BPMSpiralsScale({ scaleX : 0.25, scaleZ: 2, ease : "bounce" })
        },
        { 
            start : 61, end : 66,
            effect : new BPMBloom({ destIntensity : 1.4, destRadius : -1.32 })
        },
        { 
            start : 72, end : 84.5,
            effect : new BPMBloom({ originIntensity : 1.4, originRadius : -1.32, destIntensity : 1.45, destRadius : 1.1 })
        },
    ]
}