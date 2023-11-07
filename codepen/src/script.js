/* Experience created by Josep Antoni Bover for https://devildrey33.es.
 *  
 *  This experience uses 6 songs (5 with separated instruments by IA)
 *   to display his frequency values using diferent objects
 * 
 *  Main song is Ride into the Badlands - Kill City Kills
 *   https://www.jamendo.com/track/1901190/kill-city-kills-ride-into-the-badlands
 *   
 * 
 *  https://github.com/devildrey33/Audio-Hole
 * 
 *  Created on        : 07/11/2023
 *  Last modification : 07/11/2023
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Effect, BlendFunction, BloomEffect, EffectComposer, EffectPass, RenderPass, GodRaysEffect, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import gsap from 'gsap';
import * as lil from 'lil-gui'
// Set to true to enable debug mode, or add #debug to the end of the url
// for example : http://localhost:5173/#debug
const isDebug = window.location.hash === '#debug';

/* 
 * Experience options
 */
const options = {
    // Debug mode : use #debug at the end of the url
    debug                   : isDebug,
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
    // Fast fourier transform buffer size 
    audioFFTSize            : 4096,
    // Analize more than one song (separated instruments)
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
};


/* 
 * Songs (only kill city kills has bpm based animations)
 */
const songs = [        
    {
        name    : "Ride into the Badlands",
        group   : "Kill City Kills", 
        path    : "https://devildrey33.es/Ejemplos/AudioHole/songs/kill-city-kills/", 
        url     : "https://www.jamendo.com/track/1901190/kill-city-kills-ride-into-the-badlands",
        bpm     : 152,
    },
    {
        name    : "Nothing's Over",
        group   : "In Camera", 
        path    : "https://devildrey33.es/Ejemplos/AudioHole/songs/nothings-over/", 
        url     : "https://www.jamendo.com/track/1397271/nothing-s-over",
        bpm     : 123
    }, {
        name    : "One Chance",
        group   : "Fallen to Flux", 
        path    : "https://devildrey33.es/Ejemplos/AudioHole/songs/one-chance/", 
        url     : "https://www.jamendo.com/track/1155241/one-chance",
        bpm     : 123
    }, {
        name    : "Quantum Ocean",
        group   : "From Sky to Abyss", 
        path    : "https://devildrey33.es/Ejemplos/AudioHole/songs/quantum-ocean/", 
        url     : "https://www.jamendo.com/track/1284951/quantum-ocean",
        bpm     : 96
    }, {
        name    : "Six Feet Under",
        group   : "Convergence", 
        path    : "https://devildrey33.es/Ejemplos/AudioHole/songs/six-feet-under/", 
        url     : "https://www.jamendo.com/track/80122/six-feet-under",
        bpm     : 152
    }, {
        name    : "The Deep",
        group   : "Anitek", 
        path    : "https://devildrey33.es/Ejemplos/AudioHole/songs/the-deep/", 
        url     : "https://www.jamendo.com/track/1884527/the-deep",
        bpm     : 117
    }, {
        name    : "Alone",
        group   : "Color out", 
        path    : "https://devildrey33.es/Ejemplos/AudioHole/songs/alone/", 
        url     : "https://www.jamendo.com/track/1886257/alone",
        bpm     : 129
    }, {
        name    : "Lost",
        group   : "Jount",
        path    : "https://devildrey33.es/Ejemplos/AudioHole/songs/lost/",
        url     : "https://www.jamendo.com/track/1910909/jount-lost",
        bpm     : 117
    },
]

/* 
 * Resources to load
 */
const sources = [
    { // stars background
        name : 'background1',
        type : 'texture',
        path : 'https://devildrey33.es/Ejemplos/AudioHole/textures/1.webp'
    }
]


/* 
 * Event Emmiter
 *  Object to handle events
 */
class EventEmitter {
    constructor() {
        this.callbacks = {}
        this.callbacks.base = {}
    }

    on(_names, callback) {
        // Errors
        if(typeof _names === 'undefined' || _names === '') {
            console.warn('wrong names')
            return false
        }

        if(typeof callback === 'undefined') {
            console.warn('wrong callback')
            return false
        }

        // Resolve names
        const names = this.resolveNames(_names)

        // Each name
        names.forEach((_name) => {
            // Resolve name
            const name = this.resolveName(_name)

            // Create namespace if not exist
            if(!(this.callbacks[ name.namespace ] instanceof Object))
                this.callbacks[ name.namespace ] = {}

            // Create callback if not exist
            if(!(this.callbacks[ name.namespace ][ name.value ] instanceof Array))
                this.callbacks[ name.namespace ][ name.value ] = []

            // Add callback
            this.callbacks[ name.namespace ][ name.value ].push(callback)
        })

        return this
    }

    off(_names) {
        // Errors
        if(typeof _names === 'undefined' || _names === '') {
            console.warn('wrong name')
            return false
        }

        // Resolve names
        const names = this.resolveNames(_names)

        // Each name
        names.forEach((_name) => {
            // Resolve name
            const name = this.resolveName(_name)

            // Remove namespace
            if(name.namespace !== 'base' && name.value === '') {
                delete this.callbacks[ name.namespace ]
            }

            // Remove specific callback in namespace
            else {
                // Default
                if(name.namespace === 'base') {
                    // Try to remove from each namespace
                    for(const namespace in this.callbacks) {
                        if(this.callbacks[ namespace ] instanceof Object && this.callbacks[ namespace ][ name.value ] instanceof Array) {
                            delete this.callbacks[ namespace ][ name.value ]

                            // Remove namespace if empty
                            if(Object.keys(this.callbacks[ namespace ]).length === 0)
                                delete this.callbacks[ namespace ]
                        }
                    }
                }

                // Specified namespace
                else if(this.callbacks[ name.namespace ] instanceof Object && this.callbacks[ name.namespace ][ name.value ] instanceof Array) {
                    delete this.callbacks[ name.namespace ][ name.value ]

                    // Remove namespace if empty
                    if(Object.keys(this.callbacks[ name.namespace ]).length === 0)
                        delete this.callbacks[ name.namespace ]
                }
            }
        })

        return this
    }

    trigger(_name, _args) {
        // Errors
        if(typeof _name === 'undefined' || _name === '') {
            console.warn('wrong name')
            return false
        }

        let finalResult = null
        let result = null

        // Default args
        const args = !(_args instanceof Array) ? [] : _args

        // Resolve names (should on have one event)
        let name = this.resolveNames(_name)

        // Resolve name
        name = this.resolveName(name[ 0 ])

        // Default namespace
        if(name.namespace === 'base')
        {
            // Try to find callback in each namespace
            for(const namespace in this.callbacks) {
                if(this.callbacks[ namespace ] instanceof Object && this.callbacks[ namespace ][ name.value ] instanceof Array) {
                    this.callbacks[ namespace ][ name.value ].forEach(function(callback) {
                        result = callback.apply(this, args)

                        if(typeof finalResult === 'undefined') {
                            finalResult = result
                        }
                    })
                }
            }
        }

        // Specified namespace
        else if(this.callbacks[ name.namespace ] instanceof Object)  {
            if(name.value === '') {
                console.warn('wrong name')
                return this
            }

            this.callbacks[ name.namespace ][ name.value ].forEach(function(callback) {
                result = callback.apply(this, args)

                if(typeof finalResult === 'undefined')
                    finalResult = result
            })
        }

        return finalResult
    }

    resolveNames(_names) {
        let names = _names
        names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '')
        names = names.replace(/[,/]+/g, ' ')
        names = names.split(' ')

        return names
    }

    resolveName(name) {
        const newName = {}
        const parts = name.split('.')

        newName.original  = name
        newName.value     = parts[ 0 ]
        newName.namespace = 'base' // Base namespace

        // Specified namespace
        if(parts.length > 1 && parts[ 1 ] !== '') {
            newName.namespace = parts[ 1 ]
        }

        return newName
    }
}

/* 
 * Sizes
 *  Canvas size object
 */
class Sizes extends EventEmitter {
    // Constructor without parameters that gets the canvas size 
    constructor() {
        super();
        this.experience = new Experience();
        this.options    = this.experience.options;

        this.width      = window.innerWidth;
        this.height     = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.hEventResize = this.eventResize.bind(this);
        window.addEventListener('resize', this.hEventResize);
    }

    eventResize() {
        // Calculo el nuevo ancho y la nueva altura (si no son fijas) //this.elementOCanvas.offsetWidth
        this.width  = window.innerWidth; 
        this.height = window.innerHeight;

        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.trigger('resize');
    }

    destroy() {
        window.removeEventListener('resize', this.hEventResize);
        this.hEventResize = null;
    }
}

/* 
 * Time
 *  Main time object
 */
class Time extends EventEmitter {
    constructor() {
        super();
        this.experience     = new Experience();
        this.elements       = this.experience.htmlElements;

        this.start          = Date.now();
        this.current        = this.start;
        this.elapsed        = 0;
        this.delta          = 16;
        // Time from this second 
        this.actualFrame    = this.start + 1000;
        // Number of frames during this second
        this.frameCounter   = 0;
        // actual framerate
        this.fps            = 0;

        // Use a function that not updates the fps in the experience
        if (this.experience.options.showFPS === false) {
            this.calculateFPS = this.calculateFPSSilent;
        }

        // Start the main animation loop
        window.requestAnimationFrame(() => {
            this.tick();
        });


    }

    /* 
     * Pics 6 times the frames per second during 3 secs, and make an estimation
     * to recomend low or high settings
     */
    measureQuality() {        
        this.qualityCounter = 0;
        this.qualityTotal = 0;
        this.qualityTimes = 6;
        setTimeout(() => {
            this.qualityInterval = setInterval(() => {
                if (this.qualityCounter > this.qualityTimes) {
                    clearInterval(this.qualityInterval);
                    this.qualityTotal = this.qualityTotal / (this.qualityTimes);
                    this.experience.recomended(this.qualityTotal);
                    return;
                }
                // avoid first time, its always 0
                if (this.qualityCounter != 0) {
                    this.qualityTotal += this.fps;
                }
                this.qualityCounter++;
            }, 250);
        }, 1500);
    }

    // Function to measure Frames Per Second
    // This function updates FPS in the experience HTML
    calculateFPS() {
        // If the current time is superior from actualFrame
        if (this.current > this.actualFrame) {
            // Setup the next frame is current time + 1000
            this.actualFrame = this.current + 1000;
            
            // Write the new frames per second
            this.elements.elementFPS.innerHTML = this.frameCounter;
            // Set the parts per color
            const Part = 256 / 60; 
            // Put the color of the FPS text (Green 60fps, Red 0fps)        
            this.elements.elementFPS.style.color = "rgb(" + Math.round(255 - (this.frameCounter * Part)) + "," + Math.round(this.frameCounter * Part) + ", 0)";

            this.fps = this.frameCounter;
            // Restart the counter of frames
            this.frameCounter = 0;
        }
        // If the current time is inferior to actualFrame
        else {
            // Increment one frame for this actualFrame
            this.frameCounter ++;
        }
    }

    // Function to measure Frames Per Second
    // This function does not updates FPS in the experience HTML
    calculateFPSSilent() {
        // If the current time is superior from actualFrame
        if (this.current > this.actualFrame) {
            // Setup the next frame is current time + 1000
            this.actualFrame = this.current + 1000;
            
            this.fps = this.frameCounter;
            // Restart the counter of frames
            this.frameCounter = 0;
        }
        // If the current time is inferior to actualFrame
        else {
            // Increment one frame for this actualFrame
            this.frameCounter ++;
        }
    }

    // Function that triggers every frame of the scene
    tick() {
        // Recalculate the time variables
        const currentTime = Date.now();
        this.delta   = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;
        // Recalculate Frames Per Second
        this.calculateFPS();
        // Send tick event 
        this.trigger('tick');
        // Call requestAnimationFrame for the next frame
        window.requestAnimationFrame(() => {
            this.tick();
        })
    }
}

/* 
 * HTMLElements 
 *  Create html elements and setup their events
 */
class HTMLElements {
    // Static counter for canvas id's
    static #countIds = 0;

    // constructor
    constructor() {
        this.experience = new Experience();
        this.options    = this.experience.options;
        this.sizes      = this.experience.sizes;
        this.songs      = this.experience.songs;
        this.song       = this.experience.song;
        
        this.create();

        this.setupAudioControlEvents();
        this.setupQualityEvents();
    }

    setupQualityEvents() {
        this.elementQualityHigh.addEventListener('click', ()=> {
            this.experience.setQuality("high");
            this.elementQuality.remove();
        })
        this.elementQualityLow.addEventListener('click', ()=> {
            this.experience.setQuality("low");            
            this.elementQuality.remove();
        })
    }

    setupAudioControlEvents() {
        // Time bar its changing by the user
        this.dragTime = false;
        // Not a drag & drop song
        this.defaultSong = true;
        

        if (this.experience.options.debug === true) {

            // Audio songs select option element
            this.elementAudioSongs.addEventListener('change', (e) => {
                for (let i = 0; i < this.songs.length; i++) {
                    if (e.currentTarget.value === this.songs[i].name) {
                        this.experience.song = this.songs[i];
                        this.experience.currentSong = i;
                        break;
                    }
                }
                
                this.experience.audioAnalizer.loadSong(this.experience.song.path, this.experience.song.bpm);
                this.experience.audioAnalizer.playPause();
            });

            // Audio main volume slider element
            this.elementAudioVolume.addEventListener('input', (e) => { 
                if (this.experience.debug === false) {
                    this.experience.audioAnalizer.volume(e.currentTarget.value);
                }
                else {
                    this.experience.audioAnalizer.volume(e.currentTarget.value, true);
                    this.elementAudioVolumeSong.value = 0;
                    this.elementAudioVolumeBass.value = e.currentTarget.value;
                    this.elementAudioVolumeDrum.value = e.currentTarget.value;
                    this.elementAudioVolumeOther.value = e.currentTarget.value;
                    this.elementAudioVolumeVoice.value = e.currentTarget.value;
                    this.elementAudioVolumePiano.value = e.currentTarget.value;
                }
                
            }); 
            if (this.experience.options.audioMultiChannel === true) {
                // Song volume
                this.elementAudioVolumeSong.addEventListener('input', (e) => { 
                    this.experience.audioAnalizer.channelSong.volume(e.currentTarget.value);
                }); 
                // Bass volume
                this.elementAudioVolumeBass.addEventListener('input', (e) => { 
                    this.experience.audioAnalizer.channelBass.volume(e.currentTarget.value);
                }); 
                // Drum volume
                this.elementAudioVolumeDrum.addEventListener('input', (e) => { 
                    this.experience.audioAnalizer.channelDrum.volume(e.currentTarget.value);
                }); 
                // Other volume
                this.elementAudioVolumeOther.addEventListener('input', (e) => { 
                    this.experience.audioAnalizer.channelOther.volume(e.currentTarget.value);
                }); 
                // Voice volume
                this.elementAudioVolumeVoice.addEventListener('input', (e) => { 
                    this.experience.audioAnalizer.channelVocal.volume(e.currentTarget.value);
                }); 
                // Piano volume
                this.elementAudioVolumePiano.addEventListener('input', (e) => { 
                    this.experience.audioAnalizer.channelPiano.volume(e.currentTarget.value);
                }); 
            }
            // Speed ratio
            this.elementAudioSpeed.addEventListener('input', (e) => { 
                this.experience.audioAnalizer.speed(e.currentTarget.value);
            }); 

            if (this.experience.options.audioMultiChannel === true) {

                // Mute song
                this.elementMuteSong.addEventListener('click', () => { 
                    if (this.experience.audioAnalizer.channelSong.currentVolume === 0)
                        this.experience.audioAnalizer.channelSong.volume(this.experience.audioAnalizer.currentVolume);
                    else 
                        this.experience.audioAnalizer.channelSong.volume(0);
                    this.elementAudioVolumeSong.value = this.experience.audioAnalizer.channelSong.currentVolume;
                }); 
                // Mute bass
                this.elementMuteBass.addEventListener('click', () => { 
                    if (this.experience.audioAnalizer.channelBass.currentVolume === 0)
                        this.experience.audioAnalizer.channelBass.volume(this.experience.audioAnalizer.currentVolume);
                    else 
                        this.experience.audioAnalizer.channelBass.volume(0);
                    this.elementAudioVolumeBass.value = this.experience.audioAnalizer.channelBass.currentVolume;
                }); 
                // Mute drum
                this.elementMuteDrum.addEventListener('click', () => { 
                    if (this.experience.audioAnalizer.channelDrum.currentVolume === 0)
                        this.experience.audioAnalizer.channelDrum.volume(this.experience.audioAnalizer.currentVolume);
                    else 
                        this.experience.audioAnalizer.channelDrum.volume(0);
                    this.elementAudioVolumeDrum.value = this.experience.audioAnalizer.channelDrum.currentVolume;
                }); 
                // Mute Other
                this.elementMuteOther.addEventListener('click', () => { 
                    if (this.experience.audioAnalizer.channelOther.currentVolume === 0)
                        this.experience.audioAnalizer.channelOther.volume(this.experience.audioAnalizer.currentVolume);
                    else 
                        this.experience.audioAnalizer.channelOther.volume(0);
                    this.elementAudioVolumeOther.value = this.experience.audioAnalizer.channelOther.currentVolume;
                }); 
                // Mute Voice
                this.elementMuteVoice.addEventListener('click', () => { 
                    if (this.experience.audioAnalizer.channelVocal.currentVolume === 0)
                        this.experience.audioAnalizer.channelVocal.volume(this.experience.audioAnalizer.currentVolume);
                    else 
                        this.experience.audioAnalizer.channelVocal.volume(0);
                        this.elementAudioVolumeVoice.value = this.experience.audioAnalizer.channelVocal.currentVolume;
                }); 
                // Mute Piano
                this.elementMutePiano.addEventListener('click', () => { 
                    if (this.experience.audioAnalizer.channelPiano.currentVolume === 0)
                        this.experience.audioAnalizer.channelPiano.volume(this.experience.audioAnalizer.currentVolume);
                    else 
                        this.experience.audioAnalizer.channelPiano.volume(0);
                    this.elementAudioVolumePiano.value = this.experience.audioAnalizer.channelPiano.currentVolume;
                }); 
            }
            // set default speed
            this.elementDefaultSpeed.addEventListener('click', () => { 
                this.elementAudioSpeed.value = 1;
                this.experience.audioAnalizer.speed(1);
            });

        

        // Audio time slider element mousedown
        this.elementAudioTime.addEventListener('mousedown', (e) => { 
            this.dragTime = true;
        }); 
        // Audio time slider element touchstart
        this.elementAudioTime.addEventListener('touchstart', (e) => { 
            this.dragTime = true;
        }, { passive: true }); 
        // Audio time slider element mouseup
        this.elementAudioTime.addEventListener('mouseup', (e) => { 
            this.dragTime = false;
        }); 
        // Audio time slider element touchend
        this.elementAudioTime.addEventListener('touchend', (e) => { 
            this.dragTime = false;
        }, { passive: true }); 

        // Update current time
        this.elementAudioTime.addEventListener('change', (e) => { 
            this.elementDebugEffects.innerHTML = "";
            this.experience.audioAnalizer.setTime(this.elementAudioTime.value);
            // Update current beat per minute acording to the new time
            if (this.experience.audioAnalizer.bpm !== 0) {
                // Update current beat per minute
                const mspb = 60000 / this.experience.audioAnalizer.bpm;
                this.experience.audioAnalizer.currentBpm = Math.floor((this.experience.audioAnalizer.channelSong.song.currentTime * 1000) / mspb);
                this.experience.onAudioBpmChange(this.experience.audioAnalizer.currentBpm);
            }
        }); 

    }



        // Update bpms
        if (this.experience.options.debug === true && this.experience.options.showBPM === true) {
            this.elementAudioTime.addEventListener('input', (e) => { 
                const mspb = 60000 / this.experience.audioAnalizer.bpm;
                this.experience.audioAnalizer.currentBpm = Math.floor((e.target.value * 1000) / mspb);
                this.experience.onAudioBpmChange(this.experience.audioAnalizer.currentBpm);
                // If song is not playing update the current time 
                if (this.experience.audioAnalizer.isPlaying === false) {
                    this.experience.audioAnalizer.setTime(this.elementAudioTime.value);
                }
            });
        }
    }

