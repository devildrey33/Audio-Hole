import Experience from "../Experience";

/* 
 * Class to create and show bpm animations in debug mode
 */
export default class DebugEffect {
    
    constructor(name, start, end, params) {
        this.experience = new Experience();
        if (typeof(this.experience.idDebugEffect) === "undefined") this.experience.idDebugEffect = 0;
        else                                                       this.experience.idDebugEffect ++;
        
        this.name   = name;
        this.params = params;
        this.start  = start;
        this.end    = end;

        this.createHTML();
    }

    createHTML() {

        this.element = document.createElement("div");
        this.element.className = "Experience_DebugEffect";
        this.element.id = `DebugEffect${this.experience.idDebugEffect}`;

        let strHTML = `
                            <div>
                                ${this.name}
                            </div>
                            <div>
                                ${this.params}
                            </div>
                            <div>
                                ${this.start}
                            </div>
                            <div>
                                ${this.end}
                            </div>
                        `;
        this.element.innerHTML = strHTML;

        if (this.experience.htmlElements.elementDebugEffects.firstChild === null) {
            this.experience.htmlElements.elementDebugEffects.appendChild(this.element);
        }
        else {
            this.experience.htmlElements.elementDebugEffects.insertBefore(this.element, this.experience.htmlElements.elementDebugEffects.firstChild);
        }
        this.element = document.getElementById(`DebugEffect${this.experience.idDebugEffect}`);
        this.element.setAttribute("visible", "true");
    }
}


