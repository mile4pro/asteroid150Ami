precision mediump float;

uniform float     time, delta;
uniform vec2      resolution;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

//#define PI 0.01



vec4 makeGrayColor(vec4 pixelArg)
{

    float averageColorTmp = (pixelArg.r + pixelArg.g + pixelArg.b) / 4.0;
    vec4 pixelTmp = vec4(averageColorTmp, averageColorTmp, averageColorTmp, pixelArg.a);

    pixelTmp.r = pixelTmp.r + ( sin(time) / 32.0);

    return pixelTmp;
}



vec4 makeNoiseEffect(vec4 pixelArg)
{

    float noiseTmp1 = sin(delta) / 26.0;
    float noiseTmp2 = cos(delta) / 16.0;
    float noiseTmp3 = (noiseTmp1 + noiseTmp2) / 2.0;
    vec4 pixelTmp = vec4(pixelArg.r + noiseTmp1, pixelArg.g + noiseTmp2, pixelArg.b + noiseTmp3, pixelArg.a);

    return pixelTmp;
}



vec4 makeNoiseLineEffect(vec4 pixelArg, vec2 fragCoordNormalArg)
{

    float noiseTmp1 = sin(time);
    vec4 pixelTmp = pixelArg;

    if (abs(noiseTmp1 - fragCoordNormalArg.y) < 0.05)
    {
        pixelTmp.g += 0.025;
        pixelTmp.b += 0.01;
    }

    return pixelTmp;
}



vec4 makeParableScreenEffect(vec2 fragCoordNormalArg)
{

    float    factorX = sin((fragCoordNormalArg.x * 3.1416) + 1.57) / 16.0,
             factorY = sin((fragCoordNormalArg.y * 3.1416) + 1.57) / 16.0;

    float    tmpDeltaX = fragCoordNormalArg.x + factorX,
             tmpDeltaY = (1.0 - fragCoordNormalArg.y) - factorY;

     float noiseTmp1 = sin(time);
     if (abs(noiseTmp1 - (1.0 - tmpDeltaY)) < 0.05)
     {
         tmpDeltaX += sin(delta) / 100.0;
         tmpDeltaY += sin(delta) / 100.0;
     }

    vec2     coordOut = vec2(tmpDeltaX, tmpDeltaY);

    vec4     pixelTmp = texture2D(uMainSampler, coordOut);

    return pixelTmp;
}



vec4 makeSmallLineTvEffect(vec4 pixelArg)
{
    vec4 pixelTmp = pixelArg;
    if (mod(gl_FragCoord.y, 2.0)  < 1.0)
    {
        pixelTmp.gb /= 1.5;
        pixelTmp.r /= 4.0;
    }
    return pixelTmp;
}



void main() {

   vec2 fragCoordNormal = ( gl_FragCoord.xy / resolution.xy );

   vec4 pixelEffect = makeParableScreenEffect(fragCoordNormal);
   pixelEffect = makeNoiseLineEffect(pixelEffect, fragCoordNormal);
   //pixelEffect = makeNoiseEffect(pixelEffect);
   pixelEffect = makeSmallLineTvEffect(pixelEffect);

   gl_FragColor = vec4( pixelEffect.r, pixelEffect.g, pixelEffect.b, pixelEffect.a );

}
