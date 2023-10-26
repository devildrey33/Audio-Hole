import { Effect, BlendFunction, EffectAttribute } from "postprocessing";
import * as THREE from 'three'
import MirrorModeFragment from "../Shaders/PostProcessing/MirrorMode/MirrorModeFragment.glsl"

/**
 * Mirror effect for the solo
 */

export default class ColorCorrectionEffect extends Effect {

	constructor() {
		super("MirrorModeEffect", MirrorModeFragment,
			{
				blendFunction: BlendFunction.ALPHA,
//				attributes: EffectAttribute.CONVOLUTION,
				uniforms : new Map([
					[ "uStartTime" 		  , new THREE.Uniform(0.0) ],
					[ "uEndTime"   		  , new THREE.Uniform(0.0) ],
					[ "uTime"      		  , new THREE.Uniform(0.0) ],
					[ "uTimeAnimationIn"  , new THREE.Uniform(0.0) ],
					[ "uTimeAnimationOut" , new THREE.Uniform(0.0) ],					
					[ "uSize"      		  , new THREE.Uniform(new THREE.Vector2(0, 0)) ]
				]),
			}
		)

	}

	init(startTime, endTime, width, height, animationIn = 0.5, animationOut = 0.5) {
		this.uniforms.get("uStartTime").value = startTime;
		this.uniforms.get("uEndTime").value = endTime;
		this.uniforms.get("uTimeAnimationIn").value = animationIn;
		this.uniforms.get("uTimeAnimationOut").value = animationOut;
		this.uniforms.get("uSize").value = new THREE.Vector2(width, height);
	}

};


