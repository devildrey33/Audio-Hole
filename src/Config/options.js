const options = {
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
    // Allow orbit controls (only on debug by default)
    orbitControls           : window.location.hash === '#debug',

    // Bloom
    bloomThreshold                  : -15.4,
    bloomRadius                     : -5.32,
    bloomIntensity                  : 1,
//    bloomStrength                   : 0.0,
    bloomEnabled                    : true,
    
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

    osciloscopeAudioStrength        : 0.5,
    osciloscopeAudioZoom            : 1,

    sunLightIntensity               : 1
}

export default options;