    audioUI(playing) {
        this.elementPlay.setAttribute("play", playing);
        this.elementPause.setAttribute("play", playing);

        this.elementSongInfoName.innerHTML = "<a href='" + this.experience.song.url + "' target='_blank'>" + this.experience.song.name + "</a>";
        this.elementSongInfoArtist.innerHTML = "<a href='" + this.experience.song.url + "' target='_blank'>" + this.experience.song.group + "</a>";

        if (this.defaultSong === true && (playing === "true" || playing === true)) 
            this.elementSongInfo.setAttribute("visible", false);
        else
            this.elementSongInfo.setAttribute("visible", true);
    }


    create() {
        // Si no hay una ID asignada es que no se ha creado la etiqueta OCanvas para este objeto
        if (typeof(this.id) === 'undefined') {
            // Creo las etiquetas necesarias para el canvas, los botones, el framerate y la carga
            const preElementExperience = document.createElement("div");
            // Asigno la id para este Canvas, y sumo 1 al contador de ids estatico
            this.id = HTMLElements.#countIds ++;
            preElementExperience.id        = "Experience" + this.id; 
            preElementExperience.className = "Experience";
            // Añado la etiqueta que contiene todas las etiquetas de este OCanvas
            this.options.rootElement.appendChild(preElementExperience);
            this.elementExperience = document.getElementById(preElementExperience.id);
            // Setup the loading atribute
            this.elementExperience.setAttribute("loading", true);
            // Creo un string para crear las etiquetas HTML
            let strHTML = ""
            // Añado la etiqueta para el canvas
            strHTML += '<canvas id="Experience' + this.id + '_Canvas" class="Experience_Canvas"></canvas>';
            // Añado la etiqueta para el marco que indica que se está cargando
            strHTML += '<div class="Experience_Loading Experience_Panel"><span>Loading...</span></div>';


            /*
             * Menu to select the experience quality
             */
            strHTML += `<div id='Experience_Quality' class='Experience_Panel'> 
                <h2>Select experience quality</h2>                
                <div class='Experience_Quality_List' id='Experience_Quality_Low'>
                    <div>Low</div>
                    <div>
                        512 frequency values <br />
                        One channel analisis 
                    </div>
                </div>
                <div class='Experience_Quality_List' id='Experience_Quality_High'>
                    <div>High</div>
                    <div>
                        2048 frequency values <br />
                        Six channel analisis 
                    </div>
                </div>
            </div>`;

            /*
             * Press play button to start
             * and
             * Full screen mode
             */
            strHTML += `<div id='Experience_PressPlay' class='Experience_Panel'>
            Press play to start
            </div>
            <div id='Experience_PressFullScreen' class='Experience_Panel' show='true'>
                Full screen button
            </div>            
            `

            // Debug ui for effects
            if (this.options.showBPM === true) {
                strHTML += `<div class="Experience_DebugEffects"></div>`; 
            }            
            
            // Añado la etiqueta para el marco de los controles
            strHTML += '<div class="Experience_Controls">';
            // Show beats per minute
            if (this.options.showBPM === true) {
                strHTML +=  "<div class='Experience_Panel Experience_Static' title='Beats per minute'>" +
                                "<div class='Experience_BPM'>0</div>" +
                                "<div class='Experience_TxtBPM'>cbpm</div>" +
                            "</div>";

            }
            // Show frames per second
            if (this.options.showFPS === true) {
                strHTML +=  "<div class='Experience_Panel Experience_Static' title='Frames Per Second'>" +
                                "<div class='Experience_FPS'>60</div>" +
                                "<div class='Experience_TxtFPS'>fps</div>" +
                            "</div>";
            }
            // Show full screen button
            if (this.options.buttonFullScreen === true) {
                strHTML +=  "<div id='fullScreen' class='Experience_Panel Experience_Control' title='Full screen mode'>" +
                                "<img draggable='false' src='https://devildrey33.es/Ejemplos/AudioHole/icos.svg#svg-pantalla-completa' />" +
                            "</div>" +
                            "<div id='restoreScreen' class='Experience_Panel Experience_Control' title='Restore screen'>" +
                                "<img draggable='false' src='https://devildrey33.es/Ejemplos/AudioHole/icos.svg#svg-restaurar-pantalla' />" +
                            "</div>";                
            }

            // Show github button
            if (this.options.buttonGitHub === true) {
                strHTML +=  "<a href='" + this.options.urlGitHub + "' target='_blank' class='Experience_Panel Experience_Control' title='GitHub project'>" +
                                "<img draggable='false' src='https://devildrey33.es/Ejemplos/AudioHole/icos.svg#svg-github' />" +            
                            "</a>";
            }
            // Show devildrey33 logo button
            if (this.options.buttonLogo === true) {
                strHTML +=  "<a href='https://devildrey33.es' target='_blank' id='Logo' class='Experience_Panel Experience_Control'>" +
                                "<img draggable='false' src='https://devildrey33.es/Ejemplos/AudioHole/icos.svg#svg-logo' />" +
                                "<div id='LogoText'>" +
                                    "<span>D</span>" + "<span>E</span>" + "<span>V</span>" + "<span>I</span>" + "<span>L</span>" + "<span>D</span>" + "<span>R</span>" + "<span>E</span>" + "<span>Y</span>" + "<span>&nbsp;</span>" + "<span>3</span>" + "<span>3</span>" +
                                "</div>" +

                            "</a>";
            }
            // Cierro el div .Experience_Controls
            strHTML += '</div>';

            // Play button
            strHTML += '<div class="Experience_Play Experience_Panel Experience_Control" play="true" disabled="true">' +
                            "<img draggable='false' src='https://devildrey33.es/Ejemplos/Three.js-Journey/Audio-PlayGround/icos.svg#svg-play' />" +
                    '</div>';
            // Pause button
            strHTML += '<div class="Experience_Pause Experience_Panel Experience_Control" play="true">' +
                            "<img draggable='false' src='https://devildrey33.es/Ejemplos/Three.js-Journey/Audio-PlayGround/icos.svg#svg-pause' />" +
                    '</div>';

            // Song info
            strHTML += `<div class="Experience_Panel Experience_SongInfo">
                            <span>Name</span>
                            <span>:</span>
                            <span id='AudioInfo_Name'><a href="https://www.jamendo.com/track/1884527/the-deep" target="_blank">The Deep</a></span>
                            <span>Artist</span>
                            <span>:</span>
                            <span id='AudioInfo_Artist'><a href="https://www.jamendo.com/artist/359034/anitek" target="_blank">Anitek</a></span>
                        </div>`;

            
            /* 
             * AudioControls
             */
            if (this.experience.options.debug === true) {
                strHTML += `<div class='Experience_AudioControls'>
                    <div class="Experience_AC_SongsVolume">
                        <span>song</span>
                        <select name='songs'>`
                        for (let i = 0; i < this.songs.length; i++) {
                            strHTML += (this.songs[i].name === this.song.name) ? "<option selected>" : "<option>";
                            strHTML += this.songs[i].name + "</option>";
                        }        
                strHTML +=`</select>
                        <span>volume</span>
                        <div class='Experience_AC_Volume'>
                            <input id='volume' type='range' name='volume' min='0' max='1' value='0' step='0.01'></input>
                        </div>`

                if (this.experience.options.audioMultiChannel === true) {
                strHTML +=`<span id='muteSong'>song</span>
                    <div class='Experience_AC_Volume'>
                        <input id='volumeSong' type='range' name='song' min='0' max='1' value='${this.experience.options.audioVolume}' step='0.01'></input>
                    </div>
                    <span id='muteDrum'>drum</span>
                    <div class='Experience_AC_Volume'>
                        <input id='volumeDrum' type='range' name='drum' min='0' max='1' value='0' step='0.01'></input>
                    </div>
                    <span id='muteBass'>bass</span>
                    <div class='Experience_AC_Volume'>
                        <input id='volumeBass' type='range' name='bass' min='0' max='1' value='0' step='0.01'></input>
                    </div>
                    <span id='muteOther'>other</span>
                    <div class='Experience_AC_Volume'>
                        <input id='volumeOther' type='range' name='other' min='0' max='1' value='0' step='0.01'></input>
                    </div>
                    <span id='muteVoice'>voice</span>
                    <div class='Experience_AC_Volume'>
                        <input id='volumeVoice' type='range' name='voice' min='0' max='1' value='0' step='0.01'></input>
                    </div>
                    <span id='mutePiano'>piano</span>
                    <div class='Experience_AC_Volume'>
                        <input id='volumePiano' type='range' name='piano' min='0' max='1' value='0' step='0.01'></input>
                    </div>`
                }
                strHTML +=`<span id='defaultSpeed'>speed</span>
                    <div class='Experience_AC_Volume'>
                        <input id='reproductionSpeed' type='range' name='speed' min='0.1' max='2' value='1' step='0.01'></input>
                    </div>`
            }

            strHTML += `</div>`;
            if (this.experience.options.debug === true) {
                strHTML += `<div class='Experience_AC_Time'>
                                <input type='range' step="0.1" value="0"></input>
                            </div>`
            }
            strHTML += `</div>`;

            // Add the html string to the experience element
            this.elementExperience.innerHTML = strHTML;


            if (this.options.buttonFullScreen === true) {
                this.elementFullScreen    = document.getElementById("fullScreen");
                this.elementRestoreScreen = document.getElementById("restoreScreen");
                this.elementFullScreen.addEventListener("click", (e) => {
                    this.elementExperience.requestFullscreen();
                    this.elementFullScreen.style.display    = "none";
                    this.elementRestoreScreen.style.display = "block";
                    // disable the initial tooltip
                    this.elementPressFullScreen.setAttribute("show", "false");
                });
                this.elementRestoreScreen.addEventListener("click", (e) => {
                    document.exitFullscreen();
                    this.elementFullScreen.style.display    = "block";
                    this.elementRestoreScreen.style.display = "none";        
                });

            }



            // Audio controls element
            this.elementAudioControls = document.querySelector("#" + this.elementExperience.id + " > .Experience_AudioControls");
            // Audio songs select option element
            this.elementAudioSongs = document.querySelector("#" + this.elementExperience.id + " > .Experience_AudioControls > .Experience_AC_SongsVolume > select");
            // Get the song information panel
            this.elementSongInfo = document.querySelector("#" + this.elementExperience.id + " > .Experience_SongInfo");
            this.elementSongInfoName   = document.getElementById("AudioInfo_Name");
            this.elementSongInfoArtist = document.getElementById("AudioInfo_Artist");
            // Audio volume slider element per channel
            this.elementAudioVolume = document.getElementById("volume");
            this.elementAudioVolumeSong = document.getElementById("volumeSong");
            this.elementAudioVolumeBass = document.getElementById("volumeBass");
            this.elementAudioVolumeDrum = document.getElementById("volumeDrum");
            this.elementAudioVolumeOther = document.getElementById("volumeOther");
            this.elementAudioVolumeVoice = document.getElementById("volumeVoice");
            this.elementAudioVolumePiano = document.getElementById("volumePiano");
            // speed
            this.elementAudioSpeed = document.getElementById("reproductionSpeed");
            // Mute audio volume channel
            this.elementMuteSong  = document.getElementById("muteSong");
            this.elementMuteBass  = document.getElementById("muteBass");
            this.elementMuteDrum  = document.getElementById("muteDrum");
            this.elementMuteOther = document.getElementById("muteOther");
            this.elementMuteVoice = document.getElementById("muteVoice");
            this.elementMutePiano = document.getElementById("mutePiano");
            // default speed
            this.elementDefaultSpeed = document.getElementById("defaultSpeed");

            // Audio time slider element
            this.elementAudioTime = document.querySelector("#" + this.elementExperience.id + " > .Experience_AudioControls > .Experience_AC_Time > input");
            // Audio information element
            this.elementAudioInfo = document.querySelector("#" + this.elementExperience.id + " > .Experience_AudioControls  .Experience_AC_Info");

            // Get the play and pause button elements
            this.elementPlay  = document.querySelector("#" + this.elementExperience.id + " > .Experience_Play");
            this.elementPause = document.querySelector("#" + this.elementExperience.id + " > .Experience_Pause");            
            
            
            // Play pause button listen click
            this.elementPlay.addEventListener( "click", (e) => { 
                this.audioUI(!this.experience.audioAnalizer.playPause(this.experience.song.path, this.experience.song.bpm));  
                this.elementPressPlay.setAttribute("show", "false");
                this.elementPressFullScreen.setAttribute("show", "false");
            });
            this.elementPause.addEventListener("click", (e) => {  
                this.audioUI(!this.experience.audioAnalizer.playPause());  
            });


        
            // Obtengo la etiqueta del canvas 
            this.elementCanvas = document.querySelector("#" + this.elementExperience.id + " > .Experience_Canvas");
            // Obtengo la etiqueta del marco para la carga
            this.elementLoading = document.querySelector("#" + this.elementExperience.id + " > .Experience_Loading");
            // Obtengo la etiqueta del marco para los controles
            this.elementControls = document.querySelector("#" + this.elementExperience.id + " > .Experience_Controls");
            
            // Experience quality
            this.elementQuality = document.getElementById("Experience_Quality");
            this.elementQualityLow = document.getElementById("Experience_Quality_Low");
            this.elementQualityHigh = document.getElementById("Experience_Quality_High");

            this.elementPressPlay = document.getElementById("Experience_PressPlay");
            this.elementPressFullScreen = document.getElementById("Experience_PressFullScreen");

            // if FPS are show
            if (this.options.showFPS === true) {
                // Get FPS html element from the doom
                this.elementFPS = document.querySelector("#" + this.elementExperience.id + " > .Experience_Controls > .Experience_Static > .Experience_FPS");
            }
            // if BPM are show
            if (this.options.showBPM === true) {
                // Get BPM html element from the doom
                this.elementBPM = document.querySelector("#" + this.elementExperience.id + " > .Experience_Controls > .Experience_Panel > .Experience_BPM");
                this.elementTxtBPM = document.querySelector("#" + this.elementExperience.id + " > .Experience_Controls > .Experience_Panel > .Experience_TxtBPM");
                
                this.elementAudioLevelH0 = document.getElementById("Experience_AudioLevelH0");
                this.elementAudioLevelM0 = document.getElementById("Experience_AudioLevelM0");
                this.elementAudioLevelL0 = document.getElementById("Experience_AudioLevelL0");
                this.elementAudioLevelT0 = document.getElementById("Experience_AudioLevelT0");
                if (this.options.audioMultiChannel === true) {
                    this.elementAudioLevelH1 = document.getElementById("Experience_AudioLevelH1");
                    this.elementAudioLevelM1 = document.getElementById("Experience_AudioLevelM1");
                    this.elementAudioLevelL1 = document.getElementById("Experience_AudioLevelL1");
                    this.elementAudioLevelT1 = document.getElementById("Experience_AudioLevelT1");
                    this.elementAudioLevelH2 = document.getElementById("Experience_AudioLevelH2");
                    this.elementAudioLevelM2 = document.getElementById("Experience_AudioLevelM2");
                    this.elementAudioLevelL2 = document.getElementById("Experience_AudioLevelL2");
                    this.elementAudioLevelT2 = document.getElementById("Experience_AudioLevelT2");
                    this.elementAudioLevelH3 = document.getElementById("Experience_AudioLevelH3");
                    this.elementAudioLevelM3 = document.getElementById("Experience_AudioLevelM3");
                    this.elementAudioLevelL3 = document.getElementById("Experience_AudioLevelL3");
                    this.elementAudioLevelT3 = document.getElementById("Experience_AudioLevelT3");
                    this.elementAudioLevelH4 = document.getElementById("Experience_AudioLevelH4");
                    this.elementAudioLevelM4 = document.getElementById("Experience_AudioLevelM4");
                    this.elementAudioLevelL4 = document.getElementById("Experience_AudioLevelL4");
                    this.elementAudioLevelT4 = document.getElementById("Experience_AudioLevelT4");
                }
                
                this.elementDebugEffects = document.querySelector("#" + this.elementExperience.id + " > .Experience_DebugEffects");
            }
        }
    }
}

