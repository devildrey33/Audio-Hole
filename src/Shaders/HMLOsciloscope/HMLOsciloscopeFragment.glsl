uniform sampler2D uAudioTexture;    // AUdio data values
uniform float     uAudioStrength;   // Audio strength
uniform vec4      uAudioValue;      // Audio average value
uniform float     uTime;            // Current time
uniform float     uSpeed;           // Spped

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

#define PI 3.1415

/*vec4 Line(vec3 color, float audioValue, float speed, float width) {
    const float freq = 15.0;
    const float amp = 1.0 / 15.0;
    vec2 uv = vUv - 0.5;
    float y = sin(uv.x * PI * freq * (uTime * 10.0) * speed) * amp;
    return vec4(color - abs(uv.y - (y + 0.01)), 1.0);
}*/

vec4 Line2(vec3 color, float audioValue, float speed, float width) {
    float curve = (0.25 * width) * sin((10.25 * vUv.x) - (uSpeed * speed * uTime * 10.0));

    float lineAShape = smoothstep(1.0 - clamp(distance(curve + (vUv.y) + (audioValue * 0.5), 0.5 ) * 1.0, 0.0, 1.0), 1.0, 0.99);
    vec4  lineACol = (1.0 - lineAShape) * vec4(mix(vec4(color, 1.0), vec4(0.0), lineAShape));
    return lineACol;
}

void main() {
    //const divisions = [ 256, 2000, 16000, 50000 ];
/*    const float posMinH = 0.0;
    const float posMaxH = (1.0 / 25000.0) * 256.0;
    const float posMaxM = (1.0 / 25000.0) * 2000.0;
    float posH = (mod(vUv.x * 64.0, 1.0) / 25000.0) * 256.0;
    float posM = posMaxH + ((mod(vUv.x * 32.0, 1.0) / 25000.0) * 2000.0);
    float posL = posMaxM + ((mod(vUv.x * 4.0, 1.0) / 25000.0) * 10000.0);

    float audioValueH = ((texture2D(uAudioTexture, vec2(mod(posH * 512.0, posH) , 0.0)).g ) * uAudioStrength);    
    float audioValueM = ((texture2D(uAudioTexture, vec2(mod(posM * 4.0, posM), 0.0)).g ) * uAudioStrength);    
    float audioValueL = ((texture2D(uAudioTexture, vec2(posL, 0.0)).g ) * uAudioStrength);    
*/

    float audioValue = ((texture2D(uAudioTexture, vec2(mod(vUv.x * 2.0, 1.0), 0.0)).g ) * uAudioStrength);    

    vec4 finalColor = vec4(0.0, 0.0, 0.0, 0.0);
    finalColor += Line2(vec3(0.5, 0.5, 1.0), audioValue, .230, uAudioValue.r);
    finalColor += Line2(vec3(0.5, 1.0, 0.5), audioValue, .435, uAudioValue.g);
    finalColor += Line2(vec3(1.0, 0.5, 0.5), audioValue, .640, uAudioValue.b);
//    finalColor += vec4(Line2(vec3(0.0), audioValue, .245));
    vec4 tmpCol = Line2(vec3(1.0, 1.0, 1.0), audioValue, .845, uAudioValue.a);
    if (tmpCol.a > 0.1) finalColor = tmpCol;
//        finalColor.rgb += Line(uv, 1.0, 16.0, audioValue * 5.0, 2.0);
//        finalColor.rgb += Line(uv, 1.0, 16.0, audioValue * 5.0, 4.0);
//        finalColor.a = 1.0;
//        finalColor.a = 0.1 - (vUv.x * 0.1);
//        finalColor.a *= uAudioValue * 0.05;
//    }    
    finalColor.a *= (0.01 + uAudioValue.g) * 0.75 * vUv.x;
    //finalColor.a = 1.0;

//    if (finalColor.a < 0.01) discard;
    gl_FragColor = finalColor;
//    vec2 lowSinus = 0.5 + (0.5 * sin(vUv * 3.14159));
    
//    gl_FragColor = vec4(lowSinus.x, lowSinus.y, lowSinus.x, 1.0);
}
