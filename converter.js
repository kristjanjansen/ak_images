var fs = require('fs');
var path = require('path');

var im = require('imagemagick-native');
var wrench = require('wrench')
var each = require('each')
var levelup = require('levelup');
var Jobs = require('level-jobs');
var cron = require('cron');

var port = 4001
var concurrentJobs = 2

var filetypes = /\.(jpg|jpeg|png|gif)$/i
var sourceDir = 'files/original'

var preset = {
  small: {
    targetDir: 'files/small',
    width: 200,
    height: 200,
    resizeStyle: 'aspectfill'     
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
    var targetFile = path.join(preset[key].targetDir, f)
    if (!fs.existsSync(targetFile)) {
    
      var targetDir = path.join(preset[key].targetDir, f.split('/')[0])
       if (!fs.existsSync(targetDir)) {
         fs.mkdirSync(targetDir)
       }
       fs.openSync(targetFile, 'w')
         
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
 
  var s = path.join(sourceDir, payload.f)
  var t = path.join(preset[key].targetDir, payload.f)  
  generateThumbnail(s, t, preset[key].width, preset[key].height, preset[key].resizeStyle ? preset[key].resizeStyle : null, function() {
    next()
  })
  })
  .on('end', function() {
    callback()
  });
}


function generateThumbnail(s, t, w, h, resizeStyle, callback) {
 
  console.log('im:', s, t)
 
  fs.readFile(s, function(err, data) {
  
  if (err) throw err

  var ts = fs.createWriteStream(t)  
  var image = im.convert({
    srcData: data,
    width: w,
    height: h,
    resizeStyle: resizeStyle || 'aspectfit',
    debug: 1
  })
  ts.write(image, function() {
    callback()
  })
  
  })
    
}

var db = levelup('./db')
var queue = Jobs(db, worker, concurrentJobs);

var cron = new cron.CronJob('*/15 * * * * *', processDir).start()
