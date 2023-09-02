import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
import Experience from "./Experience";
import options from './Config/options';


export default class Camera {
    // Constructor
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.mouseX = 0;
        this.mouseY = 0;

        this.setInstance();
        if (options.orbitControls === true) {
            this.setOrbitControls();
            this.update = () => {};
        }
        else {
            this.setCameraControls();
        }
    }


    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 1000);
        // Adapt camera to view port
        const xz = (this.sizes.width > this.sizes.height) ? 25 : 40;
//        this.instance.position.set(-xz * 0.5, 13, xz);
        this.instance.position.set(0, 0, 1);
        this.scene.add(this.instance);
//        console.log (this.instance.position);
    }


    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
//        this.controls.enableDamping = true;
    }

    setCameraControls() {
        this.experience.canvas.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX - (this.sizes.width * 0.5);
            this.mouseY = e.clientY - (this.sizes.height * 0.5);
        });
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        // update camera rotation using mouse coordinates
        this.instance.rotation.y = THREE.MathUtils.lerp(this.instance.rotation.y, (this.mouseX * Math.PI) / 50000, 0.05) 
        this.instance.rotation.x = THREE.MathUtils.lerp(this.instance.rotation.x, (this.mouseY * Math.PI) / 50000, 0.05)

    }
}
