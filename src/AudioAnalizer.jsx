import * as THREE from "three"
import options from "./Config/Options";

let audioAnalizerInstance = null;

/* BufferCanvas its an object that creates a 2d canvas in memory */
export class BufferCanvas {
    constructor(width, height) {
        this.canvas  = document.createElement("canvas");
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);
        this.context = this.canvas.getContext("2d", { willReadFrequently : true }); 
        this.width   = width;
        this.height  = height;
    }

    debug_InsertCanvasIntoBody() {
        document.body.appendChild(this.canvas);
        this.canvas.style.zIndex = 100;
        this.canvas.style.position = "fixed";
        this.canvas.style.top = 0;
    }
}


/* Audio analizer singleton */
export class AudioAnalizer {
    constructor() {
        // if there is a previous instance initiated
        if (audioAnalizerInstance) return audioAnalizerInstance;
        // First instance
        audioAnalizerInstance = this;
        // Song loaded flag
        this.songLoaded = false;
        // Setup the drag & drop events
        if (options.songsDragDrop) this.setupDragDropEvents();
        // Set the default volume
        this.currentVolume = 0.5;
        // Flag to prevent update time slider if the user its changing it
        this.isChangingTime = false;
    }

    setupDragDropEvents() {
        // Drag & drop events
        document.body.addEventListener("dragenter", (e) => { this.eventDragEnter(e) });
        document.body.addEventListener("dragover" , (e) => { this.eventDragOver(e)  });
        document.body.addEventListener("drop"     , (e) => { this.eventDrop(e)      });
    }
    
    volume(vol) {
        this.currentVolume = vol;
        if (typeof this.gainNode !== "undefined") {
            this.gainNode.gain.value = vol;
        }
    }

    setupAudio(fftSize = 2048) {
        // Exit if fftSize is initialized
        if (typeof this.fftSize !== "undefined") return;

        this.fftSize         = fftSize;
        this.square          = Math.sqrt(this.fftSize * 0.5);
        // Arrays for analizer data (bars and osciloscope)
        this.analizerData    = new Uint8Array(fftSize * 0.5);
        this.analizerDataSin = new Uint8Array(fftSize * 0.5);
        
        this.context                          = new AudioContext();
        this.gainNode                         = this.context.createGain();
        this.analizer                         = this.context.createAnalyser();
        this.analizer.fftSize                 = fftSize;
        this.analizer.smoothingTimeConstant   = 0.8; // 

        // Audio textures
        this.bufferCanvasSquare         = new BufferCanvas(this.square, this.square);
        this.bufferCanvasSquare.texture = new THREE.CanvasTexture(this.bufferCanvasSquare.canvas);
        this.imageDataSquare            = this.bufferCanvasSquare.context.createImageData(this.square, this.square);
        this.bufferCanvasLinear         = new BufferCanvas(1024, 1);
        this.bufferCanvasLinear.texture = new THREE.CanvasTexture(this.bufferCanvasLinear.canvas);
        this.imageDataLinear            = this.bufferCanvasLinear.context.createImageData(1024, 1);


        this.bufferCanvasSquare.texture.generateMipMaps = false;
        this.bufferCanvasSquare.texture.minFilter = THREE.NearestFilter;
        this.bufferCanvasSquare.texture.magFilter = THREE.NearestFilter;

        this.bufferCanvasLinear.texture.generateMipMaps = false;
        this.bufferCanvasLinear.texture.minFilter = THREE.NearestFilter;
        this.bufferCanvasLinear.texture.magFilter = THREE.NearestFilter;        
    }

    eventDragEnter(e) {
        return false;
    }

    eventDragOver(e) {
        return e.preventDefault();
    }

    eventDrop(e) {
        this.loadSongDrop(e.dataTransfer.files);
        e.stopPropagation();  
        e.preventDefault();             
    }    


    loadSong(path) {
        if (typeof this.song !== "undefined") {
            this.song.pause();
            this.songLoaded = false;
            this.setLoading(true);
            this.setIsPlaying(false);            
        }
         
        this.song                = new Audio();
        this.song.controls       = true;
        this.song.crossOrigin    = "anonymous";
        this.song.src            = path;          // "/Canciones/cancion.mp3"
        this.song.addEventListener('canplay', () => { 
            this.canPlay();
        });
        this.song.addEventListener('error',   () => { 
            this.setLoading(false); 
            this.setIsPlaying(false);
            window.alert("error loading : " + path);
        });
        this.song.addEventListener('ended'  , () => { 
            this.setIsPlaying(false);
        });                
        // Update max time
        this.song.addEventListener('durationchange'  , () => { 
            // Update max time on the time slider
            this.refTime.current.setAttribute("max", this.song.duration);
        });                
        // Update current time
/*        this.song.addEventListener('timeupdate'  , () => { 
            if (this.isChangingTime == false)
                this.refTime.current.value = this.song.currentTime;
        });*/
        
        
        this.song.addEventListener('play'  , () => { this.setIsPlaying(true); });        
        this.song.addEventListener('pause' , () => { this.setIsPlaying(false); });        
    }



