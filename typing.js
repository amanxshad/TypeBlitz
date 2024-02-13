const words = 'the quick brown fox jumps over the lazy dog each day brings new opportunities for growth and learning time flies when having fun so make the most of every moment life is a journey filled with unexpected twists and turns Success often comes to those who persevere and never give up on their dreams remember to stay true to yourself and embrace the challenges that come your way'.split(' ');
const wordsCount = words.length;

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

//
function newgame() {
  document.getElementById('words').innerHTML = '';
  for (let i = 0; i < 200; i++) {
    document.getElementById('words').innerHTML += formatWord(randomword());
  }
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
}


//events of typing
document.getElementById('game').addEventListener("keyup", (e) => {
  console.log(e);
  const key = e.key;
  const currentLetter = document.querySelector('.letter.current');
  const currentWord = document.querySelector('.word.current');
  
  const isLetter = key.length === 1 && key !== ' ';
  const isSpace = key === ' ';


  if (isLetter) {
    const expected = currentLetter.innerHTML;
    if (currentLetter) {
      addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
      removeClass(currentLetter, 'current');
      addClass(currentLetter.nextSibling, 'current');
    }
  }
  
  if (isSpace) {

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
  
})

newgame();
