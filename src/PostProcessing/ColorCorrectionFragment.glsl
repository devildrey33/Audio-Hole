

uniform vec3 powRGB;
uniform vec3 mulRGB;
uniform vec3 addRGB;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor.rgb = mulRGB * pow( ( inputColor.rgb + addRGB ), powRGB );
}
