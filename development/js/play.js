// cook's paws are temporarly going to be globals so they can be seen by the pickupables pre-fab
var leftPaw;
var rightPaw;

var Play = function(game){
	//Dialog System constants that will save my Life
	//credit to Nathan's dialogue example from lecture

	this.DBOX_X = 256; //dialog box x-position
	this.DBOX_Y = 96; //dialog box y-position

	this.TEXT_X = 150;//dialog text x-position
	this.TEXT_Y = 30;//dialog text y-position
	this.TEXT_STYLE = { font: 'bold 12px Courier New', fill: '#000000', align:
	 "center",  boundsAlignH: "center", boundsAlignV: "middle"
}; //text style inside of speech bubble
	this.TEXT_MAX_WIDTH = 290; //max width of text within box

	this.NEXT_TEXT = '[...]'; //text to display to prompt user response
	this.NEXT_X = 340; //next prompt x position
	this.NEXT_Y = 350; //next prompt y position

	this.LETTER_TIMER = 10; // # of ms each letter takes to "type" onscreen
	this.LETTER_TIMER_SLOW = 50; // a slow one to nerf the speed readers

  //this.ORDER_TIMER = //180000; //time limit to prepare an order; set to 3 minutes

	//dialog variables specifically
	this.dialogConvo = 0; //current "convo"
	this.dialogLine = 0; //current line
	this.customer = null; //current customer
	this.lastCustomer = null; //last customer
	this.isDialogTyping = false; //lock player input while text is being typed out
	this.dialogText = null; //actual dialog text
	this.nextText = null; //prompt for player response
	this.dialogClick = false; //detect player response
	this.customerDonezo = false; //detect if a customer is Donezo

	//other dialogue to fit the modulus dialogue system mess around
	this.pauseDialog = false; //pause dialogue call
	this.orderTime = 30000; //order timer temp set to 30 seconds
	this.isRunningLate = false; //keeps track if late(half way passed order) dialogue was accessed
	this.isOrderFinished = false; //keeps track if the player completed order (correctly)

	// this.lateTimer = null; //will be used for determine if player is late
	// this.finishedTimer = null; //will be used to time player

	//x value to place characters offscreen to the right
	  //y values not here to keep consistent with a customer's y value
	this.RIGHT_OFFSCREEN_X = 1400;

	//TEST TIMER FOR PAUSING
	this.pauseDialog = false; //pause dialogue call

};
Play.prototype = {

	// place assets and initialize variables
	create: function() {

		    //for debug purposes:parse random days
		  	//days 2, 4, & 5 don't work due to formatting erros
			// day = 1;// game.rnd.integerInRange(1,5);
			// switch (day) {
			// 	case 1:
			// 		this.dialog = JSON.parse(this.game.cache.getText('dialog'));
			// 		break;
			// 	case 2:
			// 		this.dialog = JSON.parse(this.game.cache.getText('dialog2'));
			// 		break;
			// 	case 3:
			// 		this.dialog = JSON.parse(this.game.cache.getText('dialog3'));
			// 		break;
			// 	case 4:
			// 		this.dialog = JSON.parse(this.game.cache.getText('dialog4'));
			// 		break;
			// 	case 5:
			// 		this.dialog = JSON.parse(this.game.cache.getText('dialog5'));
			// 		break;
			// 	default:
			// 		console.log("this shouldn't be happening");
			// }
		//TODO: switch statement for different files for different days

			//parse dialog from JSON file
		this.dialog = JSON.parse(this.game.cache.getText('dialog'));

		// add audio
		this.ambientNoise = game.add.audio('ambientNoise');
		//play ambient noise
		this.ambientNoise.play('',0, .25, true);
		//load UIselect noise
		this.selectNoise = game.add.audio('select');

		// enable physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// set appropriate background color
		game.stage.backgroundColor = "#ffffff";

		// load bottom
			// background
		this.add.sprite(0, 512, 'atlas', 'counter');

		//CREATING COOKWARE
		this.spawnCookware();

		//CREATE PAWS
		this.createPaws();

		//spawn ALL ingredients
		//TODO: have other function to spawn some specific ingredients

		//this.spawnAllIngredients();

		//create top screen (if not all top screen elements)
		this.createTopScreen();

		// load divider
		this.createDivider();

		//load "chop" noise
		this.chopNoise = game.add.audio('grab');

		//let the typing Commence
		this.TypeText();

		//start the order timers with 30 seconds duration and 10 second delay
		//this.startOrderTimer(this.orderTime, 10000);
	},

	update: function() {

		// collide player two with split screen divider
		var leftHitDivider = game.physics.arcade.collide(this.leftPaw, this.divider);
		var rightHitDivider = game.physics.arcade.collide(this.rightPaw, this.divider);

		//handles food and paw collisions
		if(game.physics.arcade.overlap(this.seaweed, rightPaw)){
			rightPaw.overlap = true;
			rightPaw.overlapObject = this.seaweed;
		}
		if(game.physics.arcade.overlap(this.seaweed, leftPaw)){
			leftPaw.overlap = true;
			leftPaw.overlapObject = this.seaweed;
		}
			// rice
		if(game.physics.arcade.overlap(this.rice, rightPaw)){
			rightPaw.overlap = true;
			rightPaw.overlapObject = this.rice;
		}
		if(game.physics.arcade.overlap(this.rice, leftPaw)){
			leftPaw.overlap = true;
			leftPaw.overlapObject = this.rice;
		}
			// salmon
		if(game.physics.arcade.overlap(this.salmon, rightPaw)){
			rightPaw.overlap = true;
			rightPaw.overlapObject = this.salmon;
		}
		if(game.physics.arcade.overlap(this.salmon, leftPaw)){
			leftPaw.overlap = true;
			leftPaw.overlapObject = this.salmon;
		}

		// collide player two with knife
		if(game.physics.arcade.overlap(this.knife, rightPaw)){
			rightPaw.overlap = true;
			rightPaw.overlapObject = this.knife;
		}
		if(game.physics.arcade.overlap(this.knife, leftPaw)){
			leftPaw.overlap = true;
			leftPaw.overlapObject = this.knife;
		}

		// collide knife with salmon
		if(!this.salmonIsChopped && (rightPaw.isHolding || leftPaw.isHolding)){
			var chop = game.physics.arcade.overlap(this.salmon, this.knife);
			if(chop && !(this.salmon.isHeldByRight || this.salmon.isHeldByLeft) && (this.knife.isHeldByRight || this.knife.isHeldByLeft)){
				this.salmon.loadTexture('atlas', 'salmon_cut');
				this.salmonIsChopped = true;
				this.chopNoise.play();
			}
			//for now, set an order to be true if you.. chop the salmon
			this.isOrderFinished = true; //keeps track if the player completed order (correctly)
		}

		// collide rice with rice pot
		if(!this.rice.isHeldByRight && !this.rice.isHeldByLeft){
			if(game.physics.arcade.overlap(this.rice, this.ricePot)){
				this.rice.kill();
				this.ricePot.loadTexture('atlas', 'pot_rice');
			}
		}

		// collide money with counter
		game.physics.arcade.collide(this.topCounter, this.money);

		// money in register (on hover)
		if(game.physics.arcade.overlap(this.register, this.money)){
			this.register.loadTexture('atlas', 'cashRegister_open');
			if(this.money.beingHeld == false){
				this.money.kill();
				this.registerNoise.play();
			}
		}else{
			this.register.loadTexture('atlas', 'cashRegister_closed');
		}

		//TODO: CHECK if:
		  //ORDER IS LATE
				//setLate:
			//ORDER FINISHED
				//call ORDER COMPLETE
			//ORDER NOT FINISHED
				//setIncomplete

		//check for mouse click to progress through dialog
		if(this.dialogClick && !this.dialogTyping) {// !this.pauseDialog) {
			this.TypeText();
		}

	},

  // credits to Nathan Altice for the basis of this dialogue system code that this was
	//heavily based off of
	TypeText: function() {

		//lock input while typing
		this.isDialogTyping = true;
		this.dialogBox.inputEnabled = false; //prevent clicks from interrupting dialogue

		//also reset playerResponse to false
		this.dialogClick = false;

		//clear any text that may be leftover from previous calls
		this.dialogText.text = '';
		this.nextText.text = '';

		//TODO: find proper dialogConvo
		// make sure there are lines left to read in this convo, otherwise jump to next convo
	if(this.dialogLine > this.dialog[this.dialogConvo].length-1) {
		this.dialogLine = 0;
		this.dialogConvo++;
	}


		//check if we're in a convo
		if(this.dialogConvo >= this.dialog.length) {
			console.log('No more convos');
			//TODO: proceed to night time state if done with all customers
		} else {
			//set current speaker
			this.customer = this.dialog[this.dialogConvo][this.dialogLine]['customer'];

			//if there's going to be a new customer
			if(this.dialog[this.dialogConvo][this.dialogLine]['newCustomer']) {
				//and if last customer exists
				if(this.lastCustomer) {

					//take them off screen to the right
					  //keep y consistent with the last customer
					this.add.tween(this[this.lastCustomer].body).to({x: this.RIGHT_OFFSCREEN_X}, 500, Phaser.Easing.Linear.None, true);
					//this sounds really ominous, but destroy this customer....
					//this.lastCustomer.kill();

					//since nothing is working set them invisible bc god isn't real
					//this.LastCustoner.visible = false;

					//say we're "done" with this customer
					this.customerDonezo = true;

				}
				// create this new customer with the customer prefab
				  //passes in a string from dialogue to create customer
				 this.customer = new Customer(game, this.dialog[this.dialogConvo][this.dialogLine]['customer']);
				game.add.existing(this.customer);

				//this.add.tween(this[this.customer]).to({x: this.ONSCREEN_X}, {y: this.customer.body.y}, Phaser.Easing.Linear.None, true);

				  //reset us being "done" with a customer
				this.customerDonezo = false;
			}

			//build dialogue
			this.dialogLines = this.dialog[this.dialogConvo][this.dialogLine]['dialog'];

			//set up timer to iterate through each letter in dialog
			  //will probably have a property in the dialog.json to switch timers
			let currentChar = 0;
			this.textTimer = this.time.events.repeat(this.LETTER_TIMER, this.dialogLines.length, function() {
				this.dialogText.text += this.dialogLines[currentChar]; //spell out the text
				currentChar++; //increment letter by letter
			}, this);

			//once timer finished typing dialog for a line, show [...] prompt to go on
			this.textTimer.timer.onComplete.addOnce(function() {
				//show prompt for more text
				this.nextText = this.add.text(this.NEXT_X, this.NEXT_Y, this.NEXT_TEXT);
				this.nextText.anchor.setTo(1, 1);

				//enable player input
				this.dialogTyping = false;
				this.dialogBox.inputEnabled = true;

			}, this);

			//if there's a function property in the dialogue, evaluate it
			if(this.dialog[this.dialogConvo][this.dialogLine]['function'] != undefined) {
				eval(this.dialog[this.dialogConvo][this.dialogLine].function);
			}


			//set dialog bounds
			this.dialogText.maxWidth = this.TEXT_MAX_WIDTH;
			this.dialogText.setTextBounds(30, 10, 290, 374);
			this.dialogText.wordWrap = true;
			this.dialogText.wordWrapWIdth = this.TEXT_STYLE;

			//increment dialog line
			this.dialogLine++;

			//set past customer
			this.lastCustomer = this.customer;
		}
	}, //end of text typing function derived from nathan

	 //spawns cookware needed for bottom screen player
		spawnCookware: function() {
			// cutting board
		this.board = this.add.sprite(256, 512, 'atlas', 'cutting board');
		//this.board.rotation = Math.PI / 2;

			// Rice pot
		this.ricePot = this.add.sprite(768, 522, 'atlas', 'pot_empty');
		this.ricePot.scale.setTo(0.6);
		game.physics.enable(this.ricePot, Phaser.Physics.ARCADE);

		// knife
		this.knife = new Pickupable(game, 'knife', 712, 700);
		game.add.existing(this.knife);

	},
	createPaws: function() {
		// create player 2's paws
			// left paw
		this.leftPaw = new Paw(game, true, 20,800);
		game.add.existing(this.leftPaw);
		leftPaw = this.leftPaw
			// right Paw
		this.rightPaw = new Paw(game, false, 720,800);
		game.add.existing(this.rightPaw);
		rightPaw = this.rightPaw
	}, //spawns all ingredients for the bottom screen
	spawnAllIngredients: function () {
				// seaweed
			this.seaweed = new Pickupable(game, 'seaweed', 200, 800);
			game.add.existing(this.seaweed);

				// salmon
			this.salmon = new Pickupable(game, 'salmon', 400, 700);
			game.add.existing(this.salmon);

				// rice
			this.rice = new Pickupable(game, 'rice_raw', 756, 800);
			game.add.existing(this.rice);

	},
	//sets up top screen. put here for code readability
	createTopScreen: function() {
		// load top
		this.add.sprite(0, 0, 'atlas', 'top screen');

		//add dialog box & allow input
		this.dialogBox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'atlas', 'TextBox');
		this.dialogBox.inputEnabled = true;

		//if click on box, set the response to "true"
		this.dialogBox.events.onInputDown.add(this.proceedDialog, this);

    //initialize dialog text
		this.dialogText = this.add.text(this.TEXT_X, this.TEXT_Y, '', this.TEXT_STYLE);
		this.nextText = this.add.text(this.NEXT_X, this.NEXT_Y, '', this.TEXT_STYLE);

		// //create first customer
		 this.customer = new Customer(game, this.dialog[this.dialogConvo][this.dialogLine]['customer']);
		 game.add.existing(this.customer);

			// add the counter
		this.topCounter = this.add.sprite(0, 384, 'atlas', 'topCounter');
		game.physics.enable(this.topCounter);
		this.topCounter.body.setSize(1024, 64, 0, 64);
		this.topCounter.body.immovable = true;

		// add the register (currently decorative : P)
	this.add.sprite(600, 75, 'atlas', 'cashRegisterTempDisplay');
	this.register = this.add.sprite(600, 75, 'atlas', 'cashRegister_closed');
	game.physics.enable(this.register);
	this.register.body.immovable = true;

			// add an instance of the money prefab
		this.money = new Money(game, 100, 200);
		game.add.existing(this.money);


	},
	//creates our divider to fake our "split screen"
	createDivider: function() {
		this.divider = this.add.sprite(0, 502, 'atlas', 'divider');
		this.physics.arcade.enable(this.divider);
		this.divider.enableBody = true;
		this.divider.body.immovable = true;

	},
	//starts the timer for the player to complete an order
		//time: how much time allotted for an order
		//delay:how much time before starting timers
			//will decrease as days go on
	startOrderTimer: function(time, delay) {

		//auto destroy timers
		let lateTimer = game.time.create(true);
		let finishedTimer = game.time.create(true);

		//add events to these timers
		//timer (delay, callback, context)
		lateTimer.add((time / 2), this.setLate, this);
		finishedTimer.add(time, this.setIncomplete, this);

		//start timers
		lateTimer.start(delay);
		finishedTimer.start(delay);

	},
  //functon that detects player response if click on dialog box
	proceedDialog: function() {
				this.dialogClick = true; //detect player response
	}


	//functions to check for status
	//on lateTimer completion, will call this and set the player as "late"
	// setLate: function() {
 //
	//  		// set player as running late
	//  		this.isRunningLate = true;
 //
	//  		// set to true
	//  		this.pauseDialog = true;
 //
 // },
	// //on finishTimer completion, will set order as incomplete
	// setIncomplete: function() {
	// 		//set order as incomplete to make sure :'/
	// 		this.isOrderFinished = false;
	//
	// 		// set to true
	// 		this.pauseDialog = true;
	//
	// },
	// //in update, check if an order's correct and then call this to stay Safe
	// orderComplete: function() {
	// 		//set the order as finished
	// 		this.isOrderFinished = true;
	//
	// 		// set to true
	// 		this.pauseDialog = true;
	// }
};


