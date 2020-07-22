

let scene, angleMouseCursor, mouseCursor1, oldTv01,
    bulletMagazine, gun1, debugText = [],
    testObj = {
        test1: 0,
        test2: 0,
        tmpArr: [],
        tmpTime: 0,
        tmpLastGunAngle: 0,
        tmpMaxGunAngleMove: 0,
        tmpGunAngleCount: 0
    },
    tmpPointA = {x: 30, y: 20}

export default class UserInterface extends Phaser.Scene
{

    init(argData)
    {
        angleMouseCursor = argData.angleMouseCursorRef
        bulletMagazine = argData.bulletMagazineRef
        gun1 = argData.gun1Ref
        //console.log("angleMouseCursor: " + angleMouseCursor)
        //console.dir(argData)
    }

    create()
    {
        console.log('userInterface create...')
        scene = this
        let fullScreenBtn = this.add.sprite(620, 20, 'fullScreenStartIcon')
        let winietaCam1 = this.add.image(320, 180, 'winietaCam1')

        mouseCursor1 = this.add.image(320, 180, 'mouseCursor1')
        mouseCursor1.setOrigin(1, .5)

        fullScreenBtn.setInteractive()
        fullScreenBtn.on('pointerdown', testFullScreenCallback)
        //this.scene.start('physicTest')
        //console.dir(this)
        //angleMouseCursor = scene.settings.data.angleMouseCursorRef


        //bullets left screen magazine
        makeBulletMagazineLightShot()
        makeBulletMagazineChain()
        makeParticlesShells()

        //oldTv
        oldTv01 = this.add.image(320, 180, 'oldTv01')
        oldTv01.setScale(1.15)
        //debug text
        //makeDebugText()

        //startShader()
    }



    update(argTime, argDelta)
    {
        //console.log("angleMouseCursor: " + angleMouseCursor.value)
        updateMouseCursor()
        updateBulletsMagazinChain()
        //debugTextUpdate(argTime)
        /*if (tmpPointA.x < 33)
        {
            tmpPointA.x+=4
            tmpPointA.y+=.25
        }*/
    }
}


function testFullScreenCallback()
{
    console.log("click fullscreen btn: " + document.fullscreen)

    if (scene.sys.game.device.os.desktop)
    {
            console.log("desktop")
    }
    else
    {
             console.log("mobile")
             //scene.scale.orientation = Phaser.Scale.LANDSCAPE
             //scene.scale.lockOrientation(Phaser.Scale.LANDSCAPE)
    }

    if (!document.fullscreen)
    {
        scene.scale.scaleMode = Phaser.Scale.FIT
        //scene.scale.scaleMode = Phaser.Scale.HEIGHT_CONTROLS_WIDTH
        //scene.scale.scaleMode = Phaser.Scale.WIDTH_CONTROLS_HEIGHT
        document.getElementById('game01').requestFullscreen()
    }
    else
    {
        document.exitFullscreen()
    }
}



function updateMouseCursor()
{
    mouseCursor1.setPosition(scene.input.activePointer.x, scene.input.activePointer.y)
    mouseCursor1.setRotation(angleMouseCursor.value)
}



function makeBulletMagazine()
{
    for(let i=0; i<bulletMagazine.max; i++)
    {
        bulletMagazine.img[i] = scene.add.image(18, 10 + 11*i, 'bullet1')
        //bulletMagazine.img[i].setPipeline('Light2D')
        bulletMagazine.img[i].setTint(0x777777)
    }
    bulletMagazine.count = bulletMagazine.max
    bulletMagazine.countLast = bulletMagazine.count
}



function updateBulletsMagazin()
{
    if(bulletMagazine.count != bulletMagazine.countLast)
    {
        if(bulletMagazine.count < bulletMagazine.countLast)
        {
            //console.log("updateBulletsMagazin <<<")
            bulletMagazine.img[bulletMagazine.count].setVisible(false)
            bulletMagazine.countLast = bulletMagazine.count
        }
        else if(bulletMagazine.count > bulletMagazine.countLast)
        {
            //console.log("updateBulletsMagazin >>> " + bulletMagazine.count + ", " + bulletMagazine.countLast)
            for(let i=bulletMagazine.count-1; i>=bulletMagazine.countLast; i--)
            {
                bulletMagazine.img[i].setVisible(true)
            }
            bulletMagazine.countLast = bulletMagazine.count
        }
    }
}


