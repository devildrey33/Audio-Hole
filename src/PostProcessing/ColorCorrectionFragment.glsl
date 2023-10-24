

uniform vec3 powRGB;
uniform vec3 mulRGB;
uniform vec3 addRGB;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

//    vec4 col = texture2D(inputBuffer, vec2(mod(uv.x * 2.0, 1.0), mod(uv.y * 2.0, 1.0)));
//    outputColor.rgb = mulRGB * pow( ( col.rgb + addRGB ), powRGB );

    outputColor.rgb = mulRGB * pow( ( inputColor.rgb + addRGB ), powRGB );
//    outputColor.a = 1.0;

}
