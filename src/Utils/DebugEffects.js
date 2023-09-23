import Experience from "../Experience";



export class DebugEffect {
    

    constructor(name, start, end, params) {
        this.experience = new Experience();
        if (typeof(this.experience.idDebugEffect) === "undefined") this.experience.idDebugEffect = 0;
        else                                                       this.experience.idDebugEffect ++;

        
        this.name   = name;
        this.params = params;
        this.start  = start;
        this.end    = end;
//        this.id    = 0;

        this.createHTML();
    }

    createHTML() {
        let strHTML = `<div class='Experience_DebugEffect' 
                            id="DebugEffect${this.experience.idDebugEffect}" 
                        >
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
                        
                        </div>`;
        this.experience.htmlElements.elementDebugEffects.innerHTML = strHTML + this.experience.htmlElements.elementDebugEffects.innerHTML;
        this.element = document.getElementById(`DebugEffect${this.experience.idDebugEffect}`);
    }
}

export default class DebugEffects {
    constructor() {
//       this.uno = new DebugEffect("test", 0, 0);
    }



}

