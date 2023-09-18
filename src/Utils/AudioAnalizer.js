import * as THREE from "three"
import BufferCanvas from "./BufferCanvas.js";
//import Experience from "../Experience.js";


/* Audio analizer singleton */
export default class AudioAnalizer {
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
            allowDropSong     : true,
            volume            : 0.5       // 
        }
        
        this.audioOptions = { ...audioDefaultOptions, ...audioOptions };

        // Song loaded flag
        this.songLoaded = false;
        // Setup the drag & drop events
        if (this.audioOptions.allowDropSong) this.setupDragDropEvents();
        // Set the default volume
        this.currentVolume = this.audioOptions.volume;
        // Initialize memory for audio textures
        this.setupTextures();

        this.averageFrequency = [ 0, 0, 0, 0, 0 ];
        // Paint the audio textures to have safe values 
        this.paintAudioTexture();
        // Time to calculate beats per minute
        this.bpmTime = 0;
        // Beats per minute, if its 0 its not calculated
        this.bpm = 0;        
        
        this.isPlaying = false;

        this.currentBpm = 0;
    }

    setupDragDropEvents() {
        // Drag & drop events
        document.body.addEventListener("dragenter", (e) => { this.eventDragEnter(e) });
        document.body.addEventListener("dragover" , (e) => { this.eventDragOver(e)  });
        document.body.addEventListener("drop"     , (e) => { this.eventDrop(e)      });
    }
    
    volume(vol) {
        if (typeof vol !== "undefined") this.currentVolume = vol;

        if (typeof this.gainNode !== "undefined") {
            this.gainNode.gain.value = this.currentVolume;
        }
    }

    setupTextures() {
        this.fftSize         = 2048;
        this.square          = Math.sqrt(this.fftSize * 0.5);

        // Arrays for analizer data (bars and osciloscope)
        this.analizerData    = new Uint8Array(this.fftSize * 0.5);
        this.analizerDataSin = new Uint8Array(this.fftSize * 0.5);
        for (let i = 0; i < this.fftSize * 0.5; i++) {
            this.analizerData[i] = 0;
            this.analizerDataSin[i] = 128;
        }

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

    setupAudio() {
        // Exit if context is initialized
        if (typeof this.context !== "undefined") return;        
        
        this.context                          = new AudioContext();             // Create context
        this.gainNode                         = this.context.createGain();      // Setup gain
        this.analizer                         = this.context.createAnalyser();  // Setup analizer
        this.analizer.fftSize                 = this.fftSize;                   // fftSize
        this.analizer.smoothingTimeConstant   = 0.8;                            // Smoothing Time
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


    loadSong(path, bpm = 0) {
        if (typeof this.song !== "undefined") {
            this.song.pause();
            this.songLoaded = false;
            this.isPlaying = false;
            this.audioOptions.onLoading();
        }
        // Reset time to calculate beats per minute
        this.bpmTime = 0;
        this.bpm = bpm;
        this.currentBpm = 0;
         
        this.song                = new Audio();
        this.song.controls       = true;
        this.song.crossOrigin    = "anonymous";
        this.song.src            = path;          // "/Canciones/cancion.mp3"
        this.song.addEventListener('canplay', () => { 
            this.canPlay();
            this.audioOptions.onCanPlay();
        });
        this.song.addEventListener('error',   () => { 
            this.currentBpm = 0;
            this.isPlaying = false;
            this.audioOptions.onError();
        });
        this.song.addEventListener('ended'  , () => { 
            this.currentBpm = 0;
            this.isPlaying = false;
            this.audioOptions.onEnded();
        });                
        // Update max time
        this.song.addEventListener('durationchange'  , () => { 
            this.audioOptions.onDurationChange(this.song.duration);
        });                
        // Update current time
        this.song.addEventListener('timeupdate'  , () => { 
            this.audioOptions.onTimeUpdate(this.song.currentTime);
            // Calculate current beats per minute NOT ACURATE
/*            if (this.bpm !== 0) {
                const mspb = 60000 / this.bpm;
                let currentBpm = Math.floor((this.song.currentTime * 1000) / mspb);
                if (currentBpm !== this.currentBpm) {
                    this.currentBpm = currentBpm;
                    this.onBpmChange(this.currentBpm);
                }
            }*/ 
            
        });
        
        
        this.song.addEventListener('play'  , () => { 
            this.audioOptions.onPlay();
        });        
        this.song.addEventListener('pause' , () => { 
            this.audioOptions.onPause();
         });        
    }



    loadSongDrop(files) {
//        this.experience.htmlElements.audioUI(false);
        this.loadSong(URL.createObjectURL(files[0]));
    }


    // Función que detecta si está en play o en pausa, y asigna el estado contrario
    playPause(path, bpm) {
        if (typeof this.context === "undefined") {
            this.setupAudio();
            this.loadSong(path, bpm);
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
        
        // Paint audio texture ussing analizerData
        this.paintAudioTexture();

        // Get average frequency
        this.averageFrequency = this.getAverageFrequency();

        // Calculate current beats per minute 
        this.calculateCurrentBeat(delta);
    }


    calculateCurrentBeat(delta) {
        if (this.isPlaying === true && this.bpm !== 0) {
            this.bpmTime += delta;
            const mspb = 60000 / this.bpm;
            if (this.bpmTime > mspb) {
                this.currentBpm ++;
                this.bpmTime -= mspb;
                this.audioOptions.onBpmChange(this.currentBpm);
            }
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
        let hzBar       = this.context.sampleRate / this.fftSize;
//        console.log(this.context.sampleRate)
        const divisions = [ 256, 2000, 16000, 50000 ];
        let total       = [ 0, 0, 0, 0, 0 ];// Graves, Medios, Agudos, Agudos inaudibles, Media de todo
        let values      = [ 0, 0, 0, 0, 0 ];// Graves, Medios, Agudos, Agudos inaudibles, Media de todo
        let pos         = 0;        
        const totalFreq = this.fftSize / 2;
        for (let i = 0; i < totalFreq; i++) {
            if (i * hzBar > divisions[pos]) {
                pos++;
            }
            total[pos]  ++;
            values[pos] += this.analizerData[i];    // set the current pos average
            values[4]   += this.analizerData[i];    // set the total average
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
        this.document.body.removeEventListener("dragenter", this.eventDragEnter);
        this.document.body.removeEventListener("dragover" , this.eventDragOver);
        this.document.body.removeEventListener("drop"     , this.eventDrop);
    }    
}



