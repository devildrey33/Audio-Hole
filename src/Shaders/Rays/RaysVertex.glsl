
uniform float uTime;

attribute float aSpeed;

varying vec2 vUv;

void main() {
    vec4 modelPosition      = modelMatrix       * vec4(position , 1.0);

    modelPosition.z = - mod(modelPosition.z + (uTime * aSpeed), 100.0);

    vec4 viewPosition       = viewMatrix        * modelPosition;
    vec4 projectionPosition = projectionMatrix  * viewPosition;

//    projectionPosition.z = -mod(uTime * speed, 100);
    gl_Position = projectionPosition;
    vUv = uv;

    // Adapt point size to pixel ratio and random scale
    gl_PointSize = 100.0 * (1.0 / - viewPosition.z);

}