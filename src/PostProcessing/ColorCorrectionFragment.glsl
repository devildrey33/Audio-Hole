
/*#ifdef FRAMEBUFFER_PRECISION_HIGH

	uniform mediump sampler2D map;

#else

	uniform lowp sampler2D map;

#endif*/

uniform vec3 powRGB;
uniform vec3 mulRGB;
uniform vec3 addRGB;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
//    vec4 color = texture2D(map, uv);
    outputColor.rgb = mulRGB * pow( ( inputColor.rgb + addRGB ), powRGB );
    outputColor.a = 1.0;

}
