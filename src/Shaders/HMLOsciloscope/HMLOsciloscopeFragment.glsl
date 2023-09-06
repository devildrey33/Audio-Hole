uniform sampler2D uAudioTexture;    // AUdio data values
uniform float     uAudioStrength;   // Audio strength
uniform float     uTime;            // Current time

varying vec2      vUv; 

/*vec4 Line(vec2 uv, float speed, float height, vec3 col) {
    float audioValue = ((texture2D(uAudioTexture, vec2(vUv.x, 0.0)).g ) * uAudioStrength);    
    
    uv.y += audioValue + smoothstep(1., 0., abs(uv.x)) * sin(uTime * speed + uv.x * height) * .2;
    return vec4(smoothstep(.06 * smoothstep(.2, .9, abs(uv.x)), 0., abs(uv.y) - .004) * col, 1.0);// * smoothstep(1., .3, abs(uv.x));
}*/

float Line(vec2 uv, float speed, float height, float audioValue, float pos) {
    
    uv.y += audioValue * smoothstep(1., 0., abs(uv.x)) * sin((uTime * speed + uv.x * height) + pos) * .2;
    return smoothstep(.06 * smoothstep(.2, .9, abs(uv.x)), 0., abs(uv.y) - .004) * 1.0;// * smoothstep(1., .3, abs(uv.x));
}

void main() {
    float audioValue = ((texture2D(uAudioTexture, vec2(vUv.x, 0.0)).g ) * uAudioStrength);    

    vec2 uv = vUv - 0.5; //(I - .5 * iResolution.xy) / iResolution.y;
    vec4 finalColor = vec4 (0.);
//    for (float i = 0.; i <= 5.; i += 1.) {
//        float t = 5.;
        finalColor.r += Line(uv, 1.0, 16.0, audioValue * 5.0, 0.0);
        finalColor.g += Line(uv, 1.0, 16.0, audioValue * 5.0, 2.0);
        finalColor.b += Line(uv, 1.0, 16.0, audioValue * 5.0, 4.0);
        finalColor.a = 0.1 - (vUv.x * 0.1);
        finalColor.a = .5;
//    }    
    gl_FragColor = finalColor;
//    vec2 lowSinus = 0.5 + (0.5 * sin(vUv * 3.14159));
    
//    gl_FragColor = vec4(lowSinus.x, lowSinus.y, lowSinus.x, 1.0);
}
