

export default class BootGame extends Phaser.Scene
{
    preload()
    {
        //this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d')

        this.load.json('objectsPhysicVerts', 'script/config/objectsPhysicVerts.json')

        this.load.image("shipRed", "asset/ships/shipRed.png")
        this.load.image("rocketRed", "asset/ships/rocketRed.png")
        this.load.image("ship3", ["asset/ships/ship05redR.png", "asset/ships/ship05redRnormalMaps.png"])
        this.load.image("ship3-shadow", "asset/ships/ship05redR-shadow.png")
        this.load.image("planet", "asset/planets/planet.png")
        this.load.image("fullScreenStartIcon", "asset/other/fullScreenStartIcon.png")
        this.load.image("winietaCam1", "asset/other/winietaCam1.png")
        this.load.image("sun01", "asset/other/sun.png")
        this.load.image("moon01", ["asset/other/moon01.png", "asset/other/moon01-n.png"])
        this.load.image("moon01-shadowX4", "asset/other/moon01-shadowX4.png")
        this.load.image("mouseCursor1", "asset/other/mouseCursor1.png")
        this.load.image("earth1euro", ["asset/other/earth1euro.png", "asset/other/earth1euro-normal.png"])

        this.load.image("miniGun1", ["asset/other/miniGun1.png", "asset/other/miniGun1-normal.png"])
        this.load.image("bullet1", ["asset/other/bullet1.png", "asset/other/bullet1-normal.png"])
        this.load.image("bullet1-shell", ["asset/other/bullet1-shell.png", "asset/other/bullet1-shell-normal.png"])

        this.load.image("oldTv01", "asset/other/oldTv01.png")

        this.load.atlas('asteroids', ['asset/asteroids/asteroids.png', 'asset/asteroids/asteroids-n.png'], 'asset/asteroids/asteroids.json')
        this.load.atlas('flares', 'asset/particles/flares.png', 'asset/particles/flares.json')
        this.load.atlas('okAtlasPeacesAst1Gray8', 'asset/asteroids/okAtlasPeacesAst1Gray8.png', 'asset/asteroids/okAtlasPeacesAst1Gray8.json')
        this.load.atlas('shotLight', ['asset/other/shotLight.png', 'asset/other/shotLight-normal.png'], 'asset/other/shotLight.json')

        this.load.glsl('testShader1', 'script/project/shaders/testShader1.glsl.js')
        this.load.glsl('testShader2', 'script/project/shaders/testShader2.glsl.js')
        this.load.glsl('testShader3', 'script/project/shaders/testShader3.glsl.js')
        this.load.glsl('testShader4', 'script/project/shaders/testShader4.glsl.js')
        this.load.glsl('testShader5', 'script/project/shaders/testShader5.glsl.js')
        this.load.glsl('testShader5UserInterface', 'script/project/shaders/testShader5UserInterface.glsl.js')
    }

    create()
    {
        //this.scale.scaleMode = Phaser.Scale.HEIGHT_CONTROLS_WIDTH
        //this.scale.scaleMode = Phaser.Scale.WIDTH_CONTROLS_HEIGHT
        //this.scale.scaleMode = Phaser.Scale.FIT
        //this.scale.setParentSize(1280, 720)
        console.log("scale log: " + this.scale.parent.id)
        console.log("scale log: " + this.scale.parentSize)

        //console.log(this.cache.json.get('objectsPhysicVerts'));
        //this.scale.width = 1280
        //this.scale.height = 720
        //this.scale.setGameSize(1280, 720)

        //this.scale.autoCenter = Phaser.Scale.CENTER_BOTH
        this.add.text(20, 20, "boot game...")
        console.log('initGame...')
        //this.scene.start('testStateBackgroudStars')
        this.scene.start('physicTest')
        //this.scene.start('userInterface')
    }
}
