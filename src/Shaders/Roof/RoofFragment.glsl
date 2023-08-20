uniform sampler2D   uAudioTexture;
uniform float       uAudioStrength;
varying float       vAudioValue;
varying vec2        vUv;

void main() {

    #define GRID_SIZE   32.0
    #define BORDER_SIZE  0.5

    vec3 uColorGrid = vec3(1.0);


    // Calculate the position of the grid
    vec2 position = mod((vUv * GRID_SIZE * GRID_SIZE), vec2(GRID_SIZE)) / GRID_SIZE;
    // Calculate the ratio of each row
    float ratio = BORDER_SIZE / GRID_SIZE;
    // Calculate the border of the grid
    float border =  step(position.x, ratio) + 
                    step(position.y, ratio) + 
                    step(1.0 - position.x, ratio) + 
                    step(1.0 - position.y, ratio);

    vec3 color = mix(vec3(0.0, 0.0, vAudioValue), uColorGrid, step(position.x, ratio) + step(position.y, ratio));

    gl_FragColor = vec4(color, vAudioValue);
}