function makeBulletMagazineChain()
{
    let tmpPrev, tmpPosY = 0, tmpStatck
    tmpPointA.y = tmpPosY
    bulletMagazine.max = 30
    bulletMagazine.mainJoint = tmpPointA

    /*tmpStatck  = scene.matter.add.stack(10, 18, 1, bulletMagazine.max, 0, 11, (argX, argY)=>{
        let tmpObj = scene.matter.add.image(argX, argY, 'bullet1', null, { mass: 0.01 })
        bulletMagazine.img.push(tmpObj)
        return tmpObj
    })*/
    for(let i=0; i<bulletMagazine.max; i++)
    {
        //bulletMagazine.bullet[i] = scene.add.image(18, 10 + 11*i, 'bullet1')
        bulletMagazine.img[i]  = scene.matter.add.image(18, tmpPosY, 'bullet1', null, { mass: 0.01, render: {visible: false} })
        bulletMagazine.img[i].setFixedRotation()
        bulletMagazine.img[i].setPipeline('Light2D')
        //bulletMagazine.img[i].debugShowBody = false
        if (i>0)
        {
            //bulletMagazine.bullet[i] = scene.matter.add.joint(tmpPrev, bulletMagazine.img[i], 10, 1, {render: {visible: true}})
            bulletMagazine.bullet[i] = scene.matter.add.constraint(tmpPrev, bulletMagazine.img[i], i*.4, 1, {damping: -0.1, render: {visible: false}})
            //bulletMagazine.bullet[i].debugShowBody = false
            //console.log("---CONSTRAINT--- " + i)
            //console.dir(bulletMagazine.bullet[i])
        }
        else
        {
            bulletMagazine.bullet[i] = scene.matter.add.worldConstraint(bulletMagazine.img[i], 0, 1, { pointA: bulletMagazine.mainJoint, damping: 0, render: {visible: false} })
            //console.log("---WORLD CONSTRAINT--- " + i)
            //console.dir(bulletMagazine.bullet[i])
        }
        tmpPrev = bulletMagazine.img[i]
        tmpPosY += 11;
        //bulletMagazine.img[i].setPipeline('Light2D')
        //bulletMagazine.img[i].setTint(0x777777)
        bulletMagazine.img[i].setTint(0x999999)
    }
    bulletMagazine.count = bulletMagazine.max
    bulletMagazine.countLast = bulletMagazine.count
}


function updateBulletsMagazinChain()
{
    if (bulletMagazine.lightShotFL)
    {
        bulletMagazineShotLight(false)
    }

    if(bulletMagazine.count != bulletMagazine.countLast)
    {
        if(bulletMagazine.count < bulletMagazine.countLast)
        {
            //console.log("updateBulletsMagazin <<<")
            bulletMagazine.img[bulletMagazine.count].setVisible(false)
            //bulletMagazine.img[bulletMagazine.max - 1 - bulletMagazine.count].setVisible(false)
            bulletMagazine.countLast = bulletMagazine.count
            //tmpPointA.y -= 10
            //bulletMagazine.img[bulletMagazine.max - 1 - bulletMagazine.count].applyForce(new Phaser.Math.Vector2(-.0005, 0))
            bulletMagazine.img[1].applyForce(new Phaser.Math.Vector2(-.02, 0))
            bulletMagazine.particlesShells.emitParticle(1, bulletMagazine.img[0].x-7, bulletMagazine.img[0].y)
            bulletMagazineShotLight(true)
        }
        else if(bulletMagazine.count > bulletMagazine.countLast)
        {
            //console.log("updateBulletsMagazin >>> " + bulletMagazine.count + ", " + bulletMagazine.countLast)
            for(let i=bulletMagazine.count-1; i>=bulletMagazine.countLast; i--)
            {
                bulletMagazine.img[i].setVisible(true)
                //bulletMagazine.img[bulletMagazine.max - 1 - i].setVisible(true)
                //tmpPointA.y += 10
                //bulletMagazine.img[bulletMagazine.max - 1 - i].applyForce(new Phaser.Math.Vector2(.00175, 0))
                bulletMagazine.img[i].applyForce(new Phaser.Math.Vector2(Phaser.Math.RND.realInRange(.001, .00175), 0))
            }
            bulletMagazine.countLast = bulletMagazine.count
        }
    }
}



function makeParticlesShells()
{
    let tmpParticles = scene.add.particles('bullet1-shell')
    bulletMagazine.particlesShells = tmpParticles.createEmitter(
        {
            //follow: ship,
            //frame: 'yellow',
            x: 0,
            y: 0,
            lifespan: 2000,
            speedX: { min: -50, max: 250 },
            speedY: { min: -250, max: 0 },
            //angle: {min: 100, max :179},
            rotate: {min: -30, max: 30},
            //scale: .05,
            gravityY: 1000,
            gravityX: -500,
            quantity: 0,
            active: true,
            //blendMode: 'ADD',
            frequency: 250,
            tint: 0x777777
        })

    tmpParticles.setPipeline('Light2D')
    console.log('makeParticlesShells...')
}



