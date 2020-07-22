import ShipsMngr from '../managers/ShipsMngr.js'

let scene,
    stars = [],
    blendType = [], blendTypeHwMn = 4,
    frameName = [], frameNameHwMn = 4,
    rectangle, ellipse, scaleCheck = 0, speedX = 10,
    warpSpeedFL = false, warpMaxSpeed = 5000,
    tmpRndNebulaStars, newNebulaFL = false, newNebulaCount = 0, actualNebulaIndxSize = 0,
    fpsSpanIdDOM,
    ship, actualSpeed = 0

export default class StarsBackgroudImgType
{

    constructor(sceneArg)
    {
        console.log("StarsBackgroudImgType constructor...")
        scene = sceneArg
        makeObjects()
        tmpRndNebulaStars = Phaser.Math.RND.between(20, 50)
        actualNebulaIndxSize = tmpRndNebulaStars
        makeNebula(tmpRndNebulaStars, Phaser.Math.RND.between(300, 400), Phaser.Math.RND.between(150, 250))
        tmpRndNebulaStars = Phaser.Math.RND.between(20, 50)
        //makeNebula(20, 290, 175)
        //makeNebula(15, 280, 125)
        makeConsoleDevelopHelper()
        ship = new ShipsMngr(scene)
    }


    updatePublic(argDelta)
    {
        updatePrivate(argDelta)
        updateConsoleDevelopHelper()
        ship.update(actualSpeed)
    }
}