//for now, pause if reach end of:
	//greet&order convo
	//late convo
//TODO:have order start function property at @ end of greet
// 	var result = this.dialogConvo % 4;
// 	if( (result === 0 && this.dialogLine > this.dialog[this.dialogConvo].length - 1) ||
//    result === 1 && this.dialogLine > this.dialog[this.dialogConvo].length - 1) {
// 	   this.pauseDialog = true; //pause future calls to dialogue until time elapses
// } else {
// 	console.log("no pause.");
// }


		//accessing new customer
		// if(this.customerDonezo) {
		//  var result = dialogConvo % 4;
		//  if ( result === 2 ) {
		// 		 dialogCovno += 2
		//  } else{
		// 	//assume they got Bad end
		// 	dialogConvo += 1;
		//  }
		// 	//reset lines
		//  this.dialogLine = 0;
	 // }

	 // jumping to proper conversation post new customer
	 //TODO: if running late, increase convo by one
	 // if(this.isRunningLate) {
	 //
	 // 	this.dialogConvo +=1; //increase convo by one
	 // 	this.dialogLine = 0; //reset lines
	 // }
	 //
	 // if (this.isOrderFinished) {
	 //
	 // 	//TODO: check if order is correct, proceed to "thanks" (3rd convo for customer)
	 // 		//spawn money if do this
	 // 			//if accessed "late", increment convo by one to get here
	 // 		if(this.isRunningLate){
	 // 			this.dialogConvo += 1;
	 // 		} else {
	 // 			this.dialogConvo += 2;
	 // 	 }
	 // 	 //reset lines
	 // 	 this.dialogLine == 0;
	 //  }
	 //
	 //  	//TODO: check if order never made it, proceed to "bye"(4th convo for customer)
	 //   if (!this.isOrderFinished && this.isRunningLate){
	 // 	 this.dialogConvo += 2;
	 //  //reset lines
	 //    this.dialogLine == 0;
	 //  }
	 //
	 //  //case where order is unfinished
	 //   if (!this.isOrderFinished && this.isRunningLate){
	 // 	 this.dialogConvo += 2;
	 //  //reset lines
	 //    this.dialogLine == 0;
	 //  }
