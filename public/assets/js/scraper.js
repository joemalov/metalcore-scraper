$(document).on("click", ".addCommentBtn", function() {

  var thisId = $(this).attr("data-id");


  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {

      comment: $("#postComment").val()
    }
  })
    .then(function(data) {

      console.log(data);
    });


  $("#postComment").val("");
});

$(document).on("click", ".deleteCommentBtn", function() {

  var thisId = $(this).attr("data-id");


  $.ajax({
    method: "DELETE",
    url: "/comments/" + thisId
  })
    .then(function(data) {

      console.log(data);
    });
});

$(document).on("click", ".commentBtn", function() {

  $("#modalCommentContainer").empty();

  var thisId = $(this).attr("data-id");


  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

    .then(function(data) {
      console.log(data);
      
      var modalCommentContainer = $("#modalCommentContainer");

      modalCommentContainer.append('<h4>' + data.title + '</h4>');

      for (var i = 0; i < data.comments.length; i++) {
        var panel = $('<div class="panel panel-default">');
        var panelbody = $('<div class="panel-body">').text(data.comments[i].comment);
        panelbody.append('<button data-id="' + data.comments[i]._id + '" type="submit" class="btn btn-danger deleteCommentBtn" data-dismiss="modal" style="float: right;">delete</button>')
        panel.append(panelbody);
        modalCommentContainer.append(panel);
      }

      form = $('<form>');
      form.append('<div class="form-group"><label for="postComment">comment:</label><input type="text" class="form-control" id="postComment" required></div>');
      form.append('<div class="text-right form-group"><button data-id="' + data._id + '" type="submit" class="btn btn-primary addCommentBtn" data-dismiss="modal">add comment</button></div>')

      modalCommentContainer.append(form);
    });
});

$(document).on("click", "#scrapeBtn", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  .then(function(data) {
      
    $(".jumbotron").after('<div class="alert alert-success" role="alert">scraping successful</div>');
    setTimeout(function () {
      location.reload();
    }, 5000);
  });
});