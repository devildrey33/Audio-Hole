import Experience from "../../Experience.js";
import { DebugEffect } from "../../Utils/DebugEffects.js";

export default class BPMEffect {
    constructor() {
        this.experience = new Experience();
        this.name  = "BPMEffect";
        this.params = "(0, 0)";
        this.start = 0;
        this.end   = 0;

        // disable debug functions
        if (this.experience.options.debug !== true) {
            this.onStart          = () => {};
            this.onComplete       = () => {};
            this.onUpdateProgress = () => {};
        }
    }

    onStart(This) {
        This.debugEffect = new DebugEffect(This.name, This.start, This.end, This.params);
        This.element = This.debugEffect.element;
//        console.log("Start", This.element)
    }

    onComplete(This) {
//        console.log("complete", This.element)
        if (typeof(This.element) !== "undefined") {
            This.element.setAttribute("visible", "false");
            
            setTimeout(() => { This.element.remove(); }, 500);
        } 
//        console.log("complete removed", This.element)
    }

    onUpdateProgress(current, total) {
        let val = (current / total) * 100;
        if (typeof(this.element) !== "undefined") this.element.style.backgroundPositionX = `${100 - Math.floor(val)}%`;
//        this.element.setAttribute("data-pos", `${Math.floor(val)}%`);
//        console.log((current / total) * 100);
    }
}