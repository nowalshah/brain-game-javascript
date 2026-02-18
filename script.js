import { fetchPuzzleFromAPIs } from './modules/api.js';
import { showPuzzle, showFeedback, showScore, showRecent } from './modules/display.js';
import { Puzzle, AdvancedPuzzle } from './modules/puzzle.js';
import { Score } from './modules/score.js';
import { MemoryGame } from './modules/memory.js';

let puzzles = [];
let currentPuzzle = null;
const score = new Score();

// load local puzzles (async OP 1)
async function loadLocalPuzzles() {
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('Failed to load data.json');
    puzzles = await res.json();
    console.log('Local puzzles loaded:', puzzles.length);
  } catch (err) {
    console.error('loadLocalPuzzles error:', err);
    puzzles = [];
  }
}
function randomLocalPuzzle() {
  if (!puzzles.length) {
    return new Puzzle(
      "No local puzzles available.",
      "__INVALID__",          
      "Try clicking 'Get New Puzzle' for online puzzles."
    );
  }

  const p = puzzles[Math.floor(Math.random() * puzzles.length)];
  const copy = { ...p };
  return new Puzzle(copy.puzzle, copy.answer, copy.hint);
}
// This get new puzzle (async  OP 2 )
async function getNewPuzzle() {
  try {
    // Always try APIs first
    const apiPuzzle = await fetchPuzzleFromAPIs();
    if (apiPuzzle)
         {
      currentPuzzle = Math.random() > 0.5
        ? new AdvancedPuzzle(apiPuzzle.puzzle, apiPuzzle.answer, apiPuzzle.hint, { difficulty: 'hard' })
        : new Puzzle(apiPuzzle.puzzle, apiPuzzle.answer, apiPuzzle.hint);
    } 
    else 
     {
      currentPuzzle = randomLocalPuzzle();
    }
    showPuzzle(currentPuzzle);
    showFeedback('');
  } 
  catch (err) 
  {
    console.error('getNewPuzzle error:', err);
    currentPuzzle = randomLocalPuzzle();
    showPuzzle(currentPuzzle);
    showFeedback('Problem fetching online. Showing local puzzle.', 'orange');
  }
}
// The Event listeners
document.getElementById('newPuzzleBtn').addEventListener('click', getNewPuzzle);
document.getElementById('submitAnswerBtn').addEventListener('click', () => {
  const input = document.getElementById('userAnswer');
  const answer = input.value.trim();
  if (!answer) return showFeedback('Please enter an answer.', 'red');

  // The record attempt (Score.addAnswer will stringify)
  score.addAnswer({ attempt: answer, puzzle: currentPuzzle ? currentPuzzle.puzzle : '' });
  showRecent(score.getRecentAnswers());

if (currentPuzzle && currentPuzzle.answer !== "__INVALID__" && currentPuzzle.checkAnswer(answer)) {
    showFeedback('Correct!', 'green');
    score.increment();
    showScore(score.getScore());
  } else {
    showFeedback('Wrong! Try again.', 'red');
  }
  input.value = '';
});

document.getElementById('hintBtn').addEventListener('click', () => {
  if (!currentPuzzle) return showFeedback('No puzzle loaded.', 'red');
  showFeedback(`Hint: ${currentPuzzle.getHint()}`, 'orange');
});

// The reset button
document.getElementById('resetScoreBtn').addEventListener('click', () => {
  score.reset();
  showScore(score.getScore());
  showRecent(score.getRecentAnswers());
  showFeedback('Score reset.', 'green');
});

// The memory game
const memoryGame = new MemoryGame('memoryGame', 2);
document.getElementById('startMemoryBtn').addEventListener('click', () => memoryGame.start());

// initial load
(async function init() {
  await loadLocalPuzzles(); // async #1
  showScore(score.getScore());
  showRecent(score.getRecentAnswers());
  await getNewPuzzle();     // async #2
})();
