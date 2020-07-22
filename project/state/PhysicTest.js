
let ship, shipShadow = [], ship2,
    keyCursors, keySpacebar, keyWASD = {},
    debugText1, debugText2, debugText3,
    particles, temp02, shipAngle = 0,
    speedThrust = 0,
    particlesStars, asteroidsParticlesBackLayer, asteroidsParticles, particleBoom1, particleBullets, particleExplosionTest,
    particleExplosionTestShape, particleExplosionTestXXX = [], okAtlasPeacesAst1Gray8,
    temp02Matter,
    light, lightAsteroid1, lightAsteroid2,
    asteroid1, asteroid2,
    collisiionCategory1, collisiionCategory2,
    rectangleBoard,
    collisionWithAsteroidFL = false,
    asteroid1ParticleZone, asteroid1DeathZone,
    asteroid2ParticleZone,
    tmpBoomImg,
    scene,
    fpsSpanIdDOM,
    controlLeftFL = false, controlRightFL = false, controlUpFL = false, controlDownFL = false,
    fullScreenBtn,
    sun01, planet01, moon01, moon01ShadowX4,
    shipShotTmpTime = 0, shipShotFrequencyTime = 150, shipShotPower = -.025, shipShotLight, shipBullet,
    testMaskAsteroid1,
    devMoveFL = true, cameramenTween1, cameramenTween1Shock, warSpeedFL = false, warSpeedTimeTmp = 0, warSpeedTimeCheck = 3000,
    cameramenTween1ShockFL = false,
    pointerRef, shipMiniGunPosVec2, angleMouseCursor = {value: 0},
    miniGun1, shipGun1PosVec2, shotLight,
    shipGun1PosVec2RightCenter, shipGun1PosVec2TopRight, shipGun1PosVec2BottomRight, shipGun1PosVec2StartBullet, shipGun1RunTimer,
    earth1euro,
    bulletMagazine = {bullet: [], img: [], count: 0, countLast: 0, max: 32, step: 4, timeBorneBullet: 300, timeTmp: 0, mainJoint: null, particlesShells: null, lightShot: null, lightShotFL: false},
    testPipeline1


