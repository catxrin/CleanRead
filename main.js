console.log('The extension is running');

const badWordsJSON = chrome.runtime.getURL('badWords.json');

const fetchBadWords = async () => {
  try {
    const response = await fetch(badWordsJSON);
    const badWords = await response.json();
    return badWords;
  } catch (error) {
    console.error('Error fetching bad words:', error);
    return [];
  }
};

const censor = async () => {
  const nodes = [];
  const badWords = await fetchBadWords();
  const regex = new RegExp(`\\b(${badWords.join('|')})\\b`, 'gi');

  if (badWords.length === 0) return;

  const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, node =>
    !node.nodeValue.trim() ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
  );

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    const text = node.nodeValue;

    if (regex.test(text)) nodes.push(node);

    regex.lastIndex = 0;
  }

  nodes?.forEach(node => {
    const newNode = document.createElement('span');
    newNode.style.filter = 'blur(3px)';

    const censorship = '*'.repeat(Math.round(Math.random() * 5 + 3));
    newNode.textContent = censorship;

    node.parentElement.insertBefore(newNode, node);
    node.parentNode.removeChild(node);
  });
};

censor();
