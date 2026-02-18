const API_KEY = ""; 
export async function fetchPuzzleFromPrimaryAPI() {
  try {
    if (!API_KEY) {
      console.warn("Primary API skipped (no API key provided).");
      return null;
    }

    const res = await fetch('https://api.api-ninjas.com/v1/riddles', {
      headers: { 'X-Api-Key': API_KEY }
    });

    if (!res.ok) throw new Error('Primary API error ' + res.status);

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    return {
      puzzle: data[0].question,
      answer: data[0].answer,
      hint: data[0].category || 'Think!'
    };
  } 
  catch (err) {
    console.error('Primary API failed:', err);
    return null;
  }
}
export async function fetchPuzzleFromSecondaryAPI() {
  try {
    const res = await fetch('https://official-joke-api.appspot.com/jokes/general/random');
    if (!res.ok) throw new Error('Secondary API error ' + res.status);

    const data = await res.json();
    const joke = Array.isArray(data) ? data[0] : data;

    return {
      puzzle: `Joke puzzle: ${joke.setup}`,
      answer: joke.punchline,
      hint: `It ends with: "${joke.punchline.split(' ')[0]}..."`
    };
  } 
  catch (err) {
    console.error('Secondary API failed:', err);
    return null;
  }
}
export async function fetchPuzzleFromAPIs() {
  try {
    const [primary, secondary] = await Promise.all([fetchPuzzleFromPrimaryAPI(), fetchPuzzleFromSecondaryAPI()]);
    return primary || secondary || null;
  } 
  catch (err) 
  {
    console.error('fetchPuzzleFromAPIs error:', err);
    return null;
  }
}
