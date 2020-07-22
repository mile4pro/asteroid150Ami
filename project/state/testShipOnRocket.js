
let ship, rocket,
    shipOffsetX = -12, shipOffsetY = -8,
    rocketFireParticles, planet,
    camX = 0, camY = 0, camZoom = 1, directZoom = 1,
    keyCursors,
    debugText1, fpsSpanIdDOM


export default class testShipOnRocket extends Phaser.Scene
{
    preload()
    {
        //CustomPipeline1 = makeTestShader1()
        //this.game.renderer.addPipeline('Custom1', new CustomPipeline1(this.game))
        //console.log('THIS OBJECT: ' + this.game.renderer)
        //customPipeline = this.game.renderer.addPipeline('Custom', new CustomPipeline(game));
        //customPipeline.setFloat2('uResolution', this.config.width, this.config.height);

    }

    create()
    {
        //this.cameras.main.setRenderToTexture(CustomPipeline1)
        console.log("testShipOnRocket...")
        fpsSpanIdDOM = document.getElementById('fpsSpanId')

        debugText1 = this.add.text(20, 20, "start game...")

        keyCursors = this.input.keyboard.createCursorKeys();

        planet = this.add.sprite(400, 175, 'planet')
        rocketFireParticles = this.add.particles('flares')
        rocket = this.add.sprite(170, 500, "rocketRed")
        ship = this.add.sprite(rocket.x+shipOffsetX, rocket.y+shipOffsetY, "shipRed")

        rocket.setAngle(-90).setScale(.35)
        ship.setAngle(-90).setScale(.35)


        rocketFireParticles.createEmitter({
            frame: 'yellow',
            //radial: false,
            //x: 100,
            //y: { min: 0, max: 560, steps: 256 },
            angle: {min: -25, max: 25},
            lifespan: 1000,
            speedY: { min: 200, max: 400 },
            speedX: { min: -20, max: 20 },
            quantity: 4,
            gravityX: 0,
            scale: { start: 0.2, end: .6, ease: 'Power3' },
            blendMode: 'ADD'
        })



        console.log('camera x: ' + this.cameras.main.scrollX + ', y: ' + this.cameras.main.scrollY)
        //this.cameras.main.startFollow(rocket, false, .75)

        this.input.keyboard.once('keydown-T', changeState)
        this.input.keyboard.once('keydown-N', changeState)

        //let testShader1 = this.add.shader('testShader3', 320, 185, 1280, 720) //<------ S H A D E R   T E S T
        //testShader1.flush()
        //let testShader1Mask = testShader1.createBitmapMask()
        //ship.setMask(testShader1Mask)

        //this.cameras.main.rotation = .075
        let tmpTween1 = this.tweens.add({
            targets: this.cameras.main,
            props: {
                zoom: {value: .5, duration: 9000},
                //scrollX: {value: 17.5, duration: 1500},
                //scrollY: {value: 10, duration: 1200},
                rotation: {value: function ()
                            {
                                let tmpRandomRotation = Phaser.Math.Between(-15, 15)/1000
                                console.log('camera random rotation: ' + tmpRandomRotation)
                                return tmpRandomRotation
                            },
                            duration: 400 //, ease: 'Sine.easeInOut'
                        }
            },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        console.log("camera main rotation: " + this.cameras.main.angle)
        //this.cameras.main.startFollow(ship, roundPx, lerpX, lerpY, offsetX, offsetY)
        this.cameras.main.startFollow(ship, true, .05, .05, 50, 50)
        //this.cameras.main.setDeadzone(100, 100)



        //let config = { game: this.game, renderer: this.game.renderer, fragShader: testShader1};
        //let customPipeline = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline(config);
        //let filter = this.game.renderer.addPipeline(pipelineName, customPipeline);
        //console.log("SHADER STRING:\n" + testShader1.shader.fragmentSrc)

        let tmpPipeline = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline(
            {
                game: this.game,
                renderer: this.game.renderer,
                fragShader: [
                    "precision mediump float;",

                    "uniform float     time;",
                    "uniform vec2      resolution;",
                    "uniform sampler2D uMainSampler;",
                    "varying vec2 outTexCoord;",

                    "#define PI 0.01",

                    "void main( void ) {",

                        "vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;",
                        "float sx = 0.2*sin( 25.0 * p.y - time * 5.);",
                        "float dy = 2.9 / ( 20.0 * abs(p.y - sx));",
                        "vec4 pixel = texture2D(uMainSampler, outTexCoord);",

                        "gl_FragColor = pixel * vec4( (p.x + 0.5) * dy, 0.5 * dy, dy-1.65, pixel.a );",

                    "}"
                    ].join('\n')
            })
        tmpPipeline.setFloat2('resolution', this.game.config.width, this.game.config.height);
        let pipeline1 = this.game.renderer.addPipeline('pipeline1', tmpPipeline)
        this.cameras.main.setRenderToTexture(pipeline1)
        this.cameras.main.setPipeline(tmpPipeline)
    }


    update()
    {
        moveRocket(this)
        rocketFireParticles.emitters.first.x.propertyValue = rocket.x
        rocketFireParticles.emitters.first.y.propertyValue = rocket.y + 50
        //cameraMan(this)
        showDebugText(this);
    }
}


function moveRocket(arg)
{
        if(keyCursors.right.isDown) rocket.x += (arg.game.loop.delta/1000 * 100)
        if(keyCursors.left.isDown)  rocket.x -= (arg.game.loop.delta/1000 * 100)

        let speed = (-arg.game.loop.delta/1000) * 120;
        rocket.y += speed;
        ship.y = rocket.y;
        ship.x = rocket.x;
        //console.log(rocket.y)
        if(rocket.y < -1100) rocket.y = 500
}


function cameraMan(arg)
{
    //arg.cameras.main.shake(2000)
    arg.cameras.main.setZoom(camZoom)
    arg.cameras.main.setScroll(camX, camY)
    camZoom += arg.game.loop.delta/1000 * .025 * directZoom
    if (camZoom > 1.2) directZoom *= -1
    if (camZoom < 1) directZoom *= -1
}


function testKeyboardCallback(){
    console.log("press T...")
    //this.game.scene.start('physicTest')
    this.game.scene.stop('testShipOnRocket')
    this.game.scene.start('physicTest')
}



function changeState(arg)
{
    console.log("C H A N G E   S T A G E")
    console.dir(arg)

    if(arg.keyCode == 78)   //N
    {
        this.game.scene.stop('testShipOnRocket')
        this.game.scene.start('testStateBackgroudStars')
    }
    else if(arg.keyCode == 84)  //T
    {
        this.game.scene.stop('testShipOnRocket')
        this.game.scene.start('physicTest')
    }
}






/*function makeTestShader1()
{

    let CustomPipeline1 = new Phaser.Class(
    {

        Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

        initialize:

        function CustomPipeline1 (game)
        {
            Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this,
            {
                game: game,
                renderer: game.renderer,
                fragShader: [
                "precision mediump float;",

                "uniform float     time;",
                "uniform vec2      resolution;",
                "uniform sampler2D uMainSampler;",
                "varying vec2 outTexCoord;",

                "#define PI 0.01",

                "void main( void ) {",

                "vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;",
                "float sx = 0.2*sin( 25.0 * p.y - time * 5.);",
                "float dy = 2.9 / ( 20.0 * abs(p.y - sx));",
                "vec4 pixel = texture2D(uMainSampler, outTexCoord);",

                "gl_FragColor = pixel * vec4( (p.x + 0.5) * dy, 0.5 * dy, dy-1.65, pixel.a );",

                "}"
                ].join('\n')
            })
        }
    })
    return CustomPipeline1
}







var CustomPipeline = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

    initialize:

    function CustomPipeline (game)
    {
        Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
            game: game,
            renderer: game.renderer,
            fragShader: `
            precision mediump float;

            uniform sampler2D uMainSampler;
            uniform vec2 uResolution;
            uniform float uTime;

            varying vec2 outTexCoord;
            varying vec4 outTint;

            vec4 plasma()
            {
                vec2 pixelPos = gl_FragCoord.xy / uResolution * 20.0;
                float freq = 0.8;
                float value =
                    sin(uTime + pixelPos.x * freq) +
                    sin(uTime + pixelPos.y * freq) +
                    sin(uTime + (pixelPos.x + pixelPos.y) * freq) +
                    cos(uTime + sqrt(length(pixelPos - 0.5)) * freq * 2.0);

                return vec4(
                    cos(value),
                    sin(value),
                    sin(value * 3.14 * 2.0),
                    cos(value)
                );
            }

            void main()
            {
                vec4 texel = texture2D(uMainSampler, outTexCoord);
                texel *= vec4(outTint.rgb * outTint.a, outTint.a);
                gl_FragColor = texel * plasma();
            }

            `
        });
    }

});*/




function showDebugText(thisArg){

    debugText1.text = thisArg.game.loop.actualFps.toFixed().toString() + " FPS\npress T change scene"
    fpsSpanIdDOM.innerText = thisArg.game.loop.actualFps.toFixed().toString()
}
