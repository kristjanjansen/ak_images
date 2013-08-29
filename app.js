var fs = require('fs');
var path = require('path');
var watch = require('watch')
var im = require('imagemagick');
var express = require('express');
var wrench = require('wrench')
var each = require('each')


var cron = require('cron').CronJob;
var job = new cron('*/20 * * * * *', processDir).start()


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


function processDir() {
  
var queue = []

// Travel the source directories and find images not yet converted

wrench.readdirSyncRecursive(source)
.filter(function(f) {
    return f.split('/').length == 2 && fs.statSync(path.join(source, f)).isFile() && f.match(filetypes)
})
.forEach(function (f) {
  if (!fs.existsSync(path.join(target, f))) queue.push(f)
})

// Process each image in queue

each(queue)
.on('item', function(f, i, next) {
  var p = path.join(target, f.split('/')[0])
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p)
  }
  var s = path.join(source, f)
  var t = path.join(target, f)  
  generateThumbnail(s, t, function() {
    next()
  })
})
.on('end', function() {
})

}


function generateThumbnail(s, t, callback) {
  console.log('im:', s, t)
  im.crop({
    srcPath: s,
    dstPath: t,
    width: 200,
    height: 200
  }, function(err, stdout, stderr) {
    console.log(err, stdout, stderr)
    callback()
  });
}

