export class MemoryGame 
{
  constructor(containerId, startLevel = 2)
   {
    this.container = document.getElementById(containerId);
    this.level = startLevel;
    this.cards = [];
    this.firstCard = null;
    this.lockBoard = false;
    this.matches = 0;
  }
  start() 
  {
    this.matches = 0;
    this.cards = [];
    this.firstCard = null;
    this.lockBoard = false;
    this.container.innerHTML = '';

    const vals = Array.from({ length: this.level }, (_, i) => i + 1);
    const gameVals = [...vals, ...vals]; 
    this.shuffle(gameVals);

    gameVals.forEach(v => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.value = v;
      card.textContent = '?';
      card.addEventListener('click', () => this.flipCard(card));
      this.container.appendChild(card);
      this.cards.push(card);
    });
  }
  shuffle(arr) 
  {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  flipCard(card) 
  {
    if (this.lockBoard || card === this.firstCard || card.classList.contains('matched')) return;
    card.textContent = card.dataset.value;
    card.classList.add('flipped');

    if (!this.firstCard) {
      this.firstCard = card;
      return;
    }

    if (card.dataset.value === this.firstCard.dataset.value) {
      card.classList.add('matched');
      this.firstCard.classList.add('matched');
      this.matches++;
      this.firstCard = null;

      if (this.matches === this.level) {
        setTimeout(() => alert('You matched all cards! Level up!'), 300);
        this.level++;
        this.start();
      }
    } 
    else 
        {
      this.lockBoard = true;
      setTimeout(() => {
        card.textContent = '?';
        this.firstCard.textContent = '?';
        card.classList.remove('flipped');
        this.firstCard.classList.remove('flipped');
        this.firstCard = null;
        this.lockBoard = false;
      }, 900);
    }
  }
}
