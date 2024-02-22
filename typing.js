const words = 'the quick brown fox jumps over the lazy dog each day brings new opportunities for growth and learning time flies when having fun so make the most of every moment life is a journey filled with unexpected twists and turns success often comes to those who persevere and never give up on their dreams remember to stay true to yourself and embrace the challenges that come your way'.split(' ');
const wordsCount = words.length;
const gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;

// generating random word order
function randomword() {
  const randomindex = Math.ceil(Math.random() * wordsCount);
  return words[randomindex - 1];
}

// segregating each word letter 
function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

// adding & removing CSS classes for tracking current letter and word
function addClass(el, name) {
  el.className += ' ' + name;
}
function removeClass(el, name) {
  el.className = el.className.replace(name, '');
}

// checking for next word
function getNextWord(currentWord) {
  let nextNode = currentWord.nextSibling;
  while (nextNode) {
    if (nextNode.nodeType === 1 && nextNode.classList.contains('word')) {
      return nextNode;
    }
    nextNode = nextNode.nextSibling;
  }
  return null; // No next word found
}

// resetting game
function newgame() {
  window.timer = null;
  window.gameStart = null;
  removeClass(document.getElementById('game'), 'over');
  removeClass(document.getElementById('game'), 'over');
  document.getElementById('words').innerHTML = '';
  for (let j = 0; j < 100; j++) {
    document.getElementById('words').innerHTML += formatWord(randomword());
  }
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  document.getElementById('info').innerHTML = (gameTime / 1000) + '';
  window.timer = null;
  const hasChangeClass = cursor.classList.contains('change');

  if (hasChangeClass) {
    removeClass(cursor, 'change');
  }
}

// calculating typing speed
function getWpm() {
  const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current');
  const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
  const typedWords = words.slice(0, lastTypedWordIndex);
  const correctWords = typedWords.filter(word => {
    const letters = [...word.children];
    const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
    const correctLetters = letters.filter(letter => letter.className.includes('correct'));
    return incorrectLetters.length === 0 && correctLetters.length === letters.length;
  });
  return correctWords.length / gameTime * 60000;
}

// stop timer and display result
function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById('game'), 'over');
  const result = getWpm();
  document.getElementById('info').innerHTML = `WPM: ${result}`;
}


// events of typing
document.getElementById('game').addEventListener("keyup", (e) => {
  const key = e.key;
  const currentLetter = document.querySelector('.letter.current');
  const currentWord = document.querySelector('.word.current');
  const expected = currentLetter?.innerHTML || ' ';
  const isLetter = key.length === 1 && key !== ' ';
  const isSpace = key === ' ';
  const isBackspace = key === 'Backspace';
  const isFirstLetter = currentLetter === currentWord.firstChild;

  if (document.querySelector('#game.over')) {
    return;
  }

  if (!window.timer && isLetter) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = (new Date()).getTime();
      }
      const currentTime = (new Date()).getTime();
      const msecPassed = currentTime - window.gameStart;
      const secPassed = Math.round(msecPassed / 1000);
      const secLeft = (gameTime / 1000) - secPassed;
      if (secLeft <= 0) {
        gameOver();
        return;
      }
      document.getElementById('info').innerHTML = secLeft + '';
    }, 1000)
  }


  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
      removeClass(currentLetter, 'current');
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, 'current');
      }
    } else {
      const incorrectLetter = document.createElement('span');
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = 'letter incorrect extra';
      currentWord.appendChild(incorrectLetter);
    }
  }


  if (isSpace) {
    if (expected !== ' ') {
      const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
      lettersToInvalidate.forEach(letter => {
        addClass(letter, 'incorrect');
      });
    }

    removeClass(currentWord, 'current');
    const nextWord = getNextWord(currentWord);
    if (nextWord) {
      addClass(nextWord, 'current');
      const nextWordFirstLetter = nextWord.querySelector('.letter');
      if (currentLetter) {
        removeClass(currentLetter, 'current');
      }
      if (nextWordFirstLetter) {
        addClass(nextWordFirstLetter, 'current');
      }
    }
  }


  if (isBackspace) {
    if (currentLetter && isFirstLetter) {

      removeClass(currentWord, 'current');
      addClass(currentWord.previousSibling, 'current');
      removeClass(currentLetter, 'current');
      addClass(currentWord.previousSibling.lastChild, 'current');
      removeClass(currentWord.previousSibling.lastChild, 'incorrect');
      removeClass(currentWord.previousSibling.lastChild, 'correct');
    }

    if (currentLetter && !isFirstLetter) {
      removeClass(currentLetter, 'current');
      addClass(currentLetter.previousSibling, 'current');
      removeClass(currentLetter.previousSibling, 'incorrect');
      removeClass(currentLetter.previousSibling, 'correct');
    }

    if (!currentLetter) {
      addClass(currentWord.lastChild, 'current');
      removeClass(currentWord.lastChild, 'incorrect');
      removeClass(currentWord.lastChild, 'correct');
    }
  }

  //move lines vertically
  if (currentWord.getBoundingClientRect().top > 290) {
    const words = document.getElementById('words');
    const margin = parseInt(words.style.marginTop || '0px');
    words.style.marginTop = (margin - 35) + 'px';
  }

  // move cursor 
  const nextLetter = document.querySelector('.letter.current');
  const nextWord = document.querySelector('.word.current');
  const cursor = document.getElementById('cursor');
  const hasChangeClass = cursor.classList.contains('change');

  if (!hasChangeClass) {
    addClass(cursor, 'change');
  }
  cursor.style.top = (nextLetter || nextWord || ' ').getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = (nextLetter || nextWord || ' ').getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';

});

// new game button
document.getElementById('newGame').addEventListener('click', () => {
  gameOver();
  newgame();
  cursor.style.top = 5 + 'px';
  cursor.style.left = 2 + 'px';
});


newgame();
