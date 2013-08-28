$(document).ready(function() {

  page('/', data, renderFront, log)
  page('/:dir', data, log)
  page({dispatch: true})

})


function data(ctx, next) {

  $.getJSON('/index.json', function(data) {
    ctx.data = data
    next()
  })

}

function log(ctx, next) {
  console.log(ctx.data)  
  console.log(ctx.params.dir)  
  console.log(ctx.params.file)  
  next()
}

function renderFront(ctx, next) {
  var output = Mustache.render($('#index').html(), ctx.data)
  $('body').html(output)
  next()
}

   /*
  $.getJSON('../files/index.json', function(data) {
    console.log(data)

    var output = Mustache.render($('#front').html(), data)
    $('body').html(output)
*/