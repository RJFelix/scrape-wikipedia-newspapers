const { JSDOM } = require('jsdom');

excludeRedLinks = (url) => url.includes('redlink=1') ? '' : url;

function parseStatePage(stateInfo) {
  return JSDOM.fromURL(stateInfo.wikiLink)
    .then(jsd => jsd.window.document)
    .then(document => document.querySelectorAll('table:first-of-type i a'))
    .then(nodeList => {
      if(nodeList.length < 1)
        throw new Error('State listing not in table format.')
      return nodeList;
    })
    .then(nodeList => Array.from(nodeList))
    .then(nodes => nodes.map(node => ({ name: node.textContent, state: stateInfo.state, wikiLink: excludeRedLinks(node.href),
      locale: node.parentNode.parentNode.parentNode.querySelectorAll('td:nth-of-type(2) a')[0].textContent
    })))
}

module.exports = parseStatePage;