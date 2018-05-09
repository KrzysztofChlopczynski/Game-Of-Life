document.addEventListener("DOMContentLoaded", function() {
  const cellDefaultSize = 10;
  var self = this;

  self.gameOfLife = null;

  //{name: "Gosper Glider Gun", data:[[0,2], [0,3], [1,2], [1,3], [8,3], [8,4], [9,2], [9,4], [10,2], [10,3], [16,4], [16,5], [16,6], [17,4], [18,5], [22,1], [22,2], [23,0], [23,2], [24,0], [24,1], [24,12], [24,13], [25,12], [25,14], [26,12], [34,0], [34,1], [35,0], [35,1], [35,7], [35,8], [35,9], [36,7], [37,8]]}

  
  function gameOfLife(
    numberOfCols,
    numberOfRows,
    boardElement,
    eventName
  ) {
    var width = numberOfCols * cellDefaultSize;
    var height = numberOfRows * cellDefaultSize;
    var interval = null;

    var gol = this;
    gol.cells = new Array(numberOfRows);

    gol.start = function(intervalTime) {
      if(interval){
        gol.stop();
      }
      interval = setInterval(printNextGeneration, intervalTime);
    };

    gol.stop = function() {
      clearInterval(interval);
      interval=null;
    };

    var data = [
      [0, 2],
      [0, 3],
      [1, 2],
      [1, 3],
      [8, 3],
      [8, 4],
      [9, 2],
      [9, 4],
      [10, 2],
      [10, 3],
      [16, 4],
      [16, 5],
      [16, 6],
      [17, 4],
      [18, 5],
      [22, 1],
      [22, 2],
      [23, 0],
      [23, 2],
      [24, 0],
      [24, 1],
      [24, 12],
      [24, 13],
      [25, 12],
      [25, 14],
      [26, 12],
      [34, 0],
      [34, 1],
      [35, 0],
      [35, 1],
      [35, 7],
      [35, 8],
      [35, 9],
      [36, 7],
      [37, 8]
    ];

    gol.gen = function() {
      var arr = gol.cells;
      for (let i = 0; i < data.length; i++) {
        let x = data[i][0] + 5;
        let y = data[i][1] + 20;
        arr[y][x].setState(true);
      }
      // for (let i = 0; i < numberOfRows; i++) {
      //   for (let j = 0; j < numberOfCols; j++) {
      //     arr[i][j].setState(Math.round(Math.random()) === 1);
      //   }
      // }
    };
    
    function printNextGeneration() {
      var nextgenarr = computeNextGeneration();
      var arr = gol.cells;
      for (let i = 0; i < nextgenarr.length; i++) {
        let cols = nextgenarr[i].length;

        if (!arr[i]) {
          arr[i] = new Array(cols);
        }
        for (let j = 0; j < cols; j++) {
          var gliderObj = arr[i][j];
          if (!gliderObj) {
            let d = document.createElement("div");
            gliderObj = new glider(i, j, d);
            d.addEventListener(
              eventName,
              (function(gl) {
                return function() {
                  gl.changeState();
                };
              })(gliderObj)
            );
            boardElement.appendChild(d);
            arr[i][j] = gliderObj;
          }
          gliderObj.setState(nextgenarr[i][j]);
        }
      }
      gol.cells = arr;
    }

    function computeNextGeneration() {
      var arr = new Array(numberOfRows);
      for (let i = 0; i < numberOfRows; i++) {
        arr[i] = new Array(numberOfCols);
        for (let j = 0; j < numberOfCols; j++) {
          arr[i][j] = computeCellNextState(i, j);
        }
      }
      return arr;
    }

    function computeCellNextState(x, y) {
      var row = gol.cells[x];
      if (!row) {
        return false;
      }
      var currentGlider = row[y];
      if (!currentGlider) {
        return false;
      }

      var sum = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          let r = x + i;
          let c = y + j;

          if(r>=0 && c>=0 && r<numberOfRows && c<numberOfCols){
            sum += gol.cells[r][c].getStateValue();
          }          
        }
      }
      let stateValue = currentGlider.getStateValue();

      sum -= stateValue;

      if (stateValue === 0 && sum === 3) {
        return true;
      } else if (sum < 2 || sum > 3) {
        return 0;
      }

      return currentGlider.currentState;
    }

    function createBoard() {
      while (boardElement.firstChild) {
        boardElement.removeChild(boardElement.firstChild);
      }

      boardElement.style.width = width + "px";
      boardElement.style.height = height + "px";

      boardElement.style.background = "#f3f3f3";

      printNextGeneration();
    }

    function glider(x, y, gliderEl) {
      var gObj = this;
      gObj.currentState = false;
      // gliderEl.style.transition = `all ${intervalTime / 2}ms`;

      gObj.setState = function(isAlive) {
        gObj.currentState = isAlive;
        gliderEl.classList.remove("live");
        gliderEl.classList.remove("dead");
        if (isAlive) {
          gliderEl.classList.add("live");
        } else {
          gliderEl.classList.add("dead");
        }
      };

      gObj.changeState = function() {
        gObj.setState(!gObj.currentState);
      };

      gObj.getStateValue = function() {
        if (gObj.currentState) {
          return 1;
        }
        return 0;
      };

      gObj.setState(false);
    }

    createBoard();
  }

  (function init() {
    var boxWidth = document.getElementById("width");
    var boxHeight = document.getElementById("height");
    let createBtn = document.getElementById("create");
    let playBtn = document.getElementById("play");
    let pauseBtn = document.getElementById("pause");
    let randomBtn = document.getElementById("randomStartState");
    

    var errorMessage = document.querySelector(".error-message");

    function validateForm(event) {
      var formIsValid = true;
      errorMessage.innerText = "";
      if (boxHeight.value < 50) {
        errorMessage.innerText += "The number of rows can't be less than 50 \n";
        formIsValid = false;
      }
      
      if (boxWidth.value < 50) {
        errorMessage.innerText += "The number of columns can't be less than 50 \n";
        formIsValid = false;
      }
      if (boxHeight.value > 100) {
        errorMessage.innerText += "The number of rows can't be bigger than 100 \n";
        formIsValid = false;
      }
      if (boxWidth.value > 100) {
        errorMessage.innerText += "The number of columns can't be bigger than 100 \n";
        formIsValid = false;
      }
      if (formIsValid === false) {
        event.preventDefault();
      }
      return formIsValid;
    }

    createBtn.addEventListener("click", function(event) {
      if(!validateForm(event)){
        return;
      }

      let width = parseInt(boxWidth.value);
      let height = parseInt(boxHeight.value);
      var radios = document.getElementsByName("mouseEvent");
      var radio = "click";
      for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
          radio = radios[i].value;
          break;
        }
      }

      self.gameOfLife = new gameOfLife(
        width,
        height,
        document.getElementById("board"),        
        radio
      );
    });

    playBtn.addEventListener("click", function() {
      
      self.gameOfLife.start(parseInt(document.getElementById("time").value));
    });

    pauseBtn.addEventListener("click", function() {
      self.gameOfLife.stop();
    });

    randomBtn.addEventListener("click", function() {
      self.gameOfLife.gen();
    });
  })();
});
