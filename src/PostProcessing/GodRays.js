import * as THREE from 'three'
import GodRaysVertexShader from '../Shaders/GodRays/GodRaysVertex.glsl'
import GodRaysFragmentShader from '../Shaders/GodRays/GodRaysFragment.glsl'

// Used in renderer.js 
// God rays aproximation based on Yuri Artiukh tutorial 
// https://tympanus.net/codrops/2022/06/27/volumetric-light-rays-with-three-js/

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