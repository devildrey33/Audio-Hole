import Experience from "../Experience";

export default class HTMLElements {
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
//        this.createAudioControls();
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

//        let play = !this.song.paused;

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
                        One channel analized <br />
                        512 frequency values
                    </div>
                </div>
                <div class='Experience_Quality_List' id='Experience_Quality_High'>
                    <div>High</div>
                    <div>
                        Six channels analized <br />
                        2048 frequency values
                    </div>
                </div>
            </div>`;

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

                strHTML +=  "<div class='Experience_Panel Experience_Static Experience_AudioLevels' title='Audio levels (High / Medium / Low / Total)'>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelH' id='Experience_AudioLevelH0'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelM' id='Experience_AudioLevelM0'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelL' id='Experience_AudioLevelL0'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelT' id='Experience_AudioLevelT0'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelH' id='Experience_AudioLevelH1'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelM' id='Experience_AudioLevelM1'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelL' id='Experience_AudioLevelL1'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelT' id='Experience_AudioLevelT1'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelH' id='Experience_AudioLevelH2'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelM' id='Experience_AudioLevelM2'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelL' id='Experience_AudioLevelL2'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelT' id='Experience_AudioLevelT2'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelH' id='Experience_AudioLevelH3'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelM' id='Experience_AudioLevelM3'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelL' id='Experience_AudioLevelL3'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelT' id='Experience_AudioLevelT3'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelH' id='Experience_AudioLevelH4'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelM' id='Experience_AudioLevelM4'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelL' id='Experience_AudioLevelL4'></div>" +
                                "<div class='Experience_AudioLevel Experience_AudioLevelT' id='Experience_AudioLevelT4'></div>" +
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
                                "<img draggable='false' src='icos.svg#svg-pantalla-completa' />" +
                            "</div>" +
                            "<div id='restoreScreen' class='Experience_Panel Experience_Control' title='Restore screen'>" +
                                "<img draggable='false' src='icos.svg#svg-restaurar-pantalla' />" +
                            "</div>";                
            }

            // Show github button
            if (this.options.buttonGitHub === true) {
                strHTML +=  "<a href='" + this.options.urlGitHub + "' target='_blank' class='Experience_Panel Experience_Control' title='GitHub project'>" +
                                "<img draggable='false' src='icos.svg#svg-github' />" +            
                            "</a>";
            }
            // Show devildrey33 logo button
            if (this.options.buttonLogo === true) {
                strHTML +=  "<a href='https://devildrey33.es' target='_blank' id='Logo' class='Experience_Panel Experience_Control'>" +
                                "<img draggable='false' src='icos.svg#svg-logo' />" +
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
                            <input id='volume' type='range' name='volume' min='0' max='1' value='${this.experience.options.audioVolume}' step='0.01'></input>
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

        // Determino el ancho y altura del canvas (fijo o variable)
/*        if (this.options.width  === "auto") { this.width  = this.options.width;  }
        if (this.options.height === "auto") { this.height = this.options.height; }        
        // Si el canvas es de ancho fijo, añado el css para centrar-lo
        if (this.options.width  !== "auto") { 
            this.sizes.width = this.options.width;
            this.elementCanvas.style.width  = this.sizes.width  + "px"; 
        }
        if (this.options.left  === "auto") { 
            this.elementCanvas.style.left   = "calc(50% - (" + this.width  + "px / 2))"; 
        }

        if (this.options.height !== "auto") { 
            this.sizes.height = this.options.height;
            this.elementCanvas.style.height = this.height + "px"; 
        }
        if (this.options.top  === "auto") { 
            this.elementCanvas.style.top    = "calc(50% - (" + this.height + "px / 2))"; 
        }*/

        // Actualizo las posiciones
//        this.eventResize();
    }
}