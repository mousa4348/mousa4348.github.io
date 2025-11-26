import { _WORDS } from "./words.js";

const GUESSES = 5;
let guessesRemaining = GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = _WORDS[Math.floor(Math.random() * _WORDS.length)]
console.log(rightGuessString)

document.addEventListener("keyup", (e) =>{
    if(guessesRemaining === 0)
    {
        return;
    }//No more guesses left

    let pressedKey  = String(e.key);//Find the key that was just pressed
    if(pressedKey === "Backspace" && nextLetter !== 0)
    {
        deleteLetter();
        return;
    }
    if(pressedKey === "Enter")
    {
        checkGuess();
        return;
    }
    let found = pressedKey.match(/[a-z]/gi)
    if(!found || found.length > 1)
    {
        return;
    }
    else
    {
        insertLetter(pressedKey);
    }
})

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('submitButton').addEventListener('click', function(e){
        e.preventDefault();
        checkGuess();
    })
})

document.getElementById("keyboard-cont").addEventListener("click", (e) =>{
    const target = e.target;
    if(!target.classList.contains("keyboard-button"))
    {
        return;
    }
    let key = target.textContent;
    if(key === "DEL")
    {
        key = "Backspace";
    }
    document.dispatchEvent(new KeyboardEvent("keyup", {'key' : key}));
})

function insertLetter(pressedKey)
{
    if(nextLetter === 5)
    {
        return;
    }
    pressedKey = pressedKey.toLowerCase();
    let row = document.getElementsByClassName("letter-row")[GUESSES - guessesRemaining];
    let box = row.children[nextLetter];
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);
    nextLetter += 1;
}

function deleteLetter()
{
    let row  = document.getElementsByClassName("letter-row")[GUESSES - guessesRemaining];
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess.pop();
    nextLetter -= 1;
}

function checkGuess()
{
    let row = document.getElementsByClassName("letter-row")[GUESSES - guessesRemaining];
    let guessString = '';
    let correctGuess = Array.from(rightGuessString);

    for(const val of currentGuess)
    {
        guessString += val;
    }
    if(guessString.length != 5)
    {
        toastr.error("The word selected is not 5 letters long.");
        return;
    }
    if(!_WORDS.includes(guessString))
    {
        toastr.error("Not a word!");
        return;
    }
    for(let i = 0; i < 5; i++)
    {
        let letterColor = '';
        let box = row.children[i];
        let letter = currentGuess[i];

        let letterPosition = correctGuess.indexOf(currentGuess[i]);

        if(letterPosition == -1)
        {
            letterColor = 'grey';//Wrong letter
        }
        else
        {
            if(currentGuess[i] == correctGuess[i])
            {
                letterColor = 'green';//Correct letter
            }
            else
            {
                letterColor = 'yellow';//Letter in the word, but wrong location
            }
            correctGuess[letterPosition] = "#";
        }
        let delay  = 250 * i;
        setTimeout(() => {
            box.style.backgroundColor = letterColor;
            shadedKeyBoard(letter, letterColor);
        }, delay);
    }

    if(guessString === rightGuessString)
    {
        document.getElementById("winMessage").textContent = "YOU WON!";
        document.getElementById("winMessage").style.display = "block";
        toastr.success("Correct! Game over. ");
        guessesRemaining = 0;
        return;
    }
    else
    {
        guessesRemaining--;
        currentGuess = [];
        nextLetter = 0;
        if(guessesRemaining === 0)
        {
            toastr.error("No more guesses left! Gamve over.");
            toastr.info(`Correct word:  "${rightGuessString}"`);
        }
    }

}


function shadedKeyBoard(letter, color)
{
    for(const elem of document.getElementsByClassName("keyboard-button"))
    {
        if(elem.textContent === letter)
        {
            let oldColor = elem.style.backgroundColor;
            if(oldColor === 'green')
            {
                return;
            }
            if(oldColor === 'yellow' && color !== 'green')
            {
                return;
            }

            elem.style.backgroundColor = color;
            break;
        }
    }
}
function initBoard()
{
    let board = document.getElementById("gameBoard");

    for(let i = 0; i < GUESSES; i++)
    {
        let row = document.createElement("div");
        row.className = "letter-row";
        for(let j = 0; j < 5; j++)
        {
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }
        board.appendChild(row);
    }
}

initBoard()