/* 
 * BufferCanvas
 *  its an object that creates a canvas in memory 
 */
class BufferCanvas {
    constructor(width, height) {
        this.canvas  = document.createElement("canvas");
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);
        this.context = this.canvas.getContext("2d", { willReadFrequently : false }); 
        this.width   = width;
        this.height  = height;
    }
}


/* 
 * AudioChannel
 *  This object analizes one channel (song) and generates a texture with audio data
 */
class AudioChannel {
    constructor(audioOptions, first = false) {
        const audioDefaultOptions = {
            // Default callbacks
            onPlay            : () => {}, // Playing the song
            onPause           : () => {}, // Pausing the song
            onTimeUpdate      : () => {}, // Updating current song time
            onDurationChange  : () => {}, // First time whe know duration of the song
            onEnded           : () => {}, // Song has reached the end
            onError           : () => {}, // Error...
            onCanPlay         : () => {}, // Song is ready to play
            onLoading         : () => {}, // Starting to load the song
            // Default values
            volume            : 0.5,      // 
            fftSize           : 1024,     // fast fourier transform size (1024 gives 512 frequency bars)
        }
        // First channel is the song to play, the rest are only for analisis
        this.fistChannel = first;

        this.audioOptions = { ...audioDefaultOptions, ...audioOptions };
        // Set secondary channels volume to 0
        if (first === false) this.audioOptions.volume = 0;

        // Song loaded flag
        this.songLoaded = false;
        // Set the default volume
        this.currentVolume = this.audioOptions.volume;
        // Initialize memory for audio textures
        this.setupTextures(this.audioOptions.fftSize);
        // Average frequency values
        this.averageFrequency      = [ 0, 0, 0, 0, 0 ];
        // Average frequency peak values. (if peak values are greather than his average frequency, they decrease slowly, if not peak is set to frequency)
        this.averageFrequencyPeaks = [ 0, 0, 0, 0, 0 ];
        // Paint the audio textures to have safe values 
        this.paintAudioTexture();
        
        this.isPlaying = false;
    }
 
   
    volume(vol) {
        if (typeof vol !== "undefined") this.currentVolume = vol;

        if (typeof this.gainNode !== "undefined") {
            this.gainNode.gain.value = this.currentVolume;
        }
    }

    setupTextures(fftSize) {        
        this.maxData = fftSize * 0.5;

        // Arrays for analizer data (bars and osciloscope)
        this.analizerData    = new Uint8Array(this.maxData);
        this.analizerDataSin = new Uint8Array(this.maxData);
        for (let i = 0; i < this.maxData; i++) {
            this.analizerData[i]    = 0;
            this.analizerDataSin[i] = 128;
        }

        // Audio texture
        this.bufferCanvasLinear         = new BufferCanvas(this.maxData, 1);
        this.bufferCanvasLinear.texture = new THREE.CanvasTexture(this.bufferCanvasLinear.canvas);
        this.imageDataLinear            = this.bufferCanvasLinear.context.createImageData(this.maxData, 1);

        this.bufferCanvasLinear.texture.generateMipMaps = false;
        this.bufferCanvasLinear.texture.minFilter       = THREE.NearestFilter;
        this.bufferCanvasLinear.texture.magFilter       = THREE.NearestFilter;                
    }

    setupAudio() {
        // Exit if context is initialized
        if (typeof this.context !== "undefined") return;        
        
        this.context                          = new AudioContext();             // Create context
        this.gainNode                         = this.context.createGain();      // Setup gain
        this.analizer                         = this.context.createAnalyser();  // Setup analizer
        this.analizer.fftSize                 = this.audioOptions.fftSize;      // fftSize
        this.analizer.smoothingTimeConstant   = 0.8;                            // Smoothing Time
    }

    loadSong(path) {
        if (typeof this.song !== "undefined") {
            this.song.pause();
            this.songLoaded = false;
            this.isPlaying = false;
            this.audioOptions.onLoading();
        }
         
        this.song                = new Audio();
        this.song.controls       = true;
        this.song.crossOrigin    = "anonymous";
        this.song.src            = path;          // "/Canciones/cancion.mp3"
        this.song.addEventListener('canplay', () => { 
            this.canPlay();
            this.audioOptions.onCanPlay();
        });
        this.song.addEventListener('error',   () => { 
            this.isPlaying = false;
            this.audioOptions.onError();
        });
        this.song.addEventListener('ended'  , () => { 
            this.isPlaying = false;
            this.audioOptions.onEnded();
        });
        // ONLY WANT ONE CHANNEL UPDATING
        if (this.fistChannel === true) {
            // Update max time
            this.song.addEventListener('durationchange'  , () => { 
                this.audioOptions.onDurationChange(this.song.duration);
            });                
            // Update current time
            this.song.addEventListener('timeupdate'  , () => { 
                this.audioOptions.onTimeUpdate(this.song.currentTime);            
            });
            // Play and pause events only on the first channel
            this.song.addEventListener('play'  , () => { 
                this.audioOptions.onPlay();
            });        
            this.song.addEventListener('pause' , () => { 
                this.audioOptions.onPause();
            });        
        }
        
    }


    // Función que detecta si está en play o en pausa, y asigna el estado contrario
    playPause(path) {
        if (typeof this.context === "undefined") {
            this.setupAudio();
            this.loadSong(path);
        }

        this.context.resume();
        
        // If song is playing
        if (this.song.duration > 0 && !this.song.paused) { 
            this.song.pause();
            this.isPlaying = false;
        } 
        else {
            this.song.play();   
            this.isPlaying = true;
        }        

        // Ensure the current volume is the same of the UI
        this.volume(this.currentVolume);

        return this.isPlaying;               
    };


    canPlay() {
        if (this.songLoaded !== true) {
            if (typeof this.context === "undefined") {
                this.setupAudio();
            }
            this.songLoaded         = true;
            this.audioSource        = this.context.createMediaElementSource(this.song);
            this.audioSource.connect(this.analizer);
            this.analizer.connect(this.gainNode);
            this.gainNode.connect(this.context.destination);
        }
    }


    update(delta, freqDivisor) {
        // Avoid update if analizer is not created
        if (typeof this.analizer === "undefined") return;

        // Get wave frequancy buffers        
        this.analizer.getByteFrequencyData(this.analizerData);
        this.analizer.getByteTimeDomainData(this.analizerDataSin);
        
        // Paint audio texture using analizerData
        this.paintAudioTexture();

        // Get average frequency
        this.getAverageFrequency(delta, freqDivisor);
    }


    setTime(newTime) {
        if (typeof this.song === "undefined") return;
        this.song.currentTime = newTime;
    }

    /* 
     * Get average frequency values
     */
    getAverageFrequency(delta, freqDivisor) {
        // greus  de 0hz a 256hz
        // mitjos de 257hz a 2000hz
        // aguts  de 2001hz a 16000hz
        let hzBar       = this.context.sampleRate / this.audioOptions.fftSize;
        const divisions = [ 256, 2000, 16000, 50000 ];
        let total       = [ 0, 0, 0, 0, 0 ];// Graves, Medios, Agudos, Agudos inaudibles, Media de todo
        let values      = [ 0, 0, 0, 0, 0 ];// Graves, Medios, Agudos, Agudos inaudibles, Media de todo
        let pos         = 0;        
        
        for (let i = 0; i < this.maxData; i++) {
            if (i * hzBar > divisions[pos]) {
                pos++;
            }
            total[pos]  ++;
            values[pos] += this.analizerData[i];    // set the current pos average
            values[4]   += this.analizerData[i];    // set the total average
        }
        
        this.averageFrequency = [
            (values[0] / total[0]) / freqDivisor,    // High
            (values[1] / total[1]) / freqDivisor,    // Medium
            (values[2] / total[2]) / freqDivisor,    // Low
            (values[3] / total[3]) / freqDivisor,    // Inaudible
            (values[4] / this.maxData) / freqDivisor // Total average
        ]; 

        // update peaks
        const avf  = this.averageFrequency;
        const avfp = this.averageFrequencyPeaks;
        const d    = delta / 2500;
        for (let i = 0; i < 5; i++) {
            (avf[i] >= avfp[i]) ? avfp[i] = avf[i] : avfp[i] -= d;
        }
    }    

    paintAudioTexture() {
        for (let i = 0; i < this.maxData; i++) {
            let pos = i * 4;
            this.imageDataLinear.data[pos]     = this.analizerData[i];      // 
            this.imageDataLinear.data[pos + 1] = this.analizerDataSin[i];
            this.imageDataLinear.data[pos + 2] = 0;
            this.imageDataLinear.data[pos + 3] = 255;
        }
        this.bufferCanvasLinear.context.putImageData(this.imageDataLinear, 0, 0, 0, 0, this.maxData, 1);
        this.bufferCanvasLinear.texture.needsUpdate = true;
    }
}

/* 
 * AudioAnalizerSC
 *  This object acts as a single channel audio analizer using only one AudioChannel
 */
class AudioAnalizerSC {
    constructor(audioOptions) {
        const audioDefaultOptions = {
            // Default callbacks
            onPlay            : () => {}, // Playing the song
            onPause           : () => {}, // Pausing the song
            onTimeUpdate      : () => {}, // Updating current song time
            onDurationChange  : () => {}, // First time whe know duration of the song
            onEnded           : () => {}, // Song has reached the end
            onError           : () => {}, // Error...
            onCanPlay         : () => {}, // Song is ready to play
            onLoading         : () => {}, // Starting to load the song
            onBpmChange       : () => {}, // Current beat per minute is updated
            // Default values
            allowDropSong     : false,    // NOT IMPLEMENTED FOR 5 CHANNELS
            volume            : 0.5,      // 
            fftSize           : 1024      // fast fourier transform size (1024 gives 512 frequency values)
        }
        
        this.audioOptions = { ...audioDefaultOptions, ...audioOptions };

        this.experience = new Experience();

        // Song loaded flag
        this.songsLoaded = false;
        // Setup the drag & drop events
        if (this.audioOptions.allowDropSong) this.setupDragDropEvents();
        // Set the default volume
        this.currentVolume = this.audioOptions.volume;
        // Time to calculate beats per minute
        this.bpmTime = 0;
        // Beats per minute, if its 0 its not calculated
        this.bpm = 0;        
        this.currentBpm = 0;
        this.isPlaying = false;

        this.channelOptions = {
            // Default callbacks
            onPlay            : this.audioOptions.onPlay,           // Playing the song
            onPause           : this.audioOptions.onPause,          // Pausing the song
            onTimeUpdate      : this.audioOptions.onTimeUpdate,     // Updating current song time
            onDurationChange  : this.audioOptions.onDurationChange, // First time whe know duration of the song
            onEnded           : () => { this.onEnded() },           // Song has reached the end
            onError           : this.audioOptions.onError,          // Error...
            onCanPlay         : this.audioOptions.onCanPlay,         // Song is ready to play
            onLoading         : this.audioOptions.onLoading,        // Starting to load the song
            // Default values
            volume            : this.audioOptions.volume,           // 
            fftSize           : this.audioOptions.fftSize,          // fast fourier transform size (1024 gives 512 frequency bars)
//            saveAudioData     : this.audioOptions.saveAudioData     
        }


        this.channelSong  = new AudioChannel(this.channelOptions, true);
        this.channelBass  = this.channelSong;
        this.channelDrum  = this.channelSong;
        this.channelOther = this.channelSong;
        this.channelPiano = this.channelSong;
        this.channelVocal = this.channelSong;
        
        this.channels = [
            this.channelSong, 
            this.channelBass,
            this.channelDrum, 
            this.channelOther, 
            this.channelPiano, 
            this.channelVocal
        ];
        this.totalChannels   = this.channels.length;
        this.canPlayChannels = 0;
        this.endedChannels   = 0;

        this.resyncTime = 0;
    }

    setupDragDropEvents() {
        // Drag & drop events
        document.body.addEventListener("dragenter", (e) => { return false });
        document.body.addEventListener("dragover" , (e) => { return e.preventDefault()  });
        document.body.addEventListener("drop"     , (e) => {         
            this.loadSongDrop(e.dataTransfer.files);
            e.stopPropagation();  
            e.preventDefault(); 
        });
    }

    loadSongDrop(files) {
        this.loadSong(URL.createObjectURL(files[0]));
    }   
    

    volume(vol, debug = false) {
        if (typeof vol !== "undefined") this.currentVolume = vol;
        this.channelSong.volume(this.currentVolume);
    }

    speed(newSpeed) {
        if (typeof newSpeed !== "undefined") {
            this.channelSong.song.playbackRate = newSpeed;
        }
    }

    // Path must be a folder ending with '/' or '\'
    loadSong(path, bpm = 0) {
        // Reset time to calculate beats per minute
        this.bpm        = bpm;
        this.bpmTime    = 60000 / bpm;

        this.canPlayChannels = 0;
        this.endedChannels   = 0;
        this.resyncTime      = 0;

        // Load the main channel
        this.channelSong.loadSong(path + "Song.mp3");
    }


    onEnded() {
        this.isPlaying = false;

        this.audioOptions.onEnded();
    }

    setTime(newTime) {
        this.channelSong.setTime(newTime);
    }    

    playPause(path) {
        this.isPlaying = this.channelSong.playPause(path);
    }

    update(delta) {
        // freqDivisor is 512 because the main channel has higger values than i used to calculate bpm effects, and peak based animations
        this.channelSong.update(delta, 512);

        // Calculate current beats per minute 
        this.calculateCurrentBeat(delta);
    }

    calculateCurrentBeat() {
        if (this.experience.htmlElements.dragTime === true) return;

        let currentBpm = Math.floor((this.channelSong.song.currentTime * 1000) / this.bpmTime);
        if (isNaN(currentBpm)) 
            currentBpm = 0;

        if (this.currentBpm != currentBpm) {
            this.currentBpm = currentBpm;
            this.audioOptions.onBpmChange(this.currentBpm);

            this.resync();
        }
    }

    // whe dont need to resync because its only one channel
    resync() {

    }

    setFFTSize(fftSize) {
        console.log(fftSize)
        this.channelSong.setupTextures(fftSize);
        this.channelSong.analizer.fftSize = fftSize;
    }

}

/* 
 * AudioAnalizerMC
 *  This object is a six songs audio analizer using six AudioChannel (one for each song)
 */
class AudioAnalizerMC {
    constructor(audioOptions) {
        const audioDefaultOptions = {
            // Default callbacks
            onPlay            : () => {}, // Playing the song
            onPause           : () => {}, // Pausing the song
            onTimeUpdate      : () => {}, // Updating current song time
            onDurationChange  : () => {}, // First time whe know duration of the song
            onEnded           : () => {}, // Song has reached the end
            onError           : () => {}, // Error...
            onCanPlay         : () => {}, // Song is ready to play
            onLoading         : () => {}, // Starting to load the song
            onBpmChange       : () => {}, // Current beat per minute is updated
            // Default values
            allowDropSong     : false,    // NOT IMPLEMENTED FOR 5 CHANNELS
            volume            : 0.5,      // 
            fftSize           : 1024      // fast fourier transform size (1024 gives 512 frequency values)
        }
        
        this.audioOptions = { ...audioDefaultOptions, ...audioOptions };

        this.experience = new Experience();

        // Song loaded flag
        this.songsLoaded = false;
        // Setup the drag & drop events
        if (this.audioOptions.allowDropSong) this.setupDragDropEvents();
        // Set the default volume
        this.currentVolume = this.audioOptions.volume;
        // Time to calculate beats per minute
        this.bpmTime = 0;
        // Beats per minute, if its 0 its not calculated
        this.bpm = 0;        
        this.currentBpm = 0;
        this.isPlaying = false;

        this.channelOptions = {
            // Default callbacks
            onPlay            : this.audioOptions.onPlay,           // Playing the song
            onPause           : this.audioOptions.onPause,          // Pausing the song
            onTimeUpdate      : this.audioOptions.onTimeUpdate,     // Updating current song time
            onDurationChange  : this.audioOptions.onDurationChange, // First time whe know duration of the song
            onEnded           : () => { this.onEnded() },           // Song has reached the end
            onError           : this.audioOptions.onError,          // Error...
            onCanPlay         : () => { this.onCanPlay() },         // Song is ready to play
            onLoading         : this.audioOptions.onLoading,        // Starting to load the song
            // Default values
            volume            : this.audioOptions.volume,           // 
            fftSize           : this.audioOptions.fftSize,          // fast fourier transform size (1024 gives 512 frequency bars)
        }


        this.channelSong  = new AudioChannel(this.channelOptions, true);
        this.channelBass  = new AudioChannel(this.channelOptions, false);
        this.channelDrum  = new AudioChannel(this.channelOptions, false);
        this.channelOther = new AudioChannel(this.channelOptions, false);
        this.channelPiano = new AudioChannel(this.channelOptions, false);
        this.channelVocal = new AudioChannel(this.channelOptions, false);
        
        this.channels = [
            this.channelSong, 
            this.channelBass,
            this.channelDrum, 
            this.channelOther, 
            this.channelPiano, 
            this.channelVocal
        ];
        this.totalChannels   = this.channels.length;
        this.canPlayChannels = 0;
        this.endedChannels   = 0;

        this.resyncTime = 0;
    }
    
    /*
     * Setup volume for song if its in release
     * in debug mode sets all channels volume, and mutes the main song
     */ 
    volume(vol, debug = false) {
        if (typeof vol !== "undefined") this.currentVolume = vol;
        if (debug === false) {
            this.channelSong.volume(this.currentVolume);
        }
        else {
            this.channelSong.volume(0);
            for (let i = 1; i < this.totalChannels; i++) 
                this.channels[i].volume(this.currentVolume);
        }
    }

