import { Effect, BlendFunction } from "postprocessing";
import * as THREE from 'three'

/**
 * trying to implement Color correction in pmndr postprocessing...
 */

export default class ColorCorrectionEffect extends Effect {

	constructor() {
		const fragment = /* glsl */`
		uniform vec3 powRGB;
		uniform vec3 mulRGB;
		uniform vec3 addRGB;

		void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
			outputColor = vec4(1.0, 0.0, 0.0, 1.0);
			//outputColor.rgb = mulRGB * pow( ( inputColor.rgb + addRGB ), powRGB );
		}`;

		super(
			"ColorCorrectionEffect", 
			fragment,
			{
				blendFunction: BlendFunction.Normal,
				uniforms : new Map([
					[ "powRGB" , new THREE.Uniform(new THREE.Vector3( 2, 2, 2 )) ],
					[ "mulRGB" , new THREE.Uniform(new THREE.Vector3( 1, 1, 1 )) ],
					[ "addRGB" , new THREE.Uniform(new THREE.Vector3( 0, 0, 0 )) ]
				])
			}
		)

		console.log(this);
	}

};


