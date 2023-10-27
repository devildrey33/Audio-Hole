import * as THREE from 'three'
//import BPMGodRays from "./BPMGodRays.js";
import BPMBloom from "../BPMBloom.js";
import BPMSpiralsScale from "../BPMSpiralsScale.js";
//import BPMSpiralsPosition from "./BPMSpiralsPosition.js";
import BPMSpiralBars from "../BPMSpiralBars.js";
import BPMSpiralOsciloscope from "../BPMSpiralOsciloscope.js";
import BPMLateralBars from "../BPMLateralBars.js";
import BPMColorCorrection from "../BPMColorCorrection.js"
import BPMMirror from "../BPMMirror.js"


export default class killCityKills {
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
        {   // Slow color correction to blue
            start : 1, end : 30,
            effect : new BPMColorCorrection({ destPow : [3, 3, 8], destMul : [2, 2, 15], destAdd : [0.05, 0.05, 0.5] })
        },
        {   // batery
            start : 8.5, end : 9.0,
            effect : new BPMSpiralsScale({ scaleX : 2, scaleZ : 0.65, ease : "bounce" })
        },
        {   // batery
            start : 9, end : 9.5,
            effect : new BPMSpiralsScale({ scaleZ : 3, scaleX : 0.75, scaleY : 0.63, ease : "bounce" })
        },
        {   // batery
            start : 12, end : 12.5,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" }) //effect : new BPMSpiralsScale({ scaleX : 0.375, ease : "bounce" })
        },
        {   // bass changing rithm
            start : 24.75, end : 25.25,            
            effect : new BPMSpiralsScale({ scaleX : 3.5, ease : "bounce" })
        },

        {   // first yell
            start : 33, end : 41, 
            effect : new BPMSpiralOsciloscope({ audioStrength : 1.75, thickness : 0.15, color : new THREE.Color(2,2,0) })
        },
        {   // end first yell and begin of a second mini yell
            start : 49, end : 51, 
            effect : new BPMSpiralOsciloscope({ audioStrength : 1.5, thickness : 0.2, color : new THREE.Color(2,0,0) })
        },
        {   // woooOOO
            start : 73, end : 81, 
            effect : new BPMMirror({ animationIn : 1.0, animationOut : 2.5 })
        },    
        {   // woooOOO
            start : 89, end : 98, 
            effect : new BPMMirror({ animationIn : 1.0, animationOut : 2.5 })
        },   
        
        
        {   // 
            start : 89, end : 93, 
            effect : new BPMBloom({ destIntensity : 2.48, destRadius : 1.15, yoyo : true })
        },            
        {   // right
            start : 113.5,  end : 115,
            effect : new BPMColorCorrection({
                originPow : [3, 3, 8], originMul : [2, 2, 15] , originAdd : [0.05, 0.05, 0.5], 
                destPow   : [8, 3, 8], destMul   : [15, 2, 15], destAdd   : [0.6, 0.05, 0.5],
                yoyo : true 
            })
        },
        {   // right
            start : 114,  end : 114.5,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" })
        },
        {   // right
            start : 114,  end : 114.25,
            effect : new BPMSpiralsScale({ scaleX : 2.3, scaleZ : 0.75, ease : "bounce-inOut" })
        },
        {   // 
            start : 144, end : 146, 
            effect : new BPMBloom({ destIntensity : 1.48, destRadius : 1.15, yoyo : true })
        },            
        {   // hey
            start : 144.5, end : 145,
            effect : new BPMSpiralBars({ destThickness : 0.15, destAudioStrength : 0.75, ease : "bounce" })
        },
        {   // hey
            start : 144.5, end : 145,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" })
        },

        {   // Last hey add a mirror
            start : 144.5, end : 145, 
            effect : new BPMSpiralBars({ originMirrors : 1, destMirrors : 2,  yoyo : false })
        },            

        {   // hey
            start : 145.5, end : 146,
            effect : new BPMSpiralBars({ originMirrors : 2, destMirrors : 2, destThickness : 0.15, destAudioStrength : 0.75, ease : "bounce" })
        },           
        {   // hey
            start : 145.5, end : 146,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" })
        },
        {
            start : 161.5, end : 162,
            effect : new BPMSpiralsScale({ scaleX : 2.3, scaleY : 1.3, scaleZ : 0.75, ease : "bounce-inOut" })
        },            
        {   // woooOOO
            start : 175, end : 182, 
            effect : new BPMMirror({ animationIn : 1.0, animationOut : 2.5 })
        },     

        //start : 312.5, end : 313.5, 
        {   // mayday
            start : 182.5, end : 184, 
            effect : new BPMBloom({ destIntensity : -1.1, destRadius : -1.85, yoyo : true })
        },
        {   // mayday
            start : 184.5, end : 185.5,
            effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
        },
        {   // oneday
            start : 192.5, end : 194,
            effect : new BPMBloom({ destIntensity : 3, destRadius : 1.35, yoyo : true })
        },

