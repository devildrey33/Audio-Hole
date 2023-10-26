uniform float uTime;                // current song time comes in seconds
uniform float uStartTime;           // start time in seconds
uniform float uEndTime;             // end time in seconds (duration is uEndTime - uStartTime)

uniform float uTimeAnimationIn;     // Time in seconds of the starting animation (split)
uniform float uTimeAnimationOut;    // Time in seconds of the finish animation   (join)
uniform vec2  uSize;                // width and height of the viewport

// https://github.com/glslify/glsl-easings/blob/master/bounce-out.glsl
/*float bounceOut(float t) {
  const float a = 4.0 / 11.0;
  const float b = 8.0 / 11.0;
  const float c = 9.0 / 10.0;

  const float ca = 4356.0 / 361.0;
  const float cb = 35442.0 / 1805.0;
  const float cc = 16061.0 / 1805.0;

  float t2 = t * t;

  return t < a
    ? 7.5625 * t2
    : t < b
      ? 9.075 * t2 - 9.9 * t + 3.4
      : t < c
        ? ca * t2 - cb * t + cc
        : 10.8 * t * t - 20.52 * t + 10.72;
}

// https://github.com/glslify/glsl-easings/blob/master/bounce-in.glsl
float bounceIn(float t) {
  return 1.0 - bounceOut(1.0 - t);
}*/

// https://github.com/glslify/glsl-easings/blob/master/elastic-in-out.glsl
#define HALF_PI 1.5707963267948966
float elasticInOut(float t) {
  return t < 0.5
    ? 0.5 * sin(+13.0 * HALF_PI * 2.0 * t) * pow(2.0, 10.0 * (2.0 * t - 1.0))
    : 0.5 * sin(-13.0 * HALF_PI * ((2.0 * t - 1.0) + 1.0)) * pow(2.0, -10.0 * (2.0 * t - 1.0)) + 1.0;
}


void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
//    outputColor = inputColor;
    if (uTime > uStartTime && uTime < uEndTime) {
        // begin animation uTimeAnimationIn  from 0 to 1
        float curPosIn  = elasticInOut(clamp(uTime - uStartTime, 0.0, uTimeAnimationIn) * (1.0 / uTimeAnimationIn));
        // end animation uTimeAnimationOut from 0 to 1
        float curPosOut = elasticInOut(clamp(uTime - (uEndTime - uTimeAnimationOut), 0.0, uTimeAnimationOut) * (1.0 / uTimeAnimationOut));
        // Combine animations and multiply * 0.25 of displacement
        float displacement = (curPosIn - curPosOut) * 0.25;
        // Determinate the position of mirrors 
        vec2 pos = uv, pos2 = uv;
        float mixPos = uv.y; // mix set for width < height
        // width its greater than height
        if (uSize.x > uSize.y) { 
            pos.x  = uv.x + displacement;
            pos2.x = uv.x - displacement;
            mixPos = uv.x;
        }
        // height its greater than width
        else { 
            pos.y  = uv.y + displacement;
            pos2.y = uv.y - displacement;
        }
        // Get colors from inputBuffer
        vec4 color  = texture2D(inputBuffer, pos);
        vec4 color2 = texture2D(inputBuffer, pos2);
        // Set transparency in oposite ways
        color.a  = 1.0 - uv.x;
        color2.a = uv.x;
        // Combine the final color using both mirrors
        outputColor = mix(color, color2, mixPos);
        //outputColor = vec4((color.rgb + color2.rgb) * (curPos), 1.0);
    }
}

/*
 * TODO : add uEndTime, by this way whe can remove the half of ifs nad its more controlable
 */


/*void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = inputColor;
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
   
    
//}
    