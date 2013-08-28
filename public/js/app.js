$(document).ready(function() {

  page('/', data, renderFront)
  page('/:dir', data, log)
  page()

})


function data(ctx, next) {

  $.getJSON('/index.json', function(data) {
    ctx.data = data
    next()
  })

}

function log(ctx, next) {
  console.log(ctx.params.dir)  
  console.log(ctx.params.file)  
  console.log(ctx.data)  
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