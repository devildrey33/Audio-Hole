// https://tympanus.net/codrops/2022/06/27/volumetric-light-rays-with-three-js/

/*
 * NOT USED
 */

uniform sampler2D tDiffuse;
varying vec2 vUv;

#define PI 3.14159265
#define MAX 20.0

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
//    vec4 original = texture2D(tDiffuse, vec2(fract(vUv.x * 1.0), fract(vUv.y * 2.0) ));
    vec4 original = texture2D(tDiffuse, vUv);
    vec4 color = vec4(0.0);
    vec2 center = vec2(0.5) - vUv;
    float total = 0.0;
    for (float i = 0.0; i < MAX; i += 1.0)  {
        float lerp = 0.1 + ((i + (rand(vUv * 1.0))) / MAX);
        float weight = sin(lerp * PI);
        vec4 tex = texture2D(tDiffuse, vUv + center * lerp * 0.4);
        tex.rgb *= tex.a;
        color += tex * weight;
        total += weight;
    }
    color.a = 1.0;
    color.rgb /= total;

//    vec4 finalColor = 1.0 - (1.0 - color) * (1.0 - original);
    vec4 finalColor = 1.0 - (0.75 - color) * (1.0 - original);

    gl_FragColor = finalColor;
//    gl_FragColor = original;
}