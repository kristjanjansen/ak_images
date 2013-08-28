$(document).ready(function() {

  page('/', data, log)
  page('/:path', data, log)
  page()

})


function data(ctx, next) {

  $.getJSON('/index.json', function(data) {
    ctx.data = data
    next()
  })

}

function log(ctx, next) {
  console.log(ctx.data)  
  next()
}

   /*
  $.getJSON('../files/index.json', function(data) {
    console.log(data)

    var output = Mustache.render($('#front').html(), data)
    $('body').html(output)
*/