        {   // woooOOO
            start : 202, end : 211, 
            effect : new BPMMirror({ animationIn : 1.0, animationOut : 2.5 })
        },            
        {   // wuah
            start : 211, end : 211.5,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" })
        },
        {   // woooOOO
            start : 218, end : 227.5, 
            effect : new BPMMirror({ animationIn : 1.0, animationOut : 2.5, displacement : 0.35 })
        },    
        {   // right
            start : 243.5,  end : 245,
            effect : new BPMColorCorrection({
                originPow : [3, 3, 8], originMul : [2, 2, 15] , originAdd : [0.05, 0.05, 0.5], 
                destPow   : [8, 3, 8], destMul   : [15, 2, 15], destAdd   : [0.6, 0.05, 0.5],
                yoyo : true 
            })
        },
        {   // right
            start : 244,  end : 244.5,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" })
        },
        {   // right
            start : 244,  end : 244.25,
            effect : new BPMSpiralsScale({ scaleX : 2.3, scaleZ : 0.75, ease : "bounce-inOut" })
        },

        {   // hey
            start : 274, end : 274.75,
            effect : new BPMSpiralsScale({ scaleX : 3.5, ease : "bounce" })
        },
        {   // hey
            start : 274.75, end : 275.5,
            effect : new BPMSpiralsScale({ scaleZ : 2.75, ease : "bounce" })
        },

        {   // now!
            start : 291, end : 291.5,
            effect : new BPMBloom({ destIntensity : 3, destRadius : 1.35, yoyo : true })
        },
        {   // now!
            start : 291.25, end : 291.75,
            effect : new BPMLateralBars({ position : 25, ease : "bounce" }) //effect : new BPMSpiralsScale({ scaleX : 0.375, ease : "bounce" })
        },

        {   // woooOOO
            start : 304, end : 311.5, 
            effect : new BPMMirror({ animationIn : 1.0, animationOut : 2.5 })
        },    

        {   // mayday
            start : 312.5, end : 313.5, 
            effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
        },
        {   // mayday
            start : 314.5, end : 315.5,
            effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
        },
        {   // oneday
            start : 322.5, end : 324,
            effect : new BPMBloom({ destIntensity : 3, destRadius : 1.35, yoyo : true })
        },

        {   // woooOOO
            start : 326, end : 337, 
            effect : new BPMMirror({ animationIn : 0.5, animationOut : 1.5, displacement : 0.025 })
        },    

        {   // woooOOO
            start : 341, end : 354, 
            effect : new BPMMirror({ animationIn : 0.5, animationOut : 1.5, displacement : 0.02 })
        },    

        {   // yell
            start : 356, end : 361, 
            effect : new BPMSpiralOsciloscope({ audioStrength : .75, thickness : 0.25, color : new THREE.Color(0,2,3) })
        },
        


/*        {   // Guitar solo mirror 1
            start : 390, end : 407, 
            effect : new BPMMirror({ animationIn : 1.0, animationOut : 2.5, displacement : 0.05})
        },            */
               
        {   // Guitar solo (ends 423)
            start : 390, end : 394, 
            effect : new BPMSpiralBars({ destThickness : 0.25, originMirrors : 2, destMirrors : 24, destAudioStrength : 0.5, yoyo : false })
        },            
        {   // Guitar solo bloom 1
            start : 390, end : 394, 
            effect : new BPMBloom({ destIntensity : -1.5, destRadius : 0.65, yoyo : false })
        },            

        {   // Guitar solo first end
            start : 394, end : 395,
            effect : new BPMLateralBars({ position : 50, ease : "elastic" })
        },
        {   // end of mirror grow
            start : 394.5, end : 395, 
            effect : new BPMSpiralsScale({ scaleZ : 2.75, ease : "bounce" })
        },            
        { // set to pink
            start : 394,  end : 395,
            effect : new BPMColorCorrection({ 
                originPow : [3, 3, 8], originMul : [2, 2, 15], originAdd : [0.05, 0.05, 0.5], 
                destPow   : [3, 3, 3], destMul   : [2, 2, 2] , destAdd   : [0.35, 0.27, 0.5] 
            })
        },

        {   // Solo guitar acord
            start : 398, end : 398.5, 
            effect : new BPMSpiralsScale({ scaleY : 1.5, ease : "bounce" })
        },            

