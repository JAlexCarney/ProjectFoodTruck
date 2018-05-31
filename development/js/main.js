// create the game object with a...
// resolution (1:2 rectangle)
var game;

window.onload = function(){
	game = new Phaser.Game(1024, 1024, Phaser.AUTO, 'foodtruck-game');
	game.state.add('Preload', Preload);
	game.state.add('Boot', Boot);
	game.state.add('Menu', Menu);
	game.state.add('Controls', Controls);
	game.state.add('Play', Play);
	game.state.add('Over', Over);
	game.state.add('Credits', Credits);
	game.state.start('Boot');
}

// Boot and preloader adapted from nathans source code on asset loading (assets03.js).
var Boot = function(game){};
Boot.prototype = {
	init: function() {
		// keep game running when not active browser.
		this.stage.disableVisibilityChange = true;
	},

	preload: function() {
		// load minimal assets needed for loading bar
		this.load.image('load', 'assets/img/load.png')
	},

	create: function() {
		// precede to preloader
		game.state.start('Preload');
	}
}

var Preload = function(game){};
Preload.prototype = {
	preload: function() {
		// set appropriate background color
		game.stage.backgroundColor = "#ffffff";

		// display text
		this.add.text(475, 300, 'Loading...', {fontSize: '32px', fill: 'black'});

		// add preloader bar and set as preloader sprite (auto-crops sprite)
		this.preloadBar = this.add.sprite(this.world.centerX-256, this.world.centerY-64,'load');
		this.load.setPreloadSprite(this.preloadBar);

		// load assets into cache
			// load texture atlas
		game.load.atlas('atlas', 'assets/img/spritesheet.png', 'assets/img/sprites.json');
			// load menu backdrop
		game.load.image('menuBackdrop', 'assets/img/titleScreen.png');
      //load dialog JSON file
		game.load.text('dialog', 'js/day1dialog.json');


		//load audio files
		  //ambient noise
		game.load.audio('ambientNoise', 'assets/audio/tokyoSupermarket.ogg');
		  //load UI select SFX
		game.load.audio('select', 'assets/audio/UIselect.ogg');
		  // grab sound
		game.load.audio('grab', 'assets/audio/grab.ogg');
	},

	update: function() {
		// wait for first ogg to properly decode
		this.state.start('Menu');
	}
}

var Over = function(game){};
Over.prototype = {

	preload: function() {
		// load assets into cache
	},

	create: function() {
		// place assets
	},

	update: function() {
		// run game loop
	}
}