export default class PhysicTest extends Phaser.Scene
{
    create()
    {
        scene = this
        pointerRef = scene.input.activePointer
        fpsSpanIdDOM = document.getElementById('fpsSpanId')
        fpsSpanIdDOM.innerText = '456'
        rectangleBoard = new Phaser.Geom.Rectangle(-450, -350, 1340, 1060)
        this.matter.world.setBounds()       //ustala granice obrazu, żeby odbijały się od nich obiekty
        //this.matter.world.setGravity(0, 4.8);
        this.matter.world.drawDebug = false

        let objectsPhysicVerts = this.cache.json.get('objectsPhysicVerts')

        //*********** stars ************
        particlesStars = this.add.particles('flares');

        particlesStars.createEmitter({
            frame: { frames: [ 'yellow', 'white' ], cycle: false },
            x: 700,
            y: { min: 0, max: 360},
            lifespan: 320000,
            //lifespan: 10000,
            speedX: {min: -1, max: -10},
            //speedX: {min: -100, max: -1000},
            scaleY: {min: .01, max: .1},
            alpha: {min: .1, max: .5},
            frequency: 1250,
            //frequency: 50,
            maxParticles: 1000,
            blend: "NONE"
        })
        particlesStars.emitters.first.scaleX.onUpdate = particlesStars.emitters.first.scaleX.defaultUpdate  //to coś naprawia problem z niechcianą animacją zakresu losowej skali obiektów
        particlesStars.emitters.first.scaleY.onUpdate = particlesStars.emitters.first.scaleY.defaultUpdate  //to coś naprawia problem z niechcianą animacją zakresu losowej skali obiektów
        //particlesStars.emitters.first.scaleX.onUpdate = particlesStars.emitters.first.scaleY.onUpdate  //to coś naprawia problem z niechcianą animacją zakresu losowej skali obiektów
        //particlesStars.emitters.first.preUpdate()
        for (let i=0; i<100; i++) particlesStars.emitters.first.emitParticle(1, Phaser.Math.RND.between(0, 640), Phaser.Math.RND.between(0, 360))
        //particlesStars.emitters.first.explode(250, 320, 180)
        particlesStars.emitters.first.setScrollFactor(0,-1)

        //particlesStars.emitters.first.setSpeedX({min: -30, max: -300})
        console.log("* * * * * * * * * * * * * * * * * * * * * * *\n" + "* * *** P A R T I C L E    S T A R *** * *")
        console.dir(particlesStars.emitters.first)
        /*particlesStars.emitters.first.alive.forEach(
            (star, indx)=>{
                //console.dir("scaleX: " + star.x)
                star.scaleX += .7
                star.velocityX -= 100
                }
        )*/
        particlesStars.emitters.first.forEachAlive((particle)=>{
            particle.scaleX = particle.scaleY
            //console.log('particle: ' + particle.scaleX + ", "+ particle.scaleY)
        })
        particlesStars.emitters.first.onParticleEmit((particle)=>{
            particle.scaleX = particle.scaleY
            //console.log('particle NEW: ' + particle.scaleX + ", " + particle.scaleY)
        })
        //particlesStars.emitters.first.EmitterOpOnUpdateCallback(particle, key, t, value)



        sun01 = this.add.sprite(720, 150, 'sun01')
        sun01.setScrollFactor(1, -1)
        //sun01.setTint(0x55DD55)
        planet01 = this.add.sprite(sun01.x-75, sun01.y, 'planet')
        planet01.setScrollFactor(1,-1)
        planet01.setScale(.05)
        planet01.setTint(0x555555)

        earth1euro = this.add.sprite(250, 200, 'earth1euro')
        earth1euro.setTint(0xAAAAAA)
        earth1euro.setScrollFactor(1, -.5)
        earth1euro.setVisible(false)

        moon01 = this.add.sprite(1800, 180, 'moon01')
        moon01.setScrollFactor(1,-0.25)
        moon01.setTint(0x262626)

        asteroidsParticlesBackLayer = this.add.particles('asteroids')


        //ASTEROIDS <---------------------------------------------------------------------
        asteroid1 = this.matter.add.sprite(-1000, 200, 'asteroids', 'ast1Blue.png', objectsPhysicVerts.asteroid00)
        asteroid1.setIgnoreGravity(true)
        //asteroid1.setBody({type: 'circle', radius: 58})
        //asteroid1.setBody(objectsPhysicVerts.asteroid00.shape)
        asteroid1.setFriction(0, 0, 0)
        asteroid1.setMass(62.5)
        asteroid1ParticleZone = new Phaser.Geom.Circle(asteroid1.x, asteroid1.y, 58);
        asteroid1DeathZone = new Phaser.Geom.Rectangle(asteroid1.x, asteroid1.y, 100, 34);

        let asteroid1Particle = this.add.particles('flares')
        asteroid1Particle.createEmitter(
            {
                frame: 'blue',
                x: 0,
                y: 0,
                lifespan: 2000,
                alpha: {end: 0, start: .75},
                speed: { min: -1250, max: -750 },
                angle: {min: 175, max :185},
                gravityY: 0,
                scale: { start: 0, end: 0.25 },
                quantity: 25,
                blendMode: 'ADD',
                emitZone: { type: 'random', source: asteroid1ParticleZone },
                deathZone: { type: 'onEnter', source: asteroid1DeathZone },
                frequency: 100,
                //tint: 0x00FF00
            })


        //console.dir(objectsPhysicVerts.asteroid01)
        asteroid2 = this.matter.add.sprite(100, 200, 'asteroids', 'ast5Red.png', objectsPhysicVerts.asteroid04)
        asteroid2.setIgnoreGravity(true)
        //asteroid2.setBody({type: 'circle', radius: 58})
        //asteroid2.setBody(objectsPhysicVerts.asteroid00.shape)
        //asteroid2.setBody({type: "fromVerts", verts: "3 59 50 38 97 2 108 3 128 30 128 55 117 66 116 123 89 136 55 127 25 96 5 85"})
        asteroid2.setFriction(0, 0, 0)
        asteroid2.setMass(62.5)
        asteroid2ParticleZone = new Phaser.Geom.Circle(asteroid2.x, asteroid2.y, 58);

        let asteroid2Particle = this.add.particles('flares')
        asteroid2Particle.createEmitter(
            {
                frame: 'red',
                x: 0,
                y: 0,
                lifespan: 2000,
                alpha: {end: 0, start: .75},
                speed: { min: -1250, max: -750 },
                angle: {min: 175, max :185},
                gravityY: 0,
                scale: { start: 0, end: 0.25 },
                quantity: 35,
                blendMode: 'ADD',
                emitZone: { type: 'random', source: asteroid2ParticleZone },
                deathZone: { type: 'onEnter', source: asteroid1DeathZone },
                frequency: 100,
            })



        //END ASTEROID <--^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


        //kontener
        /*temp02 = this.add.container(300, 100)
        temp02.height = 39
        temp02.width = 135
        temp02Matter = this.matter.add.gameObject(temp02)
        console.log("displayHeight: " + temp02.body)*/


        particles = this.add.particles('flares')
        //ship = this.matter.add.sprite(150, 150, "ship3")
        //ship = this.matter.add.sprite(150, 150, "ship3", false, {render: { sprite: { xOffset: 0.05, yOffset: -0.05} }})
        //let shipVerts = this.cache.json.get('objectsPhysicVerts').ship04
        //let objectsPhysicVerts = this.cache.json.get('objectsPhysicVerts')
        //ship = this.matter.add.sprite(150, 150, "ship3", false, {shape: { type: 'fromVerts', verts: shipVerts }, render: { sprite: { xOffset: 0.05, yOffset: -0.05} }})
        ship = this.matter.add.sprite(150, 150, "ship3", false, objectsPhysicVerts.ship04)
        ship.setIgnoreGravity(true)
        //ship.setScale(1)

        miniGun1 = this.add.sprite(300, 200, 'shotLight', 'miniGun1sOff.png')
        miniGun1.setOrigin(.1, .5)
        //miniGun1.setScale(.5)
        shipGun1PosVec2 = new Phaser.Math.Vector2()
        shipGun1PosVec2RightCenter = new Phaser.Math.Vector2()
        shipGun1PosVec2TopRight = new Phaser.Math.Vector2()
        shipGun1PosVec2BottomRight = new Phaser.Math.Vector2()
        shipGun1PosVec2StartBullet = new Phaser.Math.Vector2()

        shipGun1RunTimer = this.time.addEvent({delay: 2000, callback: ()=>console.log("TIME EVENT SHIP GUN RUN TIMER")})

        for (let i=0; i<5; i++)
        {
            shipShadow[i] = this.add.sprite(ship.x, ship.y, 'ship3-shadow')
            shipShadow[i].setOrigin(.54, .46)
            shipShadow[i].setTint(0x444444).setAlpha(.75)
        }

        shotLight = this.add.image(200, 200, 'shotLight', 'shotLight02.png')
        shotLight.setScale(.25)
        shotLight.setFrame('shotLight03.png')
        shotLight.setVisible(false)

        /*shipBullet = this.matter.add.sprite(-300, -300, "flares", "yellow")
        shipBullet.setMass(50)
        shipBullet.setScale(.4, .04)
        shipBullet.setFixedRotation()
        shipBullet.setOnCollide( ()=>console.log('test callback object 1') )*/
        shipMiniGunPosVec2 = new Phaser.Math.Vector2(ship.x, ship.y)

        particleBullets = this.add.particles('flares')
        particleBullets.createEmitter(
            {
                //follow: ship,
                frame: 'yellow',
                x: -100,
                y: 100,
                lifespan: 2000,
                speed: { min: 225, max: 450 },
                angle: {min: 169, max :179},
                scale: .05,
                gravityX: -50,
                quantity: 1,
                active: true,
                blendMode: 'ADD'
            })
        //ship.setBody({width: 122, height: 32})
        //let shipVerts = '0 5 75 0 110 3 120 5 143 20 140 32 60 32 70 20 0 15'
        //let shipVerts = this.cache.json.get('objectsPhysicVerts').ship04
        //console.log('shipVerts: ' + shipVerts)
        //console.log('shipVerts JSON: ' + this.cache.json.get('objectsPhysicVerts').ship04)
        //ship.setBody({type: "fromVerts", verts: shipVerts, flagInternal: true})
        ship.setMass(5);
        //ship.setBody(type: "fromVerts", verts: shipVerts, flagInternal: true)
        ship.setFixedRotation()
        ship.setFrictionAir(.2)
        ship.setAngle(shipAngle)

        collisiionCategory1 = this.matter.world.nextCategory()
        collisiionCategory2 = this.matter.world.nextCategory()
        ship.setCollisionCategory(collisiionCategory1)
        //ship.setCollidesWith(collisiionCategory1)
        /*shipBullet.setCollisionCategory(collisiionCategory1)
        shipBullet.setCollidesWith(collisiionCategory2)*/

        asteroid1.setCollisionCategory(collisiionCategory2)
        asteroid1.setCollidesWith(collisiionCategory1)
        console.log('S H I P')
        console.dir(ship)
        console.log('A S T E R O I D 1')
        console.dir(asteroid1)
        //ship.setOnCollideWith(asteroid1.body, colisionWithAsteroids)

        asteroid2.setCollisionCategory(collisiionCategory2)
        asteroid2.setCollidesWith(collisiionCategory1)
        //ship.setOnCollideWith(asteroid2.body, colisionWithAsteroids)

        ship.setOnCollide(()=>console.log('T E S T  C A L L B A C K'))
        asteroid1.setOnCollide(shipCollisionCallback)
        asteroid2.setOnCollide(shipCollisionCallback)

        asteroid1.setCollidesWith([collisiionCategory1, collisiionCategory2])
        asteroid2.setCollidesWith([collisiionCategory1, collisiionCategory2])

        shotAsteroid(asteroid1)
        shotAsteroid(asteroid2, 3500)


        let asteroidsFilesNames =
        [
                'ast1Blue.png', 'ast2Blue.png', 'ast3Blue.png', 'ast4Blue.png', 'ast5Blue.png',
                'ast1Yellow.png', 'ast2Yellow.png', 'ast3Yellow.png', 'ast4Yellow.png', 'ast5Yellow.png',
                'ast1Red.png', 'ast2Red.png', 'ast3Red.png', 'ast4Red.png', 'ast5Red.png',
                'ast1Brown.png', 'ast2Brown.png', 'ast3Brown.png', 'ast4Brown.png', 'ast5Brown.png',
                'ast1Gray.png', 'ast2Gray.png', 'ast3Gray.png', 'ast4Gray.png', 'ast5Gray.png',
        ]

        asteroidsParticles = this.add.particles('asteroids');
        asteroidsParticles.createEmitter({
            frame: { frames:asteroidsFilesNames, cycle: false },
            x: 740,
            //y: { min: -120, max: 480},
            y: { min: -620, max: 980},
            lifespan: 4000,
            //speedX: {min: -750, max: -1500},
            speedX: {min: -1750, max: -3750},
            speedY: {min: -200, max: 200},
            //scale: {min: .4, max: 1.25},
            scale: {min: 1.75, max: 3.25},
            rotate: {min: -2880, max: 2880},
            angle: 0,
            //frequency: 400
            frequency: 1250
        })
        asteroidsParticles.emitters.first.scaleX.onUpdate = asteroidsParticles.emitters.first.scaleX.defaultUpdate  //to coś naprawia problem z niechcianą animacją zakresu losowej skali obiektów
        //asteroidsParticles.pause()  //resume()

        asteroidsParticlesBackLayer.createEmitter({
            frame: { frames:asteroidsFilesNames, cycle: false },
            x: 740,
            //x: 1280,
            y: { min: -120, max: 480},
            //y: { min: -360, max: 720},
            lifespan: 8000,
            //lifespan: 16000,
            speedX: {min: -200, max: -600},
            speedY: {min: -45, max: 45},
            scale: {min: .025, max: .35},
            rotate: {min: -2880, max: 2880},
            angle: 0,
            frequency: 50,
            active: true
            //quantity: 10,
            //maxParticles: 10
        })
        asteroidsParticlesBackLayer.emitters.first.scaleX.onUpdate = asteroidsParticlesBackLayer.emitters.first.scaleX.defaultUpdate
        //asteroidsParticlesBackLayer.pause()

        //console.log("asteroids back layer: " + asteroidsParticlesBackLayer)
        //ship.setBounce(.15)
        //ship.setMass(1)
        //ship.inverseMass = 1/100;

        //ship.setDensity(0.02);      //gęstość ciała, defaltowo 0.001, większa gęstość = większa masa
        //ship.setAngle(90);

        //ship.body.rotation = 100;

        keyCursors = this.input.keyboard.createCursorKeys()
        keySpacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        keyWASD.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        keyWASD.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keyWASD.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        keyWASD.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        keyWASD.X = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
        keyWASD.E = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

        //debugText1 = this.add.text(20, 20, "start game...")
        //debugText2 = this.add.text(330, 15, "right text...")
        //debugText3 = this.add.text(290, 40, "test game, control: arrow or AWSD")
        console.log('physicTest...')


        //particles   **********

        particles.createEmitter(
            {
                //follow: ship,
                frame: 'blue',
                x: 0,
                y: 0,
                lifespan: 300,
                alpha: {min: 0, max: 1},
                speed: { min: 225, max: 450 },
                angle: {min: 177.5, max :182.5},
                gravityY: 0,
                scale: { start: 0.25, end: 0.0 },
                quantity: 3,
                blendMode: 'ADD'
            })

        //temp02.add(particles)
        //temp02.add(this.add.sprite(0, 0, "ship3"))


        moon01ShadowX4 = this.add.sprite(moon01.x, moon01.y, 'moon01-shadowX4')
        moon01ShadowX4.setScale(5)







        //test light****************

        this.lights.enable().setAmbientColor(0xAAAAAA)
        //asteroidsParticlesBackLayer.setPipeline('Light2D')
        asteroidsParticlesBackLayer.emitters.first.setTint(0x333333)//(0x666666)
        //asteroidsParticles.setPipeline('Light2D')
        asteroidsParticles.emitters.first.setTint(0x333333)//(0x505050)
        //temp02.getFirst().setPipeline('Light2D')
        shipShotLight = this.lights.addLight(-300, -300, 75).setColor(0xFF0000).setIntensity(5)

        light = this.lights.addLight(280, 180, 500).setColor(0xCCCCCC).setIntensity(.5)
        let light2 = this.lights.addLight(460, 180, 500).setColor(0xCCCCCC).setIntensity(.5)
        let light3 = this.lights.addLight(320, 180, 500).setColor(0xCCCCCC).setIntensity(.5)
        let light4 = this.lights.addLight(280, 80, 500).setColor(0xCCCCCC).setIntensity(.5)
        let light5 = this.lights.addLight(460, 80, 500).setColor(0xCCCCCC).setIntensity(.5)
        let light6 = this.lights.addLight(320, 80, 500).setColor(0xCCCCCC).setIntensity(.5)
        let light7 = this.lights.addLight(60, 80, 500).setColor(0xCCCCCC).setIntensity(.5)
        let light8 = this.lights.addLight(60, 180, 500).setColor(0xCCCCCC).setIntensity(.5)
        let light9 = this.lights.addLight(60, 280, 500).setColor(0xCCCCCC).setIntensity(.5)
        //light = this.lights.addLight(200, 180, 400).setColor(0x111111).setIntensity(.5)
        lightAsteroid2 = this.lights.addLight(200, 180, 500).setColor(0xff0000).setIntensity(1)
        lightAsteroid1 = this.lights.addLight(300, 280, 500).setColor(0x0000ff).setIntensity(1)

                                                                                /*      //L I G H T S  P I P E L I N E  E N A B L E
        shotLight.setPipeline('Light2D')    //shot light img
        asteroid1.setPipeline('Light2D')
        asteroid2.setPipeline('Light2D')

        asteroid1Particle.setPipeline('Light2D')
        asteroid2Particle.setPipeline('Light2D')
                                                                                */

        /*this.input.on('pointermove', function (pointer)
        {
        light.x = pointer.x
        light.y = pointer.y
        console.log('pointer x: ' + pointer.x + ', y: ' + pointer.y)
    })*/

        //light.x = ship.x
        //light.y = ship.z

        //light.x = 600
        /*let lightTween1 = this.tweens.add({
            targets: light,
            props: {
                x: {value: -500, duration: 3000},
            },
            repeat: -1,
            repeatDelay: 3000
        })*/

        //full screen test************************************
        /*ship.setInteractive().on('pointerdown', function()
            {
                console.log("click")
                if (this.scale.isFullscreen)
                {
                    console.log("stop fulscreen")
                    //this.scale.scaleMode = Phaser.Scale.NONE
                    //this.scale.setParentSize(640, 360)
                    this.scale.stopFullscreen()
                }
                else
                {
                    //this.scale.scaleMode = Phaser.Scale.FIT
                    //this.scale.setParentSize(1280, 720)
                    this.scale.startFullscreen()
                }
            }, this)*/


            //this.input.keyboard.once('keydown-T', testKeyboardCallback)
            this.input.keyboard.once('keydown-T', testKeyboardCallback2)
            this.input.keyboard.on('keydown-F', testFullScreenCallback)
            this.input.keyboard.on('keydown-Z', keyShowPhysicBody)
            this.input.keyboard.on('keydown-V', testWarpSpeed)
            this.input.keyboard.once('keydown-N', changeState)

            //let camera3d = this.cameras.add3D(85).setPosition(0,0,200)
            cameramenTween1 = this.tweens.add({
                targets: this.cameras.main,
                props: {
                    zoom: {value: 1.05, duration: 7000},
                    //zoom: {value: 1.05, duration: 700},
                    scrollY: {value: function ()
                                {
                                    let tmpRandomRotation = Phaser.Math.Between(-15, 15)
                                    //let tmpRandomRotation = Phaser.Math.Between(-150, 150)
                                    //console.log('camera random rotation: ' + tmpRandomRotation)
                                    return tmpRandomRotation
                                },
                                duration: 1500},
                                //duration: 250},
                    //scrollX: {value: 17.5, duration: 1500},
                    //scrollY: {value: 10, duration: 1200},
                    rotation: {value: function ()
                                {
                                    let tmpRandomRotation = Phaser.Math.Between(-5, 5)/1000
                                    //let tmpRandomRotation = Phaser.Math.Between(-25, 25)/1000
                                    //console.log('camera random rotation: ' + tmpRandomRotation)
                                    return tmpRandomRotation
                                },
                                duration: 400 //, ease: 'Sine.easeInOut'
                                //duration: 200 //, ease: 'Sine.easeInOut'
                            }
                },
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            })
            //cameramenTween1.setTimeScale(4)
            console.log("* * * * C A M E R A   T W E E N * * * *")
            console.dir(cameramenTween1)
            cameramenTween1Shock = this.tweens.add({
                targets: cameramenTween1,
                props: {
                    timeScale: {value: 1}
                },
                onStart: ()=>{cameramenTween1.setTimeScale(15)},
                duration: 2250,
                ease: 'Sine.easeInOut'
            })

            tmpBoomImg = this.add.sprite(-100, -100, 'flares', 'red')


            particleBoom1 = this.add.particles('flares').createEmitter({
                //frame: { frames: [ 'blue', 'green', 'red', 'white', 'yellow'], cycle: false },
                frame: { frames: [ 'blue'], cycle: false },

                speed: { min: -150, max: 150 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.125, end: 0 },
                alpha: {start: .75, end: 0.25},
                blendMode: 'SCREEN',
                active: false,
                lifespan: 750,
                gravityX: -1000
                //emitZone: { type: 'random', source: asteroid1ParticleZone }
            })

            this.game.scene.start('userInterface', {angleMouseCursorRef: angleMouseCursor, bulletMagazineRef: bulletMagazine, gun1Ref: miniGun1})
            //fullScreenBtn = this.add.sprite(200, 200, 'fullScreenStartIcon')
            //fullScreenBtn.setScrollFactor(0)
            //console.log('particleBoom1')
            //console.dir(particleBoom1)
            //particleBoom1.setSpeed({min: -25, max: 25})


            testMaskAsteroid1 = this.make.graphics()
            testMaskAsteroid1.fillStyle(0xffffff)
            testMaskAsteroid1.beginPath()
            testMaskAsteroid1.fillRect(0, 200, 100, 50)
            testMaskAsteroid1.fillCircle(100, 100, 50)



            let tmpGravityX = -350
            particleExplosionTestShape = new Phaser.Geom.Circle(0, 0, 58);
            particleExplosionTest = this.add.particles('flares')
            particleExplosionTest.setPosition(-500, -500)
            //particleExplosionTest.pause()
            particleExplosionTestXXX[0] = particleExplosionTest.createEmitter({
                //active: false,
                frame: { frame: ['blue'], cycle: true },
                x: 0,
                y: 0,
                scale: { start: .45, end: .75 },
                blendMode: 'ADD',
                emitZone: { source: particleExplosionTestShape, quantity: 48, yoyo: false },
                //quantity: 3,
                gravityX: tmpGravityX,
                speed: {min: -1500, max: 1500},
                alpha: {start: 1, end: 0},
                lifespan: 200,
                tint: 0xDDDDDD
            });


            particleExplosionTestXXX[1] = particleExplosionTest.createEmitter({
                //active: false,
                frame: { frame: [0, 1, 2, 3, 4], cycle: false },
                x: 0,
                y: 0,
                scale: { start: .15, end: .3 },
                blendMode: 'ADD',
                emitZone: { source: particleExplosionTestShape, quantity: 48, yoyo: false },
                //quantity: 3,
                gravityX: tmpGravityX,
                speed: {min: -400, max: 400},
                alpha: {start: 1, end: 0},
                lifespan: 4000,
                //tint: 0x0000FF
            })

            let tmpIndx = []
            for (let i=0; i<50; i++){
                tmpIndx.push(i)
            }

            particleExplosionTestXXX[2] = particleExplosionTest.createEmitter({
                //active: false,
                frame: { frame: tmpIndx, cycle: false },
                x: 0,
                y: 0,
                scale: { start: .15, end: .15 },
                blendMode: 'ADD',
                emitZone: { source: particleExplosionTestShape, quantity: 48, yoyo: false },
                //quantity: 3,
                gravityX: tmpGravityX,
                speed: {min: -800, max: 800},
                alpha: {start: 1, end: 0},
                lifespan: 5000,
                rotate: 20,
                deathZone: { type: 'onEnter', source: asteroid1DeathZone }
                //tint: 0x0000FF
            })
            particleExplosionTestXXX[0].explode(400)
            particleExplosionTestXXX[1].explode(200)
            particleExplosionTestXXX[2].explode(200)


            let tmpPipeline = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline(
                {
                    game: this.game,
                    renderer: this.game.renderer,
                    fragShader: this.cache.shader.get('testShader5').fragmentSrc
                })
            tmpPipeline.setFloat2('resolution', this.game.config.width, this.game.config.height);
            //tmpPipeline.setFloat2('resolution', 24, 16);
            let pipeline1 = this.game.renderer.addPipeline('pipeline1', tmpPipeline)
            this.cameras.main.setRenderToTexture(pipeline1)
            //this.cameras.main.setPipeline(tmpPipeline)
            //particlesStars.setPipeline('pipeline1')
            //sun01.setPipeline('pipeline1')
            //tmpPipeline.onPostRender()
            //console.log('--- T E S T  S H A D E R  4 ---\n')
            //console.dir(this.cache)
            //console.log('- S T R I N G -\n' + this.cache.shader.get('testShader4').fragmentSrc)
            testPipeline1 = tmpPipeline
    }


//**********************************************************************************
//**********************************************************************************
//*******************           U P D A T E              ***************************
//**********************************************************************************
//**********************************************************************************