    /*
     * Setup the speed for all channels (only debug)
     */
    speed(newSpeed) {
        if (typeof newSpeed !== "undefined") {
            for (let i = 0; i < this.totalChannels; i++) 
                this.channels[i].song.playbackRate = newSpeed;
        }
    }

    // Path must be a folder ending with '/' or '\'
    loadSong(path, bpm = 0) {
        // Reset time to calculate beats per minute
        this.bpm = bpm;
        this.bpmTime = 60000 / bpm;
        this.currentBpm = 0;

        this.canPlayChannels = 0;
        this.endedChannels   = 0;
        this.resyncTime      = 0;

        // Load all the channels
        this.channelSong.loadSong(path + "Song.mp3");
        this.channelBass.loadSong(path + "Bass.mp3");
        this.channelDrum.loadSong(path + "Drum.mp3");
        this.channelOther.loadSong(path + "Other.mp3");
        this.channelPiano.loadSong(path + "Piano.mp3");
        this.channelVocal.loadSong(path + "Vocal.mp3");
    }


    onCanPlay() {
        this.canPlayChannels ++;
        if (this.canPlayChannels === this.totalChannels) {
            this.audioOptions.onCanPlay();
            this.canPlayChannels = 0;
        }
    }

    onEnded() {
        this.isPlaying = false;
        this.endedChannels ++;
        if (this.endedChannels === this.totalChannels) {

            this.endedChannels = 0;
            this.audioOptions.onEnded();
        }
    }

    setTime(newTime) {
        for (let i = 0; i < this.totalChannels; i++) 
            this.channels[i].setTime(newTime);
    }    

    playPause(path) {
        for (let i = 0; i < this.totalChannels; i++) 
            this.isPlaying = this.channels[i].playPause(path);
    }

    update(delta) {
        for (let i = 0; i < this.totalChannels; i++) {
            this.channels[i].update(delta, 255);
        }

        // Calculate current beats per minute 
        this.calculateCurrentBeat(delta);
    }

    calculateCurrentBeat() {
        if (this.experience.htmlElements.dragTime === true) return;

        let currentBpm = Math.floor((this.channelSong.song.currentTime * 1000) / this.bpmTime);
        if (isNaN(currentBpm)) 
            currentBpm = 0;

        if (this.currentBpm != currentBpm) {
            this.currentBpm = currentBpm;
            this.audioOptions.onBpmChange(this.currentBpm);

            this.resync();
        }
    }

    resync() {
        if (this.resyncTime > 0) {
            this.resyncTime -= 16;
            return;
        } 

        // Play and analize 5 sincronized songs its a loot of work for the CPU,
        // So whe need to ensure all the chanels are almost on the same current position
        let timeMin = this.channels[0].song.currentTime;
        let timeMax = timeMin;
        for (let i = 0; i < this.totalChannels; i++) {
            if (this.channels[i].song.currentTime < timeMin) timeMin = this.channels[i].song.currentTime;
            if (this.channels[i].song.currentTime > timeMax) timeMax = this.channels[i].song.currentTime;
        }
        // If the diference between all positions its more than 16ms
        if ((timeMax - timeMin) * 1000 > 16) {
            // set the current time for all songs
            for (let i = 1; i < this.totalChannels; i++) {
                this.channels[i].song.currentTime = this.channelSong.song.currentTime;
            }

            this.resyncTime = 5000;
        }
    }

    setFFTSize(fftSize) {
        for (let i = 0; i < this.totalChannels; i++) {
            this.channels[i].setupTextures(fftSize);
            this.channels[i].analizer.fftSize = fftSize;
        }
    }
 }

 /* 
  * Camera
  *  Handle the main camera
  */
 class Camera {
    // Constructor
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.time = this.experience.time;

        this.mouseX = 0;
        this.mouseY = 0;

        this.setInstance();
        if (options.orbitControls === true) {
            this.setOrbitControls();
        }
        else {
            this.setCameraControls();
        }
    }


    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 20000);
        this.instance.position.set(0, 0, 2);
        this.scene.add(this.instance);

        // Remove the update function if debug mode is active
        if (this.experience.options.debug === true) {
            this.update = () => {};
        }
    }


    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
    }

    setCameraControls() {
        this.experience.canvas.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX - (this.sizes.width * 0.5);
            this.mouseY = e.clientY - (this.sizes.height * 0.5);
        });
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        // update camera rotation using mouse coordinates
        this.instance.rotation.y = THREE.MathUtils.lerp(this.instance.rotation.y, (this.mouseX * Math.PI) / 15000, 0.15) 
        this.instance.rotation.x = THREE.MathUtils.lerp(this.instance.rotation.x, (this.mouseY * Math.PI) / 15000, 0.15)
    }
}


/* 
 * Color correction for pnmdrs postprocessing 
 */
class ColorCorrectionEffect extends Effect {
	constructor() {
		super("ColorCorrectionEffect", document.getElementById("ColorCorrectionFragment").innerHTML,
			{
				blendFunction: BlendFunction.ADD,
				uniforms : new Map([
					[ "powRGB" , new THREE.Uniform(new THREE.Vector3( 3, 3, 4 )) ],
					[ "mulRGB" , new THREE.Uniform(new THREE.Vector3( 2, 2, 5 )) ],
					[ "addRGB" , new THREE.Uniform(new THREE.Vector3( 0.05, 0.05, 0.25 )) ]
				]),
			}
		)
	}
};


/* 
 * Mirror mode effect for pnmdrs postprocessing
 */
class MirrorModeEffect extends Effect {

	constructor() {
		super("MirrorModeEffect", document.getElementById("MirrorModeFragment").innerHTML,
			{
				blendFunction: BlendFunction.ALPHA,
				uniforms : new Map([
					[ "uStartTime" 		  , new THREE.Uniform(0.0) ],
					[ "uEndTime"   		  , new THREE.Uniform(0.0) ],
					[ "uTime"      		  , new THREE.Uniform(0.0) ],
					[ "uTimeAnimationIn"  , new THREE.Uniform(0.0) ],
					[ "uTimeAnimationOut" , new THREE.Uniform(0.0) ],					
					[ "uDisplacement"     , new THREE.Uniform(0.0) ],					
					[ "uSize"      		  , new THREE.Uniform(new THREE.Vector2(0, 0)) ]
				]),
			}
		)
	}

	init(startTime, endTime, width, height, animationIn, animationOut, displacement) {
		this.uniforms.get("uStartTime").value = startTime;
		this.uniforms.get("uEndTime").value = endTime;
		this.uniforms.get("uTimeAnimationIn").value = animationIn;
		this.uniforms.get("uTimeAnimationOut").value = animationOut;
		this.uniforms.get("uDisplacement").value = displacement;
		this.uniforms.get("uSize").value = new THREE.Vector2(width, height);
	}
};


/*
 * Renderer using pnmdrs postprocessing
 */
class Renderer {
    // Costructor
    constructor() {
        // Get the experience instance
        this.experience = new Experience();
        this.canvas     = this.experience.canvas;
        this.sizes      = this.experience.sizes;
        this.scene      = this.experience.scene;
        this.camera     = this.experience.camera;
        this.time       = this.experience.time;
        this.world      = this.experience.world;

        this.setInstance();
    }

    setInstance() {

        this.instance = new THREE.WebGLRenderer({
            canvas          : this.canvas, 
            powerPreference : "high-performance",
            antialias       : false,
            stencil         : false,
            depth           : false
        })

        this.instance.outputColorSpace = THREE.SRGBColorSpace;
        this.instance.toneMapping = THREE.NoToneMapping;
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);


        this.effectComposer = new EffectComposer(this.instance, {
               frameBufferType: THREE.HalfFloatType
        });


        this.effectComposer.addPass(new RenderPass(this.scene, this.camera.instance));

        this.mirrorModeEffect = new MirrorModeEffect();
        this.mirrorModePass = new EffectPass(this.camera.instance, this.mirrorModeEffect);
        this.effectComposer.addPass(this.mirrorModePass);


        this.bloomEffect = new BloomEffect({ mipmapBlur : true, levels : 5 });
        this.bloomEffect.intensity = this.experience.options.bloomPmndrsIntensity;
        this.bloomEffect.luminanceMaterial.uniforms.threshold.value = this.experience.options.bloomPmndrsThreshold;
        this.bloomEffect.luminanceMaterial.uniforms.smoothing.value = this.experience.options.bloomPmndrsSmoothing;
        this.bloomEffect.mipmapBlurPass.radius = this.experience.options.bloomPmndrsRadius;
        this.bloomPass = new EffectPass(this.camera.instance, this.bloomEffect);
        this.effectComposer.addPass(this.bloomPass);

        this.colorCorrectionEffect = new ColorCorrectionEffect();

        this.colorCorrectionEffect.uniforms.get("powRGB").value = this.experience.options.colorCorrectionPowRGB;
        this.colorCorrectionEffect.uniforms.get("mulRGB").value = this.experience.options.colorCorrectionMulRGB;
        this.colorCorrectionEffect.uniforms.get("addRGB").value = this.experience.options.colorCorrectionAddRGB;
        this.colorCorrectionPass = new EffectPass(this.camera.instance, this.colorCorrectionEffect);
        this.effectComposer.addPass(this.colorCorrectionPass);


        this.toneMappingEffect = new ToneMappingEffect();
        this.toneMappingEffect.mode = ToneMappingMode.OPTIMIZED_CINEON;
        this.toneMappingEffect.exposure = 1.75;
        this.toneMappingPass = new EffectPass(this.camera.instance, this.toneMappingEffect);
        this.effectComposer.addPass(this.toneMappingPass);

        // Remove automatic GodRays with a separate channel because there is only one channel
        if (this.experience.options.audioMultiChannel === false) {
            this.updateGodRays = () => {}
        }
    }

    setGodRays(sunMesh) {        
        this.godRaysEffect = new GodRaysEffect(this.camera.instance, sunMesh);
        this.godRaysPass = new EffectPass(this.camera.instance, this.godRaysEffect);
        this.effectComposer.addPass(this.godRaysPass, 1);

        this.godRaysEffect.godRaysMaterial.density  = this.experience.options.godRaysDensity;
        this.godRaysEffect.godRaysMaterial.decay = this.experience.options.godRaysDecay;
        this.godRaysEffect.godRaysMaterial.weight = this.experience.options.godRaysWeigth;
        this.godRaysEffect.godRaysMaterial.exposure = this.experience.options.godRaysExposure;
        this.godRaysEffect.godRaysMaterial.clampMax = this.experience.options.godRaysClampMax;
        this.godRaysEffect.godRaysMaterial.samples = this.experience.options.godRaysSamples;

        // Setup the god rays update for single or multichannel
        this.updateGodRays = (this.experience.options.audioMultiChannel) ? this.updateGodRaysMC : this.updateGodRaysSC;

        // Set the update function for post quality selected
        this.update = this.updateQuality;
    }

    /**
     * Function called on resize
    */
    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
        
        this.effectComposer.setSize(this.sizes.width, this.sizes.height);
    }

    /*
     * Function called on update
     */
    update() {
        this.effectComposer.render();
    }

    updateQuality() {
        this.mirrorModeEffect.uniforms.get("uTime").value = this.experience.audioAnalizer.channelSong.song.currentTime;
        this.effectComposer.render();
        this.updateGodRays();
    }

    // Multichannel is more acurate and max values are low
    updateGodRaysMC() {
        const audioValue = (this.world.songChannels.SunRays.averageFrequency[1] * 0.75);
        this.godRaysEffect.godRaysMaterial.weight = 0.3 + audioValue;
        this.godRaysEffect.godRaysMaterial.density = 0.96 + audioValue;    
    }

    // Singlechannel is less acurate and max values are high because are an average of all channels
    updateGodRaysSC() {
        const audioValue = (this.world.songChannels.SunRays.averageFrequency[1] * 0.35);
        this.godRaysEffect.godRaysMaterial.weight = 0.3 + audioValue;
        this.godRaysEffect.godRaysMaterial.density = 0.96 + audioValue;    
    }
}


/* 
 * Resources
 */
class Resources extends EventEmitter {
    constructor(sources) {
        super();
        // options
        this.sources = sources;
        // setup
        this.items  = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }
    

    setLoaders() {
        this.loaders = {
            textureLoader       : new THREE.TextureLoader()
        }
    }

    startLoading() {
        for (const source of this.sources) {
            if (source.type === 'texture') {
                this.loaders.textureLoader.load(source.path, (file) =>{
                    this.sourceLoaded(source, file);
                })
            }
        }
    }


    sourceLoaded(source, file) {
        this.items[source.name] = file;
        this.loaded ++;
        if (this.loaded == this.toLoad) {
            // Send event 
            this.trigger('ready');
        }
    }

    get finished() {
        return  (this.loaded == this.toLoad);
    }
}


/* 
 * World - Spirals 
 *  3D Cone with one white spiral and one color spiral
 */
class Spirals {
    constructor(world) {
        this.experience    = new Experience();
        this.scene         = this.experience.scene;
        this.time          = this.experience.time;
        this.audioAnalizer = this.experience.audioAnalizer;
        this.world         = world;
        this.setup();
    }

    
    setup() {
        this.geometry = new THREE.CylinderGeometry( 0.01, 2, 64, 256, 1, true );

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uAudioTexture      : { value : this.audioAnalizer.channelSong.bufferCanvasLinear.texture },
                uAudioTexture2     : { value : this.audioAnalizer.channelVocal.bufferCanvasLinear.texture },
                uAudioStrength     : { value : this.experience.options.spiralAudioStrength },
                uAudioZoom         : { value : this.experience.options.spiralAudioZoom },
                uAudioStrengthSin  : { value : this.experience.options.spiralAudioStrengthSin },
                uAudioZoomSin      : { value : this.experience.options.spiralAudioZoomSin },
                uAudioValue        : { value : 0 },
                uAudioValue2       : { value : 0 },
                uTime              : { value : 0 },
                uFrequency         : { value : this.experience.options.spiralFrequency },
                uSpeed             : { value : this.experience.options.spiralSpeed },
                uThickness         : { value : this.experience.options.spiralThickness },
                uMirrors           : { value : this.experience.options.spiralMirrors },
                uFrequencySin      : { value : this.experience.options.spiralFrequencySin },
                uSpeedSin          : { value : this.experience.options.spiralSpeedSin },
                uThicknessSin      : { value : this.experience.options.spiralThicknessSin },
                uColorSin          : { value : this.experience.options.spiralColorSin }
            },
            vertexShader    : document.getElementById("BasicVertexShader").innerHTML,
            fragmentShader  : document.getElementById("SpiralsFragmentShader").innerHTML,
            transparent     : true, 
            side            : THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = Math.PI * -0.5;
        this.mesh.name = "Spirals";
        this.mesh.position.set(0, 0, -27);
        this.world.group.add(this.mesh);

    }

    update(delta) {
        // update rotation on the cilynder
        this.mesh.rotation.y += delta;
        // update audio value on spiral
        this.material.uniforms.uAudioValue.value  = (this.world.songChannels.SpiralBars.averageFrequency[4] * 4);
        this.material.uniforms.uAudioValue2.value = (this.world.songChannels.SpiralOsciloscope.averageFrequency[0]) + (this.audioAnalizer.channelVocal.averageFrequency[1] / 64) + (this.audioAnalizer.channelVocal.averageFrequency[2]);//        this.material.uniforms.uAudioValue.value = 1.0;
        // update time on spiral
        this.material.uniforms.uTime.value += delta;
    }
}

/* 
 * World - Sun
 *  2D Plane that shows a sun with plasma arround
 */
class Sun {
    constructor(world) {
        this.experience    = new Experience();
        this.scene         = this.experience.scene;
        this.time          = this.experience.time;
        this.audioAnalizer = this.experience.audioAnalizer;
        this.world         = world;
        this.setupSun();
    }

    
    setupSun() {
        this.geometry = new THREE.PlaneGeometry(12, 12);

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uAudioTexture      : { value : this.audioAnalizer.channelVocal.bufferCanvasLinear.texture },
                uTime              : { value : 0 },
                uAudioStrengthFreq : { value : this.experience.options.sunAudioStrengthFreq },
                uAudioStrengthSin  : { value : this.experience.options.sunAudioStrengthSin },
                uNoiseStrength     : { value : this.experience.options.sunNoiseStrength },
                uNoiseSpeed        : { value : this.experience.options.sunNoiseSpeed },
                uColorSin          : { value : this.experience.options.sunColorSin }
            },
            vertexShader    : document.getElementById("BasicVertexShader").innerHTML,
            fragmentShader  : document.getElementById("SunFragmentShader").innerHTML,
            transparent     : true, 
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.z = -Math.PI * 0.5;
        this.mesh.position.set(0, 0, -135);
        this.mesh.name = "Sun";
    
        this.scene.add(this.mesh);
    }

    update(delta) {
        // update time on sun
        this.material.uniforms.uTime.value += delta;   
    }    
}


/* 
 * Rays
 */
class Rays {
       
    constructor() {
        this.experience           = new Experience();
        this.scene                = this.experience.scene;
        this.sizes                = this.experience.sizes;
        this.audioAnalizer        = this.experience.audioAnalizer;

        this.createRandValues();

        this.setup();
    }

    createRandValues() {
        this.color = new THREE.Color(Math.random(), Math.random(), Math.random());
        this.speed = 0.3 + Math.random() * 1;

        this.size  = 0.01 + Math.random() * 0.2;
        this.rotationSpeed = Math.random() * 0.005 ;

        this.angle = Math.PI - Math.random(Math.PI * 2);
        this.radius = 0.4 + Math.random() * 2.8;
        this.position = new THREE.Vector3(Math.cos(this.angle * this.radius) , Math.sin(this.angle * this.radius), -60);
    }

    appyRandValues() {
        this.material.uniforms.uColor.value = this.color;
        this.material.uniforms.uSize.value = this.size;
        this.mesh.position.copy(this.position);
    }

