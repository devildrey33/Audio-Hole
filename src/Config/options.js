export default {
    // Debug mode : use #debug at the end of the url
    debug                   : window.location.hash === '#debug',
    // Y position. Use 'auto' to center canvas horizontaly to the view port
    top                     : 0,
    // X position. Use 'auto' to center canvas verticaly to the view port
    left                    : 0,
    // Width in pixels. Use 'auto' to fit all viewport width
    width                   : "auto",           
    // Height in pixels. Use 'auto' to fit all viewport height
    height                  : "auto",           
    // Show framerate inside the butons frame
    showFPS                 : true,
    // Show current beat per minute            
    showBPM                 : true,
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
    // Allow drag & drop songs
    songsDragDrop           : true,
    // default audio volume
    audioVolume             : 0.25,
    // Allow orbit controls (only on debug by default)
    orbitControls           : window.location.hash === '#debug',

    // Spirals      
    spiralAudioStrength             : 0.4,
    spiralAudioZoom                 : 2.0,
    spiralAudioStrengthSin          : 1.0,
    spiralAudioZoomSin              : 1.0,
    spiralFrequency                 : 0.1,
    spiralSpeed                     : 0.12,
    spiralThickness                 : 0.05,
    spiralFrequencySin              : 0.5,
    spiralSpeedSin                  : 0.75,
    spiralThicknessSin              : 0.001,

    // Sun
    sunAudioStrengthFreq            : 1.0,
    sunAudioStrengthSin             : 2.1,
    sunNoiseStrength                : 15,
    sunNoiseSpeed                   : 1,
    sunLightIntensity               : 1,


    // Rays (particles)
    raysCount                       : 50,

    // Bars
    barsAudioStrength               : 0.75,
    barsAudioZoom                   : 1.5,
    barsSpeed                       : 1.0,


    osciloscopeAudioStrength        : 0.5,
    osciloscopeAudioZoom            : 1,

    hmsOsciloscopeAudioStrength     : 0.5,
    hmsOsciloscopeSpeed             : 2,

    // Voronoi Background 
    voronoiBackgroundSpeed          : 1.0,
    voronoiBackgroundThickness      : 0.01,
    voronoiBackgroundCount          : 64.0,

    // Bloom (postprocessing)
    bloomIntensity                  : 2.0,   // 0.3,   // 2.7
    bloomThreshold                  : -15.4, //4.3,    // 159.5, // -234.8
    bloomSmoothing                  : -1.97, // -342,  // 240.1
    bloomRadius                     : -5.32, //0.7,   // 1.4,   // 1.4
    bloomEnabled                    : true,

    // God rays (postprocessing)
    godRaysDensity                  : 0.96,
    godRaysDecay                    : 0.9,
    godRaysWeigth                   : 0.4,
    godRaysExposure                 : 0.6,
    godRaysClampMax                 : 1.0,
    godRaysSamples                  : 60,
    godRaysEnabled                  : true,

    // Shock wave (postprocessing)
    shockWaveSpeed                  : 7.5,
    shockWaveMaxRadius              : 1.6,
    shockWaveWaveSize               : 0.2,
    shockWaveAmplitude              : 20,


};

