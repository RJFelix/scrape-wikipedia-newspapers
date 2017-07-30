const { JSDOM } = require('jsdom');

function parsePaperPage(paperInfo) {
  return JSDOM.fromURL(paperInfo.wikiLink)
    .then(jsd => jsd.window.document)
    .then(document => document.querySelectorAll('.infobox tr'))
    .then(rowNodes => {
      if(rowNodes.length < 1)
        throw new Error('Paper page not in recognized format.')
      return rowNodes;
    })
    .then(rowNodes => Array.from(rowNodes))
    .then(rows => rows.filter(row => row.textContent.includes('Website')))
    .then(linkRows => {
      if(linkRows.length < 1) {
        throw new Error('No link to website in paper wiki page infobox.')
      }
      return linkRows[0]
    })
    .then(linkRow => linkRow.querySelector('a'))
    .then(a => a.href)
    .then(link => Object.assign({}, paperInfo, { link: link }))
    .catch(error => Object.assign({}, paperInfo, { error: error.message }));
}

module.exports = parsePaperPage;