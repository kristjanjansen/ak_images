$(document).ready(function() {

  page('*', data)
  page('/', renderFront)
  page('/:dir/:file?', renderDir)
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

  console.log(ctx.params.file)
  
//  $('body').html('hem')
/*  
  ctx.data.index.forEach(function(item) {
    if (item.dir == ctx.params.dir) {
      var output = Mustache.render($('#dir').html(), item)
      $('body').html(output)
    }
  })
*/  
}

   /*
  $.getJSON('../files/index.json', function(data) {
    console.log(data)

    var output = Mustache.render($('#front').html(), data)
    $('body').html(output)
*/