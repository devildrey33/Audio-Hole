


const options = {
    // Default options 
    showFPS                 : true,
    // Show full screen buton in the buttons frame
    buttonFullScreen        : true,
    // Show my logo buton in the buttons frame (that redirects to devildrey33.es)
    buttonLogo              : true,            
    // Show a github icon to go to the example repository
    buttonGitHub            : true,
    // GitHub url for this project (only used if buttonGitHub is true)
    urlGitHub               : "https://github.com/devildrey33",
    // Enable drag & drop external songs
    songsDragDrop           : true,
    // Orbit controls
    orbitControls           : true,
    // Debug mode shows leva
    debug                   : window.location.hash === '#debug'
};

export default options;