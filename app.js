var fs = require('fs');
var path = require('path');
var watch = require('watch')
var im = require('imagemagick');
var express = require('express');
var wrench = require('wrench')


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

  return index

}

/*
watch.createMonitor(source, {ignoreDotFiles: true}, function (monitor) {

   monitor.on("created", function (f, stat) {
    console.log('crea', f)
       
    if (stat.isDirectory()) {

      var dir = f.replace(source, target)
   
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, function() {})
      }
      
      fs.readdirSync(f)
       .filter(function (file) {
         return fs.statSync(path.join(f, file)).isFile() && file.match(filetypes);
       })
       .forEach(function (file) {
         var src = path.join(f,file)
         var tgt = src.replace(source, target)
         generateThumbnail(src, tgt, function() {});
       });
    
    } else if (f.match(filetypes)) {
        var tgt = f.replace(source, target)
        generateThumbnail(f, tgt, function() {});
    }
       
   })
   
   monitor.on("changed", function (f, curr, prev) {
     console.log('cha', f)
   })
   
   monitor.on("removed", function (f, stat) {
     console.log('rem', f)
   })
   
 })


 function generateThumbnail(sf, tf, cb) {

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
 
*/
