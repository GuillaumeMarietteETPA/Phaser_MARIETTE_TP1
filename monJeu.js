var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },
scene: {
		preload: preload,
		create: create,
		update: update
	}
};



var game = new Phaser.Game(config);


	var score = 0;
	var wall;
	var platforms;
	var player;
	var ennemy;
	var cursors; 
	var stars;
	var potion;
	var scoreText;
	var bomb;
	var jump = 0;
	var verif = 0;
	var pvbar;
	var pv = 3;


function preload(){
	this.load.image('background','assets/skyp.png');	
	this.load.image('etoile','assets/melon.png');
	this.load.image('sol','assets/platform.png');
	this.load.image('sol1','assets/sol1.png');
	this.load.image('branche','assets/miniplatform.png');
	this.load.image('bomb','assets/cheese.png');
	this.load.image('coeur1','assets/coeur1.png');
	this.load.image('coeur2','assets/coeur2.png');
	this.load.image('coeur3','assets/coeur3.png');
	this.load.image('potion','assets/potion.png');
	this.load.image('wall','assets/wall.png');
	
	this.load.spritesheet('fire','assets/fire.png'),{frameWidth: 8, frameHeight: 8});
	this.load.spritesheet('perso','assets/dino3.png',{frameWidth: 31, frameHeight: 34});
	this.load.spritesheet('ennemy','assets/knight.png',{frameWidth: 11, frameHeight: 23});
}



function create(){
	this.add.image(400,300,'background');
	wall = this.physics.add.staticGroup();
	wall.create(0,600,'wall');
	wall.create(800,600,'wall');

	platforms = this.physics.add.staticGroup();
	platforms.create(400,568,'sol1').setScale(2).refreshBody();
	platforms.create(400,300,'branche');
	platforms.create(600,400,'branche');	
	platforms.create(30,450,'branche');
	platforms.create(50,250,'branche');
	platforms.create(760,250,'branche');
	
	player = this.physics.add.sprite(100,450,'perso');
	player.setCollideWorldBounds(true);
	player.body.setGravityY(000);
	this.physics.add.collider(player,platforms);
	
	cursors = this.input.keyboard.createCursorKeys(); 
	
	this.anims.create({
		key:'right',
		frames: this.anims.generateFrameNumbers('perso', {start: 1, end: 6}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:0}],
		frameRate: 20
	});

	
	stars = this.physics.add.group({
		key: 'etoile',
		repeat:11,
		setXY: {x:12,y:0,stepX:70}
	});
	
	this.physics.add.collider(stars,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	//pvbar = this.add.text(670,16, 'Vie 3', {fontSize: '32px', fill:'#000'});
	
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player,bombs, hitBomb, null, this);
	
	//pvbar = this.physics.add.staticGroup();
	//pvbar.create(700,35,'life');

	coeur1 = this.physics.add.staticGroup();
	coeur2 = this.physics.add.staticGroup();
	coeur3 = this.physics.add.staticGroup();
	
	coeur1.create(700,40,'coeur1');
	coeur2.create(650,40,'coeur2');
	coeur3.create(600,40,'coeur3');
	
	ennemy = this.physics.add.sprite(6,450,'ennemy');
	ennemy.setCollideWorldBounds(true);
	ennemy.body.setGravityY(000);
	this.physics.add.collider(ennemy,platforms);
	this.physics.add.collider(player,ennemy);
	this.physics.add.collider(wall,ennemy);
	
	this.anims.create({
		key:'ennemyR',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 7}),
		frameRate: 10,
		repeat: -1
	});

	this.anims.create({
		key:'ennemystop',
		frames: [{key: 'ennemy', frame:0}],
		frameRate: 20
	});




}
	
	


function update(){
	if(cursors.left.isDown){
		player.anims.play('right', true);
		player.setVelocityX(-300);
		player.setFlipX(true);
	}else if(cursors.right.isDown){
		player.setVelocityX(300);
		player.anims.play('right', true);
		player.setFlipX(false);
	}else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}
	
		if (cursors.up.isDown && player.body.touching.down && jump === 0){
			player.setVelocityY(-430);
			jump = 1;
			verif = 0;
		} 

		if (cursors.up.isDown){
			verif = 1;
			
		} 

		if (jump === 1 && cursors.up.isDown && verif === 1) {
			player.setVelocityY(-430);
			jump = 0;
		}
		
	
	if(cursors.down.isDown){
		player.setVelocityY(700);
	}
	
		
		if(ennemy.body.touching.left){
			ennemy.setVelocityX(150);
		}
		else if(ennemy.body.touching.right) {
			ennemy.setVelocityX(-150);
		}
	

}

function hitBomb(player, bomb){
	pv --;
	//pvbar.setText('Vie: '+pv);
	
	
	if (pv == 2)	{
	coeur3.clear(true);
	}
	if (pv == 1)	{
	coeur2.clear(true);
	}
	
	if (pv == 0)	{
		coeur1.clear(true);
		this.physics.pause();
		player.setTint(0xff0000);
		player.anims.play('turn');
		gameOver=true;
	}
}

function collectStar(player, star){
	star.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+score);
	if(stars.countActive(true)===0){
		stars.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});
		
		var x = (player.x < 400) ? 
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
	if(score == 300 || score == 600 || score == 900 || score == 1200 || score == 1800 || score == 2400) {
		potion = this.physics.add.sprite(450,450,'potion');
		this.physics.add.collider(potion,platforms);
		this.physics.add.overlap(player,potion,collectPotion,null,this);
	}
	
}

function collectPotion(player,potion){
	potion.disableBody(true,true);
	
	if (pv == 2)	{
	pv ++;
	coeur3.create(600,40,'coeur3');
	}
	
	if (pv == 1)	{
	pv ++;
	coeur2.create(650,40,'coeur2');
	}
	
}