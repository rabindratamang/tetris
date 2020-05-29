document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid");
    let squares = Array.from(document.querySelectorAll(".grid div"));
    const scoreDisplay = document.querySelector("#score");
    const startButton = document.querySelector("#start-button");
    const width = 10;
    let score = 0;
    let nextRandom = 0;
    let timerId;
    let gamePaused;

    let gameAudio = new Audio('./Assets/Sounds/game.mp3');
    let moveAudio = new Audio('./Assets/Sounds/move.mp3');
    let rotateAudio = new Audio('./Assets/Sounds/rotate.mp3');
    let takenAudio = new Audio('./Assets/Sounds/taken.mp3');
    let breakAudio = new Audio('./Assets/Sounds/break.mp3');

    gameAudio.loop = true;

    const colors = [
        '#56A753',
        '#FEEE34',
        '#EB412F',
        '#F07A2C',
        '#3BB0EE'
    ]

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width,width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const oTetromino = [
        [0, 1,width, width+1],
        [0, 1,width, width+1],
        [0, 1,width, width+1],
        [0, 1,width, width+1],
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
    
    let currentPosition = 4;
    let currentRotation = 0;
 
    //randomly select tetromino
    let randomTetromino = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[randomTetromino][currentRotation];


    //draw tetromino
    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[randomTetromino];
        })
    }

    //undraw the tetromino 
    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })
    }

    //move down
    // timerId = setInterval(moveDown, 1000);


    //assign function to keyCode
    function control(e){
        if(gamePaused) return false;
        switch (e.keyCode) {
            case 37:
                moveLeft();
                break;
            case 38:
                rotate();
                break;
            case 39:
                moveRight();
                break;
            case 40:
                playAudio(moveAudio);
                moveDown();
                break;
            default:
                return false;
          }
    }

    document.addEventListener('keydown',control)

     //move down function
    function moveDown(){
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    //freeze condition
    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            playAudio(takenAudio);
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            //start a new tetromino falling 
            randomTetromino = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[randomTetromino][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    //move tetromino
    function moveLeft(){
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if(!isAtLeftEdge) currentPosition -= 1;
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1;
        }
        draw();
        playAudio(moveAudio);
    }

      //move tetromino to the right
      function moveRight(){
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1 );
        if(!isAtRightEdge) currentPosition += 1;
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1;
        }

        draw();
        playAudio(moveAudio);
    }

    //rotate the tetromino
    function rotate(){
        undraw();
        currentRotation++
        if(currentRotation == current.length){ 
            currentRotation = 0; 
        }
        current = theTetrominoes[randomTetromino][currentRotation];
        draw();
        playAudio(rotateAudio);
    }


    //show next tetromino
    const displaySquares = document.querySelectorAll(".mini-grid div");
    const displayWidth = 4;
    let displayIndex = 0;
    
    //the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],
    ]

    //display upnext tetromino shape
    function displayShape(){
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        })

        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')    
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    }

    //add functionality to button
    startButton.addEventListener('click',function(){
        if(timerId){
            startButton.innerHTML = "<i class='fa fa-play'></i> Play"
            startButton.style.backgroundColor = "#30942d"
            clearInterval(timerId);
            timerId = null;
            gameAudio.pause();
            gamePaused = true;
        } else {
            gamePaused = false;
            startButton.innerHTML = "<i class='fa fa-pause'></i> Pause"
            startButton.style.backgroundColor = "#ff8c00"
            gameAudio.play();
            draw();
            timerId = setInterval(moveDown, 1000);
            // nextRandom  = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();

        }
    });

    function addScore(){
        for(let i = 0; i< 199;i+=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10;
                playAudio(breakAudio);
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove("taken");
                    squares[index].classList.remove("tetromino")
                    squares[index].style.backgroundColor = "";
                }) 

                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = "Game Over";
            gamePaused = true;
            clearInterval(timerId);
        }
    }
  
    function playAudio(audio){
        (!audio.paused) ? audio.cloneNode().play() : audio.play();
    }
})

