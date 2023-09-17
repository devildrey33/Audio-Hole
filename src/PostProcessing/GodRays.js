import * as THREE from 'three'
import GodRaysVertexShader from '../Shaders/GodRays/GodRaysVertex.glsl'
import GodRaysFragmentShader from '../Shaders/GodRays/GodRaysFragment.glsl'

let GodRays = {
    uniforms: {
        tDiffuse   : { value : null },
        uTime      : { value : 0 },
        uAmplitude : { value : null },
        uFrequency : { value : null }
    },
    vertexShader   : GodRaysVertexShader,
    fragmentShader : GodRaysFragmentShader
}

export default GodRays;