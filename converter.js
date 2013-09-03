var fs = require('fs');
var path = require('path');

//var watch = require('watch')
var im = require('imagemagick-native');
//var express = require('express');
var wrench = require('wrench')
var each = require('each')
var levelup = require('levelup');
var Jobs = require('level-jobs');
var cron = require('cron');

var port = 4001
var filetypes = /\.(jpg|jpeg|png|gif)$/i
var sourceDir = 'files/original'

var preset = {
  small: {
    targetDir: 'files/small',
    width: 200,
    height: 200     
  },
  big: {
    targetDir: 'files/big',
    width: 800,
    height: 800     
  }
}


function processDir() {
  
wrench.readdirSyncRecursive(sourceDir)
.filter(function(f) {
    return f.split('/').length == 2 && fs.statSync(path.join(sourceDir, f)).isFile() && f.match(filetypes)
})
.forEach(function (f) {
  for (key in preset) {
    if (!fs.existsSync(path.join(preset[key].targetDir, f))) {
    console.log('### Adding to queue', f)
      queue.push({f: f}, function(err) {
        if (err) console.error('Error pushing work into the queue', err.stack)
      })  
    }
  }  
})

}


function worker(payload, callback) {

  each(preset)
  .on('item', function(key, value, next) {
  var p = path.join(preset[key].targetDir, payload.f.split('/')[0])
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p)
  }
  var s = path.join(sourceDir, payload.f)
  var t = path.join(preset[key].targetDir, payload.f)  
  generateThumbnail(s, t, function() {
    next()
  })
  })
  .on('end', function() {
    callback()
  });
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

var db = levelup('./db')
var queue = Jobs(db, worker, 5);

var cron = new cron.CronJob('*/5 * * * * *', processDir).start()