        {   // remove thickness
            start : 399, end : 402, 
            effect : new BPMSpiralBars({ originAudioStrength : 0.5, destAudioStrength : 0.5, originThickness : 0.25, originMirrors : 24, destMirrors : 24, destThickness : 0.15,  yoyo : false })
        },            
        {   // Guitar solo bloom 2
            start : 404, end : 408, 
            effect : new BPMBloom({ originIntensity : -1.5, originRadius : 0.65, destIntensity : 2, destRadius : 1.12,  yoyo : false })
        },            
        {   // Guitar solo (ends 423)
            start : 406, end : 415, 
            effect : new BPMSpiralBars({ originAudioStrength : 0.5, originThickness : 0.15,  originMirrors : 24, destMirrors : 3,  yoyo : false })
        },            
        {   // Solo guitar achord
            start : 406, end : 406.5, 
            effect : new BPMSpiralsScale({ scaleX : 1.75, ease : "bounce" })
        },            
        {   // Solo guitar achord
            start : 410, end : 410.5, 
            effect : new BPMSpiralsScale({ scaleX: 0.25, ease : "bounce" })
        },            
        {   // Guitar solo mirror 2
            start : 413, end : 423, 
            effect : new BPMMirror({ animationIn : 1.0, animationOut : 2.5, displacement : 0.2 })
        },    
    

        { // revert color correction to normal blue
            start : 414,  end : 420,
            effect : new BPMColorCorrection({ 
                originPow : [3, 3, 3], originMul : [2, 2, 2] , originAdd : [0.35, 0.27, 0.5], 
                destPow   : [3, 3, 8], destMul   : [2, 2, 15], destAdd   : [0.05, 0.05, 0.5], 
            })
        },


        {   // Guitar solo (ends 423)
            start : 419, end : 423, 
            effect : new BPMBloom({ originIntensity : 2, originRadius : 1.12, yoyo : false })
        },            
        {   // batery
            start : 430, end : 430.5,
            effect : new BPMSpiralsScale({ scaleX : 2, scaleZ : 0.65, ease : "bounce" })
        },
        {   // batery
            start : 430.5, end : 431,
            effect : new BPMSpiralsScale({ scaleZ : 3, scaleX : 0.75, scaleY : 0.63, ease : "bounce" })
        },
        {   // batery
            start : 434, end : 434.5,
            effect : new BPMSpiralsScale({ scaleX : 0.375, ease : "bounce" })
        },


        {   // are you ready
            start : 445,  end : 449,
            effect : new BPMColorCorrection({
                originPow : [3, 3, 8], originMul : [2, 2, 15] , originAdd : [0.05, 0.05, 0.5], 
                destPow   : [3, 8, 8], destMul   : [2, 15, 15],  destAdd   : [0.05, 0.5, 0.5],
                yoyo : true 
            })
        },

        {   // bass changing rithm
            start : 446.75, end : 447.25,            
            effect : new BPMSpiralsScale({ scaleX : 3.5, ease : "bounce" })
        },


        {   // yell
            start : 454, end : 460, 
            effect : new BPMSpiralOsciloscope({ audioStrength : .75, thickness : 0.15, color : new THREE.Color(2,0,0) })
        },

        {   // woooOOO
            start : 467, end : 473, 
            effect : new BPMMirror({ animationIn : 0.5, animationOut : 1.5 })
        },    


        {   // mayday
            start : 475, end : 476, 
            effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
        },
        {   // mayday
            start : 477.5, end : 478.5,
            effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
        },
        {   // oneday
            start : 485.5, end : 487,
            effect : new BPMBloom({ destIntensity : 3, destRadius : 1.35, yoyo : true })
        },

        {   // woooOOO
            start : 488, end : 499, 
            effect : new BPMMirror({ animationIn : 0.5, animationOut : 1.5, displacement : 0.065 })
        },    
        
        {   // woooOOO
            start : 503, end : 514, 
            effect : new BPMMirror({ animationIn : 0.5, animationOut : 1.5, displacement : 0.065 })
        },    
        


        {   // yell
            start : 520, end : 521, 
            effect : new BPMSpiralOsciloscope({ audioStrength : 1.5, thickness : 0.15, color : new THREE.Color(2,0,0) })
        },
        {   // yell
            start : 535, end : 540, 
            effect : new BPMSpiralOsciloscope({ audioStrength : 1.75, thickness : 0.2, color : new THREE.Color(0,0,2) })
        },


        {   // end yell
            start : 553, end : 556, 
            effect : new BPMSpiralOsciloscope({ audioStrength : 1.5, thickness : 0.15, color : new THREE.Color(2,0,0) })
        },

        {   // end
            start : 553.5,  end : 554,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" })
        },
        {   // end
            start : 553,  end : 553.5,
            effect : new BPMSpiralsScale({ scaleX : 2.3, scaleZ : 0.75, ease : "bounce-inOut" })
        },


        { // invert first blue color correction to black
            start : 560,  end : 561,
            effect : new BPMColorCorrection({ 
                originPow : [3, 3, 8], originMul : [2, 2, 15], originAdd : [0.05, 0.05, 0.5], 
                destPow   : [3, 3, 3], destMul   : [2, 2, 2] , destAdd   : [0.05, 0.05, 0.05] 
            })
        }
    ]
}