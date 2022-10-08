import { avaliableWords, dictionary } from "./dictionary.js";
import { createKeyboard, createGameBoard } from "./utils.js";

const englishKeyboard = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['spacer', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'spacer'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'delete'],
]

// const randomWord = avaliableWords[Math.floor(Math.random() * avaliableWords.length)];
const randomWord = 'floor';

const WORD_LENGTH = 5;
const NUMBER_OF_GUESSES = 5;

const keyboard = document.querySelector('[data-keyboard]');
const gameBoard = document.querySelector('[data-game-board]');
const alertsContainer = document.querySelector('[data-alerts-container]');

function showAlert(message, duration) {
  const div = document.createElement('div');
  div.classList.add('alert');
  div.textContent = message;
  alertsContainer.prepend(div);
  setTimeout(() => {
    div.classList.add('hide');
    div.addEventListener('transitionend', () => {
      div.remove();
    })
  }, duration);
}

function handleButtons(e) {
  if (e.target.matches('[data-enter]')) {
    handleGuess();
  }

  if (e.target.matches('[data-delete]')) {
    deleteLetter();
  }

  if (e.target.matches('[data-letter]')) {
    typeLetter(e.target.dataset.letter);
  }  
}

function shakeBoxs(filledBoxs) {
  for (const box of filledBoxs) {
    box.classList.add('shake');
    box.addEventListener('animationend', () => {
      box.classList.remove('shake')
    }, { once: true })
  }
}

function handleGuess() {
  const currentRow = gameBoard.querySelector(':not([data-filled], [data-fill])');
  const allBoxs = gameBoard.querySelector(':not([data-filled], [data-fill])').children;
  let filledBoxs = currentRow.querySelectorAll('[data-fill]');

  const word = [...filledBoxs].reduce((word, item) => word + item.textContent, '');

  if (word.length < WORD_LENGTH) {
    shakeBoxs(allBoxs);
    showAlert('Not enough letters', 1000);
    return;
  }

  if (!dictionary.includes(word)) {
    shakeBoxs(allBoxs);
    showAlert('Word doesnt exist', 1000);
    return;
  }
  
  checkWin(filledBoxs, word);
  
  currentRow.dataset.filled = '';
  return;
}

function danceBoxes(filledBoxs) {
  for (let i=0; i<filledBoxs.length; i++) {
    setTimeout(() => {
      filledBoxs[i].classList.add('dance');
    }, i * 100);

    filledBoxs[i].addEventListener('animationend', () => {
      filledBoxs[i].classList.remove('dance');
    })
  }
}

function checkWin(filledBoxs, word) {
  for (let i=0; i<filledBoxs.length; i++) {
    const letter = filledBoxs[i].textContent;
    setTimeout(() => {
      filledBoxs[i].classList.add('flip');
    }, i * 200);

    filledBoxs[i].ontransitionend = () => {
      filledBoxs[i].classList.remove('flip');
      if (randomWord[i] === letter) {
        filledBoxs[i].classList.add('correct');
      }
      else if (randomWord.includes(letter)) {
        filledBoxs[i].classList.add('wrong-location');
      }
      else {
        filledBoxs[i].classList.add('wrong');
      }

      if (i === filledBoxs.length - 1) {
        if (word === randomWord) {
          danceBoxes(filledBoxs);
          showAlert('You WIN', 5000);
          return;
        }
    
        const remainingGuesses = gameBoard.querySelectorAll('[data-filled]');
        if (remainingGuesses.length === NUMBER_OF_GUESSES) {
          showAlert('You LOSE', 5000);
          return;
        }
      }
    }
  }
}

function typeLetter(letter) {
  const currentRow = gameBoard.querySelector(':not([data-filled], [data-fill])');
  const currentBox = currentRow.querySelector(':not([data-fill])');
  if (!currentBox) return;
  currentBox.dataset.fill = '';
  currentBox.textContent = letter;
  return;
}

function deleteLetter() {
  const currentRow = gameBoard.querySelector(':not([data-filled], [data-fill])');
  const filledBoxs = currentRow.querySelectorAll('[data-fill]');

  if (filledBoxs.length === 0) return;
  const lastFilledBox = filledBoxs[filledBoxs.length - 1];
  lastFilledBox.textContent = '';
  delete lastFilledBox.dataset.fill;
  return;
}

createGameBoard({ rows: NUMBER_OF_GUESSES, columns: WORD_LENGTH, parent: gameBoard});
createKeyboard({ keyboardType: englishKeyboard, parentContainer: keyboard, cb: handleButtons });