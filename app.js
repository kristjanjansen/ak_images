var fs = require('fs');
var path = require('path');
var watch = require('watch')
var im = require('imagemagick-native');
var express = require('express');
var wrench = require('wrench')
var each = require('each')

var port = 4001

var cron = require('cron').CronJob;
var job = new cron('*/5 * * * * *', processDir).start()


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


var filetypes = /\.(jpg|jpeg|png|gif)$/i

var source = 'files/source'
var target = 'files/target'
var indexFile = 'files/index.json'

var levelup = require('levelup');
var db = levelup('./db')
var Jobs = require('level-jobs');

function worker(payload, callback) {
  console.log(payload)
  var p = path.join(target, payload.f.split('/')[0])
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p)
  }
  var s = path.join(source, payload.f)
  var t = path.join(target, payload.f)  
  generateThumbnail(s, t, function() {
    callback()
  })

callback()
}

var queue = Jobs(db, worker, 5);



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
  
// Travel the source directories and find images not yet converted

wrench.readdirSyncRecursive(source)
.filter(function(f) {
    return f.split('/').length == 2 && fs.statSync(path.join(source, f)).isFile() && f.match(filetypes)
})
.forEach(function (f) {
  if (!fs.existsSync(path.join(target, f))) {
  console.log('### Adding to queue', f)
    queue.push({f: f}, function(err) {
      if (err) console.error('Error pushing work into the queue', err.stack)
    })
  
  }
  
})

// Process each image in queue
/*
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
*/

}


function generateThumbnail(s, t, callback) {
 
  console.log('im:', s, t)
 
  fs.readFile(s, function(err, data) {
  
  if (err) throw err

  var ts = fs.createWriteStream(t)  
  var image = im.convert({
    srcData: data,
    width: 200,
    height: 200,
    debug: 1
  })
  ts.write(image, function() {
    callback()
  })
  
  })
    
}

