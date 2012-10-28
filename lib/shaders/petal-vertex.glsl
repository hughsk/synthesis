varying vec3 color;

uniform float curveHeightStart;
uniform float curveHeightEnd;
uniform float curveHeightScale;

uniform float curveWidthStart;
uniform float curveWidthEnd;
uniform float curveWidthScale;
    
uniform float growth;
uniform float twirl;

attribute float xpos;
attribute float widths;
    
varying float widthPoint;
varying float lengthPoint;

void main()
{
    float xpnt = xpos * growth;

    float twirlAngle = xpnt * twirl;
    float twirlSin = sin(twirlAngle);
    float twirlCos = cos(twirlAngle);

    mat4 twirler = mat4(
              1.0, 0.0, 0.0, 0.0,
              0.0, twirlCos, -twirlSin, 0.0,
              0.0, twirlSin,  twirlCos, 0.0,
              0.0, 0.0,            0.0, 1.0 
    );

    color = vec3(xpos, xpos, xpos);
    
    widthPoint = widths;
    lengthPoint = xpos;

    // Amplitude of the petal's width/height.
    // 
    // Note that the height is scaled by growth, but the
    // width remains the same.
    float ampHeight = sin(
        curveHeightStart + xpnt * (curveHeightEnd - curveHeightStart)
    ) * curveHeightScale;

    float ampWidth = widths * sin(
        curveWidthStart + xpos * (curveWidthEnd - curveWidthStart)
    ) * curveWidthScale;

    vec4 pos =  vec4(growth * position, 1.0) + vec4(0.0, ampHeight, growth * ampWidth, 0.0);

    gl_Position = projectionMatrix * modelViewMatrix * twirler * pos;
}