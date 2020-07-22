import StarsBackgroud from '../features/StarsBackgroud.js'
import StarsBackgroudImgType from '../features/StarsBackgroundImgType.js'


let stars, starsImg, starsImgFL = true


export default class testStateBackgroudStars extends Phaser.Scene
{

    preload()
    {

    }



    create()
    {
        //this.scene.start('userInterface')

        if (starsImgFL) stars = new StarsBackgroudImgType(this)
        else stars = new StarsBackgroud(this)

    }



    update(time, delta)
    {
        stars.updatePublic(delta)
    }

}
