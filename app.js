/* =======================================
- Name: Bricks Game
- Version: 0.1
- Author: sameh abdel moneim
========================================== */
(function(global) {
	
	// the game canvas
	var canvas = document.getElementById('my-canvas');
	var x	   = canvas.width/2;
	var y      = canvas.height-30;
	var dx     = -2;
	var dy     = -2;
	var paddleHeight = 10;
	var paddleWidth = 75;
	var paddleX = (canvas.width-paddleWidth)/2;
	var ball;
	var leftKey = false, rightKey = false;
	var ballRadius = 10;
	var brick;
	var bricks = [];
	var brickRowCount = 3;
	var brickColumnCount = 5;
	var brickWidth = 75;
	var brickHeight = 20;
	var brickPadding = 10;
	var brickOffsetTop = 30;
	var brickOffsetLeft = 30;
	var score = 0;
	var lives = 2;

	
	// game initialization
	var gameInit = {
		ctx: canvas.getContext("2d"),
		
		start: function() {

			for(c=0; c<brickColumnCount; c++) {
			    bricks[c] = [];
			    for(r=0; r<brickRowCount; r++) {
			        bricks[c][r] = { x: 0, y: 0, status:1 };
			    }
			}

			document.addEventListener("keydown",function(e){
			 if(e.keyCode == 37){
			 	leftKey = true;
			 }
			 if(e.keyCode == 39){
				rightKey= true;	
			 }
			});

            document.addEventListener("keyup",function(e){
				 leftKey = false;
				 rightKey = false;
			});

			document.addEventListener("mousemove",mouseMoveHandler);

			ball  = new component();
			brick = new component();
			this.interval = setInterval(startGame,10);
		},
		clear: function() {
			clearInterval(this.interval);
		}
	};

	var component = function() {
		var self = this;
		self.drawBall = function() {
		    // draw the ball
			gameInit.ctx.beginPath();
			gameInit.ctx.arc(x, y, ballRadius, 0, Math.PI*2);
			gameInit.ctx.fillStyle = "#2A044A";
			gameInit.ctx.fill();
			gameInit.ctx.closePath();
			
			x += dx;
			y += dy;
		}

		self.drawPaddle = function() {
		    
		    gameInit.ctx.beginPath();
		    gameInit.ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
		    gameInit.ctx.fillStyle = "#7AB317";
		    gameInit.ctx.fill();
		    gameInit.ctx.closePath();

		}

		self.drawBricks = function() {

		    for(c=0; c<brickColumnCount; c++) {
		        for(r=0; r<brickRowCount; r++) {
		            if(bricks[c][r].status == 1){
		            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
		            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
		            bricks[c][r].x = brickX;
		            bricks[c][r].y = brickY;
		            gameInit.ctx.beginPath();
		            gameInit.ctx.rect(brickX, brickY, brickWidth, brickHeight);
		            gameInit.ctx.fillStyle = "#7AB317";
		            gameInit.ctx.fill();
		            gameInit.ctx.closePath();
		            }
		        }
		    }
		}

		self.collisionDetection = function () {
		    for(c=0; c<brickColumnCount; c++) {
		        for(r=0; r<brickRowCount; r++) {
		            var b = bricks[c][r];
                    if(b.status == 1) {
			            if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
			                dy = -dy;
			                b.status = 0;
			                score++;
                            if(score == brickRowCount*brickColumnCount) {
		                        alert("YOU WIN, CONGRATULATIONS!");
		                        document.location.reload();
		                    }
			            }
			        }
		        }
		    }
		}

		self.drawScore = function() {
		    gameInit.ctx.font = "16px Arial";
		    gameInit.ctx.fillStyle = "#2A044A";
		    gameInit.ctx.fillText("Score: "+score, 8, 20);
		}

		self.drawLives = function() {
   		    gameInit.ctx.font = "16px Arial";
		    gameInit.ctx.fillStyle = "#2A044A";
		    gameInit.ctx.fillText("Lives: "+lives, 400, 20);

		}

	}

	var startGame = function () {
		gameInit.ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		ball.drawBall();
		ball.drawPaddle();
		brick.drawBricks();
		brick.collisionDetection();
		brick.drawScore();
		brick.drawLives();

		if(x-ballRadius < 0 || x+ballRadius > canvas.width) {    
			dx = -dx;
		}
		if(y-ballRadius < 0) {   
			dy = -dy;
		} else if (y+ballRadius > canvas.height-10) {
			if (x > paddleX && x < paddleX+paddleWidth) {
				dy = -dy;
			} else {
				lives--;
				if(!lives) {
					alert('You lost the game :( ');
					document.location.reload();
				}
				else {
				    x = canvas.width/2;
				    y = canvas.height-30;
				    dx = 2;
				    dy = -2;
				    paddleX = (canvas.width-paddleWidth)/2;
				}
			}
		}

	    if(leftKey == true && paddleX > 0) {
	    	paddleX -=7;
	    } else if (rightKey == true && paddleX < canvas.width-paddleWidth) {
	    	paddleX +=7;
	    }

	}
 
	var mouseMoveHandler = function(e) {
		relativeX = e.clientX - canvas.offsetLeft;

		if(relativeX >= 0 && relativeX < canvas.width) {
			paddleX = relativeX - paddleWidth/2;
		}
	}

	window.bricksGame = gameInit;
}(window))

// bricksGame.start();