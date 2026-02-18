export function showPuzzle(puzzle) {
  const el = document.getElementById('puzzle-display');
  el.textContent = puzzle ? puzzle.puzzle : 'No puzzle available.';
}

export function showFeedback(message, color = 'green') {
  const el = document.getElementById('feedback');
  el.textContent = message;
  el.style.color = color;
}

export function showScore(num) {
  const el = document.getElementById('scoreDisplay');
  el.textContent = `Score: ${num}`;
}

export function showRecent(list) {
  const container = document.getElementById('recentList');
  if (!list || list.length === 0) {
    container.innerHTML = '(none yet)';
    return;
  }
  // show only last 5 attempts
  container.innerHTML = '';
  list.slice(0,5).forEach(item => {
    const d = document.createElement('div');
    d.textContent = `${item.time.split('T')[0]} ${item.time.split('T')[1].slice(0,8)} — ${item.attempt} (${item.puzzle.slice(0,30)}...)`;
    container.appendChild(d);
  });
}
