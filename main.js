console.log('The extension is running');

const url = chrome.runtime.getURL('badWords.json');

const fetchBadWords = async () => {
  try {
    const response = await fetch(url);
    const badWords = await response.json();
    return badWords;
  } catch (error) {
    console.error('Error fetching bad words:', error);
    return [];
  }
};

const censor = async () => {
  const badWords = await fetchBadWords();
  if (badWords.length === 0) return;

  const tree = document.body.querySelectorAll('*');
  const elements = Array.from(tree);

  for (let i = 0; i < elements.length; i++) {
    const word = elements[i].textContent.trim().toLowerCase();
    if (badWords.find(el => el == word)) {
      elements[i].style.filter = 'blur(4px)';
    }
  }
};

censor();
