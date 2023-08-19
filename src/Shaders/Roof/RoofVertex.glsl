uniform sampler2D   uAudioTexture;
uniform float       uAudioStrength;

void main() {
     vec4 modelPosition      = modelMatrix       * vec4(position , 1.0);
     float audioValue = texture2D(uAudioTexture, uv).r;
    modelPosition.y -=  audioValue * uAudioStrength;
    vec4 viewPosition       = viewMatrix        * modelPosition;
    vec4 projectionPosition = projectionMatrix  * viewPosition;

    gl_Position = projectionPosition;
}