function makeNebula(argHwMn, argPosX, argPosY)
{

    blendType[0] = Phaser.BlendModes.ADD,
    blendType[1] = Phaser.BlendModes.SCREEN,
    blendType[2] = Phaser.BlendModes.MULTIPLY
    blendType[3] = blendType[0]
    blendType[4] = blendType[0]
    blendTypeHwMn = blendType.length

    frameName.push('blue')   //frameName[0] = 'blue'
    frameName.push('white')  //frameName[1] = 'white'
    frameName.push('red') //frameName[2] = 'red'
    //frameName[3] = 'white'
    frameName.push('yellow')   //frameName[4] = 'yellow'
    //frameName[5] = frameName[3]
    //frameName[6] = frameName[3]
    frameName.push('white')
    frameName.push('white')
    frameName.push('white')
    frameName.push('blue')
    frameName.push('blue')
    frameNameHwMn = frameName.length

    //let tmpEllipse = new Phaser.Geom.Ellipse(argPosX, argPosY, Phaser.Math.RND.between(25, 125), Phaser.Math.RND.between(25, 125))
    //let tmpEllipsePoints = tmpEllipse.getPoints(50)

    ellipse.setTo(argPosX, argPosY, Phaser.Math.RND.between(25, 125), Phaser.Math.RND.between(25, 125))

    for (let i=0; i<argHwMn; i++)
    {
        let tmpRndFrameName = Phaser.Math.RND.between(0, frameNameHwMn)
        //console.log("tmpRndFrameName: " + tmpRndFrameName)

        let tmpPoint = Phaser.Geom.Ellipse.Random(ellipse) //or tmpEllipse.getRandomPoint()
        //let tmpPoint = ellipse.getRandomPoint()

        let tmpStar = scene.add.image(tmpPoint.x, tmpPoint.y, 'flares', frameName[tmpRndFrameName])
        //let tmpStar = scene.add.image(argPosX + Phaser.Math.RND.between(0, 7)*i, argPosY, 'flares', frameName[tmpRndFrameName])

        let tmpRndBlendType = Phaser.Math.RND.between(0, blendTypeHwMn)
        //console.log("tmpRndBlendType: " + tmpRndBlendType)
        tmpStar.setBlendMode(blendType[tmpRndBlendType])

        let tmpRndScale = Phaser.Math.RND.realInRange(0.1, .5)
        //console.log("tmpRndScale: " + tmpRndScale)
        tmpStar.setScale(tmpRndScale)

        let tmpRndAlpha = Phaser.Math.RND.realInRange(0.15, .75)
        //console.log("tmpRndAlpha: " + tmpRndAlpha)
        tmpStar.setAlpha(tmpRndAlpha)

        /*let tmpRndOffsetY = Phaser.Math.RND.between(-7, 7)
        console.log("tmpRndOffsetY: " + tmpRndOffsetY)
        tmpStar.y += tmpRndOffsetY*/

        stars.push(tmpStar)
    }

    //Phaser.Actions.SetScaleX(stars, 1, 10)

    //Phaser.Actions.RandomEllipse(stars, tmpEllipse)   //też umieszcza tablice obiektow w elipsie, to samo co w pętli powyżej

    //let tmpRectangle = new Phaser.Geom.Rectangle(0, -20, 1280, 380)
    for (let i=0; i<argHwMn*4; i++)
    {
        let tmpRndFrameName = Phaser.Math.RND.between(0, frameNameHwMn)
        //console.log("tmpRndFrameName: " + tmpRndFrameName)

        let tmpPoint = Phaser.Geom.Rectangle.Random(rectangle) //or tmpEllipse.getRandomPoint()
        //let tmpPoint = ellipse.getRandomPoint()

        let tmpStar = scene.add.image(tmpPoint.x, tmpPoint.y, 'flares', frameName[tmpRndFrameName])
        //let tmpStar = scene.add.image(argPosX + Phaser.Math.RND.between(0, 7)*i, argPosY, 'flares', frameName[tmpRndFrameName])

        let tmpRndBlendType = Phaser.Math.RND.between(0, blendTypeHwMn)
        //console.log("tmpRndBlendType: " + tmpRndBlendType)
        tmpStar.setBlendMode(blendType[tmpRndBlendType])

        let tmpRndScale = Phaser.Math.RND.realInRange(0.05, .2)
        //console.log("tmpRndScale: " + tmpRndScale)
        tmpStar.setScale(tmpRndScale)

        let tmpRndAlpha = Phaser.Math.RND.realInRange(0.15, .55)
        //console.log("tmpRndAlpha: " + tmpRndAlpha)
        tmpStar.setAlpha(tmpRndAlpha)

        /*let tmpRndOffsetY = Phaser.Math.RND.between(-7, 7)
        console.log("tmpRndOffsetY: " + tmpRndOffsetY)
        tmpStar.y += tmpRndOffsetY*/

        stars.push(tmpStar)
    }

    /*stars[0].y += 2
    stars[1].y += -2
    stars[2].y += 12
    stars[3].y += 0
    stars[4].y += 2

    stars[0].setFrame("red")
    stars[1].setFrame("blue")
    //stars[2].setFrame("green")
    stars[3].setFrame("red")
    stars[4].setFrame("yellow")*/

    /*stars[0].setBlendMode(Phaser.BlendModes.ADD)
    stars[1].setBlendMode(Phaser.BlendModes.ADD)
    stars[2].setBlendMode(Phaser.BlendModes.SCREEN)
    stars[3].setBlendMode(Phaser.BlendModes.MULTIPLY)
    stars[4].setBlendMode(Phaser.BlendModes.ADD)*/
}



