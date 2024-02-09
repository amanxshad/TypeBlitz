const words = 'the quick brown fox jumps over the lazy dog each day brings new opportunities for growth and learning time flies when having fun so make the most of every moment life is a journey filled with unexpected twists and turns Success often comes to those who persevere and never give up on their dreams remember to stay true to yourself and embrace the challenges that come your way'.split(' ');
const wordsCount = words.length;

// generating random word order
function randomword() {
  const randomindex = Math.ceil(Math.random() * wordsCount);
  return words[randomindex];
}

// segregating each word letter 
function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

// for tracking current word and current letter
function addClass(el, name) {
  el.classname += ' ' + name;
}
function removeClass(el, name) {
  el.classname = el.classname.replace(name, '');
}

// Display of random typing test words
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
  const expected = currentLetter.innerHTML;
})

newgame();
