uniform sampler2D uTexture;
uniform float     uTime;
varying vec2      vUv; // Coordenadas UV del fragmento

void main() {
    vec4 color = texture2D(uTexture, vUv);
    gl_FragColor = vec4((color.rgb * 0.125), color.a * clamp(uTime, 0.0, 1.0));
}
