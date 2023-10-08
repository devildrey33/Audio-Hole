uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;
uniform float     uActualTexture;
uniform float     uTime;
varying vec2      vUv; // Coordenadas UV del fragmento

void main() {
    vec4 color1 = texture2D(uTexture1, vUv);
    vec4 color2 = texture2D(uTexture2, vUv);
    vec4 color3 = texture2D(uTexture3, vUv);
    gl_FragColor = vec4((color1.rgb * 0.125), color1.a * clamp(uTime, 0.0, 1.0));
}
