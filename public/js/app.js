//$(document).ready(function() {

  page('*', data)
  page('/', renderFront)
  page('/:dir', renderDir)
  page({dispatch: true})

  
//})


function data(ctx, next) {

  $.getJSON('/index.json', function(data) {
    ctx.indexTpl = Mustache.render($('#index').html(), data)

    ctx.dirTpl = {}

    data.index.forEach(function(item) {
      ctx.dirTpl[item.dir] = Mustache.render($('#dir').html(), item)
 //     ctx.dir[item.dir] = item.dir

    })
    
    next()
  })

}


function renderFront(ctx, next) {
  $('body').html(ctx.indexTpl)
  next()
}

function renderDir(ctx, next) {
  //console.log(ctx.dir,ctx.params.dir)
//  $('body').html(ctx.dir[ctx.params.dir])
  $('body').html(ctx.dirTpl[ctx.params.dir])

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