    setup() {
        this.geometry = new THREE.PlaneGeometry(3, 0.2);

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uAudioValue    : { value : 0 },
                uSize          : { value : this.size },
                uColor         : { value : this.color }
            },
            vertexShader    : document.getElementById("BasicVertexShader").innerHTML,
            fragmentShader  : document.getElementById("RaysFragmentShader").innerHTML,
            transparent     : true,
            side            : THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.rotation.x = Math.PI * 0.5;
        this.mesh.rotation.z = Math.PI * 0.5;
        this.mesh.position.copy(this.position);

        this.scene.add(this.mesh);
    }


    update() {
        this.mesh.position.z += this.speed;
        this.angle += this.rotationSpeed;
        this.radius -= this.rotationSpeed * 0.5;
        this.mesh.position.x = Math.cos(this.angle * this.radius);
        this.mesh.position.y = Math.sin(this.angle * this.radius);
        
        this.material.uniforms.uAudioValue.value = 0.01 + (this.audioAnalizer.channelSong.averageFrequency[4] * 4);

        if (this.mesh.position.z > 5) {
            this.createRandValues();
            this.appyRandValues();
        }

    }
}


/* 
 * World - RaysFromHole 
 */
class RaysToHole {

    constructor() {
        this.experience = new Experience();
        this.numRays = this.experience.options.raysCount;
        this.setup();
    }

    setup() {
        this.Rays = [];
        for (let i = 0; i < this.numRays; i++) {
            this.Rays.push(new Rays())
        }
    }

    update() {
        for (let i = 0; i < this.numRays; i++) {
            this.Rays[i].update();
        }
    }
}

/* 
 * World - HMLBars (Lateral bars)
 */
class HMLBars {
    constructor(world) {
        this.experience           = new Experience();
        this.scene                = this.experience.scene;
        this.audioAnalizer        = this.experience.audioAnalizer;
        this.time                 = this.experience.time;
        this.world                = world;

        this.setup();
    }

    setup() {
        this.geometry = new THREE.PlaneGeometry(2048 * 4, 350);

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uAudioTexture  : { value : this.audioAnalizer.channelOther.bufferCanvasLinear.texture },
                uAudioTexture2 : { value : this.audioAnalizer.channelPiano.bufferCanvasLinear.texture },
                uAudioStrength : { value : this.experience.options.barsAudioStrength },
                uAudioZoom     : { value : this.experience.options.barsAudioZoom },
                uAudioValue    : { value : 0 },
                uSpeed         : { value : this.experience.options.barsSpeed },
                uTime          : { value : 0 }
            },
            vertexShader    : document.getElementById("BasicVertexShader").innerHTML,
            fragmentShader  : document.getElementById("HMLBarsFragmentShader").innerHTML,
            transparent     : true,
            side            : THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh2 = new THREE.Mesh(this.geometry, this.material);

        this.mesh.rotation.y = Math.PI * 0.5;
        this.mesh.position.set(-500, 0, -1024 * 4);

        this.mesh2.rotation.y = Math.PI * 0.5;
        this.mesh2.position.set(500, 0, -1024 * 4);

        this.world.group.add(this.mesh);        
        this.world.group.add(this.mesh2);        
    }


    update(delta) {        
        this.material.uniforms.uTime.value += delta;
        this.material.uniforms.uAudioValue.value = 0.01 + (this.world.songChannels.LateralBars1.averageFrequency[0] + this.world.songChannels.LateralBars2.averageFrequency[1]) * 1.5;
        this.mesh.scale.y  = 1 + (1.0 + Math.cos(this.time.current / 3000))  * (this.material.uniforms.uAudioValue.value);
        this.mesh2.scale.y = this.mesh.scale.y;
    }

}

/* 
 * World - HMLOsciloscope (Lateral osciloscopes)
 */
class HMLOsciloscope {

    constructor(world, timeline) {
        this.experience           = new Experience();
        this.scene                = this.experience.scene;
        this.audioAnalizer        = this.experience.audioAnalizer;
        this.time                 = this.experience.time;
        this.world                = world;
        this.timeline             = world.timeline;
        this.setup();
    }

    setup() {
        this.geometry = new THREE.PlaneGeometry(2048 * 4, 1280);

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uAudioTexture  : { value : this.audioAnalizer.channelVocal.bufferCanvasLinear.texture },
                uAudioStrength : { value : this.experience.options.hmsOsciloscopeAudioStrength },
                uAudioValue    : { value : new THREE.Vector4(0.0, 0.0, 0.0, 0.0) },
                uSpeed         : { value : this.experience.options.hmsOsciloscopeSpeed },
                uTime          : { value : 0 }
            },
            vertexShader    : document.getElementById("BasicVertexShader").innerHTML,
            fragmentShader  : document.getElementById("HMLOsciloscopeFragmentShader").innerHTML,
            transparent     : true,
            side            : THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh2 = new THREE.Mesh(this.geometry, this.material);

        this.mesh.rotation.z = -Math.PI * 0.5 ;
        this.mesh.rotation.x = -Math.PI * 0.5 ;
        this.mesh.position.set(0, 750, -1024 * 4);

        this.mesh2.rotation.z = -Math.PI * 0.5 ;
        this.mesh2.rotation.x = -Math.PI * 0.5 ;
        this.mesh2.position.set(0, -750, -1024 * 4);

        this.world.group.add(this.mesh);
        this.world.group.add(this.mesh2);

    }

    update(delta) {        
        this.material.uniforms.uTime.value += delta;

        this.material.uniforms.uAudioValue.value = new THREE.Vector4(
            this.world.songChannels.LateralOsciloscope.averageFrequencyPeaks[0] * 1.5, 
            this.world.songChannels.LateralOsciloscope.averageFrequencyPeaks[1] * 1.5,
            this.world.songChannels.LateralOsciloscope.averageFrequencyPeaks[2] * 1.5,
            this.world.songChannels.LateralOsciloscope.averageFrequencyPeaks[4] * 1.5
        );
        
        const scale = 0.5 + (this.audioAnalizer.channelDrum.averageFrequencyPeaks[1]);
        this.mesh.scale.y = scale;
        this.mesh2.scale.y = scale;
    }
}

/* 
 * World - Background
 */
class Background {
    constructor(world, name, width = 22400, height = 12600, x = 0, y = 0, z = -10000) {
        this.name = name;
        this.z = z;
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.world = world;
        this.setup(width, height, x, y, z);        
    }