function updatePrivate(argDelta)
{
    let tmpSpeedX = (argDelta/1000) * speedX
    actualSpeed = tmpSpeedX
    Phaser.Actions.IncX(stars, -tmpSpeedX)//
    for (let indx in stars)
    {
        //stars[indx].x -= tmpSpeedX
        if (scaleCheck < 215 && scaleCheck > 150)
        {
            stars[indx].scaleX += .05
            stars[indx].scaleY += .00075
        }
        if (stars[indx].x < -300)
        {
            if (indx > tmpRndNebulaStars)
            {
                stars[indx].setPosition(Phaser.Geom.Rectangle.Random(rectangle).x + 640, Phaser.Geom.Rectangle.Random(rectangle).y)
            }
            else
            {
                newNebulaCount +=1
                if (newNebulaCount > tmpRndNebulaStars-1)
                {
                    newNebulaFL = true
                }
            }

            if (newNebulaFL)
            {
                ellipse.setTo(Phaser.Math.RND.between(840, 1280), Phaser.Math.RND.between(0, 360), Phaser.Math.RND.between(25, 125), Phaser.Math.RND.between(25, 125))
                for(let i = 0; i<tmpRndNebulaStars; i++)
                {
                    let tmpPoint = Phaser.Geom.Ellipse.Random(ellipse)
                    stars[i].setPosition(tmpPoint.x, tmpPoint.y)
                }
                tmpRndNebulaStars = Phaser.Math.RND.between(20, 50)
                actualNebulaIndxSize = newNebulaCount
                newNebulaCount = 0
                newNebulaFL = false
            }
        }
    }

    scaleCheck += 1

    if (scaleCheck <500 && scaleCheck > 150 && speedX < warpMaxSpeed) {speedX += 25, warpSpeedFL = true}

    if (scaleCheck > 500 && speedX > 110)
    {
        speedX -= 100
        if (speedX < 750)
        {
            for (let indx in stars)
            {
                stars[indx].scaleY -= .0075
                if(stars[indx].scaleX > stars[indx].scaleY) stars[indx].scaleX -= 1
                else stars[indx].scaleX = stars[indx].scaleY
            }
        }
        if(speedX < 200)
        {
            for (let indx in stars)
            {
                let tmpRndScale, tmpRndAlpha
                if (indx > actualNebulaIndxSize)
                {
                    tmpRndScale = Phaser.Math.RND.realInRange(0.05, .2)
                    tmpRndAlpha = Phaser.Math.RND.realInRange(0.15, .55)
                }
                else
                {
                    tmpRndScale = Phaser.Math.RND.realInRange(0.1, .5)
                    tmpRndAlpha = Phaser.Math.RND.realInRange(0.15, .75)
                }
                //console.log("tmpRndScale: " + tmpRndScale)
                stars[indx].setScale(tmpRndScale)
                stars[indx].setAlpha(tmpRndAlpha)

                //stars[indx].scaleY = Phaser.Math.RND.realInRange(0.05, .2)
                //stars[indx].scaleX = stars[indx].scaleY
            }
            speedX = 10
        }
    }

    /*if (scaleCheck > 1500 && speedX <20)
    {
        for (let indx in stars)
        {
            if (stars[indx].scaleX > .4)
            {
                stars[indx].scaleX -= .05
                stars[indx].scaleY -= .005
            }
        }
    }*/

    if (scaleCheck > 800) scaleCheck = 0
}



function makeObjects()
{
    //rectangle = scene.add.rectangle(-100, -100, 840, 600)
    rectangle = new Phaser.Geom.Rectangle(0, -20, 1280, 380)
    //ellipse =scene.add.ellipse(320, 180, 250, 100)//, 0xff0000)
    ellipse = new Phaser.Geom.Ellipse(0, 0, Phaser.Math.RND.between(25, 125), Phaser.Math.RND.between(25, 125))
    //ellipse.setAngle(-30)
    console.log("E L L I P S E")
    console.dir(ellipse)
}


function makeConsoleDevelopHelper()
{
    fpsSpanIdDOM = document.getElementById('fpsSpanId')
    fpsSpanIdDOM.innerText = '456'

    scene.input.keyboard.once('keydown-N', changeState)
    scene.input.keyboard.once('keydown-T', changeState)
}

function updateConsoleDevelopHelper()
{
    fpsSpanIdDOM.innerText = scene.game.loop.actualFps.toFixed().toString()
}



function changeState(arg)
{
    console.log("C H A N G E   S T A G E")
    console.dir(arg)

    resetDataWarpSpeed()

    if(arg.keyCode == 78)   //N
    {
        scene.game.scene.stop('testStateBackgroudStars')
        scene.game.scene.start('physicTest')
    }
    else if(arg.keyCode == 84)  //T
    {
        scene.game.scene.stop('testStateBackgroudStars')
        scene.game.scene.start('testShipOnRocket')
    }
}

function resetDataWarpSpeed()
{
    speedX = 10
    scaleCheck = 0
}
