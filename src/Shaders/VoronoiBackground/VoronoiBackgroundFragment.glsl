uniform sampler2D uPointsTexture;    // Point data values
uniform float     uTime;
uniform float     uSpeed;
uniform float     uThickness;
uniform float     uCount;

varying vec2      vUv; // Coordenadas UV del fragmento


void main() {
//    const float points = uCount;
    vec4 point = vec4(0.0);
    vec4 p = vec4(0.0);
    float distMin = 10000.0;
    float dist = 0.0;
    for (float i = 0.0; i < uCount; i += 1.0) {        
        p = texture2D(uPointsTexture, vec2(i / uCount, 0.5));
        p.x += sin(uTime * (p.b * 0.005) * uSpeed) * 0.01;
        p.y += cos(uTime * 0.001 * uSpeed) * 0.01;
//        p.b += cos(uTime * 0.0001 * uSpeed) * 0.25;
        dist = length(p.rg - vUv);
        if (dist < distMin)  {
            point = p;
            distMin = dist;
        }
    }
//    vec4 point = texture2D(uPointsTexture, vUv);

    gl_FragColor = vec4(0.05 * 0.25, 0.05 * 0.25, 0.05 + point.a + point.b * 0.15, 0.1);
//    gl_FragColor = vec4(0.05 - distMin * 0.25, 0.05 - distMin * 0.25, 0.05 +  point.b * 0.25, 0.1);
}