    setup(width, height, x, y, z) {
        const ratio = this.experience.sizes.width / this.experience.sizes.height;
        this.geometry = new THREE.PlaneGeometry(width, height);

        this.material = new THREE.ShaderMaterial({
            uniforms : {
                uTexture1      : { value : this.experience.resources.items[this.name] },
                uAlpha         : { value : 0.125 },
                uActualTexture : { value : 1 },
                uTime          : { value : 0 },
            },
            vertexShader    : document.getElementById("BasicVertexShader").innerHTML,
            fragmentShader  : document.getElementById("BackgroundFragmentShader").innerHTML,
            transparent     : true, 
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(x, y, z + (ratio * 1000));
        this.mesh.name = this.name;
    
        this.scene.add(this.mesh);
    }

    updateBackground() {
        this.material.uniforms.uTime.value = 0;
        this.material.uniforms.uTexture1.value = this.experience.resources.items[this.name];
    }

    update(delta) {
        this.material.uniforms.uTime.value += delta;
    }

    resize() {
        const ratio = this.experience.sizes.width / this.experience.sizes.height;
        this.mesh.position.z = this.z + (ratio * 1000);
    }
}


/*
 * Base class for BPMEffect
 *  Needs two functions :
 *      setupAnimation(tl, start, duration)    initialize the gsap timeline animation 
 *      onUpdate(This)                         update your animation values 
 */
class BPMEffect {
    /*
     * this constructor has experience declared
     */
    constructor() {
        this.experience = new Experience();
        this.name     = "BPMEffect";
        this.params   = "(0, 0)";
        this.start    = 0;
        this.duration = 0;   
        // initialize experience.effectsId value if is undefined
        if (typeof (this.experience.effectsId) === "undefined") this.experience.effectsId = 0;
        // set the unique id for this animation
        this.id = `id${this.experience.effectsId ++}`; 

        // disable debug functions
        if (this.experience.options.debug !== true) {
            this.onStart          = () => {};
            this.onComplete       = () => {};
            this.onUpdateProgress = () => {};
        }
    }

    /*
     * This function creates a debug ui for this effect
     */
    onStart(This) {
        const bpmMS = This.experience.song.bpmMS;
        let bpmStart = Math.round((This.start / bpmMS) * 1000);
        let bpmEnd   = bpmStart + Math.round((This.duration / bpmMS) * 1000);
        This.debugEffect = new DebugEffect(This.name, bpmStart, bpmEnd, This.params);
        This.element = This.debugEffect.element;
    }

    /*
     * This function removes the debug ui for this effect with a css transition
     */
    onComplete(This) {
        if (typeof(This.element) !== "undefined") {
            This.element.setAttribute("visible", "false");            
            setTimeout(() => { This.element.remove(); }, 500);
        } 
    }

    /*
     * This function updates the debug ui progress for this effect
     */
    onUpdateProgress(current, total) {
        let val = (current / total) * 100;
        if (typeof(this.element) !== "undefined") this.element.style.backgroundPositionX = `${100 - Math.floor(val)}%`;
    }
}


/*
 * BPMEffect - Bloom
 */
class BPMBloom extends BPMEffect {
    constructor({ 
            originIntensity = 0.7, 
            originRadius = 0.98, 
            destIntensity = 0.7, 
            destRadius = 0.98, 
            ease = "none", 
            yoyo = false 
        }) {
        super();
        this.ease   = ease;
        this.yoyo   = yoyo;
        this.name   = `Bloom`;
        this.params = `(${destIntensity}, ${destRadius})`; 
        this.origin = [ originIntensity, originRadius ];
        this.dest   = [ destIntensity, destRadius ];
    }

    setupAnimation(tl, start, duration) {
        this.start     = start;
        this.duration  = duration;
        this.bloomEffect = this.experience.renderer.bloomEffect;


        tl.to(
            this.origin, 
            { 
                id               : this.id,
                ease             : this.ease,
                repeat           : (this.yoyo === true) ? 1 : 0,
                yoyo             : this.yoyo,
                duration         : this.duration,
                endArray         : this.dest,
                onUpdate         : this.onUpdate, 
                onUpdateParams   : [ this ],
                onStart          : this.onStartBloom,
                onStartParams    : [ this ],
                onComplete       : this.onComplete,
                onCompleteParams : [ this ],
            },
            this.start
        )

        this.tween = tl.getById(this.id);
    }

    onStartBloom(This) {
        This.onStart(This);
    }

    onUpdate(This) {
        This.bloomEffect.intensity             = this.targets()[0][0];
        This.bloomEffect.mipmapBlurPass.radius = this.targets()[0][1];
        This.onUpdateProgress(this._tTime, this._tDur);        
    }
}

/*
 * BPMEffect - Spiral scale
 */
class BPMSpiralsScale extends BPMEffect {
    constructor({scaleX = 1, scaleY = 1, scaleZ = 1, ease = "bounce", yoyo = true}) {
        super();
        this.dest = [ scaleX ,scaleY, scaleZ ];
        
        this.name = "SpiralsScale";
        this.params = `(${scaleX}, ${scaleY}, ${scaleZ})`;

        this.ease = ease;
        this.yoyo = yoyo;
    }

    setupAnimation(tl, start, duration) {
        this.start     = start;
        this.duration  = duration;

        this.spiralsMesh = this.experience.world.spirals.mesh;

        this.origin = [ this.spiralsMesh.scale.x, this.spiralsMesh.scale.y, this.spiralsMesh.scale.x ];

        tl.to(
            this.origin, 
            { 
                id               : this.id,
                ease             : this.ease,
                repeat           : (this.yoyo === true) ? 1 : 0,
                yoyo             : this.yoyo,
                duration         : this.duration,
                endArray         : this.dest,
                onUpdate         : this.onUpdate,
                onUpdateParams   : [ this ],
                onStart          : this.onStart,
                onStartParams    : [ this ],
                onComplete       : this.onComplete,
                onCompleteParams : [ this ],
            },
            this.start
        )
    }

    onUpdate(This) {
        This.spiralsMesh.scale.x = this.targets()[0][0];
        This.spiralsMesh.scale.y = this.targets()[0][1];
        This.spiralsMesh.scale.z = this.targets()[0][2];

        This.onUpdateProgress(this._tTime, this._tDur);        
    }
}

/*
 * BPMEffect - Spiral bars
 */
class BPMSpiralBars extends BPMEffect {
    constructor({ 
        originAudioStrength = options.spiralAudioStrength, 
        originThickness     = options.spiralThickness, 
        originMirrors       = options.spiralMirrors,
        destAudioStrength   = options.spiralAudioStrength, 
        destThickness       = options.spiralThickness, 
        destMirrors         = options.spiralMirrors,        
        ease                = "none", 
        yoyo                = true 
    }) {
        super();
        this.dest = [ destAudioStrength , destThickness, destMirrors ];
        this.origin = [ originAudioStrength, originThickness, originMirrors ];
        
        this.name = "SpiralBars";
        this.params = `(${destAudioStrength}, ${destThickness}, ${destMirrors})`;

        this.ease = ease;
        this.yoyo = yoyo;
    }


    setupAnimation(tl, start, duration) {
        this.start     = start;
        this.duration  = duration;

        this.spiralUniforms = this.experience.world.spirals.material.uniforms;        

        tl.to(
            this.origin, 
            { 
                id               : this.id,
                ease             : this.ease,
                repeat           : (this.yoyo === true) ? 1 : 0,
                yoyo             : this.yoyo,
                duration         : this.duration,
                endArray         : this.dest,
                onUpdate         : this.onUpdate,
                onUpdateParams   : [ this ],
                onStart          : this.onStart,
                onStartParams    : [ this ],
                onComplete       : this.onComplete,
                onCompleteParams : [ this ],
            },
            this.start
        )
    }

    
    onUpdate(This) {
        This.spiralUniforms.uAudioStrength.value = this.targets()[0][0];
        This.spiralUniforms.uThickness.value     = this.targets()[0][1];
        This.spiralUniforms.uMirrors.value       = Math.floor(this.targets()[0][2]);

        This.onUpdateProgress(this._tTime, this._tDur);        
    }

}

/*
 * BPMEffect - Spiral osciloscope
 */
class BPMSpiralOsciloscope extends BPMEffect {
    constructor({audioStrength = 0.4, thickness = 0.05, color = new THREE.Color(1, 1, 1), ease = "none", yoyo = true}) {
        super();
        this.dest = [ audioStrength, thickness, color.r, color.g, color.b ];
        
        this.name   = "SpiralOsciloscope";
        this.params = `(${audioStrength}, ${thickness})`;

        this.ease = ease;
        this.yoyo = yoyo;
    }

    setupAnimation(tl, start, duration) {
        this.start     = start;
        this.duration  = duration;

        this.spiralUniforms = this.experience.world.spirals.material.uniforms;
        this.sunUniforms = this.experience.world.sun.material.uniforms;
        
        this.origin = [ this.spiralUniforms.uAudioStrengthSin.value, this.spiralUniforms.uThicknessSin.value,
            this.spiralUniforms.uColorSin.value.r, this.spiralUniforms.uColorSin.value.g, this.spiralUniforms.uColorSin.value.b
        ];

        tl.to(
            this.origin, 
            { 
                id               : this.id,
                ease             : this.ease,
                repeat           : (this.yoyo === true) ? 1 : 0,
                yoyo             : this.yoyo,
                duration         : this.duration,
                endArray         : this.dest,
                onUpdate         : this.onUpdate,
                onUpdateParams   : [ this ],
                onStart          : this.onStart,
                onStartParams    : [ this ],
                onComplete       : this.onComplete,
                onCompleteParams : [ this ],
            },
            this.start
        )
    }

    onUpdate(This) {
        This.spiralUniforms.uAudioStrengthSin.value = this.targets()[0][0];
        This.spiralUniforms.uThicknessSin.value     = this.targets()[0][1];
        This.spiralUniforms.uColorSin.value         = new THREE.Color(this.targets()[0][2], this.targets()[0][3], this.targets()[0][4]);
        This.sunUniforms.uColorSin.value = This.spiralUniforms.uColorSin.value;
        This.onUpdateProgress(this._tTime, this._tDur);        
    }

}

/*
 * BPMEffect - Spiral lateral bars
 */
class BPMLateralBars extends BPMEffect {
    constructor({ 
        position      = 500, 
        ease          = "none", 
        yoyo          = true 
    }) {
        super();
        this.dest = [ position ];
        
        this.name = "LateralBars";
        this.params = `(${position})`;

        this.ease = ease;
        this.yoyo = yoyo;
    }


    setupAnimation(tl, start, duration) {
        this.start     = start;
        this.duration  = duration;

        this.lateralBars = this.experience.world.hmlBars;
       
        // Mesh2 is positive, mesh is negative
        this.origin = [ this.lateralBars.mesh2.position.x ];

        tl.to(
            this.origin, 
            { 
                id               : this.id,
                ease             : this.ease,
                repeat           : (this.yoyo === true) ? 1 : 0,
                yoyo             : this.yoyo,
                duration         : this.duration,
                endArray         : this.dest,
                onUpdate         : this.onUpdate,
                onUpdateParams   : [ this ],
                onStart          : this.onStart,
                onStartParams    : [ this ],
                onComplete       : this.onComplete,
                onCompleteParams : [ this ],
            },
            this.start
        )
    }

    
    onUpdate(This) {
        const value = this.targets()[0][0];
        This.lateralBars.mesh.position.x = -value;
        This.lateralBars.mesh2.position.x = value;

        This.onUpdateProgress(this._tTime, this._tDur);        
    }

}

/*
 * BPMEffect - Color correction
 */
class BPMColorCorrection extends BPMEffect {

    constructor({originPow = [3, 3, 3], originMul = [2, 2, 2], originAdd = [0.05, 0.05, 0.05],
                 destPow   = [3, 3, 3], destMul   = [2, 2, 2], destAdd   = [0.05, 0.05, 0.05],
                 ease = "none", yoyo = false }) {
        super();
        
        this.ease = ease;
        this.yoyo = yoyo;

        this.name = "ColorCorrection";
        this.params = `(...)`;

        this.dest = [
            destPow[0], destPow[1], destPow[2], 
            destMul[0], destMul[1], destMul[2], 
            destAdd[0], destAdd[1], destAdd[2]
        ];
        this.origin = [ 
            originPow[0], originPow[1], originPow[2], 
            originMul[0], originMul[1], originMul[2], 
            originAdd[0], originAdd[1], originAdd[2]
        ];
    }


    setupAnimation(tl, start, duration) {
        this.start     = start;
        this.duration  = duration;

        this.colorCorrectionEffect = this.experience.renderer.colorCorrectionEffect;
        this.powOrigin  = this.colorCorrectionEffect.uniforms.get("powRGB").value;
        this.mulOrigin  = this.colorCorrectionEffect.uniforms.get("mulRGB").value;
        this.addOrigin  = this.colorCorrectionEffect.uniforms.get("addRGB").value;


        tl.to(
            this.origin, 
            { 
                id               : this.id,
                ease             : this.ease,
                repeat           : (this.yoyo === true) ? 1 : 0,
                yoyo             : this.yoyo,
                duration         : this.duration,
                endArray         : this.dest,
                onUpdate         : this.onUpdate,
                onUpdateParams   : [ this ],
                onStart          : this.onStart,
                onStartParams    : [ this ],
                onComplete       : this.onComplete,
                onCompleteParams : [ this ],
            },
            this.start
        )
    }

    onUpdate(This) {
        This.colorCorrectionEffect.uniforms.get("powRGB").value.x = this.targets()[0][0];
        This.colorCorrectionEffect.uniforms.get("powRGB").value.y = this.targets()[0][1];
        This.colorCorrectionEffect.uniforms.get("powRGB").value.z = this.targets()[0][2];
        This.colorCorrectionEffect.uniforms.get("mulRGB").value.x = this.targets()[0][3];
        This.colorCorrectionEffect.uniforms.get("mulRGB").value.y = this.targets()[0][4];
        This.colorCorrectionEffect.uniforms.get("mulRGB").value.z = this.targets()[0][5];
        This.colorCorrectionEffect.uniforms.get("addRGB").value.x = this.targets()[0][6];
        This.colorCorrectionEffect.uniforms.get("addRGB").value.y = this.targets()[0][7];
        This.colorCorrectionEffect.uniforms.get("addRGB").value.z = this.targets()[0][8];
        This.onUpdateProgress(this._tTime, this._tDur);        
    }
}

/*
 * BPMEffect - Mirror mode
 */
class BPMMirror extends BPMEffect {
    constructor({ 
        animationIn   = 0.5, 
        animationOut  = 0.5, 
        displacement  = 0.125,
        ease          = "none", 
        yoyo          = false 
    }) {
        super();
        this.dest = [ 1 ];
        this.animationIn = animationIn;
        this.animationOut = animationOut;
        this.displacement = displacement;
        
        this.name = "MirrorMode";
        this.params = `(${animationIn, animationOut})`;

        this.ease = ease;
        this.yoyo = yoyo;
    }


    setupAnimation(tl, start, duration) {
        this.start     = start;
        this.duration  = duration;

        this.mirrorEffect = this.experience.renderer.mirrorModeEffect;
        
        // Mesh2 is positive, mesh is negative
        this.origin = [ 0 ];

        tl.to(
            this.origin, 
            { 
                id               : this.id,
                ease             : this.ease,
                repeat           : (this.yoyo === true) ? 1 : 0,
                yoyo             : this.yoyo,
                duration         : this.duration,
                endArray         : this.dest,
                onUpdate         : this.onUpdate,
                onUpdateParams   : [ this ],
                onStart          : this.onStart,
                onStartParams    : [ this ],
                onComplete       : this.onComplete,
                onCompleteParams : [ this ],
            },
            this.start
        )
    }

    
    onUpdate(This) {
        const value = (this.targets()[0][0]);
        if (value > 0) {
            This.mirrorEffect.init(This.start, This.start + This.duration, This.experience.sizes.width, This.experience.sizes.height, This.animationIn, This.animationOut, This.displacement);
        }

        This.onUpdateProgress(this._tTime, this._tDur);        
    }
}

/* 
 * Kill City Kills song config and effect list
 */
class KillCityKills {
    constructor(audioAnalizer) {        
        this.channels = {
            LateralBars1       : audioAnalizer.channelOther,
            LateralBars2       : audioAnalizer.channelBass,
            LateralOsciloscope : audioAnalizer.channelDrum,
            Sun                : audioAnalizer.channelVocal,
            SunRays            : audioAnalizer.channelVocal,
            SpiralBars         : audioAnalizer.channelSong,
            SpiralOsciloscope  : audioAnalizer.channelVocal
        }
    }

    effects = [
        {   // Slow color correction to blue
            start : 1, end : 30,
            effect : new BPMColorCorrection({ destPow : [3, 3, 8], destMul : [2, 2, 15], destAdd : [0.05, 0.05, 0.5] })
        },
        {   // batery
            start : 8.5, end : 9.0,
            effect : new BPMSpiralsScale({ scaleX : 2, scaleZ : 0.65, ease : "bounce" })
        },
        {   // batery
            start : 9, end : 9.5,
            effect : new BPMSpiralsScale({ scaleZ : 3, scaleX : 0.75, scaleY : 0.63, ease : "bounce" })
        },
        {   // batery
            start : 12, end : 12.5,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" }) //effect : new BPMSpiralsScale({ scaleX : 0.375, ease : "bounce" })
        },
        {   // bass changing rithm
            start : 24.75, end : 25.25,            
            effect : new BPMSpiralsScale({ scaleX : 3.5, ease : "bounce" })
        },

        {   // first yell
            start : 33, end : 41, 
            effect : new BPMSpiralOsciloscope({ audioStrength : 1.75, thickness : 0.15, color : new THREE.Color(2,2,0) })
        },
        {   // end first yell and begin of a second mini yell
            start : 49, end : 51, 
            effect : new BPMSpiralOsciloscope({ audioStrength : 1.5, thickness : 0.2, color : new THREE.Color(2,0,0) })
        },
        {   // woooOOO
            start : 73, end : 77, 
            effect : new BPMSpiralBars({ destThickness : 0.35 })
        },    
        {   // woooOOO
            start : 89, end : 93, 
            effect : new BPMSpiralBars({ destThickness : 0.5 })
        },   
               
        {   // 
            start : 89, end : 93, 
            effect : new BPMBloom({ destIntensity : 2.48, destRadius : 1.15, yoyo : true })
        },            
        {   // right
            start : 113.5,  end : 115,
            effect : new BPMColorCorrection({
                originPow : [3, 3, 8], originMul : [2, 2, 15] , originAdd : [0.05, 0.05, 0.5], 
                destPow   : [8, 3, 8], destMul   : [15, 2, 15], destAdd   : [0.6, 0.05, 0.5],
                yoyo : true 
            })
        },
        {   // right
            start : 114,  end : 114.5,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" })
        },
        {   // right
            start : 114,  end : 114.25,
            effect : new BPMSpiralsScale({ scaleX : 2.3, scaleZ : 0.75, ease : "bounce-inOut" })
        },
        {   // 
            start : 144, end : 146, 
            effect : new BPMBloom({ destIntensity : 1.48, destRadius : 1.15, yoyo : true })
        },            
        {   // hey
            start : 144.5, end : 145,
            effect : new BPMSpiralBars({ destThickness : 0.15, destAudioStrength : 0.75, ease : "bounce" })
        },
        {   // hey
            start : 144.5, end : 145,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" })
        },

        {   // Last hey add a mirror
            start : 144.5, end : 145, 
            effect : new BPMSpiralBars({ originMirrors : 1, destMirrors : 2,  yoyo : false })
        },            

        {   // hey
            start : 145.5, end : 146,
            effect : new BPMSpiralBars({ originMirrors : 2, destMirrors : 2, destThickness : 0.15, destAudioStrength : 0.75, ease : "bounce" })
        },           
        {   // hey
            start : 145.5, end : 146,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" })
        },
        {
            start : 161.5, end : 162,
            effect : new BPMSpiralsScale({ scaleX : 2.3, scaleY : 1.3, scaleZ : 0.75, ease : "bounce-inOut" })
        },            
        {   // woooOOO
            start : 175, end : 178.5, 
            effect : new BPMSpiralBars({ destThickness : 0.35, originMirrors : 2, destMirrors : 2 })
        },     

        {   // mayday
            start : 182.5, end : 184, 
            effect : new BPMBloom({ destIntensity : -1.1, destRadius : -1.85, yoyo : true })
        },
        {   // mayday
            start : 184.5, end : 185.5,
            effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
        },
        {   // oneday
            start : 192.5, end : 194,
            effect : new BPMBloom({ destIntensity : 3, destRadius : 1.35, yoyo : true })
        },

        {   // woooOOO
            start : 202, end : 206.5, 
            effect : new BPMSpiralBars({ destThickness : 0.35, originMirrors : 2, destMirrors : 2 })
        },            
        {   // wuah
            start : 211, end : 211.5,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" })
        },
        {   // woooOOO
            start : 218, end : 223.25, 
            effect : new BPMSpiralBars({ destThickness : 0.5, originMirrors : 2, destMirrors : 2 })
        },    
        {   // right
            start : 243.5,  end : 245,
            effect : new BPMColorCorrection({
                originPow : [3, 3, 8], originMul : [2, 2, 15] , originAdd : [0.05, 0.05, 0.5], 
                destPow   : [8, 3, 8], destMul   : [15, 2, 15], destAdd   : [0.6, 0.05, 0.5],
                yoyo : true 
            })
        },
        {   // right
            start : 244,  end : 244.5,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" })
        },
        {   // right
            start : 244,  end : 244.25,
            effect : new BPMSpiralsScale({ scaleX : 2.3, scaleZ : 0.75, ease : "bounce-inOut" })
        },

        {   // hey
            start : 274, end : 274.75,
            effect : new BPMSpiralsScale({ scaleX : 3.5, ease : "bounce" })
        },
        {   // hey
            start : 274.75, end : 275.5,
            effect : new BPMSpiralsScale({ scaleZ : 2.75, ease : "bounce" })
        },

        {   // now!
            start : 291, end : 291.5,
            effect : new BPMBloom({ destIntensity : 3, destRadius : 1.35, yoyo : true })
        },
        {   // now!
            start : 291.25, end : 291.75,
            effect : new BPMLateralBars({ position : 25, ease : "bounce" }) //effect : new BPMSpiralsScale({ scaleX : 0.375, ease : "bounce" })
        },

        {   // woooOOO
            start : 304, end : 308, 
            effect : new BPMSpiralBars({ destThickness : 0.35, originMirrors : 2, destMirrors : 2 })
        },    

        {   // mayday
            start : 312.5, end : 313.5, 
            effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
        },
        {   // mayday
            start : 314.5, end : 315.5,
            effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
        },
        {   // oneday
            start : 322.5, end : 324,
            effect : new BPMBloom({ destIntensity : 3, destRadius : 1.35, yoyo : true })
        },

        {   // woooOOO
            start : 326, end : 332.5, 
            effect : new BPMSpiralBars({ destThickness : 0.35, originMirrors : 2, destMirrors : 2 })
        },    

        {   // woooOOO
            start : 341, end : 347.5, 
            effect : new BPMSpiralBars({ destThickness : 0.5, originMirrors : 2, destMirrors : 2 })
        },    

        {   // yell
            start : 356, end : 361, 
            effect : new BPMSpiralOsciloscope({ audioStrength : .75, thickness : 0.25, color : new THREE.Color(0,2,3) })
        },
                       
        {   // Guitar solo (ends 423)
            start : 390, end : 394, 
            effect : new BPMSpiralBars({ destThickness : 0.25, originMirrors : 2, destMirrors : 64, destAudioStrength : 0.5, yoyo : false })
        },            

        {   // Guitar solo first end
            start : 394, end : 395,
            effect : new BPMLateralBars({ position : 50, ease : "elastic" })
        },
        {   // Guitar solo first end
            start : 393.5, end : 399.5,
            effect : new BPMMirror({ animationIn : 0.5, animationOut : 1.5, displacement : 0.2 })
        },


        {   // remove thickness
            start : 399, end : 402, 
            effect : new BPMSpiralBars({ originAudioStrength : 0.5, destAudioStrength : 0.5, originThickness : 0.25, originMirrors : 64, destMirrors : 64, destThickness : 0.15,  yoyo : false })
        },            
        {   // Guitar solo bloom 2
            start : 404, end : 408, 
            effect : new BPMBloom({ destIntensity : 2, destRadius : 1.12,  yoyo : false })
        },            
        {   // Guitar solo (ends 423)
            start : 406, end : 415, 
            effect : new BPMSpiralBars({ originAudioStrength : 0.5, originThickness : 0.15,  originMirrors : 64, destMirrors : 3,  yoyo : false })
        },            
        {   // Solo guitar achord
            start : 406, end : 406.5, 
            effect : new BPMSpiralsScale({ scaleX : 1.75, ease : "bounce" })
        },            
        {   // Solo guitar achord
            start : 410, end : 410.5, 
            effect : new BPMSpiralsScale({ scaleX: 0.25, ease : "bounce" })
        },            
        {   // Guitar solo mirror 2
            start : 413, end : 427, 
            effect : new BPMMirror({ animationIn : 1.0, animationOut : 2.5, displacement : 0.2 })
        },    


        {   // Guitar solo (ends 423)
            start : 419, end : 423, 
            effect : new BPMBloom({ originIntensity : 2, originRadius : 1.12, yoyo : false })
        },            
        {   // batery
            start : 430, end : 430.5,
            effect : new BPMSpiralsScale({ scaleX : 2, scaleZ : 0.65, ease : "bounce" })
        },
        {   // batery
            start : 430.5, end : 431,
            effect : new BPMSpiralsScale({ scaleZ : 3, scaleX : 0.75, scaleY : 0.63, ease : "bounce" })
        },
        {   // batery
            start : 434, end : 434.5,
            effect : new BPMSpiralsScale({ scaleX : 0.375, ease : "bounce" })
        },


        {   // are you ready
            start : 445,  end : 449,
            effect : new BPMColorCorrection({
                originPow : [3, 3, 8], originMul : [2, 2, 15] , originAdd : [0.05, 0.05, 0.5], 
                destPow   : [3, 8, 8], destMul   : [2, 15, 15],  destAdd   : [0.05, 0.5, 0.5],
                yoyo : true 
            })
        },

        {   // bass changing rithm
            start : 446.75, end : 447.25,            
            effect : new BPMSpiralsScale({ scaleX : 3.5, ease : "bounce" })
        },


        {   // yell
            start : 454, end : 460, 
            effect : new BPMSpiralOsciloscope({ audioStrength : .75, thickness : 0.15, color : new THREE.Color(2,0,0) })
        },

        {   // woooOOO
            start : 467, end : 470, 
            effect : new BPMSpiralBars({ destThickness : 0.35, originMirrors : 3, destMirrors : 3 })
        },    


        {   // mayday
            start : 475, end : 476, 
            effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
        },
        {   // mayday
            start : 477.5, end : 478.5,
            effect : new BPMBloom({ destIntensity : -3, destRadius : 0.85, yoyo : true })
        },
        {   // oneday
            start : 485.5, end : 487,
            effect : new BPMBloom({ destIntensity : 3, destRadius : 1.35, yoyo : true })
        },

        {   // woooOOO
            start : 488, end : 493.5, 
            effect : new BPMSpiralBars({ destThickness : 0.35, originMirrors : 3, destMirrors : 3  })
        },    
        
        {   // woooOOO
            start : 503, end : 508.5, 
            effect : new BPMSpiralBars({ destThickness : 0.5, originMirrors : 3, destMirrors : 3  })
        },    
        


        {   // yell
            start : 520, end : 521, 
            effect : new BPMSpiralOsciloscope({ audioStrength : 1.5, thickness : 0.15, color : new THREE.Color(2,0,0) })
        },
        {   // yell
            start : 535, end : 540, 
            effect : new BPMSpiralOsciloscope({ audioStrength : 1.75, thickness : 0.2, color : new THREE.Color(0,0,2) })
        },


        {   // end yell
            start : 553, end : 556, 
            effect : new BPMSpiralOsciloscope({ audioStrength : 1.5, thickness : 0.15, color : new THREE.Color(2,0,0) })
        },

        {   // end
            start : 553,  end : 553.5,
            effect : new BPMLateralBars({ position : 50, ease : "bounce" })
        },
        {   // end
            start : 552.5,  end : 553,
            effect : new BPMSpiralsScale({ scaleX : 2.3, scaleZ : 0.75, ease : "bounce-inOut" })
        },


        { // invert first blue color correction to black
            start : 560,  end : 561,
            effect : new BPMColorCorrection({ 
                originPow : [3, 3, 8], originMul : [2, 2, 15], originAdd : [0.05, 0.05, 0.5], 
                destPow   : [3, 3, 3], destMul   : [2, 2, 2] , destAdd   : [0.05, 0.05, 0.05] 
            })
        }
    ]
}

/* 
 * Nothing's over song config, with empty effect list
 */
class NothingsOver {
    constructor(audioAnalizer) {        
        this.channels = {
            LateralBars1       : audioAnalizer.channelOther,
            LateralBars2       : audioAnalizer.channelPiano,
            LateralOsciloscope : audioAnalizer.channelDrum,
            Sun                : audioAnalizer.channelVocal,
            SunRays            : audioAnalizer.channelVocal,
            SpiralBars         : audioAnalizer.channelSong,
            SpiralOsciloscope  : audioAnalizer.channelVocal
        }
    }

    effects = [
    ]
}

/* 
 * One chance song config, with empty effect list
 */
class OneChance {
    constructor(audioAnalizer) {        
        this.channels = {
            LateralBars1       : audioAnalizer.channelOther,
            LateralBars2       : audioAnalizer.channelBass,
            LateralOsciloscope : audioAnalizer.channelDrum,
            Sun                : audioAnalizer.channelVocal,
            SunRays            : audioAnalizer.channelVocal,
            SpiralBars         : audioAnalizer.channelSong,
            SpiralOsciloscope  : audioAnalizer.channelVocal
        }
    }

    effects = []
}

/* 
 * Quantum ocean song config, with empty effect list
 */
class QuantumOcean {
    constructor(audioAnalizer) {        
        this.channels = {
            LateralBars1       : audioAnalizer.channelOther,
            LateralBars2       : audioAnalizer.channelBass,
            LateralOsciloscope : audioAnalizer.channelDrum,
            Sun                : audioAnalizer.channelVocal,
            SunRays            : audioAnalizer.channelVocal,
            SpiralBars         : audioAnalizer.channelSong,
            SpiralOsciloscope  : audioAnalizer.channelVocal
        }
    }

    effects = [
    ]
}

/* 
 * Six feet under song config, with empty effect list
 */
class SixFeetUnder {
    constructor(audioAnalizer) {        
        this.channels = {
            LateralBars1       : audioAnalizer.channelOther,
            LateralBars2       : audioAnalizer.channelBass,
            LateralOsciloscope : audioAnalizer.channelDrum,
            Sun                : audioAnalizer.channelVocal,
            SunRays            : audioAnalizer.channelVocal,
            SpiralBars         : audioAnalizer.channelSong,
            SpiralOsciloscope  : audioAnalizer.channelVocal
        }
    }

    effects = [
    ]
}

/* 
 * The deep song config, with empty effect list
 */
class TheDeep {
    constructor(audioAnalizer) {        
        this.channels = {
            LateralBars1       : audioAnalizer.channelOther,
            LateralBars2       : audioAnalizer.channelBass,
            LateralOsciloscope : audioAnalizer.channelDrum,
            Sun                : audioAnalizer.channelVocal,
            SunRays            : audioAnalizer.channelVocal,
            SpiralBars         : audioAnalizer.channelSong,
            SpiralOsciloscope  : audioAnalizer.channelVocal
        }
    }

    effects = [
    ]
}

/* 
 * Alone song config, with empty effect list
 */
class Alone {
    constructor(audioAnalizer) {        
        this.channels = {
            LateralBars1       : audioAnalizer.channelOther,
            LateralBars2       : audioAnalizer.channelBass,
            LateralOsciloscope : audioAnalizer.channelDrum,
            Sun                : audioAnalizer.channelVocal,
            SunRays            : audioAnalizer.channelVocal,
            SpiralBars         : audioAnalizer.channelSong,
            SpiralOsciloscope  : audioAnalizer.channelVocal
        }
    }

    effects = [
    ]
}

/* 
 * Lost song config, with empty effect list
 */
class Lost {
    constructor(audioAnalizer) {        
        this.channels = {
            LateralBars1       : audioAnalizer.channelOther,
            LateralBars2       : audioAnalizer.channelBass,
            LateralOsciloscope : audioAnalizer.channelDrum,
            Sun                : audioAnalizer.channelVocal,
            SunRays            : audioAnalizer.channelVocal,
            SpiralBars         : audioAnalizer.channelSong,
            SpiralOsciloscope  : audioAnalizer.channelVocal
        }
    }

    effects = []
}


/* 
 * BPMEffects - Handle all bpm animations for the current song
 */
class BPMEffects {
    constructor() {
        this.experience    = new Experience();
        this.audioAnalizer = this.experience.audioAnalizer;
    
        this.killCityKills = new KillCityKills(this.audioAnalizer);
        this.nothingsOver  = new NothingsOver(this.audioAnalizer);
        this.oneChance     = new OneChance(this.audioAnalizer);
        this.quantumOcean  = new QuantumOcean(this.audioAnalizer);
        this.sixFeetUnder  = new SixFeetUnder(this.audioAnalizer);
        this.theDeep       = new TheDeep(this.audioAnalizer);
        this.alone         = new Alone(this.audioAnalizer);
        this.lost          = new Lost(this.audioAnalizer)
    
        this.songChannels = [
            this.killCityKills.channels,
            this.nothingsOver.channels,
            this.oneChance.channels,
            this.quantumOcean.channels,
            this.sixFeetUnder.channels,
            this.theDeep.channels,
            this.alone.channels,
            this.lost.channels
        ];

        this.songsEffects = [
            this.killCityKills.effects,
            this.nothingsOver.effects,
            this.oneChance.effects,
            this.quantumOcean.effects,
            this.sixFeetUnder.effects,
            this.theDeep.effects,
            this.alone.effects,
            this.lost.effects
        ]
    }

    /* 
     * Setups all the animations of the current song in the specified timeline
     */
    RecalculateAnimations(timeline) {
        console.log("recalculate animations")
        const currentSong = this.experience.currentSong;
        const bpmMS = this.experience.song.bpmMS;

        this.songsEffects[currentSong].forEach(element => {
            let start    = (element.start * bpmMS) / 1000;
            let duration = ((element.end * bpmMS) / 1000) - start;        
            element.effect.setupAnimation(timeline, start, duration);            
        });
    }
}


/* 
 * WORLD
 */
class World {
    constructor() {
        this.experience = new Experience();
        this.canvas     = this.experience.canvas;
        this.scene      = this.experience.scene;
        this.resources  = this.experience.resources;
        this.camera     = this.experience.camera.instance;
        this.sizes      = this.experience.sizes;
        this.time       = this.experience.time;
        // World ready
        this.ready      = false;
        // setup
        this.setup();     

    }        



    setup() {
        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.backgroundPosition = 0;
        this.background = new Background(this, "background1");

        this.group.position.z = 5;
    }

    setQuality() {
        // Create a gsap timeline
        gsap.ticker.remove(gsap.updateRoot);
        this.timeline = gsap.timeline();

        this.spirals = new Spirals(this);

        this.sun     = new Sun(this);

        this.raysToHole = new RaysToHole();

        this.hmlBars = new HMLBars(this);

        this.hmlOsciloscope = new HMLOsciloscope(this);

        this.bpmEffects = new BPMEffects(this);
        // Current song channels
        this.songChannels = this.bpmEffects.songChannels[this.experience.currentSong];

        this.update = this.updateQuality;
    }

    // All resources are loaded
    resourcesLoaded() {
        this.background.updateBackground();
        this.ready = true;
    }

    /* 
     * Update function without knowing the quality settings
     */
    update(delta) {
        const newDelta = delta / 1000;
            
        this.background.update(newDelta);
        this.background.mesh.rotation.z += newDelta / 75;

        // Rotate all elements in the group
        this.group.rotation.z += delta / 7500;
    }

    
    /* 
     * Update function when the quality is set
     */
    updateQuality() {
        const delta = this.time.delta / 1000;
            
        this.background.update(delta);
        this.background.mesh.rotation.z += delta / 75;

        this.timeline.time(this.experience.audioAnalizer.channelSong.song.currentTime);

        this.spirals.update(delta);
        this.sun.update(delta);
        this.raysToHole.update();
        this.hmlOsciloscope.update(delta);
        this.hmlBars.update(delta);

        // Rotate all elements in the group
        this.group.rotation.z += this.time.delta / 7500;
    }


    asociateChannels () {
        // Asociate song channels with his world object
        this.songChannels = this.bpmEffects.songChannels[this.experience.currentSong];
        this.hmlBars.material.uniforms.uAudioTexture.value        = this.songChannels.LateralBars1.bufferCanvasLinear.texture;
        this.hmlBars.material.uniforms.uAudioTexture2.value       = this.songChannels.LateralBars2.bufferCanvasLinear.texture;
        this.hmlOsciloscope.material.uniforms.uAudioTexture.value = this.songChannels.LateralOsciloscope.bufferCanvasLinear.texture;
        this.sun.material.uniforms.uAudioTexture.value            = this.songChannels.Sun.bufferCanvasLinear.texture;
        // SunRays its asociated directly with the Render_pnmdrs::update function
        this.spirals.material.uniforms.uAudioTexture.value        = this.songChannels.SpiralBars.bufferCanvasLinear.texture;
        this.spirals.material.uniforms.uAudioTexture2.value       = this.songChannels.SpiralOsciloscope.bufferCanvasLinear.texture;    
    }

    setupSong() {
        this.asociateChannels();

        // Recalculate animations
        this.timeline.kill();
        this.timeline = gsap.timeline();

        this.bpmEffects.RecalculateAnimations(this.timeline);  
    }
}


/* 
 * Debug 
 */
class Debug {
    constructor() {
        this.experience = new Experience();
        this.setup();
    }

    setup() {
        this.gui = new lil.GUI({ 
            width : 300, 
            container : this.experience.htmlElements.elementExperience 
        });

        this.setupAudioChannels();

        this.setupSpirals();
        this.setupSun();
        this.setupLateralBars();
        this.setupLateralOsciloscope();
        this.setupPostProcessingPmndrs();
        this.setupBloomPmndrs();
        this.setupGodRaysPmndrs();
        this.setupColorCorrectionPmndrs();
    }

    setupLateralBars(open = false) {
        this.lateralBars = this.experience.world.hmlBars;
        this.lateralBarsUI = this.gui.addFolder("Lateral Bars").open(open);
        
        this.lateralBarsUI.add(this.experience.options, 'barsAudioStrength').min(0).max(8).step(0.1).name("Audio strength").onChange(() => {
            this.lateralBars.material.uniforms.uAudioStrength.value = this.experience.options.barsAudioStrength;
        });
        this.lateralBarsUI.add(this.experience.options, 'barsAudioZoom').min(0).max(8).step(0.1).name("Audio zoom").onChange(() => {
            this.lateralBars.material.uniforms.uAudioZoom.value = this.experience.options.barsAudioZoom;
        });
        this.lateralBarsUI.add(this.experience.options, 'barsSpeed').min(0.01).max(8).step(0.1).name("Speed").onChange(() => {
            this.lateralBars.material.uniforms.uSpeed.value = this.experience.options.barsSpeed;
        });
    
    }

    setupLateralOsciloscope(open = false) {
        this.lateralOsciloscope = this.experience.world.hmlOsciloscope;
        this.lateralOsciloscopeUI = this.gui.addFolder("Lateral Osciloscope").open(open);

        this.lateralOsciloscopeUI.add(this.experience.options, 'hmsOsciloscopeAudioStrength').min(0).max(8).step(0.1).name("Audio strength").onChange(() => {
            this.lateralOsciloscope.material.uniforms.uAudioStrength.value = this.experience.options.hmsOsciloscopeAudioStrength;
        });
        this.lateralOsciloscopeUI.add(this.experience.options, 'hmsOsciloscopeSpeed').min(0.01).max(8).step(0.1).name("Speed").onChange(() => {
            this.lateralOsciloscope.material.uniforms.uSpeed.value = this.experience.options.hmsOsciloscopeSpeed;
        });
    
    }

    setupAudioChannels(open = false) {
        this.world = this.experience.world;
        this.audioAnalizer = this.experience.audioAnalizer;
        this.audioChannels = this.gui.addFolder("Audio Channels").open(open);
        
        this.fftOptions = {
            "32768" : 32768, "16384" : 16384, "8192" : 8192, 
            "4096" : 4096, "2048" : 2048, "1024" : 1024, "512" : 512
        }

        this.fftSize = { value : this.experience.options.audioFFTSize }

        this.channelOptions = {
            All   : 0,
            Bass  : 1,
            Drum  : 2,
            Other : 3,
            Piano : 4,
            Vocal : 5,
        };
        this.LateralBar1        = { value : 'Other' }
        this.LateralBar2        = { value : 'Bass' }
        this.LateralOsciloscope = { value : 'Drum' }
        this.Sun1               = { value : 'Vocal' }
        this.Sun2               = { value : 'Vocal' } 
        this.SpiralBars         = { value : 'All' }
        this.SpiralOsciloscope  = { value : 'Vocal' }

        this.audioChannels.add(this.LateralBar1, 'value', this.channelOptions).name("Lateral bars 1").onChange(() => {
            this.world.hmlBars.material.uniforms.uAudioTexture.value = this.audioAnalizer.channels[this.LateralBar1.value].bufferCanvasLinear.texture;
        });
        this.audioChannels.add(this.LateralBar2, 'value', this.channelOptions).name("Lateral bars 2").onChange(() => {
            this.world.hmlBars.material.uniforms.uAudioTexture2.value = this.audioAnalizer.channels[this.LateralBar2.value].bufferCanvasLinear.texture;
        });
        this.audioChannels.add(this.LateralOsciloscope, 'value', this.channelOptions).name("Lateral osciloscope").onChange(() => {
            this.world.hmlOsciloscope.material.uniforms.uAudioTexture.value = this.audioAnalizer.channels[this.LateralOsciloscope.value].bufferCanvasLinear.texture;
        });
        this.audioChannels.add(this.Sun1, 'value', this.channelOptions).name("Sun").onChange(() => {
            this.world.sun.material.uniforms.uAudioTexture.value = this.audioAnalizer.channels[this.Sun1.value].bufferCanvasLinear.texture;
        });
        this.audioChannels.add(this.Sun2, 'value', this.channelOptions).name("Sun rays").onChange(() => {
            this.world.sun.material.uniforms.uAudioTexture.value = this.audioAnalizer.channels[this.Sun2.value].bufferCanvasLinear.texture;
        });
        this.audioChannels.add(this.SpiralBars, 'value', this.channelOptions).name("Spiral bars").onChange(() => {
            this.world.spirals.material.uniforms.uAudioTexture.value = this.audioAnalizer.channels[this.SpiralBars.value].bufferCanvasLinear.texture;
        });
        this.audioChannels.add(this.SpiralOsciloscope, 'value', this.channelOptions).name("Spiral osciloscope").onChange(() => {
            this.world.spirals.material.uniforms.uAudioTexture2.value = this.audioAnalizer.channels[this.SpiralOsciloscope.value].bufferCanvasLinear.texture;
        });

        this.audioChannels.add(this.fftSize, 'value', this.fftOptions).name("Fast fourier transform size").onChange(() => {
            this.experience.audioAnalizer.setFFTSize(this.fftSize.value);
            this.experience.world.asociateChannels();
        });
    }

    setupPostProcessingPmndrs(open = false) {
        this.postProcessingPmndrs = this.gui.addFolder("Post processing (Pmndrs)").open(open);
    }

    setupBloomPmndrs(open = false) {
        if (open === true) this.postProcessingPmndrs.open(true);
        this.bloomPmndrs = this.experience.renderer.bloomEffect;

        this.bloomPmndrsUI = this.postProcessingPmndrs.addFolder("Bloom").open(open);
        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsIntensity').min(-3.0).max(3).step(0.01).name("Intensity").onChange(() => {
            this.bloomPmndrs.intensity = this.experience.options.bloomPmndrsIntensity;
        });
        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsThreshold').min(-35.0).max(35).step(0.01).name("Threshold").onChange(() => {
            this.bloomPmndrs.luminanceMaterial.uniforms.threshold.value = this.experience.options.bloomPmndrsThreshold;
        });
        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsSmoothing').min(-35.0).max(35).step(0.01).name("Smoothing").onChange(() => {
            this.bloomPmndrs.luminanceMaterial.uniforms.smoothing.value = this.experience.options.bloomPmndrsSmoothing;
        });
        this.bloomPmndrsUI.add(this.experience.options, 'bloomPmndrsRadius').min(-3.0).max(3).step(0.01).name("Radius").onChange(() => {
            this.bloomPmndrs.mipmapBlurPass.radius = this.experience.options.bloomPmndrsRadius;
        });
    }

    setupGodRaysPmndrs(open = false) {
        if (open === true) this.postProcessingPmndrs.open(true);
        this.godRaysPmndrs = this.experience.renderer.godRaysEffect;

        this.godRaysPmndrsUI = this.postProcessingPmndrs.addFolder("God Rays").open(open);
        this.godRaysPmndrsUI.add(this.experience.options, 'godRaysDensity').min(-5.0).max(5).step(0.1).name("Density").onChange(() => {
            this.godRaysPmndrs.godRaysMaterial.density = this.experience.options.godRaysDensity;
        });
        this.godRaysPmndrsUI.add(this.experience.options, 'godRaysDecay').min(0).max(1).step(0.01).name("Decay").onChange(() => {
            this.godRaysPmndrs.godRaysMaterial.decay = this.experience.options.godRaysDecay;
        });
        this.godRaysPmndrsUI.add(this.experience.options, 'godRaysWeigth').min(-5.0).max(5).step(0.1).name("Weigth").onChange(() => {
            this.godRaysPmndrs.godRaysMaterial.weight = this.experience.options.godRaysWeigth;
        });
        this.godRaysPmndrsUI.add(this.experience.options, 'godRaysExposure').min(-5.0).max(5).step(0.1).name("Exposure").onChange(() => {
            this.godRaysPmndrs.godRaysMaterial.weight = this.experience.options.godRaysExposure;
        });
        this.godRaysPmndrsUI.add(this.experience.options, 'godRaysClampMax').min(-5.0).max(5).step(0.1).name("Max intensity").onChange(() => {
            this.godRaysPmndrs.godRaysMaterial.clampMax = this.experience.options.godRaysClampMax;
        });
        this.godRaysPmndrsUI.add(this.experience.options, 'godRaysSamples').min(1).max(200).step(1).name("Samples").onChange(() => {
            this.godRaysPmndrs.godRaysMaterial.samples = this.experience.options.godRaysSamples;
        });
    }

    setupColorCorrectionPmndrs(open = false) {
        if (open === true) this.postProcessingPmndrs.open(true);
        this.colorCorrectionPmndrs = this.experience.renderer.colorCorrectionEffect;

        this.colorCorrectionPmndrsUI = this.postProcessingPmndrs.addFolder("Color correction (custom)").open(open);        
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionPowRGB, 'x').min(0).max(15).step(0.1).name("Power R").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("powRGB").value.x = this.experience.options.colorCorrectionPowRGB.x;
        });
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionPowRGB, 'y').min(0).max(15).step(0.1).name("Power G").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("powRGB").value.y = this.experience.options.colorCorrectionPowRGB.y;
        });
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionPowRGB, 'z').min(0).max(15).step(0.1).name("Power B").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("powRGB").value.z = this.experience.options.colorCorrectionPowRGB.z;
        });

        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionMulRGB, 'x').min(0).max(15).step(0.1).name("Multiplier R").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("mulRGB").value.x = this.experience.options.colorCorrectionMulRGB.x;
        });
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionMulRGB, 'y').min(0).max(15).step(0.1).name("Multiplier G").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("mulRGB").value.y = this.experience.options.colorCorrectionMulRGB.y;
        });
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionMulRGB, 'z').min(0).max(15).step(0.1).name("Multiplier B").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("mulRGB").value.z = this.experience.options.colorCorrectionMulRGB.z;
        });

        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionAddRGB, 'x').min(0).max(1).step(0.01).name("Add extra R").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("addRGB").value.x = this.experience.options.colorCorrectionAddRGB.x;
        });
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionAddRGB, 'y').min(0).max(1).step(0.01).name("Add extra G").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("addRGB").value.y = this.experience.options.colorCorrectionAddRGB.y;
        });
        this.colorCorrectionPmndrsUI.add(this.experience.options.colorCorrectionAddRGB, 'z').min(0).max(1).step(0.01).name("Add extra B").onChange(() => {
            this.colorCorrectionPmndrs.uniforms.get("addRGB").value.z = this.experience.options.colorCorrectionAddRGB.z;
        });

    }

    setupSun(open = false) {
        this.sun = this.experience.world.sun;

        this.SunUI = this.gui.addFolder("Sun").open(open);        
        this.SunUI.add(this.experience.options, 'sunAudioStrengthSin').min(0).max(8).step(0.1).name("Audio strength").onChange(() => {
            this.sun.material.uniforms.uAudioStrengthSin.value = this.experience.options.sunAudioStrengthSin;
        });
        this.SunUI.add(this.experience.options, 'sunAudioStrengthFreq').min(0).max(8).step(0.1).name("Audio strength plasma").onChange(() => {
            this.sun.material.uniforms.uAudioStrengthFreq.value = this.experience.options.sunAudioStrengthFreq;
        });
        this.SunUI.add(this.experience.options, 'sunNoiseStrength').min(0).max(32).step(0.1).name("Perlin noise strength").onChange(() => {
            this.sun.material.uniforms.uNoiseStrength.value = this.experience.options.sunNoiseStrength;
        });
        this.SunUI.add(this.experience.options, 'sunNoiseSpeed').min(0).max(4).step(0.1).name("Perlin noise speed").onChange(() => {
            this.sun.material.uniforms.uNoiseSpeed.value = this.experience.options.sunNoiseSpeed;
        });
    }

    setupSpirals(open = false) {
        this.spirals = this.experience.world.spirals;

        this.spiralBarsUI = this.gui.addFolder("Spiral Bars").open(open);        
        this.spiralBarsUI.add(this.experience.options, 'spiralAudioStrength').min(0).max(8).step(0.1).name("Audio strength").onChange(() => {
            this.spirals.material.uniforms.uAudioStrength.value = this.experience.options.spiralAudioStrength;
        });
        this.spiralBarsUI.add(this.experience.options, 'spiralAudioZoom').min(0).max(8).step(0.1).name("Audio zoom").onChange(() => {
            this.spirals.material.uniforms.uAudioZoom.value = this.experience.options.spiralAudioZoom;
        });
        this.spiralBarsUI.add(this.experience.options, 'spiralFrequency').min(0).max(4).step(0.1).name("Frequency").onChange(() => {
            this.spirals.material.uniforms.uFrequency.value = this.experience.options.spiralFrequency;
        });
        this.spiralBarsUI.add(this.experience.options, 'spiralSpeed').min(0).max(4).step(0.01).name("Speed").onChange(() => {
            this.spirals.material.uniforms.uSpeed.value = this.experience.options.spiralSpeed;
        });
        this.spiralBarsUI.add(this.experience.options, 'spiralThickness').min(0.01).max(0.99).step(0.001).name("Thickness").onChange(() => {
            this.spirals.material.uniforms.uThickness.value = this.experience.options.spiralThickness;
        });
        this.spiralBarsUI.add(this.experience.options, 'spiralMirrors').min(1).max(100).step(1).name("Mirrors").onChange(() => {
            this.spirals.material.uniforms.uMirrors.value = this.experience.options.spiralMirrors;
        });

        this.spiralOsciloscopeUI = this.gui.addFolder("Spiral Osciloscope").open(open);
        this.spiralOsciloscopeUI.add(this.experience.options, 'spiralAudioStrengthSin').min(0).max(8).step(0.1).name("Audio strength").onChange(() => {
            this.spirals.material.uniforms.uAudioStrengthSin.value = this.experience.options.spiralAudioStrengthSin;
        });
        this.spiralOsciloscopeUI.add(this.experience.options, 'spiralAudioZoomSin').min(0).max(8).step(0.1).name("Audio zoom").onChange(() => {
            this.spirals.material.uniforms.uAudioZoomSin.value = this.experience.options.spiralAudioZoomSin;
        });
        this.spiralOsciloscopeUI.add(this.experience.options, 'spiralFrequencySin').min(0).max(4).step(0.1).name("Frequency").onChange(() => {
            this.spirals.material.uniforms.uFrequencySin.value = this.experience.options.spiralFrequencySin;
        });
        this.spiralOsciloscopeUI.add(this.experience.options, 'spiralSpeedSin').min(0).max(4).step(0.01).name("Speed").onChange(() => {
            this.spirals.material.uniforms.uSpeedSin.value = this.experience.options.spiralSpeedSin;
        });
        this.spiralOsciloscopeUI.add(this.experience.options, 'spiralThicknessSin').min(0.01).max(0.99).step(0.001).name("Thickness").onChange(() => {
            this.spirals.material.uniforms.uThicknessSin.value = this.experience.options.spiralThicknessSin;
        });
    }

}

