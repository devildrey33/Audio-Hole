import { Effect, BlendFunction, EffectAttribute } from "postprocessing";
import * as THREE from 'three'
import MirrorModeFragment from "./MirrorModeFragment.glsl"

/**
 * Mirror effect for the solo
 */

export default class ColorCorrectionEffect extends Effect {

	constructor() {
		super("MirrorModeEffect", MirrorModeFragment,
			{
				blendFunction: BlendFunction.ADD,
//				attributes: EffectAttribute.CONVOLUTION,
				uniforms : new Map([
					[ "uEnabled"   , new THREE.Uniform(0.0) ],
					[ "uStartTime" , new THREE.Uniform(0.0) ],
					[ "uTime"      , new THREE.Uniform(0.0) ]
				]),
			}
		)
	}

};


