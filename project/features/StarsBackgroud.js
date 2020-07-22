

let scene, consoleFL = true,
    boxMain, boxLeft, boxRight, boxUp, boxDown,
    circleParticleOnLeave,
    leftParticle, leftParticleDirectoryX = 1, timeScale = 1,
    leftParticleAngle = 0,
    leftParticleRndScaleX = .1, leftParticleRndScaleY = .1,
    fpsSpanIdDOM


export default class StarsBackgroud
{

    constructor(sceneArg)
    {
        scene = sceneArg
        makeBoxes()
        makeParticles()
        cameraMen()
        setButtons()
        makeConsoleDevelopHelper()
    }

    updatePublic(arg)
    {
        updatePrivate(arg)
        updateConsoleDevelopHelper()
    }
}



function makeBoxes()
{
    if (consoleFL) console.log("StarsBackground -> makeBoxes()...")

    let boxSize = 20, boxPosition = .56          //size px, position %

    let gameWidth = scene.scale.parentSize.width,
        gameHeight = scene.scale.parentSize.height

    let offsetWidth = boxPosition * gameWidth,
        offsetHeight = boxPosition * gameHeight,
        boxLengthWidth = gameWidth + (2 * offsetWidth),
        boxLengthHeight = gameHeight + (2 * offsetHeight)

    let boxLeftSpecialSize = 0

    boxMain = new Phaser.Geom.Rectangle(- offsetWidth + boxSize, - offsetHeight + boxSize, boxLengthWidth - 2*boxSize, boxLengthHeight - 2*boxSize)
    boxLeft = new Phaser.Geom.Rectangle(- offsetWidth -boxLeftSpecialSize, - offsetHeight, boxSize+boxLeftSpecialSize, boxLengthHeight)
    boxRight = new Phaser.Geom.Rectangle(gameWidth + offsetWidth - boxSize, - offsetHeight, boxSize, boxLengthHeight)
    //boxRight = scene.add.rectangle(gameWidth + offsetWidth - boxSize, - offsetHeight, boxSize, boxLengthHeight)
    boxUp = new Phaser.Geom.Rectangle(- offsetWidth, - offsetHeight, boxLengthWidth, boxSize)
    boxDown = new Phaser.Geom.Rectangle(- offsetWidth, gameHeight + offsetHeight - boxSize, boxLengthWidth, boxSize)

    circleParticleOnLeave = new Phaser.Geom.Circle(gameWidth/2, gameHeight/2, gameWidth*1.25);

    let graphics = scene.add.graphics()
    graphics.lineStyle(1, 0x00ff00, 1)
    graphics.strokeRectShape(boxLeft)
    graphics.strokeRectShape(boxRight)
    graphics.strokeRectShape(boxUp)
    graphics.strokeRectShape(boxDown)
    graphics.lineStyle(3, 0xff0000, 1)
    graphics.strokeRectShape(boxMain)
    graphics.strokeCircleShape(circleParticleOnLeave)
}



function makeParticles()
{
    if (consoleFL) console.log("StarsBackgroud -> makeParticles()...")

    let particle = scene.add.particles('flares')
    leftParticle = particle.createEmitter(
        {
            frame: {frames:["white", "yellow"], cycle: false}, //'red',
            x: 0,
            y: 0,
            lifespan: 90000,
            alpha: 1, //{min: .1, max: .5},
            speed: { min: -125, max: -75 },
            angle: 180, //{min: 145, max :215},
            gravityY: 0,
            scaleX: leftParticleRndScaleX, //{min: .025, max: .15}, //{ start: 0.25, end: 0.25 },
            scaleY: leftParticleRndScaleX, //{min: .025, max: .15}, //{ start: 0.25, end: 0.25 },
            quantity: {min: 1, max: 3},
            blendMode: 'ADD',
            //emitZone: { type: 'random', source: boxRight },
            //deathZone: { type: 'onEnter', source: deadZonesRectanglesRight },
            deathZone: { type: 'onLeave', source: circleParticleOnLeave },
            frequency: 200
            //maxParticles: 500
        })
    //asteroid2Particle.emitters.first.scaleX.onUpdate = asteroid2Particle.emitters.first.scaleX.defaultUpdate
    leftParticle.scaleX.onUpdate = leftParticle.scaleX.defaultUpdate
    //leftParticle.stop()

    leftParticle.onParticleEmit((particle)=>
    {
            leftParticleRndScaleX = Phaser.Math.RND.between(.025, .15)
            //particle.scaleX = leftParticleRndScaleX
            //particle.scaleY = leftParticleRndScaleX
    })

    //let rndBtwn = Phaser.Math.RND.between
    for (let i=0; i<250; i++)
    {
        leftParticle.emitParticle(1, Phaser.Math.RND.between(boxMain.left, boxMain.right), Phaser.Math.RND.between(boxMain.top, boxMain.bottom))
        //leftParticle.emitParticle(1, Phaser.Math.RND.between(boxMain.left, boxMain.right), Phaser.Math.RND.between(0, 360))
    }
    leftParticle.setEmitZone({ type: 'random', source: boxRight })

    leftParticle.forEachAlive( (particle) =>
    {
        particle.velocityX =  Phaser.Math.RND.between(-125, -75)
        console.log("PARTICLE UNIT")
        console.dir(particle)
    })

    //leftParticle.setSpeed({min: -125, max: -75})

    if (consoleFL)
    {
        console.log("E M I T   P A R T I C L E")
        console.log("boxMain position: " + boxMain.left + ", " + boxMain.top + " and bottom left: " + boxMain.right + ", " + boxMain.bottom)
    }

    //leftParticle.onParticleDeath((particle)=>{leftParticle.killAll()})
    leftParticle.pause()
    leftParticle.setEmitterAngle(leftParticleAngle)
}