    update(argTime, argDelta)
    {
        //scene.game.renderer.snapshot()
        //testPipeline1.onPostRender()
        testPipeline1.setFloat1('time', argTime / 1000)
        testPipeline1.setFloat1('delta', argDelta)

        cameraCheck()
        angleMouseCursor.value = angleMouseCursorUserInterface()
        miniGunUpdate()
        touchControll()
        shipShot(argTime)
        moveShip()
        //checkShipScale()
        //debugCheck(this)

        //particlesStars.y = this.cameras.main.scrollY * 1.75
        particlesStars.rotation = -this.cameras.main.rotation
        asteroidsParticlesBackLayer.y = this.cameras.main.scrollY * 1.25
        //asteroidsParticlesBackLayer.rotation = -this.cameras.main.rotation * 2
        asteroidsParticles.y = -this.cameras.main.scrollY * 10
        //asteroidsParticles.rotation = -this.cameras.main.rotation * 4
        //console.log('particlesStars.emitters.first.getAliveParticleCount(): ' + particlesStars.emitters.first.getAliveParticleCount())
        //console.log("cameras y: " + this.cameras.main.scrollY + ", stars y: " + particlesStars.y)
        //console.log("cameras rotate: " + this.cameras.main.rotation + ", stars rotate: " + particlesStars.rotation)
        //light.y = ship.y


        checkAsteroids(this);
        checkAsteroids(this, asteroid2, asteroid2ParticleZone, 3500, lightAsteroid2);

        fpsSpanIdDOM.innerText = this.game.loop.actualFps.toFixed().toString()

        /*let cameraWidth, cameraHeight, cameraZoom
        console.log("camera size: " + (cameraWidth = this.cameras.main.width) + ', ' + (cameraHeight = this.cameras.main.height) + ', ' + (cameraZoom = this.cameras.main.zoom))
        this.cameras.main.setViewport(0, 0, cameraWidth-1, cameraHeight-1)
        this.cameras.main.setBackgroundColor(0xBBBBBB)
        this.cameras.main.setZoom(cameraZoom + .1)*/
        //console.log('time: ' + argTime + ', delta: ' + argDelta)

        moveSun(argDelta)
        //moveMoon(argDelta)
        //moveEarth(argDelta)

        shadowsUpdate(argDelta)
        //checkDevMode()
    }
}


