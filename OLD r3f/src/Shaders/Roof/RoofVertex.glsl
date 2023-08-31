uniform sampler2D   uAudioTexture;
uniform float       uAudioStrength;
varying float       vAudioValue;
varying vec2        vUv;

void main() {
    vec4 modelPosition      = modelMatrix       * vec4(position , 1.0);
    vAudioValue = texture2D(uAudioTexture, uv).r;
    modelPosition.y -=  vAudioValue * uAudioStrength;
    vec4 viewPosition       = viewMatrix        * modelPosition;
    vec4 projectionPosition = projectionMatrix  * viewPosition;

    vUv = uv;
    gl_Position = projectionPosition;
}