function cameraMen()
{
    scene.cameras.main.setZoom(.25)

    /*let cameramenTween1 = scene.tweens.add({
        targets: scene.cameras.main,
        props: {
            zoom: {value: function ()
                        {
                            let tmpZoom = 1//Phaser.Math.Between(2, 5)
                            //let tmpRandomRotation = Phaser.Math.Between(-150, 150)
                            //console.log('camera random rotation: ' + tmpRandomRotation)
                            return tmpZoom
                        },
                        duration: 7000},
            //zoom: {value: 1.05, duration: 700},
            scrollY: {value: function ()
                        {
                            let tmpRandomRotation = Phaser.Math.Between(-150, 150)
                            //let tmpRandomRotation = Phaser.Math.Between(-150, 150)
                            //console.log('camera random rotation: ' + tmpRandomRotation)
                            return tmpRandomRotation
                        },
                        duration: 3500},
                        //duration: 250},
            //scrollX: {value: 17.5, duration: 1500},
            //scrollY: {value: 10, duration: 1200},
            rotation: {value: function ()
                        {
                            let tmpRandomRotation = Phaser.Math.Between(-1, 1)
                            //let tmpRandomRotation = Phaser.Math.Between(-25, 25)/1000
                            //console.log('camera random rotation: ' + tmpRandomRotation)
                            return tmpRandomRotation
                        },
                        duration: 4000 //, ease: 'Sine.easeInOut'
                        //duration: 200 //, ease: 'Sine.easeInOut'
                    }
        },
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    })*/
}


let rectCts = Phaser.Geom.Rectangle.Contains
let deadZonesRectanglesRight = {
        contains: function (x, y)
        {
            return rectCts(boxLeft, x, y) ||
                   rectCts(boxUp, x, y) ||
                   rectCts(boxDown, x, y)
        }
    }



function setButtons()
{
    scene.input.keyboard.on('keydown-P', changeStarsDIrectory)
    scene.input.keyboard.on('keydown-I', cameraZoomIn)
    scene.input.keyboard.on('keydown-O', cameraZoomOut)
    scene.input.keyboard.on('keydown-L', particleAngle)
    scene.input.keyboard.on('keydown-K', particleAngle)
    scene.input.keyboard.on('keydown-T', cameraTest01)
    scene.input.keyboard.on('keydown-R', cameraTest02)
    scene.input.keyboard.on('keydown-S', particleStart)
    scene.input.keyboard.on('keydown-D', particleSpeedTime)
    scene.input.keyboard.on('keydown-A', particleSpeedTime)
}



function changeStarsDIrectory()
{
    leftParticleDirectoryX *= -1
    let minSpeed = -25 -100*leftParticleDirectoryX,
        maxSpeed = 25 - 100*leftParticleDirectoryX
    leftParticle.forEachAlive( (particle) => {
        particle.velocityX =  -100 * leftParticleDirectoryX
        //particle.scaleX += .1
        //particle.scaleY -= .1
        //particle.velocityX =  Phaser.Math.RND.between(-25 + leftParticleDirectoryX, 25 + leftParticleDirectoryX)
        })
    leftParticle.setSpeed({min: minSpeed, max: maxSpeed})
    if (leftParticleDirectoryX < 0) leftParticle.setAngle(0)
    else leftParticle.setAngle(180)
}



