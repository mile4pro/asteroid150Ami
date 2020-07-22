

let scene,
    bulletMagazine, gun1, debugText = [], testObj = {test1: 0, test2: 0},
    tmpPointA = {x: 18, y: 10}

export default class BulletsMagazine
{
    constructor()
    {

    }
}






function makeBulletMagazineChain()
{
    let tmpPrev, tmpPosY = 50, tmpStatck
    tmpPointA.y = tmpPosY
    bulletMagazine.max = 20
    bulletMagazine.mainJoint = tmpPointA

    /*tmpStatck  = scene.matter.add.stack(10, 18, 1, bulletMagazine.max, 0, 11, (argX, argY)=>{
        let tmpObj = scene.matter.add.image(argX, argY, 'bullet1', null, { mass: 0.01 })
        bulletMagazine.img.push(tmpObj)
        return tmpObj
    })*/
    for(let i=0; i<bulletMagazine.max; i++)
    {
        //bulletMagazine.bullet[i] = scene.add.image(18, 10 + 11*i, 'bullet1')
        bulletMagazine.img[i]  = scene.matter.add.image(18, tmpPosY, 'bullet1', null, { mass: 0.01, render: {visible: true} })
        bulletMagazine.img[i].setFixedRotation()
        //bulletMagazine.img[i].debugShowBody = false
        if (i>0)
        {
            //bulletMagazine.bullet[i] = scene.matter.add.joint(tmpPrev, bulletMagazine.img[i], 10, 1, {render: {visible: true}})
            bulletMagazine.bullet[i] = scene.matter.add.constraint(tmpPrev, bulletMagazine.img[i], 10, 1, {damping: 0.1, render: {visible: true}})
            //bulletMagazine.bullet[i].debugShowBody = false
        }
        else
        {
            scene.matter.add.worldConstraint(bulletMagazine.img[i], 0, 1, { pointA: bulletMagazine.mainJoint, damping: 0 })
        }
        tmpPrev = bulletMagazine.img[i]
        tmpPosY += 11;
        //bulletMagazine.img[i].setPipeline('Light2D')
        bulletMagazine.img[i].setTint(0x777777)
    }
    bulletMagazine.count = bulletMagazine.max
    bulletMagazine.countLast = bulletMagazine.count
}


function updateBulletsMagazinChain()
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
