export class Score {
  constructor() {
    this.score = Number(localStorage.getItem('score')) || 0;

    const raw = localStorage.getItem('recentAnswers');
    this.recentAnswers = raw ? JSON.parse(raw) : [];

    const rawSettings = localStorage.getItem('gameSettings');
    this.settings = rawSettings ? JSON.parse(rawSettings) : { sound: true, difficulty: 'easy' };
  }
  increment() 
  {
    this.score += 1;
    localStorage.setItem('score', this.score);
  }
  getScore() 
  {
    return this.score;
  }
  reset()
   {
    this.score = 0;
    localStorage.setItem('score', this.score);

    this.recentAnswers = [];
    localStorage.setItem('recentAnswers', JSON.stringify(this.recentAnswers));

    this.settings = { sound: false, difficulty: 'easy' };
    localStorage.setItem('gameSettings', JSON.stringify(this.settings));
  }
  addAnswer(obj) 
  {
    const entry = { ...obj, time: new Date().toISOString() }; 
    this.recentAnswers = [entry, ...this.recentAnswers].slice(0, 20);
    localStorage.setItem('recentAnswers', JSON.stringify(this.recentAnswers));
  }
  getRecentAnswers() 
  {
    const raw = localStorage.getItem('recentAnswers');
    return raw ? JSON.parse(raw) : [];
  }
  saveSettings(s) 
  {
    this.settings = { ...this.settings, ...s };
    localStorage.setItem('gameSettings', JSON.stringify(this.settings)); 
  }
}
