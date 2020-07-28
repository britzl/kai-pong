var WINDOW_HEIGHT = 320,
    WINDOW_WIDTH = 240,
    SPEED = 300;

var mainState = {

    preload: function() {
        game.load.crossOrigin = 'anonymous';

        game.load.image('wall', 'https://i.imgur.com/WQUKFVC.png');
        game.load.image('ball', 'https://i.imgur.com/xtFdsIU.png');
    },

    create: function() {
        // Game key input
        // Arrows
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.physics.arcade.checkCollision.up = false;
        game.physics.arcade.checkCollision.down = false;

        game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
                                          Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
        this.cursor = game.input.keyboard.createCursorKeys();

        // WASD
        this.wasd = {
			left: game.input.keyboard.addKey(Phaser.Keyboard.FOUR),
			right: game.input.keyboard.addKey(Phaser.Keyboard.SIX)
        };

        // Load player
        this.player = game.add.sprite(game.world.centerX, 30, 'ball');
        this.player.anchor.setTo(0.5, 0.5);
        this.player.scale.x = 4;
        this.player.scale.y = 1;
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.immovable = true;

        // Load enemy
        this.enemy = game.add.sprite(game.world.centerX, WINDOW_HEIGHT - 30, 'ball');
        this.enemy.anchor.setTo(0.5, 0.5);
        this.enemy.scale.x = 4;
        this.enemy.scale.y = 1;
        game.physics.arcade.enable(this.enemy);
        this.enemy.body.collideWorldBounds = true;
        this.enemy.body.immovable = true;

        this.ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
        game.physics.arcade.enable(this.ball);
        this.ball.body.velocity.set(0, -200);
        this.ball.onPaddlePlayer = false;
        this.ball.onPaddleEnemy = false;
        this.ball.body.bounce.set(1);
        this.ball.body.collideWorldBounds = true;
        //this.ball.anchor.setTo(0.5, 0.5);
    },

    update: function() {

        // Check for keyboard input, either arrows for player, wasd for enemy
        this.movePlayer();
        this.moveEnemy();
        this.ballCollision();

        if (this.ball.onPaddlePlayer) {
            this.ball.body.velocity.x = ((Math.random() * 50) + this.player.body.velocity.x);
            this.ball.body.velocity.y += (0.1) * this.ball.body.velocity.y;
            this.ball.onPaddlePlayer = false;
        }
        else if (this.ball.onPaddleEnemy) {
            this.ball.body.velocity.x = ((Math.random() * 50) + this.enemy.body.velocity.x);
            this.ball.body.velocity.y += (0.1) * this.ball.body.velocity.y;
            this.ball.onPaddleEnemy = false;
        }

        if (this.ball.y >= game.height) {
            this.ballLost();
        }
        else if (this.ball.y <= 0) {
            this.ballLost();
        }

    },

    movePlayer: function() {
        if (this.wasd.left.isDown) {
            this.player.body.velocity.x = -1 * SPEED;
        }
        else if (this.wasd.right.isDown) {
            this.player.body.velocity.x = SPEED;
        }
        else {
            this.player.body.velocity.x = 0;
        }
    },

    moveEnemy: function() {
        if (this.cursor.left.isDown) {
            this.enemy.body.velocity.x = -SPEED;
        }
        else if (this.cursor.right.isDown) {
            this.enemy.body.velocity.x = SPEED;
        }
        else {
            this.enemy.body.velocity.x = 0;
        }
    },

    ballCollision: function() {
        this.ball.onPaddlePlayer = this.ball.onPaddleEnemy = false;
        game.physics.arcade.collide(this.player, this.ball, function() { this.ball.onPaddlePlayer = true; }, null, this);
        game.physics.arcade.collide(this.enemy, this.ball, function() { this.ball.onPaddleEnemy = true; }, null, this);
    },

    ballLost: function() {
        this.ball.reset(game.world.centerX, game.world.centerY);
        game.time.events.add(0, function() { this.ball.body.velocity.set(0, -200); }, this);
    }
};

var game = new Phaser.Game(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.AUTO, 'gameDiv', mainState);
