import Experience from "../Experience.js";
import AudioChannel from "./AudioChannel.js";
/* 
 Audio Analizer for multiple channels
 */


export default class AudioAnalizerMC {
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
//            saveAudioData     : false,    // Trying to save each channel data un json
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
//            saveAudioData     : this.audioOptions.saveAudioData     
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
        if (debug === false) {
            this.channelSong.volume(this.currentVolume);
        }
        else {
            this.channelSong.volume(0);
            for (let i = 1; i < this.totalChannels; i++) 
                this.channels[i].volume(this.currentVolume);
        }
    }

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
        this.channels[0].loadSong(path + "Song.mp3");
        this.channels[1].loadSong(path + "Bass.mp3");
        this.channels[2].loadSong(path + "Drum.mp3");
        this.channels[3].loadSong(path + "Other.mp3");
        this.channels[4].loadSong(path + "Piano.mp3");
        this.channels[5].loadSong(path + "Vocal.mp3");
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

/*            if (this.audioOptions.saveAudioData === true) {
                // save audio data for each channel...
                this.jsonSaveAudioData("bass" , this.channels[0].audioData);
                this.jsonSaveAudioData("drum" , this.channels[1].audioData);
                this.jsonSaveAudioData("other", this.channels[2].audioData);
                this.jsonSaveAudioData("piano", this.channels[3].audioData);
                this.jsonSaveAudioData("voice", this.channels[4].audioData);
                // Free memory
                this.channels[0].audioData = [];
                this.channels[1].audioData = [];
                this.channels[2].audioData = [];
                this.channels[3].audioData = [];
                this.channels[4].audioData = [];
            }*/
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
            this.channels[i].update();
        }

        // Calculate current beats per minute 
        this.calculateCurrentBeat(delta);
    }

    calculateCurrentBeat(delta) {
        if (this.experience.htmlElements.dragTime === true) return;

        let currentBpm = Math.floor((this.channels[0].song.currentTime * 1000) / this.bpmTime);
        if (isNaN(currentBpm)) 
            currentBpm = 0;

        if (this.currentBpm != currentBpm) {
            this.currentBpm = currentBpm;
            this.audioOptions.onBpmChange(this.currentBpm);

            this.resync(delta);
        }
    }

    resync(delta = 16) {
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
            console.log("re-sincronize", 
                Math.floor(this.channels[0].song.currentTime * 1000),
                Math.floor(this.channels[1].song.currentTime * 1000),
                Math.floor(this.channels[2].song.currentTime * 1000),
                Math.floor(this.channels[3].song.currentTime * 1000),
                Math.floor(this.channels[4].song.currentTime * 1000)                        
            );
            // set the current time for all songs
            for (let i = 1; i < this.totalChannels; i++) {
                this.channels[i].song.currentTime = this.channels[0].song.currentTime;
            }

            this.resyncTime = 5000;
        }
    }

/*
    jsonSaveAudioData(name, data) {
        // Supongamos que tienes un array grande de datos
        const datosGrandes = [
            // ... tus datos aquí
        ];
        
        // Dividir los datos en fragmentos más pequeños (por ejemplo, cada fragmento tiene 1000 elementos)
        const fragmentos = [];
        const fragmentoTamaño = 1000;
        for (let i = 0; i < data.length; i += fragmentoTamaño) {
            const fragmento = data.slice(i, i + fragmentoTamaño);
            fragmentos.push(fragmento);
        }
        
        // Convertir cada fragmento en una cadena JSON
        const fragmentosJSON = fragmentos.map(fragmento => JSON.stringify(fragmento));
        
        // Crear un objeto que contenga el array de fragmentos
        const objetoParaGuardar = {
            fragmentos: fragmentosJSON
        };
        
        // Convertir el objeto en una cadena JSON
        const jsonString = JSON.stringify(objetoParaGuardar, null, 2);
        
        // Crea un Blob con la cadena JSON
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Crea una URL para el Blob
        const blobURL = URL.createObjectURL(blob);
        
        // Crea un enlace (link) en el DOM para descargar el archivo
        const enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = blobURL;
        enlaceDescarga.download = name + '.json'; // Nombre del archivo a descargar
        
        // Simula un clic en el enlace para abrir el diálogo de descarga
        enlaceDescarga.click();
        
        // Limpia la URL creada para el Blob después de que se descargue el archivo
        URL.revokeObjectURL(blobURL);
    }*/
/*
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
    }   */ 

/*    getRandTexture() {
        let r = Math.floor(Math.random() * (this.totalChannels - 1));
        return this.channels[r].bufferCanvasLinear.texture;
    }*/
 }