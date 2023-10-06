import Experience from "../../Experience.js";
import DebugEffect from "../../Utils/DebugEffect.js";

/*
 * Base class for BPMEffects
 *  Needs two functions :
 *      setupAnimation(tl, start, end)    initialize the gsap timeline animation 
 *      onUpdate(This)                    update your animation values 
 */
export default class BPMEffect {
    /*
     * this constructor has experience declared
     */
    constructor() {
        this.experience = new Experience();
        this.name  = "BPMEffect";
        this.params = "(0, 0)";
        this.start = 0;
        this.end   = 0;   
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
        This.debugEffect = new DebugEffect(This.name, This.start, This.end, This.params);
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