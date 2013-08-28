//$(document).ready(function() {

  page('*', data)
  page('/', renderFront)
  page('/:dir', renderDir)
  page({dispatch: true})

  
//})


function data(ctx, next) {

  $.getJSON('/index.json', function(data) {
    ctx.data = data
    next()
  })

}


function renderFront(ctx, next) {
  var output = Mustache.render($('#index').html(), ctx.data)
  $('body').html(output)
  
}

function renderDir(ctx, next) {
 
  $('body').html('hem')
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