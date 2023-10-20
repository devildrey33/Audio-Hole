export default class SixFeetUnder {
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
    ]
}