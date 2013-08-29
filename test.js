var fs = require('fs')
var path = require('path')

var wrench = require('wrench')

var source = 'files/source'
var target = 'files/target'
var filetypes = /\.(jpg|jpeg|png|gif)$/i

var queue = []

wrench.readdirSyncRecursive('./files/source')
.filter(function(f) {
    return f.split('/').length == 2 && fs.statSync(path.join(source, f)).isFile() && f.match(filetypes)
})
.forEach(function (f) {
  if (!fs.existsSync(path.join(target, f))) queue.push(f)
})

console.log(queue)
