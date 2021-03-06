precision mediump float;

uniform float     time;
uniform vec2      resolution;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

#define PI 0.01

void main( void ) {
   vec2 p = ( gl_FragCoord.xy / resolution.xy );
   float sx = 0.2*sin( 25.0 * p.y - time * 5.);
   float dy = 2.9 / ( 20.0 * abs(p.y - sx));
   vec4 pixel = texture2D(uMainSampler, outTexCoord);
   //pixel.a = 1.0;

   gl_FragColor = pixel * vec4( (p.x + 0.5) * dy, 0.5 * dy, dy-1.65, pixel.a );
   //gl_FragColor = vec4( pixel.x*p.y, p.y*pixel.z, p.x*pixel.y, 1.0 );

}
