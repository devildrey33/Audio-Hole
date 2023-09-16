uniform sampler2D uAudioTexture;    // AUdio data values
uniform float     uAudioStrength;   // Audio strength
uniform float     uAudioZoom;       // Audio zoom
uniform float     uAudioValue;      // Audio average value

uniform float     uTime;            // Current time
uniform float     uSpeed;           // Spped

varying vec2 vUv;

vec3 Bars(vec3 color, float speed, float amplitude) {
    vec2 pos = vec2(-0.5 + mod(vUv.x - ((uTime * 0.01) * speed), 1.0), -0.5 + vUv.y);    

    float audioValue = ((texture2D(uAudioTexture, vec2((abs(pos.x * 2.0) / uAudioZoom), 0.0)).r) * uAudioStrength) * amplitude * 0.5;

    if (abs(pos.y) < audioValue ) return color * uAudioValue * 0.125;
    return vec3(0.0);
}

void main() {
    vec3 color = vec3(0.0);
    color += Bars(vec3(1.0, 0.5, 0.5), 1.1, 1.0);
    color += Bars(vec3(0.5, 1.0, 0.5), 0.8, 0.9);
    color += Bars(vec3(0.5, 0.5, 1.0), 0.6, 0.8);
    color -= Bars(vec3(.7, .7, .0), 1.3, .50);
    if (color.r > 0.0 || color.g > 0.0 || color.b > 0.0) {
        gl_FragColor = vec4(color, 1.0);        
        gl_FragColor = vec4(color, 1.0 * (1.0 - vUv.x));        
    }
    else {
        discard;
    }
}