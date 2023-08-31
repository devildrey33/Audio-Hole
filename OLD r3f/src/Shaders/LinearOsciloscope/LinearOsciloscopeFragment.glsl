//uniform float     uTime;
//uniform vec2      uResolution;
uniform sampler2D uAudioTexture;
uniform float     uAudioStrength;
uniform float     uAudioZoom;
uniform float     uThickness;
varying vec2      vUv; // Coordenadas UV del fragmento



void main() {
    // Get the audio value from texture green channel
    float audioValue = ((texture2D(uAudioTexture, vec2(vUv.x / uAudioZoom, 0.0)).g - .5) * uAudioStrength) + .5;

    // Base color
    vec4 color = vec4(1.0);

    if (abs(vUv.y - audioValue) < uThickness) {
        color = vec4(0.0, 0.75, 0.0, 1.0);
    }
    else {
        discard;
    }


    gl_FragColor = color;
}
