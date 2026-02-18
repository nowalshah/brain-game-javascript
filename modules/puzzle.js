export class Puzzle 
{
  constructor(puzzle, answer, hint = '') 
  {
    this.puzzle = puzzle;
    this.answer = (answer || '').toString().toLowerCase();
    this.hint = hint;
    this.createdAt = new Date().toISOString();
  }
  checkAnswer(userAnswer)
   {
    if (!userAnswer) return false;
    return userAnswer.toLowerCase().trim() === this.answer;
    }
  getHint() 
  {
    return this.hint || 'No hint available';
  }
}
export class AdvancedPuzzle extends Puzzle
 {
  constructor(puzzle, answer, hint = '', options = {})
   {
    const defaults = { difficulty: 'medium' };
    const merged = { ...defaults, ...options }; 
    super(puzzle, answer, hint);
    this.options = merged;
   }
  isHard() 
  {
    return this.options.difficulty === 'hard';
  }
}