function makeBulletMagazineLightShot()
{
    scene.lights.enable().setAmbientColor(0xDDDDDD)
    bulletMagazine.lightShot = scene.lights.addLight(tmpPointA.x, tmpPointA.y, 50).setColor(0x000000).setIntensity(0)
    //bulletMagazine.lightShot.setVisible(false)
}

function bulletMagazineShotLight(argFL = true)
{
    if(argFL)
    {
        bulletMagazine.lightShot.setColor(0xEEDDAA).setIntensity(5)
        bulletMagazine.lightShotFL = true
    }
    else
    {
        bulletMagazine.lightShot.setColor(0x000000).setIntensity(0)
        bulletMagazine.lightShotFL = false
    }
}






//*** D E B U G   T E X T ***

function makeDebugText()
{
    for(let i=0; i<3; i++)
    {
        debugText[i] = scene.add.text(25, 10+14*i, 'text ' + i.toString(), { font: '16px Courier', fill: '#00ff00' })
    }
    debugText[4] = scene.add.text(325, 10, 'angle pointer: ' + "??", { font: '16px Courier', fill: '#00ff00' })
    debugText[5] = scene.add.text(325, 10+14*1, 'angle miniGun delta: ' + "??", { font: '16px Courier', fill: '#00ff00' })
    debugText[6] = scene.add.text(325, 10+14*2, 'angle miniGun delta MAX: ' + "??", { font: '16px Courier', fill: '#00ff00' })
    debugText[7] = scene.add.text(325, 10+14*3, 'miniGun reload count: ' + "??", { font: '16px Courier', fill: '#00ff00' })
}


function debugTextUpdate(argTime)
{
    debugText[0].text = 'miniGun angle: ' + gun1.angle.toFixed()
    let tmpRotateGunNormalized = Phaser.Math.Percent(gun1.angle, -180, 180)
    debugText[1].text = 'test count: ' + tmpRotateGunNormalized.toFixed(2)

    let tmpAngleMove = testObj.test2 - tmpRotateGunNormalized
    if(tmpAngleMove < -0.01)
    {
        debugText[2].text = 'move around: RIGHT'
    }
    else if(tmpAngleMove > 0.01)
    {
        debugText[2].text = 'move around: LEFT'
    }
    else
    {
        debugText[2].text = 'move around: NONE'
        //console.log("tmpAngleMove: " + tmpAngleMove)
    }
    testObj.test2 = tmpRotateGunNormalized

    debugText[4].text = 'angle pointer: ' + scene.input.activePointer.angle.toFixed(3)

    //let tmpGunAngleMove = Phaser.Math.Difference(tmpRotateGunNormalized, debugText.tmpLastGunAngle)
    let tmpGunAngleMove = Phaser.Math.Angle.ShortestBetween(gun1.angle, testObj.tmpLastGunAngle)
    if (testObj.tmpMaxGunAngleMove < tmpGunAngleMove)  testObj.tmpMaxGunAngleMove = tmpGunAngleMove
    debugText[5].text = 'angle miniGun delta: ' + tmpGunAngleMove.toFixed(3)
    debugText[6].text = 'angle miniGun delta MAX: ' + testObj.tmpMaxGunAngleMove.toFixed(3)
    ammoReloadMouseTest(argTime)
    testObj.tmpLastGunAngle = gun1.angle
    //console.dir(gun1)
}




function ammoReloadMouseTest(argTime)
{
    let tmpGunAngleMove = Phaser.Math.Angle.ShortestBetween(gun1.angle, testObj.tmpLastGunAngle)
    testObj.tmpGunAngleCount += tmpGunAngleMove
    if(argTime - testObj.tmpTime > 150 && testObj.tmpGunAngleCount > 0)
    {
    testObj.tmpGunAngleCount -= 10
    testObj.tmpTime = argTime
    //console.log('argTime ' + testObj.tmpTime)
    }

    if (testObj.tmpGunAngleCount < 0 || testObj.tmpGunAngleCount > 360) testObj.tmpGunAngleCount = 0

    debugText[7].text = 'miniGun reload count: ' + testObj.tmpGunAngleCount
    //console.log('reload count: ' + testObj.tmpGunAngleCount)

}



function startShader()
{
    let tmpPipeline = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline(
        {
            game: scene.game,
            renderer: scene.game.renderer,
            fragShader: scene.cache.shader.get('testShader5UserInterface').fragmentSrc
        })
    tmpPipeline.setFloat2('resolution', scene.game.config.width, scene.game.config.height);
    //tmpPipeline.setFloat2('resolution', 24, 16);
    let pipeline1 = scene.game.renderer.addPipeline('pipeline2', tmpPipeline)
    scene.cameras.main.setRenderToTexture(pipeline1)

    //scene.cameras.main.zoom = 1
}
