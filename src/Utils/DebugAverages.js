import Experience from "../Experience";

/*
 * This class makes a 2d canvas for debugin audio averages
 * Shows 6 channels labeled and with cool peaks
 */ 

export default class DebugAverages {
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
//            const peak = this.peaks[i];
            
            // calculate positions
            let freq0 = (avFreq[0] / 255) * height;
            let freq1 = (avFreq[1] / 255) * height;
            let freq2 = (avFreq[2] / 255) * height;
            let freq4 = (avFreq[4] / 255) * height;

            this.context.fillStyle = "red";
            // fill the bars
            this.context.fillRect((50 * i) + 1, height - freq0, 10, freq0);
            this.context.fillRect((50 * i) + 12, height - freq1, 10, freq1);
            this.context.fillRect((50 * i) + 23, height - freq2, 10, freq2);
            this.context.fillRect((50 * i) + 34, height - freq4, 10, freq4);

            // calculate peaks
/*            (peak[0] < freq0) ? peak[0] = freq0  : peak[0]-= 0.4;
            (peak[1] < freq1) ? peak[1] = freq1  : peak[1]-= 0.4;
            (peak[2] < freq2) ? peak[2] = freq2  : peak[2]-= 0.4;
            (peak[3] < freq4) ? peak[3] = freq4  : peak[3]-= 0.4;*/
            
            this.context.fillStyle = "white";
//console.log(avFreqPeak[0], peak[0] )

            // fill peaks
            this.context.fillRect((50 * i) + 1, height - ((avFreqPeak[0] / 255) * height), 10, -2);
            this.context.fillRect((50 * i) + 12, height - ((avFreqPeak[1] / 255) * height), 10, -2);
            this.context.fillRect((50 * i) + 23, height - ((avFreqPeak[2] / 255) * height), 10, -2);
            this.context.fillRect((50 * i) + 34, height - ((avFreqPeak[4] / 255) * height), 10, -2);

        }
    }

}