const getStateLinks = require('./get-state-links.js');
const parseStatePage = require('./parse-state-page.js');
const parsePaperPage = require('./parse-paper-page.js');
const fs = require('fs');

const log = (it) => {
  console.log(it);
  return it;
}

const flatten = array => array.reduce((av, cv) => av.concat(cv), []);

let errorStates;
let papersWithoutWikiLinks;

getStateLinks('https://en.wikipedia.org/wiki/List_of_newspapers_in_the_United_States')
  .then(states => 
    Promise.all(
      states.map(state => 
        parseStatePage(state)
        .catch(error => Object.assign({}, state, { error: error.message }))
      )
  ))
  .then(papers => {
    errorStates = papers.filter(paper => paper.error);
    return papers.filter(paper => !paper.error);
  })
  .then(papers => flatten(papers))
  .then(papers => {
    papersWithoutWikiLinks = papers.filter(paper => !paper.wikiLink);
    return papers.filter(paper => paper.wikiLink);
  })
  .then(papers => Promise.all(papers.map(parsePaperPage)))
  .then(papers => {
    fs.writeFile('newspapers.csv', papers.reduce((str, paper) => {
      return str.concat(`${paper.name},${paper.link},${paper.state},${paper.locale},${paper.wikiLink},${paper.error}\n`)
    }, ''))
    fs.writeFile('non-scraped-states.csv', errorStates.reduce((str, state) => {
      return str.concat(`${state.state},\n`)
    }, ''))
    fs.writeFile('non-scraped-papers.csv', papersWithoutWikiLinks.reduce((str, paper) => {
      return str.concat(`${paper.name},${paper.state},${paper.locale}`)
    }, ''))
  })
  // .then(papers => Promise.all(papers.map(parsePaperPage)))
  // .then(log)