//************************************* E N D   C L A S S ***************************************
//***********************************************************************************************




function moveShip()
{
    let speedX = 0, speedY = 0, speed = .025,
        particleSee = 2, particleSeeHwMn = 2, particleSpeed = 0, particleTime = 0,
        shipVelocityY = 0, shipSpeedY = 2000,
        moveFL = false

    speedThrust = 0

    if(keyCursors.right.isDown || keyWASD.D.isDown || controlRightFL) //&& ship.body.velocity.x < 10)
    {
        speedX += speed
        particleSee = particleSeeHwMn
        particleSpeed = 250
        particleTime = 1400
        moveFL = true
        speedThrust = -.038
    }
    if(keyCursors.left.isDown || keyWASD.A.isDown || controlLeftFL) //&& ship.body.velocity.x > -10)
    {
        speedX -= speed
        speedThrust = .038
        if (!moveFL)
        {
            particleSee = particleSeeHwMn - 1
            moveFL = true
            particleTime = -150
        }
        else
        {
            particleSee = particleSeeHwMn
            speedX = 0
            speedThrust = 0
            moveFL = false
            particleSpeed = 0
            particleTime = 0
        }
    }
    if(keyCursors.up.isDown || keyWASD.W.isDown || controlUpFL)
    {
        //speedY += speed
        shipVelocityY = -shipSpeedY
        ship.applyForce(new Phaser.Math.Vector2(0, -.033))
        //ship.thrustLeft(.045)
    }
    if(keyCursors.down.isDown || keyWASD.S.isDown || controlDownFL)
    {
        //speedY -= speed/10
        //ship.setAngle(30);
        shipVelocityY = shipSpeedY
        ship.applyForce(new Phaser.Math.Vector2(0, .033))
        //ship.thrustLeft(-.045)
    }
    if(keyWASD.X.isDown)
    {
        speedX *= 1
        speedY *= 1
        ship.thrust(-.045)
    }

    let posLeftShip = ship.getLeftCenter()
    let posTopLeftShip = ship.getTopLeft()
    let shipPosEngine = posTopLeftShip.lerp(posLeftShip, 0.7)
    let posRightShip = ship.getRightCenter()

    let posRightBottom = ship.getBottomRight()
    let posRightUp = ship.getTopRight()
    let forceShipBottomEngine = posRightBottom.subtract(posRightUp).normalize()
    //console.log(forceShipBottomEngine)
    //debugCheck2(forceShipBottomEngine)
    forceShipBottomEngine.x *= -speedY
    forceShipBottomEngine.y *= speedY


    let forceShip = posRightShip.subtract(posLeftShip).normalize()     //zamiana kąta nachylanie statku na znormalizowany vector
    //console.log(forceShip);
    forceShip.x *= speedX
    forceShip.y *= speedX

    //ship.applyForce(new Phaser.Math.Vector2(speedX, speedY));
    //ship.applyForceFrom(posLeftShip, new Phaser.Math.Vector2(speedX, 0));
    //ship.body.velocity = new Phaser.Math.Vector2(0, shipVelocityY)
    //console.log(ship.body)
    //temp02.body.velocity.y = shipVelocityY
    //if (moveFL) ship.applyForceFrom(posLeftShip, forceShip)
    if (moveFL) ship.thrustBack(speedThrust)
    //debugCheck3(forceShip)
    //ship.applyForce(0.0001, 0)
    //ship.applyForce(new Phaser.Math.Vector2(.01))
    //ship.applyForceFrom(posRightBottom, forceShipBottomEngine);
    //ship.setAngularVelocity(speedY);

    //autoPilot();

    checkShipAngle();

    //particles.angle = ship.angle
    //particles.emitters.first.x = ship.x
    //particles.emitters.first.y = ship.y
    particles.emitters.first.x.propertyValue = shipPosEngine.x
    particles.emitters.first.y.propertyValue = shipPosEngine.y
    particles.emitters.first.angle.propertyValue = ship.angle + 180
    particles.emitters.first.quantity.propertyValue = particleSee
    particles.emitters.first.speedXstart = 100 + particleSpeed
    particles.emitters.first.speedX.end = 250 + particleSpeed
    particles.emitters.first.lifespan.propertyValue = 250 + particleTime;
    //console.log(particles.emitters.first)


    //ship.body.force.y = .1
    //console.log(ship);
    asteroid1DeathZone.setPosition(ship.x-50, ship.y-17)
}


