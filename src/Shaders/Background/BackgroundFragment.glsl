uniform sampler2D uTexture1;
uniform float     uActualTexture;
uniform float     uTime;
uniform float     uAlpha;
varying vec2      vUv; // Coordenadas UV del fragmento

void main() {
    vec4 color1 = texture2D(uTexture1, vUv);
    gl_FragColor = vec4((color1.rgb ), color1.a * clamp(uTime, 0.0, uAlpha));

    /*vec3 mangaColor = vec3(
        color1.r * 0.8 + color1.g * 0.2,
        color1.g * 0.7 + color1.b * 0.3,
        color1.b * 0.85 + color1.r * 0.15
    );

    gl_FragColor = vec4(mangaColor, color1.a * clamp(uTime, 0.0, uAlpha));*/
}
