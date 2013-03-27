var cocos = require('cocos2d')
  , geom  = require('geometry')
  , util  = require('util')

function Ball () {
    Ball.superclass.constructor.call(this)

    var sprite = new cocos.nodes.Sprite({
                     file: '/resources/sprites.png',
                     rect: new geom.Rect(64, 0, 16, 16)
                 })

    sprite.anchorPoint = new geom.Point(0, 0)
    this.addChild({child: sprite})
    this.contentSize = sprite.contentSize

    this.velocity = 200
    this.angle    = Math.PI/3
    this.scheduleUpdate()
}

Ball.inherit(cocos.nodes.Node, {
    velocity: null,

    update: function (dt) {
        var pos = util.copy(this.position),
            vel = util.copy(this.velocity),
            phi = util.copy(this.angle)

        // Test X position
        if (!this.testBlockCollision('x', dt * vel * Math.cos(phi))) {
            // Adjust X position
            pos.x += dt * vel * Math.cos(phi)
            this.position = pos
        }

        // Test Y position
        if (!this.testBlockCollision('y', -dt * vel * Math.sin(phi))) {
            // Adjust Y position
            pos.y -= dt * vel * Math.sin(phi)
            this.position = pos
        }

        // Test Edges and bat
        this.testBatCollision()
        this.testEdgeCollision()
    },

    testBatCollision: function () {
        var velocity = util.copy(this.velocity),
            phi      = util.copy(this.angle),
            ballBox = this.boundingBox,
            // The parent of the ball is the Breakout Layer, which has a 'bat'
            // property pointing to the player's bat.
            batBox = this.parent.bat.boundingBox

        vel = new geom.Point(velocity * Math.cos(phi), velocity * Math.sin(phi))

        // If moving down then check for collision with the bat
        if (vel.y > 0) {
            if (geom.rectOverlapsRect(ballBox, batBox)) {
                // Flip Y velocity
                vel.y *= -1
                console.log('Hit pad')
                this.angle = Math.PI*2-Math.asin(vel.y/velocity)
            }
        }
    },

    testEdgeCollision: function () {
        var velocity = util.copy(this.velocity),
            phi      = util.copy(this.angle),
            ballBox  = this.boundingBox,
            // Get size of canvas
            winSize = cocos.Director.sharedDirector.winSize

        vel = new geom.Point(velocity * Math.cos(phi), velocity * Math.sin(phi))

        // Moving left and hit left edge
        if (vel.x < 0 && geom.rectGetMinX(ballBox) < 0) {
            // Flip X velocity
            console.log("Hit left edge")
            vel.x *= -1
            this.angle = Math.acos(vel.x/velocity)
        }

        // Moving right and hit right edge
        if (vel.x > 0 && geom.rectGetMaxX(ballBox) > winSize.width) {
            // Flip X velocity
            vel.x *= -1
            console.log("Hit right edge, phi: " + phi + " phi2: " + phi2)
            this.angle = Math.acos(vel.x/velocity)
        }

        // Moving up and hit top edge
        if (vel.y < 0 && geom.rectGetMaxY(ballBox) > winSize.height) {
            // Flip Y velocity
            console.log("Hit top edge")
            vel.y *= -1
            this.angle = Math.PI*2-Math.asin(vel.y/velocity)
        }

        // Moving down and hit bottom edge - DEATH
        if (vel.y > 0 && geom.rectGetMaxY(ballBox) < 0) {
            // Restart game
            this.parent.restart()
        }
    },

    testBlockCollision: function (axis, dist) {
        var velocity = util.copy(this.velocity),
            phi = this.angle,
            box = this.boundingBox,
            // A map is made of mulitple layers, but we only have 1.
            mapLayer = this.parent.map.children[0]

        vel = new geom.Point(velocity * Math.cos(phi), velocity * Math.sin(phi))

        // Get size of canvas
        var s = cocos.Director.sharedDirector.winSize

        // Add the amount we're going to move onto the box
        box.origin[axis] += dist

        // Record which blocks were hit
        var hitBlocks = []

        // We will test each corner of the ball for a hit
        var testPoints = {
            nw: util.copy(box.origin),
            sw: new geom.Point(box.origin.x, box.origin.y + box.size.height),
            ne: new geom.Point(box.origin.x + box.size.width, box.origin.y),
            se: new geom.Point(box.origin.x + box.size.width, box.origin.y + box.size.height)
        }

        for (var corner in testPoints) {
            var point = testPoints[corner]

            // All our blocks are 32x16 pixels
            var tileX   = Math.floor(point.x / 32),
                tileY   = Math.floor((s.height - point.y) / 16),
                tilePos = new geom.Point(tileX, tileY)

            // Tile ID 0 is an empty tile, everything else is a hit
            if (mapLayer.tileGID(tilePos) > 0) {
                hitBlocks.push(tilePos)
            }
        }

        // If we hit something, swap directions
        if (hitBlocks.length > 0) {
            console.log("Hit a block in " + axis + "-direction")
            vel[axis] *= -1

            if (axis == 'y') {
                this.angle = Math.asin(vel.y/velocity)
            } else if (axis == 'x') {
                this.angle = Math.acos(vel.x/velocity)
            }
        }

        // Remove the blocks we hit
        for (var i=0; i<hitBlocks.length; i++) {
            mapLayer.removeTile(hitBlocks[i])
        }

        hitBlocks.length > 0 && console.log("Hit " + hitBlocks.length + " bricks.")
        return (hitBlocks.length > 0)
    }
})

module.exports = Ball