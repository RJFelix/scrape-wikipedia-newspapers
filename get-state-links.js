const { JSDOM } = require('jsdom');

const log = (it) => {
  console.log(it);
  return it;
}

function getStateLinks(url) {
  return JSDOM.fromURL(url)
    .then(jsd => jsd.window.document)
    .then(document => document.querySelectorAll('h3 span.mw-headline a'))
    .then(nodeList => Array.from(nodeList))
    .then(nodes => nodes.map(node => ({ state: node.textContent, wikiLink: node.href })))
}

module.exports = getStateLinks;