function debugCheck(thisArg)
{
    let text = '...'
    //debugText1.text = thisArg.game.loop.delta     //czas delta w ms
    //debugText1.text = thisArg.game.loop.framesThisSecond    //liczba klatek w tej sekundzie
    debugText1.text = thisArg.game.loop.actualFps.toFixed()    //liczba klatek na sekunde, tofixed zaokragla (ew w nawiasie podajesz ile liczb po przecinku ma wyświetlac)
    debugText1.text += " FPS\npress T change scene"
    //console.log(thisArg.game.loop.delta)

}


function debugCheck2(arg)
{
    //let text = "x: " + arg.x.toFixed(3) + ", y: " + arg.y.toFixed(3)
    //let text = ship.angle.toFixed(1)
    let text = "vel x: " + ship.body.velocity.x.toFixed(2) + ", vel y: " + ship.body.velocity.y.toFixed(2)
    debugText2.text = text
}
function debugCheck3(arg)
{
    let text = "force --> x: " + arg.x.toFixed(3) + ", y: " + arg.y.toFixed(3)
    debugText3.text = text
}


function autoPilot(arg)
{
    let forcePower = .04
    let posRightBottom = ship.getBottomRight()
    let posRightUp = ship.getTopRight()
    let forceShipBottomEngine = posRightBottom.subtract(posRightUp).normalize()

    if (keyWASD.X.isDown)
        {
        if(ship.angle < -90 || ship.angle > 90){
            forceShipBottomEngine.x *= forcePower
            forceShipBottomEngine.y *= -forcePower
            ship.applyForceFrom(posRightBottom, forceShipBottomEngine);
        }
        else if(ship.angle > -90){
            forceShipBottomEngine.x *= -forcePower
            forceShipBottomEngine.y *= forcePower
            ship.applyForceFrom(posRightBottom, forceShipBottomEngine);
        }
    }
}


function checkShipAngle()
{
     shipAngle = ship.body.velocity.y * 2
     ship.setAngle(-shipAngle)
}



function checkShipScale()
{
    if (ship.body.velocity.x > 0)
    {
        ship.scaleX = 1 + ( Math.max(ship.body.velocity.x / 10), .5)
    }
    else if (ship.body.velocity.x < 0)
    {
        ship.scaleX = 1 - Math.max((Math.abs(ship.body.velocity.x))/10, .5)
    }
    else
    {
        ship.scaleX = 1;
    }
}


/*function testKeyboardCallback()
{
    console.log(this.game.input.keyboard)
    console.log("testKeyboardCallback... press T...")

    ship.body.destroy()
    //ship.disable()
    //ship2.destroy()
    keyCursors.up.destroy()
    keyCursors.down.destroy()
    keyCursors.left.destroy()
    keyCursors.right.destroy()
    keyCursors.space.destroy()
    keyCursors.shift.destroy()
    keySpacebar.destroy()
    keyWASD.W.destroy()
    keyWASD.A.destroy()
    keyWASD.S.destroy()
    keyWASD.D.destroy()
    keyWASD.X.destroy()
    debugText1.destroy()
    debugText2.destroy()
    debugText3.destroy()
    particles.destroy()
    //console.log("temp02 hwMn: " + temp02.getAll())
    particlesStars.destroy()
    asteroidsParticlesBackLayer.destroy()
    asteroidsParticles.destroy()
    //temp02.getAll()[0].destroy()
    //temp02Matter.destroy()
    //temp02.destroy()
    //light.destroy()
    //this.input.keyboard.off('keydown-T', testKeyboardCallback)

    //this.input.keyboard.removeAllListeners()
    //this.game.scene.start('start')
    //this.game.scene.start('testShipOnRocket')
    //this.game.scene.start('physicTest')

}*/

