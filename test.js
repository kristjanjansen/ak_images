var fs = require('fs');
var path = require('path');
var watch = require('watch')
var im = require('imagemagick');

var source = 'files/source'
var target = 'files/target'

var filetypes = /\.(jpg|jpeg|png|gif)$/i

watch.createMonitor(source, {ignoreDotFiles: true}, function (monitor) {
   monitor.on("created", function (f, stat) {
    console.log('crea', f)
       
    if (stat.isDirectory()) {
      
        console.log('dir')
      
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
    
      console.log('file')
      
        var tgt = f.replace(source, target)
        generateThumbnail(f, tgt, function() {});
    }
       
   })
   monitor.on("changed", function (f, curr, prev) {
     console.log('cha', f)
   })
   monitor.on("removed", function (f, stat) {
     console.log('rem', f)
     file = f.replace(source, target)
     if (fs.existsSync(file))
     fs.unlinkSync(file)  
   })
 })


function generateThumbnail(sf, tf, cb) {
   
  console.log('src tgt ', sf,tf)

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