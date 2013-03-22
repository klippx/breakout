var cocos = require('cocos2d')
  , geom  = require('geometry')

function Bat () {
  Bat.superclass.constructor.call(this)

  var sprite = new cocos.nodes.Sprite({
                  file: '/resources/sprites.png',
                  rect: new geom.Rect(0, 0, 64, 16)
               })

  sprite.anchorPoint = new geom.Point(0, 0)
  this.addChild({child: sprite})
  this.contentSize = sprite.contentSize
}

Bat.inherit(cocos.nodes.Node)

module.exports = Bat