function testKeyboardCallback2()
{
    console.log("testKeyboardCallback... press T...")
    console.dir(this.game.scene)
    this.game.scene.stop('physicTest')
    this.game.scene.start('testShipOnRocket')
    //console.log(this.game.scene.transition())
    /*this.game.scene.transition({
                target: 'testShipOnRocket',
                duration: 3000,
                moveAbove: true
            });*/
}


function shotAsteroid(asteroidArg, argPosX = 3000)
{
    collisionWithAsteroidFL = false
    asteroidArg.setVelocity(0,0)
    asteroidArg.setAngle(0)
    asteroidArg.x = argPosX
    asteroidArg.y = Phaser.Math.Between(40, 320)
    //asteroidArg.thrustBack(1)
    //asteroidArg.applyForce(new Phaser.Math.Vector2(Phaser.Math.Between(75, 187.5)/-100, 0))
    asteroidArg.applyForce(new Phaser.Math.Vector2(Phaser.Math.Between(100, 225)/-100, 0))
    asteroidArg.setAngularVelocity(Phaser.Math.Between(-25, 25) / 1500)
}


function checkAsteroids(thisArg, argAsteroid = asteroid1, argAsteroidParticleZone = asteroid1ParticleZone, argStartPosX = 3000, argLightAsteroid = lightAsteroid1)
{
    //console.log('asteroid1.willRender(this.cameras.main): ' + Phaser.Geom.Rectangle.ContainsRect(thisArg.cameras.main.worldView, asteroid1.getBounds()))
    if(!argAsteroid.visible)
    {
        argAsteroid.visible = true
        argAsteroid.setActive(true)
        shotAsteroid(argAsteroid, argStartPosX)
    }

    if(argAsteroid.x < 540)// || collisionWithAsteroidFL)
    {
        //if(!Phaser.Geom.Rectangle.ContainsRect(thisArg.cameras.main.worldView, asteroid1.getBounds()))
        if(!Phaser.Geom.Rectangle.ContainsRect(rectangleBoard, argAsteroid.getBounds()) && !warSpeedFL)
        {
            shotAsteroid(argAsteroid, argStartPosX)
            //console.log('asteroid1 x: ' + argAsteroid.x)
        }
    }
    argAsteroidParticleZone.setPosition(argAsteroid.x-25, argAsteroid.y)
    argLightAsteroid.setPosition(argAsteroid.x, argAsteroid.y)
}


function colisionWithAsteroids(arg)
{
    //tmpBoomImg.setPosition(arg.positionImpulse.x, arg.positionImpulse.y)
    console.log('COLISION!... ' + arg.position.x + ', ' + arg.position.y)
    //console.log('arg.pairs.list.length: ' + arg.pairs.list.length)
    //console.dir(arg)
    //console.dir(particleBoom1)
    console.dir(scene.matter.world.engine.pairs.list)
    collisionWithAsteroidFL = true

    particleBoom1.setPosition(arg.position.x, arg.position.y)
    particleBoom1.explode(12)
    particleBoom1.active = true

    console.dir(scene.matter.world.engine)
}



function testFullScreenCallback()
{
    console.log("click F ...fullscreen test: " + document.fullscreen)
        /*if (scene.scale.isFullscreen)
        {
            console.log("stop fulscreen")
            //this.scale.scaleMode = Phaser.Scale.NONE
            //this.scale.setParentSize(640, 360)
            scene.scale.stopFullscreen()
        }
        else
        {
            scene.scale.scaleMode = Phaser.Scale.FIT
            //this.scale.setParentSize(1280, 720)
            scene.scale.startFullscreen()
        }*/
        if (!document.fullscreen)
        {
            scene.scale.scaleMode = Phaser.Scale.FIT
            document.getElementById('game01').requestFullscreen()
        }
        else
        {
            document.exitFullscreen()
            //scene.scale.scaleMode = Phaser.Scale.NONE
            //scene.scale.setParentSize(640, 360)
        }
}



function touchControll()
{
    //console.log('active pointer: ' + scene.input.activePointer.isDown)
    //console.log('active pointer buutons: ' + scene.input.activePointer.buttons)
    resetControllButtonsFL()
    let offset = 10
    if (scene.input.activePointer.buttons == 2)      //isDown - any button, primaryDown - primary button (left mause button)
    {
        let pointerX = scene.input.activePointer.x, pointerY = scene.input.activePointer.y

        //console.log('active pointer position: ' + scene.input.activePointer.x + ', ' + scene.input.activePointer.y)
        if (pointerX > ship.x + offset){
            controlRightFL = true
        }
        else if (pointerX < ship.x - offset){
            controlLeftFL = true
        }
        if (pointerY < ship.y - offset){
            controlUpFL = true
        }
        else if (pointerY > ship.y + offset){
            controlDownFL = true
        }
    }
}

function resetControllButtonsFL()
{
    controlLeftFL = false;
    controlUpFL = false;
    controlRightFL = false;
    controlDownFL = false;
}



function keyShowPhysicBody()
{
    scene.matter.world.drawDebug = !scene.matter.world.drawDebug
    scene.matter.world.debugGraphic.visible  = scene.matter.world.drawDebug
    //scene.matter.world.enabled = !scene.matter.world.enabled
}


function explodeAsteroid()
{
    particleExplosionTest.setPosition(asteroid1.x, asteroid1.y)
    particleExplosionTestXXX[0].explode(400)
    particleExplosionTestXXX[1].explode(300)
    particleExplosionTestXXX[2].explode(300)
    asteroid1.visible = false
    asteroid1.setActive(false)

    //cameramenTween1.setTimeScale(25)
    //cameramenTween1ShockFL = true
    //cameramenTween1Shock.seek(0)
    //cameramenTween1Shock.play()
    cameramenTween1Shock.restart()
}


function explodeAsteroidCheckShockCamera()
{
    if(cameramenTween1ShockFL)
    {
        cameramenTween1ShockFL = false
        cameramenTween1Shock.restart()
    }
}

function cameraCheck()
{
    explodeAsteroidCheckShockCamera()
}


function shipCollisionCallback(argCollisionData)
{
    //console.dir(argCollisionData.collision)
    //console.log("COLLISION...")
    let tmpX = argCollisionData.bodyA.position.x - argCollisionData.collision.normal.x * 58
    let tmpY = argCollisionData.bodyA.position.y - argCollisionData.collision.normal.y * 58

    //let tmpBoomPower = argCollisionData.collision.parentA.velocity - argCollisionData.collision.parentB.speed

    let tmpBoomPowerVec = new Phaser.Math.Vector2(argCollisionData.collision.parentA.velocity.x, argCollisionData.collision.parentA.velocity.y).subtract(new Phaser.Math.Vector2(argCollisionData.collision.parentB.velocity.x, argCollisionData.collision.parentB.velocity.y))
    //console.dir('tmpBoomPowerVec: ' + tmpBoomPowerVec)
    let tmpBoomPower = tmpBoomPowerVec.length()
    //console.log('tmpBoomPower: ' + tmpBoomPower)
    //console.log('collision tmpPower: ' + tmpBoomPower + ', ' + argCollisionData.collision.parentA.speed + ', ' + argCollisionData.collision.parentB.speed)
    collisionWithAsteroidFL = true
    //particleBoom1.setPosition(tmpX, tmpY)
    //particleBoom1.explode(12)
    particleBoom1.setSpeed({min: -tmpBoomPower*15, max: tmpBoomPower*15})
    particleBoom1.setScale({start: tmpBoomPower*.0025, end: 0})
    particleBoom1.explode(tmpBoomPower, tmpX, tmpY)
    particleBoom1.active = true
    //argCollisionData.bodyA.gameObject.setCrop()
    if (asteroid1.body.velocity.x > -5) explodeAsteroid()
}