function cameraZoomIn()
{
    scene.cameras.main.zoomTo(scene.cameras.main.zoom + 0.1, 250)
    if (consoleFL) console.log("particle count: " + leftParticle.getParticleCount())
    if (consoleFL) console.log("particle count dea: " + leftParticle.getDeadParticleCount())
    if (consoleFL) console.log("particle frequency: " + leftParticle.frequency)
    if (consoleFL) console.dir(leftParticle.quantity)
}

function cameraZoomOut()
{
    scene.cameras.main.zoomTo(scene.cameras.main.zoom - 0.1, 250)
    if (consoleFL) console.log("particle count: " + leftParticle.getParticleCount())
    if (consoleFL) console.log("particle count dea: " + leftParticle.getDeadParticleCount())
    if (consoleFL) console.log("particle frequency: " + leftParticle.frequency)
    if (consoleFL) console.dir(leftParticle.quantity)
}

function cameraRotate(arg)
{
    if (consoleFL)
        {
            console.log("C A M E R A   R O T A T E")
            console.dir(arg)
        }
    //left
    //if (arg.keyCode == 75) scene.cameras.main.setAngle(170)
    if (arg.keyCode == 75) leftParticle.setAngle(boxRight.setAngle(170))
    //right
    //if (arg.keyCode == 76) scene.cameras.main.setAngle(190)
    if (arg.keyCode == 76) leftParticle.setAngle(boxRight.setAngle(190))
}

function cameraTest01()
{
    //scene.cameras.main.fadeOut(1250, 4, 8, 4)
    scene.cameras.main.fade()
}

function cameraTest02()
{
    scene.cameras.main.fadeIn(1250, 4, 8, 4)
}

function particleStart(arg)
{
    if (consoleFL)
        {
            console.log("P A R T I C L E   S T A R T")
            console.dir(arg)
        }
    if (leftParticle.active) leftParticle.pause()
    else leftParticle.resume()
}

function particleAngle()
{
    leftParticle.setAngle(170)
}


function particleSpeedTime(arg)
{
    let timeScaleStep = 0.25, maxSpeed = 100
    if (consoleFL)
        {
            console.log("C A M E R A   R O T A T E")
            console.dir(arg)
        }
    if (arg.keyCode ==65) //keyA
        {
            if (timeScale > -100) //2*timeScaleStep)
            {
                timeScale -= timeScaleStep
            }
            else
            {
                timeScale = -100 //0
                leftParticle.pause()
            }
            particleStarsScale(timeScale)
        }
    if (arg.keyCode ==68)   //key D
        {
            if (timeScale < maxSpeed)
            {
                timeScale += timeScaleStep
                if(!leftParticle.active) leftParticle.resume()
            }
            else timeScale = maxSpeed

            particleStarsScale(timeScale)
        }

    leftParticle.timeScale = timeScale
    if (consoleFL) console.log("timeScale: " + timeScale)
    //leftParticle.preUpdate()
}


function particleStarsScale(arg)
{
    let particleStarScaleAdd = (arg - 1)/5

    if (arg > 0)
    {
        leftParticle.forEachAlive( (particle) =>
        {
            particle.scaleX += particleStarScaleAdd
            particle.scaleY = particleStarScaleAdd
        })
        leftParticle.setScaleX({min: .025 + particleStarScaleAdd*5, max: .15 + particleStarScaleAdd*5})
        //leftParticle.setScaleY({min: .025 + particleStarScaleAdd/6, max: .15 + particleStarScaleAdd/6})
    }
    else {
        {
            leftParticle.forEachAlive( (particle) =>
            {            particle.scaleX = particleStarScaleAdd
                         particle.scaleY = particleStarScaleAdd
            })
            leftParticle.setScaleX({min: .025, max: .15})
            leftParticle.setScaleY({min: .025, max: .15})
        }
    }
}


function updatePrivate(arg)
{
    leftParticleAngle += (30 * arg / 1000)
    //leftParticle.setEmitterAngle(leftParticleAngle)
    leftParticle.setEmitterAngle(180)
    //if (consoleFL) console.log("stars update: " + arg)
}



function makeConsoleDevelopHelper()
{
    fpsSpanIdDOM = document.getElementById('fpsSpanId')
    fpsSpanIdDOM.innerText = '456'
}
function updateConsoleDevelopHelper()
{
    fpsSpanIdDOM.innerText = this.game.loop.actualFps.toFixed().toString()
}
