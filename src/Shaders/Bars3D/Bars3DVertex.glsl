uniform sampler2D uAudioTexture;  // Linear texture (1024 * 1) to get audio values
uniform float     uAudioStrength; // Strength multiplyer 
uniform float     uAudioZoom;     // Zoom 
attribute float   aId;            // Its an unique ID for each bar (1.0 / totalBars * actualBar)
varying vec2      vUv;

void main() {
    float audioValue = ((texture2D(uAudioTexture, vec2((aId / uAudioZoom), 0.0)).r) * uAudioStrength);

    vec4 modelPosition      = modelMatrix       * vec4(position , 1.0);
    // If the point is from superior part
//    vec4 data = texture2D(uAudioTexture, vec2(aId, 0.0));
    modelPosition.y *= audioValue;
    modelPosition.y -= 30.0;
/*    if (uv.x < 0.5 ) {
        // Add the red channel intensity to the Y of the model
        modelPosition.y +=  data.r * uAudioStrength;
    }
    /*else {
        modelPosition.y -=  data.r * uAudioStrength;
    }*/
 
    vec4 viewPosition       = viewMatrix        * modelPosition;
    vec4 projectionPosition = projectionMatrix  * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}