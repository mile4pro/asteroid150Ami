import BootGame from './state/BootGame.js'
import StartGame from './state/StartGame.js'
import PhysicTest from './state/PhysicTest.js'
import testShipOnRocket from './state/testShipOnRocket.js'
import UserInterface from './state/UserInterface.js'
import testStateBackgroudStars from './state/testStateBackgroudStars.js'


class InitGame
{
    constructor(configArg)
    {
        this.game = new Phaser.Game(configArg)
        this.game.scene.add('boot', BootGame)
        this.game.scene.add('start', StartGame)
        this.game.scene.add('physicTest', PhysicTest)
        this.game.scene.add('testShipOnRocket', testShipOnRocket)
        this.game.scene.add('userInterface', UserInterface)
        this.game.scene.add('testStateBackgroudStars', testStateBackgroudStars)
        this.game.scene.start('boot')
    }
}

export default InitGame;
