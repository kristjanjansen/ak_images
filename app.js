var fs = require('fs');
var path = require('path');
var watch = require('watch')
var im = require('imagemagick');
var express = require('express');


app = express()
  
  app.use('/files', express.static(path.join(__dirname, '/files')))
  app.use(express.static(path.join(__dirname, '/public')))
  
  app.get('/index.json', function(req, res){
    res.json({index: generateIndex()});
  });

  app.get('/*', function(req, res){
    res.sendfile(__dirname + '/public/index.html');
  });
  
app.listen(3000)


var filetypes = /\.(jpg|jpeg|png|gif)$/i

var source = 'files/source'
var target = 'files/target'
var indexFile = 'files/index.json'

function validateFile(file) {
  return fs.statSync(file).isFile() && file.match(filetypes)
} 

watch.createMonitor(source, function (monitor) {
   monitor.on("created", function (f, stat) {
       generateThumbnail(f, function() {
       });
   })
   monitor.on("changed", function (f, curr, prev) {
   })
   monitor.on("removed", function (f, stat) {
   })
 })


function generateThumbnail(sf, cb) {
  
  var tf = sf.replace(source, target)
 
  if (!fs.existsSync(path.dirname(tf))) {
    fs.mkdirSync(path.dirname(tf))
  }

  im.crop({
    srcPath: sf,
    dstPath: tf,
    width: 200,
    height: 200
  }, function(err, stdout, stderr) {
    console.log(err, stdout, stderr)
    cb()
  });
}



function generateIndex() {

var index = []

fs.readdirSync(source)
    .filter(function(dir) {
        return fs.statSync(path.join(source, dir)).isDirectory();
    })
    .forEach(function (dir) {
      
      var indexDir = {}
      indexDir.dir = dir
      indexDir.files = []
      
      fs.readdirSync(path.join(source, dir))
      .filter(function (file) {
        return fs.statSync(path.join(source, dir, file)).isFile() && file.match(filetypes);
      })
      .forEach(function (file) {
        var indexFile = {
          file: file,
          filepath_source: path.join(source, dir, file),
          filepath_target: path.join(target, dir, file)
        }
        indexDir.files.push(indexFile)
      });
      
    //  if (indexDir.files) indexDir.filepath_target = indexDir.files[0].filepath_target
      index.push(indexDir)
      
    });

    return index

}