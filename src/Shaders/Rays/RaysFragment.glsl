uniform sampler2D uTexture;   
varying vec2      vUv; 

void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.1 / distanceToCenter - 0.1;

    gl_FragColor = vec4(strength, strength, strength, strength);
//    vec3 col = texture2D(texture, vUv).rgb;
//    gl_FragColor = vec4(col, 1.0);
//    gl_FragColor.a = 1.0;
}