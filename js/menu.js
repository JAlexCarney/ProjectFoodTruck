var Menu = function(game){};
Menu.prototype = {
	create: function() {
		// place assets and initialize variables
		game.add.image(0,0,'menuBackdrop');

		//load UIselect noise
		this.selectNoise = game.add.audio('select');

		// place a button
			// on press funtion
		var startGame = function(){
			//play select noise upon clicking button
			this.selectNoise.play('', 0, 1, false);
			// start play by first showing controls if they haven't been seen.
			if(hasSeenControls && hasSeenComic){
				game.state.start('Play');
			}else if(!hasSeenControls && !hasSeenComic){
				//still take them there for now... lol
				game.state.start('Comic', true, false, true);
			}else if(hasSeenComic){
				game.state.start('Controls', true, false, true);
			}else if(hasSeenControls){
				//still take them there for now... lol
				game.state.start('Comic', true, false, true);
			}
		};
			// button object
		this.start = game.add.sprite( 250, 160,'atlas', 'button_play');
		this.start.inputEnabled = true;
		this.start.events.onInputDown.add(startGame, this);
		
		// place a button
			// on press funtion
		var openControls = function(){
			//play select noise upon clicking button
			this.selectNoise.play('', 0, 1, false);
			game.state.start('Controls', true, false, false);
		};
			// button object
		this.controls = game.add.sprite( 500, 160,'atlas', 'button_controls');
		this.controls.inputEnabled = true;
		this.controls.events.onInputDown.add(openControls, this);
		
		// place a button
			// on press funtion
		var openCredits = function(){
			//play select noise upon clicking button
			this.selectNoise.play('', 0, 1, false);
			game.state.start('Credits');
		};
			// button object
		this.options = game.add.sprite( 750, 160,'atlas', 'button_credits');
		this.options.inputEnabled = true;
		this.options.events.onInputDown.add(openCredits, this);
	}
}
