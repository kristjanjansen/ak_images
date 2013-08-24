$.getJSON('../files/index.json', function(data) {
  console.log(data)
  data.forEach(function(item) {
    $('body').append(item.dir + '<br />')
    item.files.forEach(function(file) {
      $('body').append('<img src=../' + encodeURI(file.filepath_target) + ' />')
    })
  })
})