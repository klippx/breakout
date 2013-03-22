// Import the cocos2d module
var cocos  = require('cocos2d')
  , events = require('events')
  , geom   = require('geometry')
  , Bat    = require('/Bat')
  , Ball   = require('/Ball')

/**
 * @class Initial application layer
 * @extends cocos.nodes.Layer
 */
function Breakout () {
    // You must always call the super class version of init
    Breakout.superclass.constructor.call(this)

    this.isMouseEnabled = true

    // Get size of canvas
    var s = cocos.Director.sharedDirector.winSize

    // Add Bat
    var bat = new Bat()
    bat.position = new geom.Point(160, s.height - 280)
    this.addChild(bat)
    this.bat = bat

    // Add Ball
    var ball = new Ball()
    ball.position = new geom.Point(140, s.height - 210)
    this.addChild(ball)
    this.ball = ball

    // Add Map
    var map = new cocos.nodes.TMXTiledMap({file: '/resources/level1.tmx'})
    map.position = new geom.Point(0, s.height - map.contentSize.height)
    this.addChild(map)
    this.map = map
}

Breakout.inherit(cocos.nodes.Layer, {
    bat: null,
    ball: null,

    mouseMoved: function (evt) {
        var bat = this.bat

        var batPos = bat.position
        batPos.x = evt.locationInCanvas.x
        bat.position = batPos
    },

    restart: function () {
        var director = cocos.Director.sharedDirector

        // Create a scene
        var scene = new cocos.nodes.Scene()

        // Add our layer to the scene
        scene.addChild(new Breakout())

        director.replaceScene(scene)
    }
})

/**
 * Entry point for the application
 */
function main () {
    // Initialise application

    // Get director singleton
    var director = cocos.Director.sharedDirector

    // Wait for the director to finish preloading our assets
    events.addListener(director, 'ready', function (director) {
        // Create a scene and layer
        var scene = new cocos.nodes.Scene()
          , layer = new Breakout()

        // Add our layer to the scene
        scene.addChild(layer)

        // Run the scene
        director.replaceScene(scene)
    })

    // Preload our assets
    director.runPreloadScene()
}


exports.main = main
