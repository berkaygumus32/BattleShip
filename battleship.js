const model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    
    ships: [
        { locations: [0, 0, 0,], hits: ["", "", ""] },
        { locations: [0, 0, 0,], hits: ["", "", ""] },
        { locations: [0, 0, 0,], hits: ["", "", ""] }
    ],

    //hardcoded ships
    /*
        ships:  [
            { locations: ["06", "16", "26"], hits: ["", "", ""] },  
            { locations: ["24", "34", "44"], hits: ["", "", ""] },
            { locations: ["10", "11", "12"], hits: ["", "", ""] }
        ],
    */
   
    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            const ship = this.ships[i];
            const index = ship.locations.indexOf(guess);

            if (ship.hits[index] === "hit"){
                view.displayMessage("Oops, You already hit that location!")
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");

                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my batleship!")
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },

    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function() {
        let locations;
        for(let i = 0; i < this.numShips; i++){
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function() {
        const direction = Math.floor(Math.random() * 2);
        let row;
        let col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
            col = Math.floor(Math.random() * this.boardSize);
        }

        const newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col)
            }
        }
        return newShipLocations;
    },

    collision: function(locations){
        for (let i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }




};


const view = {
    displayMessage: function(msg) {
        const messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    }, 

    displayHit: function(location) {
        const cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        const cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

const controller = {
    guesses: 0,

    processGuess: function(guess) {
        const location = parseGuess(guess);
        if (location) {
            this.guesses++;
            const hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleShips, in " + this.guesses + " guesses")
            }
            
        }
    }
};

//helper function to parse a guess from the user

function parseGuess(guess) {
    
    const alphabet = ["A", "B", "C", "D", "E", "F", "G"]

    if(guess === null || guess.length !== 2) {
        alert('Oops, please enter a letter  and a number on the board.');
    } else {
        const firstChar = guess.charAt(0);
        const row = alphabet.indexOf(firstChar);
        const column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert('Opps, that is not on the board.');
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that is off the board!")
        } else {
            return row + column;
        }
    }
    return null;
}

//event handlers

function handleFireButton() {
    const guessInput = document.getElementById("guessInput");
    const guess = guessInput.value.toUpperCase();

    controller.processGuess(guess);

    guessInput.value = "";
}

function handleKeyPress(e){
    const fireButton = document.getElementById('fireButton');
    if(e.keyCode === 13) {
        fireButton.onclick();
        return false;
    }
}

window.onload = init;

function init() {
    //Fire! button onclick handler
    const fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;

    // handle "return" key press
    const guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
};