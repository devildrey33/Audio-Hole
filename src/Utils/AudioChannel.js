
import * as THREE from "three"
import BufferCanvas from "./BufferCanvas.js";
//import Experience from "../Experience.js";


/* Audio analizer for one channel */
export default class AudioChannel {
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
//            saveAudioData     : false
        }
        
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

        this.averageFrequency = [ 0, 0, 0, 0, 0 ];
        this.averageFrequencyPeaks = [ 0, 0, 0, 0, 0 ];
        // Paint the audio textures to have safe values 
        this.paintAudioTexture();
        
        this.isPlaying = false;

//        this.audioData = [];
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


    update(delta) {
        // Avoid update if analizer is not created
        if (typeof this.analizer === "undefined") return;

        // Get wave frequancy buffers        
        this.analizer.getByteFrequencyData(this.analizerData);
        this.analizer.getByteTimeDomainData(this.analizerDataSin);
        
        // Paint audio texture using analizerData
        this.paintAudioTexture();

        // Get average frequency
        this.getAverageFrequency(delta);

/*        if (this.isPlaying === true && this.audioOptions.saveAudioData === true)
            this.audioData.push({
                data     : this.analizerDataSin, 
                average  : this.averageFrequency, 
                time     : this.song.currentTime 
            });*/
    }


    setTime(newTime) {
        if (typeof this.song === "undefined") return;
        this.song.currentTime = newTime;
    }


    getAverageFrequency(delta) {
        // greus  de 0hz a 256hz
        // mitjos de 257hz a 2000hz
        // aguts  de 2001hz a 16000hz
        let hzBar       = this.context.sampleRate / this.audioOptions.fftSize;
//        console.log(this.context.sampleRate)
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
            (values[0] / total[0]) / 255,    // High
            (values[1] / total[1]) / 255,    // Medium
            (values[2] / total[2]) / 255,    // Low
            (values[3] / total[3]) / 255,    // Inaudible
            (values[4] / this.maxData) / 255 // Total average
        ]; 

        // update peaks
        const avf  = this.averageFrequency;
        const avfp = this.averageFrequencyPeaks;
        const d    = delta / 2500;

        for (let i = 0; i < 5; i++) {
            (avf[i] > avfp[i]) ? avfp[i] = avf[i] : avfp[i] -= d;
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