/* 
 * DebugAverages
 */
class DebugAverages {
    constructor(width, height) {
        this.canvas  = document.createElement("canvas");
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);
        this.canvas.className = "Experience_DebugAverages";
        this.context = this.canvas.getContext("2d", { willReadFrequently : false }); 
        this.width   = width;
        this.height  = height;


        this.experience = new Experience();
        this.experience.htmlElements.elementExperience.appendChild(this.canvas);

        this.audioAnalizer = this.experience.audioAnalizer;

        // Fill the text on each channel column
        this.context.fillStyle = "white";
        this.context.fillText("song", 10, this.height - 5);
        this.context.fillText("bass", 60, this.height - 5);
        this.context.fillText("drum", 110, this.height - 5);
        this.context.fillText("other", 160, this.height - 5);
        this.context.fillText("piano", 210, this.height - 5);
        this.context.fillText("voice", 260, this.height - 5);
        // Peaks for each channel
        this.peaks = [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ];

        //this.context.strokeStyle = "white";
    }


    update() {
        
        let height = this.height - 20;
        // Clear the canvas
        this.context.clearRect(0, 0, this.width, height + 1);        
        
        for (let i = 0; i < this.audioAnalizer.totalChannels; i++) {
            const avFreq = this.audioAnalizer.channels[i].averageFrequency;            
            const avFreqPeak = this.audioAnalizer.channels[i].averageFrequencyPeaks;            
            
            // calculate positions
            let freq0 = avFreq[0] * height;
            let freq1 = avFreq[1] * height;
            let freq2 = avFreq[2] * height;
            let freq4 = avFreq[4] * height;

            this.context.fillStyle = "red";
            // fill the bars
            this.context.fillRect((50 * i) + 1, height - freq0, 10, freq0);
            this.context.fillRect((50 * i) + 12, height - freq1, 10, freq1);
            this.context.fillRect((50 * i) + 23, height - freq2, 10, freq2);
            this.context.fillRect((50 * i) + 34, height - freq4, 10, freq4);

            this.context.fillStyle = "white";

            // fill peaks
            this.context.fillRect((50 * i) + 1, height - (avFreqPeak[0] * height), 10, -2);
            this.context.fillRect((50 * i) + 12, height - (avFreqPeak[1] * height), 10, -2);
            this.context.fillRect((50 * i) + 23, height - (avFreqPeak[2] * height), 10, -2);
            this.context.fillRect((50 * i) + 34, height - (avFreqPeak[4] * height), 10, -2);

        }
    }

}