function moveSun(argDelta)
{
    //console.log(argDelta)
    let moveX = argDelta/100
    if (warSpeedFL) moveX = argDelta * 10
    sun01.x -= moveX
    planet01.x -= moveX * .75
    if(sun01.x < -660)
    {
        if (devMoveFL)
        {
            sun01.setPosition(1300, Phaser.Math.RND.between(130, 230))
            planet01.setPosition(sun01.x-200, sun01.y)
        }
    }
}



function moveMoon(argDelta)
{
    //console.log(argDelta)
    let moveX = argDelta/20
    if (warSpeedFL) moveX = argDelta*30
    moon01.x -= moveX
    moon01ShadowX4.setPosition(moon01.x, moon01.y)
    if(moon01.x < -2000)
    {
        if (devMoveFL)
        //if (false)
        {
            moon01.setPosition(1300, Phaser.Math.RND.between(130, 230))
            moon01ShadowX4.setPosition(moon01.x, moon01.y)
        }
    }
    moon01.setAngle(moon01.angle + argDelta/250)
}



function moveEarth(argDelta)
{
    //console.log(argDelta)
    let moveX = argDelta/20
    if (warSpeedFL) moveX = argDelta*30
    earth1euro.x -= moveX
    if(earth1euro.x < -200)
    {
        if (devMoveFL)
        //if (false)
        {
            earth1euro.setPosition(840, Phaser.Math.RND.between(200, 300))
        }
    }
}



function shipShot(argTime)
{
    if(shotLight.visible)
        {
            shotLight.setVisible(false)
            shipShotLight.setColor(0x000000)
            //miniGun1.setFrame('miniGun1sOff.png')
        }

    if ((keyWASD.E.isDown || keyCursors.space.isDown || scene.input.activePointer.primaryDown) && argTime - shipShotTmpTime > shipShotFrequencyTime)
    //if (keyCursors.space.checkDown() && argTime - shipShotTmpTime > shipShotFrequencyTime)
    {
        if(bulletMagazine.count > 0){
            shipShotTmpTime = argTime
            //shipShotFrequencyTime = Phaser.Math.RND.between(125, 225)
            shipShotFrequencyTime = 35

            //shipBullet.setPosition(ship.getRightCenter().x - 10, ship.getRightCenter().y + 10)
            //shipBullet.setVelocity(0)
            //shipBullet.thrustBack(-.1)
            bulletCheckStartPos()
            let shipBullet = scene.matter.add.sprite(shipGun1PosVec2StartBullet.x, shipGun1PosVec2StartBullet.y, "flares", "yellow")
            shipBullet.setIgnoreGravity(true)
            //let shipBullet = scene.matter.add.sprite(shipGun1PosVec2RightCenter.x, shipGun1PosVec2RightCenter.y, "flares", "yellow")
            //let shipBullet = scene.matter.add.sprite(ship.getRightCenter().x - 10, ship.getRightCenter().y + 10, "flares", "yellow")
            shipBullet.alpha = Phaser.Math.RND.between(5, 75) / 100
            shipBullet.setCollisionCategory(collisiionCategory1)
            shipBullet.setCollidesWith(collisiionCategory2)
            shipBullet.setMass(50)
            shipBullet.setScale(Phaser.Math.RND.between(25, 50) / 100, .05)
            shipBullet.setFixedRotation()
            shipBullet.setOnCollide( ()=>shipBullet.destroy() )

            if (pointerRef.isDown || true)//bullet falow pointer angle
            {
                //let angleTmp = Phaser.Math.Angle.Between(shipBullet.x, shipBullet.y, pointerRef.x, pointerRef.y)//,
                let angleTmp = angleMouseCursor.value
                    //angleTmpDegress = Phaser.Math.Angle.WrapDegrees(angleTmp)
                //console.log("... A N G L E bullet to pointer: " + angleTmp + "\ndegress: " + angleTmpDegress)
                //console.log("... DEG TO RAD ... = " + Phaser.Math.RAD_TO_DEG)
                let tmpVectorNormalizeAngleForce = new Phaser.Math.Vector2(-3, -3)
                //console.log("... RAD ANGLE ... = " + tmpVectorTest.setRotation(.1))
                //console.log("... RAD ANGLE ... = ")
                //console.dir(Object.getOwnPropertyNames(tmpVectorTest))
                tmpVectorNormalizeAngleForce.setToPolar(angleTmp, shipShotPower)
                //console.log("... RAD ANGLE VECTOR ..." + tmpVectorNormalizeAngleForce.setToPolar(angleTmp, shipShotPower))
                //console.dir(tmpVectorNormalizeAngleForce)
                shipBullet.setAngle(angleTmp * Phaser.Math.RAD_TO_DEG + Phaser.Math.RND.between(-.25, .25))
                ship.applyForceFrom(new Phaser.Math.Vector2(shipBullet.x, shipBullet.y), tmpVectorNormalizeAngleForce);
            }
            else
            {
                shipBullet.setAngle(-shipAngle + Phaser.Math.RND.between(-.5, .5))
                ship.thrust(shipShotPower)
                //miniGun1.setRotation(0)
            }

            shipBullet.thrustBack(-.1)
            scene.time.addEvent({ delay: 1000, callback: ()=>{
                if(shipBullet) shipBullet.destroy()
                //console.log("bullet destroy")
            }})

            shotLightFunction()
            //particleBullets.setPosition(ship.getRightCenter().x, ship.getRightCenter().y)
            particleBullets.active = true
            //particleBullets.emitParticle(1, ship.getRightCenter().x - 1, ship.getRightCenter().y + 10)

            bulletMagazine.count -= 1
            particleBullets.emitParticle(1, miniGun1.x, miniGun1.y)
        }
        else
        {
            //bulletMagazine.count = bulletMagazine.max
        }

        miniGun1.setFrame('miniGun1sOn.png')
        if(shipGun1RunTimer.getProgress() < 1)
        {
            //console.log("shipGun1RunTimer < 1")
            shipGun1RunTimer.reset({delay: 250, callback: ()=>{miniGun1.setFrame('miniGun1sOff.png')}})
        }
        else
        {
            //console.log("shipGun1RunTimer 1 or more...")
            shipGun1RunTimer = scene.time.addEvent({delay: 250, callback: ()=>{miniGun1.setFrame('miniGun1sOff.png')}})
        }
        //particleBullets.active = false
    }

    if (argTime - bulletMagazine.timeTmp > bulletMagazine.timeBorneBullet && bulletMagazine.count < bulletMagazine.max)
    {
        console.log("bullet reborne... +1")
        bulletMagazine.timeTmp = argTime
        bulletMagazine.count += 1
    }
}


function checkDevMode()
{
    asteroidsParticlesBackLayer.pause()
    asteroidsParticles.pause()
}


function testWarpSpeedCallFirst()
{

}