    loadSongDrop(files) {
        this.setIsPlaying(false);
        this.loadSong(URL.createObjectURL(files[0]));
    }


    // Función que detecta si está en play o en pausa, y asigna el estado contrario
    playPause(path) {
        if (typeof this.context === "undefined") {
            this.setupAudio();
            this.loadSong(path);
        }

        // Ensure the current volume is the same of the UI
        this.volume(this.currentVolume);

        this.context.resume();

        
        // If song is playing
        if (this.song.duration > 0 && !this.song.paused) { 
            this.song.pause();
            return false;  
        } 
        else {
            this.song.play();   
            return true;               
        }        
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
            // Update max time on the time slider
            this.refTime.current.setAttribute("max", this.song.duration);
            this.setLoading(false);
        }
    }


    update() {
        // Avoid update if analizer is not created
        if (typeof this.analizer === "undefined") return;

        // Get wave frequancy buffers        
        this.analizer.getByteFrequencyData(this.analizerData);
        this.analizer.getByteTimeDomainData(this.analizerDataSin);        
        
        // Paint audio texture ussing analizerData
        this.paintAudioTexture();

        // Get average frequency
        this.averageFrequency = this.getAverageFrequency();

        // Set the current time if the user its not changing it
        if (this.isChangingTime === false) {
            this.refTime.current.value = this.song.currentTime;
        }
    }

    setTime(newTime) {
        if (typeof this.song === "undefined") return;
        this.song.currentTime = newTime;
    }

    getAverageFrequency() {
        // greus  de 0hz a 256hz
        // mitjos de 257hz a 2000hz
        // aguts  de 2001hz a 16000hz
        let hzBar      = this.context.sampleRate / this.fftSize;
        let divisions  = [ 256, 2000, 16000, 50000 ];
        let total      = [ 0, 0, 0, 0, 0 ];// Graves, Medios, Agudos, Agudos inaudibles, Media de todo
        let values     = [ 0, 0, 0, 0, 0 ];// Graves, Medios, Agudos, Agudos inaudibles, Media de todo
        let pos        = 0;        
        let totalFreq = this.fftSize / 2;
        for (let i = 0; i < totalFreq; i++) {
            if (i * hzBar > divisions[pos]) {
                pos++;
            }
            total[pos]  ++;
            values[pos] += this.analizerData[i];            
            values[4]   += this.analizerData[i];
        }
        
        return [ values[0] / total[0],    // High
                 values[1] / total[1],    // Medium
                 values[2] / total[2],    // Low
                 values[3] / total[3],    // Inaudible
                 values[4] / totalFreq ]; // Total average
    }    

    // Updates internal audio data textures
    // For the floor whe need a 32x32 texture, and for the rest of the effects a 1024x1 texture
    // Red channel is the Frequency data, and the Green channel is the time domain data
    paintAudioTexture() {
        for (let y = 0; y < this.square; y++) {
            for (let x = 0; x < this.square * 2; x++) {
                // position for a 1024 array
                let pos = (x + y * this.square);
                // set red channel with the frequency, and the green channel with time domain
                let rValue = this.analizerData[pos];
                let gValue = this.analizerDataSin[pos];
                let bValue = gValue;

                // position for a 4098 array
                pos = pos * 4;

                // fill the 32*32 image
                this.imageDataSquare.data[pos]     = rValue;
                this.imageDataSquare.data[pos + 1] = gValue;
                this.imageDataSquare.data[pos + 2] = bValue;
                this.imageDataSquare.data[pos + 3] = 255;
                // fill the 1024*1 image
                this.imageDataLinear.data[pos]     = rValue;
                this.imageDataLinear.data[pos + 1] = gValue;
                this.imageDataLinear.data[pos + 2] = bValue;
                this.imageDataLinear.data[pos + 3] = 255;
            }
        }
        this.bufferCanvasSquare.context.putImageData(this.imageDataSquare, 0, 0, 0, 0, 32, 32);
        this.bufferCanvasSquare.texture.needsUpdate = true;

        this.bufferCanvasLinear.context.putImageData(this.imageDataLinear, 0, 0, 0, 0, 1024, 1);
        this.bufferCanvasLinear.texture.needsUpdate = true;
    }


    destroy() {
        this.experience.canvas.removeEventListener("dragenter", this.eventDragEnter);
        this.experience.canvas.removeEventListener("dragover" , this.eventDragOver);
        this.experience.canvas.removeEventListener("drop"     , this.eventDrop);
    }    
}

const audio = new AudioAnalizer();

export default audio;