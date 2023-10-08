import Experience from "../Experience.js";
import AudioChannel from "./AudioChannel.js";
/* 
 Audio Analizer for a single channel with 6 duplicated channels to simulate the multichannel schema
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
        this.channelSong.update();

        // Calculate current beats per minute 
        this.calculateCurrentBeat(delta);
    }

    calculateCurrentBeat(delta) {
        if (this.experience.htmlElements.dragTime === true) return;

        let currentBpm = Math.floor((this.channelSong.song.currentTime * 1000) / this.bpmTime);
        if (isNaN(currentBpm)) 
            currentBpm = 0;

        if (this.currentBpm != currentBpm) {
            this.currentBpm = currentBpm;
            this.audioOptions.onBpmChange(this.currentBpm);

            this.resync(delta);
        }
    }

    // whe dont need to resync because its only one channel
    resync(delta = 16) {

    }

    setFFTSize(fftSize) {
        console.log(fftSize)
        this.channelSong.setupTextures(fftSize);
        this.channelSong.analizer.fftSize = fftSize;
    }

}