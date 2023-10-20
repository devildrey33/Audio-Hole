export default class NothingsOver {
    constructor(audioAnalizer) {        
        this.channels = {
            LateralBars1       : audioAnalizer.channelOther,
            LateralBars2       : audioAnalizer.channelPiano,
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