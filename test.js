var fs = require('fs')
var path = require('path')
var each = require('each')
var cron = require('cron').CronJob;

var wrench = require('wrench')
var im = require('imagemagick');

var source = 'files/source'
var target = 'files/target'
var filetypes = /\.(jpg|jpeg|png|gif)$/i

var cron = require('cron').CronJob;
//var job = new cron('*/10 * * * * *', processDir).start()

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
  
  index[dir].files.push(file)

})
console.log(index)





function processDir() {
  
var queue = []

// Travel the source directories and find images not yet converted

wrench.readdirSyncRecursive('./files/source')
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
  console.log('Done')
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