/* 
 * DebugEffects
 *  Class to create and show bpm animations in debug mode
 */
class DebugEffect {
    
    constructor(name, start, end, params) {
        this.experience = new Experience();
        if (typeof(this.experience.idDebugEffect) === "undefined") this.experience.idDebugEffect = 0;
        else                                                       this.experience.idDebugEffect ++;
        
        this.name   = name;
        this.params = params;
        this.start  = start;
        this.end    = end;

        this.createHTML();
    }

    createHTML() {

        this.element = document.createElement("div");
        this.element.className = "Experience_DebugEffect";
        this.element.id = `DebugEffect${this.experience.idDebugEffect}`;

        let strHTML = `
                            <div>
                                ${this.name}
                            </div>
                            <div>
                                ${this.params}
                            </div>
                            <div>
                                ${this.start}
                            </div>
                            <div>
                                ${this.end}
                            </div>
                        `;
        this.element.innerHTML = strHTML;

        if (this.experience.htmlElements.elementDebugEffects.firstChild === null) {
            this.experience.htmlElements.elementDebugEffects.appendChild(this.element);
        }
        else {
            this.experience.htmlElements.elementDebugEffects.insertBefore(this.element, this.experience.htmlElements.elementDebugEffects.firstChild);
        }
        this.element = document.getElementById(`DebugEffect${this.experience.idDebugEffect}`);
        this.element.setAttribute("visible", "true");
    }
}



/* 
 * Main object Experience
 */
let experienceInstance = null;

class Experience {
    // Constructor
    constructor() {
        // Look for previous instance
        if (experienceInstance) {
            // return the previous instance
            return experienceInstance;
        }
        experienceInstance = this;
        
        // Setup the songs list
        this.songs = songs;
        // select a random song
//        this.currentSong = Math.floor(Math.random() * this.songs.length);
        this.currentSong = 0;
        this.song = this.songs[this.currentSong];
        this.songLoading = true;

        // default options
        this.options = options;

        // Initialize canvas size
        this.sizes          = new Sizes();
        // Create the html tags and insert into body (canvas, buttons, fps, loading and error messages)
        this.htmlElements   = new HTMLElements();
        // Initialize time
        this.time           = new Time();
        // Start loading resource files
        this.resources      = new Resources(sources);
        // Set loading to true
        this.loading = true;

        // Initialize audio analizer options and callbacks
        this.audioAnalizerOptions = {
            onPlay           : this.onAudioPlay,
            onPause          : this.onAudioPause,
            onTimeUpdate     : (this.options.debug) ? this.onAudioTimeUpdate : function() {},
            onDurationChange : this.onAudioDurationChange,
            onEnded          : this.onAudioEnded,
            onError          : this.onAudioError,
            onCanPlay        : this.onAudioCanPlay,
            onLoading        : this.onAudioLoading, 
            onBpmChange      : this.onAudioBpmChange,
            allowDropSong    : this.options.songsDragDrop,
            volume           : this.options.audioVolume,
            fftSize          : this.options.audioFFTSize
        }

        // Set the canvas element
        this.canvas         = this.htmlElements.elementCanvas;

        this.scene          = new THREE.Scene();
        this.camera         = new Camera();
        this.world          = new World();
        this.renderer       = new Renderer();

        // Remove the updateDebug function if the experience is not on debug mode
        if (this.options.debug === false) {
            this.updateDebug = () => {}
        }
        

        // Listen events
        this.sizes.on    ('resize', () => { this.resize(); })
        this.time.on     ('tick'  , () => { this.update(); })
        this.resources.on('ready' , () => { this.resourcesLoaded(); })

        this.beats = 0;
        // Determine if the hardware is optimal to run on multi channel mode
        this.time.measureQuality();
    }

    /* 
     * Recomends the experience quality using an average of fps taken during the first 3 seconds
     */
    recomended(value) {
        // A value of 50 means an high end machine
        if (value > 50) {
            if (typeof(this.htmlElements.elementQualityHigh) !== "undefined")
                this.htmlElements.elementQualityHigh.setAttribute("recomended", "true");
        }
        // A value below 50 means a low end machine
        else {
            if (typeof(this.htmlElements.elementQualityLow) !== "undefined")
                this.htmlElements.elementQualityLow.setAttribute("recomended", "true");
        }
    }

    /*
     * Sets the quality for the experience 
     *  preset can be "low" or "high"
     */
    setQuality(preset = "high") {       
        // Setup low config (high is the standard)
        if (preset === "low") {
            this.options.audioFFTSize      = 1024;   // 512 values
            this.options.audioMultiChannel = false;  // only one channel analisis
        }

        // Update the loading function to catch loaded songs
        this.setLoading = this.setLoadingAudio;
        this.setLoading();

        // Start the audio analizer & player
        if (this.options.audioMultiChannel === true) 
            this.audioAnalizer  = new AudioAnalizerMC(this.audioAnalizerOptions);
        else
            this.audioAnalizer  = new AudioAnalizerSC(this.audioAnalizerOptions);

        // Create meshes that need audio analizer
        this.world.setQuality();
        // Setup the god rays for the sun mesh
        this.renderer.setGodRays(this.world.sun.mesh);
        // Load the song
        this.audioAnalizer.loadSong(this.song.path, this.song.bpm);
        // Apply the new update function
        this.update = this.updateQuality;
        // Enable play button
        this.htmlElements.elementPlay.setAttribute("disabled", "false");

        // Enable help tooltips
        this.htmlElements.elementPressPlay.setAttribute("show", "true");
        this.htmlElements.elementPressFullScreen.setAttribute("show", "false");

        // Start debug mode
        if (this.options.debug) {
            this.debug = new Debug();
            // Create a DebugAverages object with 300 of width if is multi channel or 50 if is single channel
            this.debugAverages = new DebugAverages((this.options.audioMultiChannel) ? 300 : 50, 80);
        }
        // Release mode
        else {
            // Create an empty debugAverages object to simulate its update function
            this.debugAverages = { update : () => { } }
        }

    }

    /**
     * Function called on resize
     */
    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    /**
     * Function called when a frame is about to update (before the world objects creation)
    */
    update() {        
        const delta = this.time.delta;
        this.camera.update();

        this.world.update(delta);
        this.renderer.update(delta);
    }

    /**
     * Function called when a frame is about to update (after the world objects creation)
    */
    updateQuality() {
        const delta = this.time.delta;
        this.camera.update();
        this.audioAnalizer.update(delta);

        this.world.update(delta);
        this.renderer.update();

        this.debugAverages.update();
    }

 
    /**
     * Function called when all thre resources are loaded (except the song)
     */
    resourcesLoaded() {
        this.loading = false;
        this.setLoading();
        this.world.resourcesLoaded();
    }

    /*
     * Initial setLoading function (this function is replaced by setLoadingAudio when whe can load songs)
     */
    setLoading() {
        let isLoading = true;
        if (this.loading === false) isLoading = false;
        this.htmlElements.elementExperience.setAttribute("loading", isLoading);
    }

    /*
     * Final setLoading function when whe can load songs
     */
    setLoadingAudio() {
        let isLoading = true;
        if (this.loading === false && this.songLoading === false) isLoading = false;
        this.htmlElements.elementExperience.setAttribute("loading", isLoading);
    }

    /* 
     * Audio events
     */

    // Audio play
    onAudioPlay = () => {
        this.htmlElements.audioUI(false); 
    }

    // Audio pause
    onAudioPause = () => { 
        this.htmlElements.audioUI(true);
    }

    // Audio has reached the end
    onAudioEnded = () => { 
        this.htmlElements.audioUI(true);
        this.beats = 0;

        if (this.options.showBPM === true) {
            this.htmlElements.elementDebugEffects.innerHTML = "";
        }
    }
    
    // Audio time has changed (this function is only for debug, in release mode its an empty function)
    onAudioTimeUpdate = (currentTime) => {
        if (this.htmlElements.dragTime == false)
            this.htmlElements.elementAudioTime.value = currentTime;        
    }

    // Whe know for the first time the audio total time
    onAudioDurationChange = (newDuration) => {
        if (this.options.debug === true) {
            // Update max time on the time slider
            this.htmlElements.elementAudioTime.setAttribute("max", newDuration);
        }
        // Calculate how much miliseconds has one beat
        this.song.bpmMS = (60000 / this.song.bpm);
        if (this.options.showBPM === true) {
            this.htmlElements.elementTxtBPM.innerHTML = Math.floor(this.song.bpmMS);
        }
    }

    // Event error
    onAudioError = () => {
        this.songLoading = false; 
        this.beats = 0;
        this.setLoading();
        this.htmlElements.audioUI(true);
        window.alert("error loading : " + this.song.path);
    }

    // Song its ready to play
    onAudioCanPlay = () => {
        // Setup animations, and asociate channels
        // ONLY IF SONG IS LOADING (I dont know why canPlay event trigers sometimes in the middle of the song)
        if (this.songLoading === true) {
            this.world.setupSong();
        }

        this.songLoading = false;
        this.beats = 0;
        this.setLoading();


    }

    // Start loading song
    onAudioLoading = () => {
        this.songLoading = true;
        this.setLoading();
        this.htmlElements.audioUI(true);    
    }

    // Current Beat Per Minute has changed
    onAudioBpmChange = (currentBpm) => {
        if (this.options.showBPM === true) 
            this.htmlElements.elementBPM.innerHTML = currentBpm;
    }

    /** 
     * This function destroy the whole scene
     */
    destroy() {
        this.sizes.off('resize');
        this.time.off('tick');
        this.resources.off('ready');

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof(value.dispose) === 'function') {
                        value.dispose()
                    }
                }
            }
        })
        // orbit
        this.camera.controls.dispose();
        // renderer
        this.renderer.instance.dispose();
        
        // remove debug ui
        if (this.debug.active) {
            this.debug.ui.destroy();
        }
    }    
}

const experience = new Experience();