function testWarpSpeed(arg)
{
    console.dir(arg)
    //console.log(arg.timeStamp - warSpeedTimeTmp > warSpeedTimeCheck)
    //if (arg.timeStamp - warSpeedTimeTmp > warSpeedTimeCheck)
    //{
        //warSpeedTimeTmp = arg.timeStamp

        if (!warSpeedFL)
        {
            devMoveFL = !devMoveFL
            warSpeedFL = true
            cameramenTween1.setTimeScale(4)
            particlesStars.emitters.first.setFrequency(25)
            particlesStars.emitters.first.setQuantity({min: 2, max:5})
            particlesStars.emitters.first.setLifespan(2500)
            particlesStars.emitters.first.setScaleX({min: 3.5, max: 7.5})
            particlesStars.emitters.first.setScaleY({min: .5, max: 1})
            particlesStars.emitters.first.forEachAlive((particle)=>
                {

                    //particle.scaleX = 3.5
                    particle.scaleX = 5
                    particle.scaleY = .75
                    //particle.velocityX *= 75
                    particle.accelerationX = -500
                    //console.log('particle: ' + particle.scaleX + ", "+ particle.scaleY)
                })

            particlesStars.emitters.first.onParticleEmit((particle)=>
                {
                    //particle.scaleX = 1
                    //particle.velocityX *= 350
                    //console.log('particle NEW: ' + particle.scaleX + ", " + particle.scaleY + "\npos: " + particle.x + ", " + particle.y + "\nvelX: " + particle.velocityX)
                })
            particlesStars.emitters.first.setSpeedX({min: -350, max: -3500})

                asteroidsParticlesBackLayer.emitters.first.forEachAlive((particle)=>
                    {
                        particle.velocityX *= 100
                    })
                asteroidsParticlesBackLayer.emitters.first.stop()
                asteroidsParticles.emitters.first.stop()
        }

        else
        {
            devMoveFL = !devMoveFL
            warSpeedFL = false

            particlesStars.emitters.first.forEachAlive((particle)=>
                {
                    let tmpScale = Phaser.Math.RND.between(.1, .2)
                    //particle.scaleX = .1
                    //particle.scaleY = .1
                    //particle.velocityX = Phaser.Math.RND.between(-10, -1)
                    //particle.velocityX = -750
                    //console.log('particle NO SPEED: ' + particle.scaleX + ", "+ particle.scaleY)
                    //console.log('particle NO SPEED life: ' + particle.life)
                    //particle.life = 30000
                    //console.log('particle NO SPEED life after: ' + particle.life)
                    //particle.lifeCurrent  = 10
                    //particle.lifeT = -4
                    //particle.accelerationX = 0
                    //particle.life = 0
                })

            cameramenTween1.setTimeScale(1)
            particlesStars.emitters.first.setFrequency(1250)
            particlesStars.emitters.first.setLifespan(320000)
            particlesStars.emitters.first.setScaleY({min: .01, max: .1})
            particlesStars.emitters.first.setScaleX({min: .01, max: .1})

            particlesStars.emitters.first.setSpeedX({min: -1, max: -10})
            particlesStars.emitters.first.onParticleEmit((particle)=>
                {
                    particle.scaleX = particle.scaleY
                    //console.log('particle NEW AFTER: ' + particle.scaleX + ", " + particle.scaleY)
                })
                //asteroidsParticlesBackLayer.emitters.first.setSpeedX({min: -200, max: -600})
            asteroidsParticlesBackLayer.emitters.first.start()
            asteroidsParticles.emitters.first.start()

            particlesStars.emitters.first.scaleX.onUpdate = particlesStars.emitters.first.scaleX.defaultUpdate
            particlesStars.emitters.first.scaleY.onUpdate = particlesStars.emitters.first.scaleY.defaultUpdate
            for (let i=0; i<100; i++) particlesStars.emitters.first.emitParticle(1, Phaser.Math.RND.between(0, 640), Phaser.Math.RND.between(0, 360))
        }
    //}
}



//angle mouse cursor for userInterface
function angleMouseCursorUserInterface()
{
    //shipMiniGunPosVec2.set(ship.getRightCenter().x - 10, ship.getRightCenter().y + 10)
    shipMiniGunPosVec2.set(miniGun1.x, miniGun1.y)
    let angleTmp = Phaser.Math.Angle.Between(shipMiniGunPosVec2.x, shipMiniGunPosVec2.y, pointerRef.x, pointerRef.y)
    //console.log("angleMouseCursorUserInterface angleTmp: " + angleTmp)
    return angleTmp
}



function changeState(arg)
{
    if(arg.keyCode == 78)   //N
    {
        scene.game.scene.stop('physicTest')
        scene.game.scene.start('testStateBackgroudStars')
    }
}



function miniGunUpdate()
{
    //ship.getBottomRight(shipGun1PosVec2)
    ship.getCenter(shipGun1PosVec2)
    miniGun1.setPosition(shipGun1PosVec2.x, shipGun1PosVec2.y)
    miniGun1.setRotation(angleMouseCursor.value)
    miniGun1.getRightCenter(shipGun1PosVec2RightCenter)
}



function shotLightFunction()
{
    shipShotLight.setColor(0xFFFF00)
    shipShotLight.setPosition(shipGun1PosVec2RightCenter.x, shipGun1PosVec2RightCenter.y)

    shotLight.setPosition(shipGun1PosVec2RightCenter.x, shipGun1PosVec2RightCenter.y)
    //shotLight.setScale(Phaser.Math.RND.between(.25, .35))
    //shotLight.setScale(.35)
    //shotLight.setRotation(angleMouseCursor.value)

    let tmpRnd = Phaser.Math.RND.integerInRange(2, 3),
        tmpRndScale = Phaser.Math.RND.realInRange(.15, .4)

    //console.log('tpmRandomScale: ' + tmpRndScale)

    switch (tmpRnd)
    {
        case 0:
        break

        case 1:
        break

        case 2:
        shotLight.setFrame('shotLight02.png')
        shotLight.setAngle(Phaser.Math.RND.angle())
        shotLight.setScale(tmpRndScale)
        break

        case 3:
        shotLight.setFrame('shotLight03.png')
        shotLight.setRotation(angleMouseCursor.value)
        shotLight.setScale(tmpRndScale)
        break

        default:
    }

    shotLight.setVisible(true)
}



function bulletCheckStartPos()
{
    miniGun1.getTopRight(shipGun1PosVec2TopRight)
    miniGun1.getBottomRight(shipGun1PosVec2BottomRight)
    let rndPos = Phaser.Math.RND.realInRange(.2, .8)
    shipGun1PosVec2StartBullet = shipGun1PosVec2TopRight.lerp(shipGun1PosVec2BottomRight, rndPos)
}



function shadowsUpdate(argData)
{
    let sunPosVec2Tmp = new Phaser.Math.Vector2(sun01.x, sun01.y),
        shipPosVec2Tmp = new Phaser.Math.Vector2(ship.x, ship.y),
        lengthShipFromSunTmp =  shipPosVec2Tmp.distance(sunPosVec2Tmp),
        shipPointTmp = new Phaser.Geom.Point((ship.x - sun01.x) + ship.x, (ship.y - sun01.y) + ship.y)

    /*console.log("shadow time START")
    console.time()
    for (let indx in shipShadow)
    {
        shipShadow[indx].setAngle(ship.angle)

        shipShadow[indx].setScale(Phaser.Math.Clamp( (300 - lengthShipFromSunTmp)/100, 1, 3))

        shipShadow[indx].setAlpha(shipShadow[indx].scaleX / 3 - .45 - indx/10)

        shipShadow[indx].setPosition( shipPointTmp.x + (ship.x - sun01.x)*indx, shipPointTmp.y + (ship.y - sun01.y)*indx)
    }
    console.timeEnd()
    console.log("shadow time END")*/

    //console.log("shadow time START")
    //console.time()
    shipShadow.forEach((elem, indx)=>
    {
        elem.setAngle(ship.angle)

        elem.setScale(Phaser.Math.Clamp( (300 - lengthShipFromSunTmp)/100, 1, 3))

        elem.setAlpha(shipShadow[indx].scaleX / 3 - .45 - indx/10)

        elem.setPosition( shipPointTmp.x + (ship.x - sun01.x)*indx, shipPointTmp.y + (ship.y - sun01.y)*indx)
    })
    //console.timeEnd()
    //console.log("shadow time END")
    //console.log("SHIP to SUN lenght: " + lengthShipFromSunTmp)
}
