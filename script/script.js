window.onload = function () {
    
    document.getElementById("start-button").onclick = function () {
    document.getElementById("title").style.display = "none";
    document.getElementById("game-board").style.display = "block";
        
      startGame();
    };
  
    function startGame() {
      myGameArea.start();
      background = new Background("./images/bgStarWars.png");
      player = new Component(80, 50, "./images/milleniumFalcon.png", 100, 110, "image");
      myGameArea.myObstacles = [];
      mySound = new sound("./sounds/arcade-video-game-explosion.wav")
      myMusic = new sound("./sounds/Star Wars 8-Bit-full.mp3");
      myMusic.play();
    }

    const myGameArea = {
      canvas: document.createElement("canvas"),
      myObstacles: [],
      frames: 0,
      gravity: 0.1,
      drawCanvas: function () {
        this.canvas.width = screen.width - screen.width * 0.3;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.getElementById("game-board").append(this.canvas);
      },
      start: function () {
        this.drawCanvas();
        this.reqAnimation = window.requestAnimationFrame(updateGameArea);
      },
      
      clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      },
      
      score: function () {
        points = Math.floor(this.frames / 5);
        this.context.font = "38px Courier New";
        this.context.fillStyle = "white";
        this.context.fillText("Score: " + points, 20, 50);
      },
      
      stop: function () {
        cancelAnimationFrame(this.reqAnimation);
        this.gameOver();
      },
      
      gameOver: function () {
        this.clear();
        this.drawFinalPoints();
        this.restartGame();
      },
      drawFinalPoints: function () {
        
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.font = "regular 38px Press Start 2P";
        this.context.fillStyle = "red";
        this.context.fillText("Game Over!", 350, 230);
        this.context.fillStyle = "white";
        this.context.fillText("Your final score: " + points, 250, 280);
        
      },
      
      restartGame: function () {
        setTimeout(function () {
          document.getElementById("game-board").style.display = "none";
          document.getElementById("title").style.display = "block";
        }, 1600);
      },
    };
    
    function Background(source) {
      this.img = new Image();
      this.img.src = source;
      this.scale = 1.05;
      this.y = 0;
      this.dx = 0.5;
      this.imgW = this.img.width;
      this.imgH = this.img.height;
      this.x = 0;
      this.clearX = 0;
      this.clearY = 0;
      that = this;
      this.img.onload = function () {
        that.imgW = that.img.width * that.scale;
        that.imgH = that.img.height * that.scale;
        };
      
      this.draw = function () {
        ctx = myGameArea.context;
        if (that.imgW <= myGameArea.canvas.width) {
          if (that.x > myGameArea.canvas.width) {
            that.x = -that.imgW + that.x;
          }
          if (that.x > 0) {
            ctx.drawImage(
              that.img,
              -that.imgW + that.x,
              that.y,
              that.imgW,
              that.imgH
            );
          }
          if (that.x - that.imgW > 0) {
            ctx.drawImage(
              that.img,
              -that.imgW * 2 + that.x,
              that.y,
              that.imgW,
              that.imgH
            );
          }
        } else {
          if (that.x > myGameArea.canvas.width) {
            that.x = myGameArea.canvas.width - that.imgW;
          }
          if (that.x > myGameArea.canvas.width - that.imgW) {
            ctx.drawImage(
              that.img,
              that.x - that.imgW + 1,
              that.y,
              that.imgW,
              that.imgH
            );
          }
        }
        ctx.drawImage(that.img, that.x, that.y, that.imgW, that.imgH);
        that.x += that.dx;
      };
    }
      
    function Component(width, height, image, x, y) {
      this.image = new Image();
      this.image.src = image;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.speedX = 0;
      this.speedY = 0;
      this.userPull = 0;
      this.update = function () {
          myGameArea.context.drawImage(
          this.image,
          this.x,
          this.y,
          this.width,
          this.height
        );
      };
        
      this.newPos = function () {
        this.x += this.speedX;
        player.speedY = player.speedY + (myGameArea.gravity - player.userPull);
        this.y += player.speedY;
      };
      this.left = function () {
        return this.x;
      };
      this.right = function () {
        return this.x + this.width;
      };
      this.top = function () {
        return this.y;
      };
      this.bottom = function () {
        return this.y + this.height;
      };

      this.crashWith = function (obstacle) {
        return !(
          player.bottom() < obstacle.top() ||
          player.top() > obstacle.bottom() ||
          player.right() < obstacle.left() ||
          player.left() > obstacle.right()
        );
      };
        
      this.outOfCanvas = function (obstacle) {
        return player.bottom() > myGameArea.canvas.height || player.top() < 0;
        
      };
    }
  
    function createObstacle() {
     
      x = myGameArea.canvas.width;
      y = myGameArea.canvas.height - 50;
      // height = Math.floor(Math.random() * (200 - 20 + 1) + 20);
      // gap = Math.floor(Math.random() * (200 - 100 + 1) + 100);
      
      myGameArea.myObstacles.push(
        new Component(50, 50, "./images/meteor.png", x, Math.floor(Math.random() * y))
      );
      // myGameArea.myObstacles.push(
      //   new Component(
      //     70,
      //     y - height - gap,
      //     "./images/Stalagmite_bottom.png",
      //     x,
      //     height + gap
      //   )
      // );
    }
    function updateGameArea() {
    for (i = 0; i < myGameArea.myObstacles.length; i++) {
        if (player.crashWith(myGameArea.myObstacles[i])) {
            mySound.play();
            myMusic.stop();
            myGameArea.stop();
            myMusic.stop();
          return;
        }
      }
        
      if (myGameArea.frames % 120 === 0) {
        createObstacle();
      }
      
      myGameArea.clear();
      background.draw();
        
      myGameArea.myObstacles.forEach(function (obstacle) {
        obstacle.x += -3;
        obstacle.update();
      });
      myGameArea.frames += 1;
      player.newPos();
      player.update();
      myGameArea.score();
        
      if (player.outOfCanvas()) {
        myGameArea.stop();
        myMusic.stop();
        return;
      }
        
      myGameArea.reqAnimation = window.requestAnimationFrame(updateGameArea);
    }
      
    document.onkeydown = function (e) {
      if (e.keyCode == 32) {
        player.userPull = 0.3;
      }
    };
  
    document.onkeyup = function (e) {
      if (e.keyCode == 32) {
        player.userPull = 0;
      }
    };

    document.onmousedown = function (e){
      player.userPull = 0.3;
      
    };

    document.onmouseup = function (e){
       player.userPull = 0;
       
     };

    // document.player.onclick = function (e) {
    //   e.player.userPull = 0.3;
    // };

    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.sound.volume = 0.1;
        this.play = function(){
            this.sound.play();
           }
        this.stop = function(){
            this.sound.pause();
        }    
    }
  };