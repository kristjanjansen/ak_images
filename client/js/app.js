$.getJSON('../files/index.json', function(data) {
  console.log(data)

  var output = Mustache.render($('#front').html(), data)
  $('body').html(output)

})
