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
  }

  nodes?.forEach(node => {
    const newNode = document.createElement('p');
    const censorship = '*'.repeat(Math.round(Math.random() * 5 + 3));

    newNode.innerHTML = node.nodeValue.replace(regex, `<span style="filter: blur(3px)">${censorship}</span>`);
    node.parentNode.replaceChild(newNode, node);
  });
};

censor();
