var fs = require('fs');
var path = require('path');
//var watch = require('watch')
//var im = require('imagemagick-native');
var express = require('express');
var wrench = require('wrench')
//var each = require('each')

var port = 4001
var filetypes = /\.(jpg|jpeg|png|gif)$/i
var source = 'files/source'
var target = 'files/target'
var indexFile = 'files/index.json'


function generateIndex() {

  var index = {}

  wrench.readdirSyncRecursive(source)
  .filter(function(f) {
      return f.split('/').length == 2 && fs.statSync(path.join(source, f)).isFile() && f.match(filetypes)
  })
  .forEach(function (f) {
    var dir = f.split('/')[0]
    var file = f.split('/')[1]

    if (!index[dir]) {
      index[dir] = {}
      index[dir].files = []
    } 

    index[dir].files.push({
      file: file,
      filepath_source: path.join(source, f),
      filepath_target: path.join(target, f)
    })

  })

  var index_a = []
  for (key in index) {
    index_a.push({dir: key, files: index[key].files})
  }
  return index_a

}


app = express()
  
app.use('/files', express.static(path.join(__dirname, '/files')))
app.use(express.static(path.join(__dirname, '/public')))

app.get('/index.json', function(req, res){
  res.json({index: generateIndex()});
});

app.get('/*', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});
  
app.listen(port)

console.log('Listening on port', port)
