/* Singleton class to hold all the options 
    YOu can owerwrite the default options on the first call 
 */
let optionsInstance = null;


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
    orbitControls           : true
};

export default options;