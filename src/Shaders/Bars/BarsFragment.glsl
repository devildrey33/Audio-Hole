varying vec2 vUv;

void main() {
    float dist = length(vUv - vec2(0.5)) * 0.25;


    // Fill the bar with red
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}