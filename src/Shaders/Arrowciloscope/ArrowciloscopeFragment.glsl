uniform sampler2D uAudioTexture;    // AUdio data values
uniform float     uAudioStrength;   // Audio strength
uniform float     uAudioZoom;       // Audio Zoom
uniform float     uSize;            // Line size
uniform vec3      uColor;           // 
varying vec2      vUv; 

void main() {
    // Get the audio value from texture green channel
    float audioValue = ((texture2D(uAudioTexture, vec2(vUv.x / uAudioZoom, 0.0)).g - .5) * uAudioStrength) + .5;
    
    float curSize = uSize - (vUv.x * uSize);
    // Its inside the line
    if (abs(vUv.y - audioValue) < curSize) {
        gl_FragColor = vec4(uColor, 0.7);
    }
    // Its outside the line
    else {
        discard;
    }
}
