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
            allowDropSong     : false,
            volume            : 0.5,      // 
            fftSize           : 1024      // fast fourier transform size (1024 gives 512 frequency bars)
        }
        
        this.audioOptions = { ...audioDefaultOptions, ...audioOptions };

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
            onEnded           : this.onEnded,                       // Song has reached the end
            onError           : this.audioOptions.onError,          // Error...
            onCanPlay         : this.onCanPlay,                     // Song is ready to play
            onLoading         : this.audioOptions.onLoading,        // Starting to load the song
            // Default values
            volume            : this.audioOptions.volume,           // 
            fftSize           : this.audioOptions.fftSize           // fast fourier transform size (1024 gives 512 frequency bars)
        }


        this.channels = [ 
            new AudioChannel(this.audioOptions, true),   // Bass
            new AudioChannel(this.audioOptions, false),  // Drum
            new AudioChannel(this.audioOptions, false),  // Other
            new AudioChannel(this.audioOptions, false),  // Piano
            new AudioChannel(this.audioOptions, false),  // Vocal
        ];
        this.totalChannels   = 5;
        this.canPlayChannels = 0;
        this.endedChannels   = 0;
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
    

    volume(vol) {
        if (typeof vol !== "undefined") this.currentVolume = vol;
        for (let i = 0; i < this.totalChannels; i++) 
            this.channels[i].volume(this.currentVolume);
    }

    // Path must be a folder ending with '/' or '\'
    loadSong(path, bpm = 0) {
        // Reset time to calculate beats per minute
        this.bpmTime = 0;
        this.bpm = bpm;
        this.currentBpm = 0;
        // Load all the channels
        this.channels[0].loadSong(path + "Bass.mp3");
        this.channels[0].loadSong(path + "Drum.mp3");
        this.channels[0].loadSong(path + "Other.mp3");
        this.channels[0].loadSong(path + "Piano.mp3");
        this.channels[0].loadSong(path + "Vocal.mp3");
        this.canPlayChannels = 0;
    }


    onCanPlay() {
        this.canPlayChannels ++;
        if (this.canPlayChannels === this.totalChannels - 1) {
            this.audioOptions.onCanPlay();
            this.canPlayChannels = 0;
        }
    }

    onEnded() {
        this.endedChannels ++;
        if (this.endedChannels === this.totalChannels - 1) {
            this.audioOptions.onCanPlay();
            this.endedChannels = 0;
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

    update() {
        for (let i = 0; i < this.totalChannels; i++) {
            this.channels[i].update();
        }

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
 }