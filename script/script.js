window.onload = function () {
    
  document.getElementById("start-button").onclick = function () {
  // aqui abaixo escondemos o titulo e o botao de StartGame
  document.getElementById("title").style.display = "none";
  //aqui abre e exibe a area do jogo "gameboard"
  document.getElementById("game-board").style.display = "block";
  
    startGame();
  };
    
  function startGame() {
    
    //criando uma array vazia de obstáculos para o jogo para ser contra o player
    myGameArea.myObstacles = [];
    myGameArea.points = 0;
    //iniciamos o jogo
    myGameArea.start();

    //imagem de plano de fundo no canvas
    background = new Background("./images/bng-starwars-universe.png");
        
    //criando musica de fundo e sound effect de colisão com os obstáculos
    mySound = new sound("./sounds/arcade-video-game-explosion.wav")
    myMusic = new sound("./sounds/Star Wars 8-Bit-full.mp3");

    //Inicia música
    myMusic.play();
  }
  
  //criando o fundo de tela infinito
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

      //Colocando a imagem de fundo aumentando o eixo x em sentido a direita no x, fazendo efeito esteira
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
  }
//criando um novo componente para o player
const player = new Component(100, 70, "./images/mFalconnew.png", 100, 110, "image");

//Criando o canvas no html e atributos como gravidade e desenhar na game-board as dimensões da tela
const myGameArea = {
  canvas: document.createElement("canvas"),
  myObstacles: [],
  frames: 0,
  gravity: 0.1,
  points: 0,
  drawCanvas: function () {

    //aqui o canvas tem de largura 70% ou *0.30
    this.canvas.width = 960
    //screen.width - screen.width * 0.3;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");

    //criando o canvas para adicionar ele na div do id "game-board"
    document.getElementById("game-board").append(this.canvas);
  },

  //aqui atualizamos a tela para cada frame, repetindo em loop o updateGameArea 
  start: function () {
    player.x = 100;
    player.y = 110;
    player.userPull = 0;
    this.drawCanvas();
    this.reqAnimation = window.requestAnimationFrame(updateGameArea);
  },
  
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  
  //aqui se cria o Score pontuação que conta a cada 5 frames
  score: function () {
    this.points = Math.floor(this.frames / 5);
    this.context.font = "38px Courier New";
    this.context.fillStyle = "white";
    this.context.fillText("SCORE: " + this.points, 20, 50);
  },
  
  //encerrar loop da animação e chamar GameOver
  stop: function () {
    cancelAnimationFrame(this.reqAnimation);
    this.gameOver();
  },
  
  //Limpar e chamar tela de Game Over, reiniciando o jogo em seguida
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
    this.context.fillText("GAME OVER!", 350, 230);
    this.context.fillStyle = "white";
    this.context.fillText("Your final score: " + this.points, 250, 280);
    
  },
  //Chamando novamente a tela de star game depois de 2 segundos
  restartGame: function () {
    setTimeout(function () {
      document.getElementById("game-board").style.display = "none";
      document.getElementById("title").style.display = "block";
      this.points = 0;
      window.location.reload()
    }, 2000);
  },
}; 

  //função Component criada para fazer objetos na tela, tanto para o jogador como os obstáculos
  function Component(width, height, image, x, y) {
    
      this.image = new Image();
      this.image.src = image;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      
      //velocidades
      this.speedX = 0;
      this.speedY = 0;
      
      //gravidade de puxo
      this.userPull = 0;
      this.update = function () {

        //desenhando o player e obstáculos para cada atualização de frame da tela
        myGameArea.context.drawImage(
          this.image,
          this.x,
          this.y,
          this.width,
          this.height
        );
      };

      //incrementar posição atual do player e obstáculos de acordo a velocidade atual
      this.newPos = function () {
        this.x += this.speedX;

        //criando a gravidade do player com velocidade de puxo
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

      //criando função de colisão verificando se os lados do objeto jogador choca os lados ocupados 
      // pelos objetos obstáculos
      this.crashWith = function (obstacle) {
        return !(
          player.bottom() < obstacle.top() ||
          player.top() > obstacle.bottom() ||
          player.right() < obstacle.left() ||
          player.left() > obstacle.right()
        );
      };

      //função verificando se o player saiu da tela do canvas se subiu ou desceu além dos limites
      this.outOfCanvas = function (obstacle) {
        return player.bottom() > myGameArea.canvas.height || player.top() < 0;

      };
    }

  //criando obstáculos em tela aleatóriamente
  function createObstacle() {
   
    x = myGameArea.canvas.width;
    y = myGameArea.canvas.height - 50;
    
    
    myGameArea.myObstacles.push(
      new Component(50, 50, "./images/meteor4.png", x, Math.floor(Math.random() * y))
    );
  
    myGameArea.myObstacles.push(
      new Component(50, 50, "./images/meteor2.png", x, Math.floor(Math.random() * y))
    );
  
  }
  function updateGameArea() {
         
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

    myGameArea.reqAnimation = window.requestAnimationFrame(updateGameArea);
    for (i = 0; i < myGameArea.myObstacles.length; i++) {
      if (player.crashWith(myGameArea.myObstacles[i])) {
          mySound.play();
          myMusic.stop();
          myGameArea.stop();
      return;
      }
    }
    
    if (player.outOfCanvas()) {
      myMusic.stop();
      myGameArea.stop();
      return;
    }
          
  }
    // Criando funcionamento teclas e clicks da nave
  document.onkeydown = function (e) {
    if (e.keyCode == 32) {
      player.userPull = 0.3;
      player.image.src = "./images/mFalconnew2.png"
    }
  };

  document.onkeyup = function (e) {
    if (e.keyCode == 32) {
      player.userPull = 0;
      player.image.src = "./images/mFalconnew.png"
    }
  };

  document.onmousedown = function (e){
    player.userPull = 0.3;
    player.image.src = "./images/mFalconnew2.png"
  };

  document.onmouseup = function (e){
     player.userPull = 0;
     player.image.src = "./images/mFalconnew.png"
   };

   document.ontouchstart = function (e){
    player.userPull = 0.3;
    player.image.src = "./images/mFalconnew2.png"
  };

  document.ontouchend = function (e){
     player.userPull = 0;
     player.image.src = "./images/mFalconnew.png"
   };


  // document.player.onclick = function (e) {
  //   e.player.userPull = 0.3;
  // };
   // Criando função de som e colocando função para ativar som elementos audio
   function sound(src) {
    
      //cria elemento no html de som na tag "audio"
      this.sound = document.createElement("audio");
      this.sound.src = src;
      this.sound.setAttribute("preload", "auto");
      this.sound.setAttribute("controls", "none");

      //esconde a tag na tela do elemento sound
      this.sound.style.display = "none";
      document.body.appendChild(this.sound);
      
      //baixando o volume para 10%
      this.sound.volume = 0.1;
      
      //criando função play sound e stop
      this.play = function () {
        this.sound.play();
      }
      this.stop = function () {
        this.sound.pause();
      }
  }