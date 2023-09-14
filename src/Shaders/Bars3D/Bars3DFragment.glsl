varying vec2 vUv;

void main() {
    float dist = length(vUv - vec2(0.5));
    

    // Fill the bar with red
    gl_FragColor = vec4(dist, dist, dist, 0.025);
}