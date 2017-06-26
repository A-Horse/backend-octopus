import fetch from 'isomorphic-fetch';
var colors = require('colors');

([
  ['Todo', 'http://127.0.0.1:5500/api/alive'],
  ['Todo Statistics', 'http://127.0.0.1:5501/api/alive']
]).map(item => {

  fetch(item[1]).then(resp => {
    console.log(item[0], 'success'.green);
  }).catch(() => {
    console.log(item[0], 'fail'.red);
  });
})
