precision mediump float;

uniform float     time, delta;
uniform vec2      resolution;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

//#define PI 0.01

void main() {

   vec2 fragCoordNormal = ( gl_FragCoord.xy / resolution.xy );

   float    factorX = sin((fragCoordNormal.x * 3.1416) + 1.57) / 16.0,
            factorY = sin((fragCoordNormal.y * 3.1416) + 1.57) / 16.0;

   float    tmpDeltaX = fragCoordNormal.x + factorX,
            tmpDeltaY = (1.0 - fragCoordNormal.y) - factorY;

   vec2 coordOut = vec2(tmpDeltaX, tmpDeltaY);

   vec4 pixel = texture2D(uMainSampler, coordOut);
   gl_FragColor = vec4( pixel.r, pixel.g, pixel.b, pixel.a );

}
