import { Effect, BlendFunction, EffectAttribute } from "postprocessing";
import * as THREE from 'three'
import ColorCorrectionFragment from "../Shaders/PostProcessing/ColorCorrection/ColorCorrectionFragment.glsl"

/**
 * Color correction for pmndr postprocessing...
 */

export default class ColorCorrectionEffect extends Effect {

	constructor() {
		super("ColorCorrectionEffect", ColorCorrectionFragment,
			{
				blendFunction: BlendFunction.ADD,
//				attributes: EffectAttribute.CONVOLUTION,
				uniforms : new Map([
					[ "powRGB" , new THREE.Uniform(new THREE.Vector3( 3, 3, 4 )) ],
					[ "mulRGB" , new THREE.Uniform(new THREE.Vector3( 2, 2, 5 )) ],
					[ "addRGB" , new THREE.Uniform(new THREE.Vector3( 0.05, 0.05, 0.25 )) ]
				]),
/*				uniforms : {
					"powRGB" : { "value"  : new THREE.Vector3( 3, 3, 4 ) },
					"mulRGB" : { "value"  : new THREE.Vector3( 2, 2, 5 ) },
					"addRGB" : { "value"  : new THREE.Vector3( 0.05, 0.05, 0.25 ) },
				}*/
			}
		)
	}

};


