uniform sampler2D uAudioTexture;    // AUdio data values
uniform float     uAudioStrength;   // Audio strength
uniform float     uAudioValue;      // Audio average value
uniform float     uTime;            // Current time

varying vec2      vUv; 

/*vec4 Line(vec2 uv, float speed, float height, vec3 col) {
    float audioValue = ((texture2D(uAudioTexture, vec2(vUv.x, 0.0)).g ) * uAudioStrength);    
    
    uv.y += audioValue + smoothstep(1., 0., abs(uv.x)) * sin(uTime * speed + uv.x * height) * .2;
    return vec4(smoothstep(.06 * smoothstep(.2, .9, abs(uv.x)), 0., abs(uv.y) - .004) * col, 1.0);// * smoothstep(1., .3, abs(uv.x));
}*/

/*float Line(vec2 uv, float speed, float height, float audioValue, float pos) {
    uv.y += audioValue * 0.5 * smoothstep(.65, 0., abs(uv.x)) * sin((uTime * speed + uv.x * height) + pos) * .2;
    return smoothstep(.06 * smoothstep(.2, .9, abs(uv.x)), 0., abs(uv.y) - .02) * 0.5;// * smoothstep(1., .3, abs(uv.x));
}*/

// https://shader.how/to/draw-a-sine-wave/
vec4 Line2(vec3 color, float audioValue, float speed) {
    float curve = 0.25 * sin((30.25 * vUv.x) - (speed * uTime));

    float lineAShape = smoothstep(1.0 - clamp(distance(curve + (vUv.y + (audioValue * 0.5)), 0.5) * 1.0, 0.0, 1.0), 1.0, 0.99);
    vec4  lineACol = (1.0 - lineAShape) * vec4(mix(vec4(color, 1.0), vec4(0.0), lineAShape));
    return lineACol;
}

void main() {
//    const float fftSize = 2048;

    //const divisions = [ 256, 2000, 16000, 50000 ];
/*    const float posMinH = 0.0;
    const float posMaxH = (1.0 / 25000.0) * 256.0;
    const float posMaxM = (1.0 / 25000.0) * 2000.0;
    float posH = (vUv.x / 25000.0) * 256.0;
    float posM = posMaxH + ((vUv.x / 25000.0) * 2000.0);
    float posL = posMaxM + ((vUv.x / 25000.0) * 10000.0);
//    float posL = posMaxM + ((vUv.x / 50000.0) * 10000.0);

    float audioValueH = ((texture2D(uAudioTexture, vec2(mod(posH * 512.0, posH) , 0.0)).g ) * uAudioStrength);    
    float audioValueM = ((texture2D(uAudioTexture, vec2(mod(posM * 4.0, posM), 0.0)).g ) * uAudioStrength);    
    float audioValueL = ((texture2D(uAudioTexture, vec2(posL, 0.0)).g ) * uAudioStrength);    

    vec2 uv = vUv - 0.5; //(I - .5 * iResolution.xy) / iResolution.y;*/
//    for (float i = 0.; i <= 5.; i += 1.) {
//        float t = 5.;
/*        float H = Line(uv, .1, 16.0, 1.0 + audioValueH * 5.0, 0.0);
        float M = Line(uv, .2, 16.0, 1.0 + audioValueM * 5.0, 1.5);
        float L = Line(uv, .3, 16.0, 1.0 + audioValueL * 5.0, 3.0);
        float T = Line(uv, .4, 16.0, 1.0 + audioValue * 5.0, 4.52);
        finalColor += vec4(H, H * 0.5, H * 0.5, 0.33);
        finalColor += vec4(M * 0.5, M , M * 0.5, 0.33);
        finalColor += vec4(L * 0.5, L * 0.5, L, 0.33);
        finalColor += vec4(T * 0.5, T * 0.5, T * 0.5, 0.5);
*/

    float audioValue = ((texture2D(uAudioTexture, vec2(mod(vUv.x * 4.0, 1.0), 0.0)).g ) * uAudioStrength);    

    vec4 finalColor = vec4(0.0, 0.0, 0.0, 0.0);
    finalColor += vec4(Line2(vec3(1.0, 0.5, 0.5), audioValue, .23));
    finalColor += vec4(Line2(vec3(0.5, 1.0, 0.5), audioValue, .235));
    finalColor += vec4(Line2(vec3(0.5, 0.5, 1.0), audioValue, .240));
    finalColor += vec4(Line2(vec3(0.5), audioValue, .245));
//        finalColor.rgb += Line(uv, 1.0, 16.0, audioValue * 5.0, 2.0);
//        finalColor.rgb += Line(uv, 1.0, 16.0, audioValue * 5.0, 4.0);
//        finalColor.a = 1.0;
//        finalColor.a = 0.1 - (vUv.x * 0.1);
        finalColor.a *= uAudioValue * 0.05;
//    }    
    if (finalColor.a < 0.01) discard;
    gl_FragColor = finalColor;
//    vec2 lowSinus = 0.5 + (0.5 * sin(vUv * 3.14159));
    
//    gl_FragColor = vec4(lowSinus.x, lowSinus.y, lowSinus.x, 1.0);
}
