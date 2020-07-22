
let ship,
    keyCursors, keySpacebar,
    debugText1;


class StartGame extends Phaser.Scene
{
    create()
    {
        //ship = this.physics.add.sprite(100, 100, "ship3");
        ship = this.matter.add.sprite(100, 100, "ship3")
        //ship = this.physics.add.group();
        //ship.setVelocity(100, 76);
        /*ship.setCollideWorldBounds(true);
        ship.setBounce(.15);

        ship.setDrag(100, 100);
        //ship.setGravity(0, 300);
        ship.setGravityY(300);
        //ship.body.maxVelocity = new Phaser.Math.Vector2(300, 300);
        ship.body.setMaxVelocity(300, 300);
        ship.body.setFrictionX(5);

        ship.body.rotation = 100; */
        //ship.setFriction(100, 100);
        //ship.debugShowVelocity = true;

        keyCursors = this.input.keyboard.createCursorKeys();
        //keySpacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        debugText1 = this.add.text(20, 20, "start game...");
        console.log('startGame...')

        this.input.keyboard.once('keydown-Y', testKeyboardCallback)
    }

    update()
    {
        //moveShip();
        //debugCheck();
    }
}


function moveShip()
{
    let speedX = 0, speedY = 0, speed = 1000;

    if(keyCursors.right.isDown)
    {
        speedX += speed;
    }
    if(keyCursors.left.isDown)
    {
        speedX -= speed;
    }
    if(keyCursors.up.isDown)
    {
        speedY -= speed;
    }
    if(keyCursors.down.isDown)
    {
        speedY += speed;
    }

    //ship.setVelocity(speedX, speedY);
    ship.setAcceleration(speedX, speedY);
    //ship.applyForce(new Phaser.Math.Vector2(speedX, speedY));
}


function debugCheck()
{
    let text = '...';
    if (ship.body.onCeiling())
    {
        text += '...sufit';
    }
    if (ship.body.onFloor())
    {
        text += '...podłoga';
    }
    if (ship.body.onWall())
    {
        text += '...ściana';
    }
    debugText1.text = text;
}


function testKeyboardCallback()
{
    ship.destroy()
    debugText1.destroy()
    //this.input.keyboard.off('keydown-T', testKeyboardCallback)
    this.game.scene.start('physicTest')
}

export default StartGame;
