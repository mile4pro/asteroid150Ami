

let scene, ship, shipWarpSpeedEffectImgs = [],
keyCursors, objectsPhysicVerts


export default class ShipMngr
{
    constructor(sceneArg)
    {
        scene = sceneArg
        objectsPhysicVerts = scene.cache.json.get('objectsPhysicVerts')
        makeControlKeys()
        makeShip()

        scene.matter.world.drawDebug = !scene.matter.world.drawDebug
        scene.matter.world.debugGraphic.visible  = scene.matter.world.drawDebug
    }

    update(shipSpeedArg)
    {
        moveShip()
        checkWarpSpeedShipEffect(shipSpeedArg)
    }
}



function makeShip()
{

    ship = scene.matter.add.sprite(150, 150, "ship3", false, objectsPhysicVerts.ship04)

    ship.setMass(5);
    //ship.setBody(type: "fromVerts", verts: shipVerts, flagInternal: true)
    ship.setFixedRotation()
    ship.setFrictionAir(.2)
    //ship.setAngle(shipAngle)

    //ship.setCollisionCategory(collisiionCategory1)
    ship.setOnCollide(()=>console.log('T E S T  C A L L B A C K'))  //not working?
    //ship.setPipeline('Light2D')
    for(let i=0; i<5; i++)
    {
        shipWarpSpeedEffectImgs[i] = scene.add.image(200 + 20 * i, 200, 'ship3')
    }
}



function makeControlKeys()
{
    keyCursors = scene.input.keyboard.createCursorKeys()
}



function moveShip()
{
    //console.log("ShipMngr UPDATE")
    let speedX = 0, speedY = 0, speed = .025,
        particleSee = 2, particleSeeHwMn = 2, particleSpeed = 0, particleTime = 0,
        shipVelocityY = 0, shipSpeedY = 2000,
        moveFL = false

    let speedThrust = 0

    if(keyCursors.right.isDown) //&& ship.body.velocity.x < 10)
    {
        speedX += speed
        particleSee = particleSeeHwMn
        particleSpeed = 250
        particleTime = 1400
        moveFL = true
        speedThrust = -.038
        //console.log("ShipMngr key RIGHT")
    }
    if(keyCursors.left.isDown) //&& ship.body.velocity.x > -10)
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
    if(keyCursors.up.isDown)
    {
        //speedY += speed
        shipVelocityY = -shipSpeedY
        ship.applyForce(new Phaser.Math.Vector2(0, -.033))
        //ship.thrustLeft(.045)
    }
    if(keyCursors.down.isDown)
    {
        //speedY -= speed/10
        //ship.setAngle(30);
        shipVelocityY = shipSpeedY
        ship.applyForce(new Phaser.Math.Vector2(0, .033))
        //ship.thrustLeft(-.045)
    }

    let posLeftShip = ship.getLeftCenter()
    //let posTopLeftShip = ship.getTopLeft()
    //let shipPosEngine = posTopLeftShip.lerp(posLeftShip, 0.7)
    let posRightShip = ship.getRightCenter()

    let posRightBottom = ship.getBottomRight()
    let posRightUp = ship.getTopRight()
    let forceShipBottomEngine = posRightBottom.subtract(posRightUp).normalize()

    forceShipBottomEngine.x *= -speedY
    forceShipBottomEngine.y *= speedY


    let forceShip = posRightShip.subtract(posLeftShip).normalize()     //zamiana kąta nachylanie statku na znormalizowany vector

    forceShip.x *= speedX
    forceShip.y *= speedX

    if (moveFL) ship.thrustBack(speedThrust)

    //checkShipAngle();

}


function checkWarpSpeedShipEffect(shipSpeedArg)
{
    console.log("checkWarpSpeedShipEffect speed: " + shipSpeedArg)
    if (shipSpeedArg > 1)
    {
        let alphaTmp = shipSpeedArg/256
        ship.setAlpha(1 - alphaTmp)
        shipWarpSpeedEffectImgs.forEach((elem, indx)=>
        {
            elem.setVisible(true)
            elem.x = ship.x - indx/8 * shipSpeedArg
            elem.y = ship.y
            elem.setAlpha(alphaTmp)
        })
    }
    else
    {
        ship.setAlpha(1)
        shipWarpSpeedEffectImgs.forEach((elem, indx)=>
        {
        elem.setVisible(false)
        })
    }
}
