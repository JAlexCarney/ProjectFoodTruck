var Customer = function(game, type){
	if(type == 0){
		Phaser.Sprite.call(this, game, 0, 0, 'atlas', 'customer_alpaca');
		//this.scale.setTo(0.8,0.8);
		console.log("alpaca");
	}else if(type == 1){
		Phaser.Sprite.call(this, game, 0, -128, 'atlas', 'customer_bird');
		console.log("bird");
	}else if(type == 2){
		Phaser.Sprite.call(this, game, 0, -128, 'atlas', 'customer_frog');
		console.log("frog");
	}else if(type == 3){
		Phaser.Sprite.call(this, game, 0, -128, 'atlas', 'customer_axolotl');
		console.log("axolotl");
	}
	this.type = type;
}

Customer.prototype = Object.create(Phaser.Sprite.prototype);

Customer.prototype.constructor = Customer;

Customer.prototype.update = function(){

}