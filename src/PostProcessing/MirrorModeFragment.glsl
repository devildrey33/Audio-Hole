uniform float uEnabled;
uniform float uTime;
uniform float uStartTime;
/*
 * TODO : add uEndTime, by this way whe can remove the half of ifs nad its more controlable
 */


void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    if (uEnabled == 0.1) { // bigger width disable
        // 2 seconds from 0 to 1
        float curPos = clamp(uTime - uStartTime, 0.0, 2.0) * 0.5;
        float x = 2.0 * abs(uv.x - 0.5);
        vec4 color = texture2D(inputBuffer, vec2(x, uv.y));
        outputColor = vec4(color.rgb * (1.0 - curPos), 1.0);
    }
    else if (uEnabled == 1.0) { // bigger width
        // 10 seconds from 0 to 1
        float curPos = clamp(uTime - uStartTime, 0.0, 10.0) * 0.1;
//        float x = 2.0 * abs(uv.x - (curPos * 0.5));
        float x = 2.0 * abs(uv.x - 0.5);
        vec4 color = texture2D(inputBuffer, vec2(x, uv.y));
        outputColor = vec4(color.rgb * curPos, 1.0);
    }
    else if (uEnabled == 0.2) { // bigger height disable
        // 2 seconds from 0 to 1
        float curPos = clamp(uTime - uStartTime, 0.0, 2.0) * 0.5;
        float y = 2.0 * abs(uv.y - 0.5);
        vec4 color = texture2D(inputBuffer, vec2(uv.x, y));
        outputColor = vec4(color.rgb * (1.0 - curPos), 1.0);
    }
    else if (uEnabled == 2.0) { // bigger height
        float curPos = clamp(uTime - uStartTime, 0.0, 10.0) * 0.1;
        float y = 2.0 * abs(uv.y - 0.5);
        vec4 color = texture2D(inputBuffer, vec2(uv.x, y));
        outputColor = vec4(color.rgb * curPos, 1.0);
    }
/*    else if (uEnabled == 0.3) { // 4 mirrors disable
        // 2 seconds from 0 to 1
        float curPos = clamp(uTime - uStartTime, 0.0, 2.0) * 0.5;
        float x = 2.0 * abs(uv.x - 0.5);
        float y = 2.0 * abs(uv.y - 0.5);
        vec4 color = texture2D(inputBuffer, vec2(x, y));
        outputColor = vec4(color.rgb * (1.0 - curPos), 1.0);
    }
    else if (uEnabled == 3.0) { // 4 mirrors
        float curPos = clamp(uTime - uStartTime, 0.0, 10.0) * 0.1;
        float x = 2.0 * abs(uv.x - 0.5);
        float y = 2.0 * abs(uv.y - 0.5);
        vec4 color = texture2D(inputBuffer, vec2(x, y));
        outputColor = vec4(color.rgb * (1.0 - curPos), 1.0);
    }*/
   
    
}
    