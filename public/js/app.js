$(document).ready(function() {

  page('*', data)
  page('/', renderFront)
  page('/:dir', renderDir)
  page('/:dir/:file', renderFile)
  page({dispatch: true, click: false})

  $('a').on('click', function(ev) {
    var dir = $(this).attr(href)
    console.log(dir)
  })
  
})


function data(ctx, next) {

  $.getJSON('/index.json', function(data) {
    ctx.indexTpl = Mustache.render($('#index').html(), data)

    ctx.dirTpl = {}

    data.index.forEach(function(item) {
      ctx.dirTpl[item.dir] = Mustache.render($('#dir').html(), item)
          
      item.files.forEach(function(i) {
        console.log(item, i)
        ctx.dirTpl[item.dir + '/' + i.file] = Mustache.render($('#file').html(), {dir: item, file: i})
      })
      
    })
    
    next()
  })

}


function renderFront(ctx, next) {
  $('body').html(ctx.indexTpl)
  next()
}

function renderDir(ctx, next) {
  $('body').html(ctx.dirTpl[ctx.params.dir])
}

function renderFile(ctx, next) {
  $('body').html(ctx.dirTpl[ctx.params.dir + '/' + ctx.params.file])
}