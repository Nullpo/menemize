var fs = require('fs');
var menemize = require('../dist/menemize.js');

fs.readFile('ftp://algo', function (err, data) {
  if(code == "ENOENT"){
    //Lot of code
  } else if(code == 'EACCESS') {
    //Second lot of code
  } else if(code == 'EISDIR'){
    //Third lot of code
  }
});


fs.readFile('cantTouchThis', function (err, data) {
  console.log(err);
});
