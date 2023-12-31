import * as THREE from 'three'

const isDebug = window.location.hash === '#debug';

export default {
    // Debug mode : use #debug at the end of the url
    debug                   : isDebug,
    // Y position. Use 'auto' to center canvas horizontaly to the view port
/*    top                     : 0,
    // X position. Use 'auto' to center canvas verticaly to the view port
    left                    : 0,
    // Width in pixels. Use 'auto' to fit all viewport width
    width                   : "auto",           
    // Height in pixels. Use 'auto' to fit all viewport height
    height                  : "auto",       */
    // Show framerate inside the butons frame
    showFPS                 : isDebug,
    // Show current beat per minute            
    showBPM                 : isDebug,
    // Show full screen buton in the buttons frame
    buttonFullScreen        : true,            
    // Show my logo buton in the buttons frame (that redirects to devildrey33.es)
    buttonLogo              : true,            
    // Show a github icon to go to the example repository
    buttonGitHub            : true,
    // GitHub url for this project (only used if buttonGitHub is true)
    urlGitHub               : "https://github.com/devildrey33/Audio-Hole",
    // Element where canvas is inserted (by default is document.body)
    // For example you can use document.getElementById() to retrieve tag inside you want to create the canvas
    rootElement             : document.body,
    // Allow drag & drop songs (NOT IMPLEMENTED FOR MULTICHANNEL)
    songsDragDrop           : false,
    // default audio volume
    audioVolume             : 0.25,

    audioFFTSize            : 4096,

    audioMultiChannel       : true,
    // Allow orbit controls (only on debug by default)
    orbitControls           : isDebug,

    // Spirals      
    spiralAudioStrength             : 0.8,
    spiralAudioZoom                 : 2.0,
    spiralAudioStrengthSin          : 0.4,
    spiralAudioZoomSin              : 1.0,
    spiralFrequency                 : 0.1,
    spiralSpeed                     : 0.12,
    spiralThickness                 : 0.05,
    spiralMirrors                   : 1,
    spiralFrequencySin              : 0.5,
    spiralSpeedSin                  : 0.75,
    spiralThicknessSin              : 0.04,
    spiralColorSin                  : new THREE.Color(1, 1, 1),

    // Sun
    sunAudioStrengthFreq            : 1.0,
    sunAudioStrengthSin             : 2.1,
    sunNoiseStrength                : 15,
    sunNoiseSpeed                   : 1,
    sunColorSin                     : new THREE.Color(1, 1, 1),

    // Rays (particles)
    raysCount                       : 50,

    // Lateral Bars
    barsAudioStrength               : 0.5,
    barsAudioZoom                   : 1.5,
    barsSpeed                       : 1.0,

    // Lateral osciloscope
    hmsOsciloscopeAudioStrength     : 0.5,
    hmsOsciloscopeSpeed             : 2,

    // Bloom Pmndrs (postprocessing)
    bloomPmndrsIntensity            : .7, //2.0,   // 0.3,   // 2.7
    bloomPmndrsThreshold            : 15.4, //4.3,    // 159.5, // -234.8
    bloomPmndrsSmoothing            : -1.97, // -342,  // 240.1
    bloomPmndrsRadius               : 0.98, //-5.32, //0.7,   // 1.4,   // 1.4
    bloomPmndrsEnabled              : true,

    // God rays Pmndrs (postprocessing)
    godRaysDensity                  : 0.96,
    godRaysDecay                    : 0.88,
    godRaysWeigth                   : 0.3,
    godRaysExposure                 : 0.6,
    godRaysClampMax                 : 1.0,
    godRaysSamples                  : 60,
    godRaysEnabled                  : true,


    // Color Correction Pmndrs custom (postprocessing)
    colorCorrectionPowRGB           : new THREE.Vector3(3.0, 3.0, 3.0),
    colorCorrectionMulRGB           : new THREE.Vector3(2.0, 2.0, 2.0),
    colorCorrectionAddRGB           : new THREE.Vector3(.05, .05, .05)
/*    colorCorrectionPowRGB           : new THREE.Vector3(3.0, 3.0, 8.0),
    colorCorrectionMulRGB           : new THREE.Vector3(2.0, 2.0, 15.0),
    colorCorrectionAddRGB           : new THREE.Vector3(.05, .05, .5)*/
};

