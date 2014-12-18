console.log("welcome admin");

$(document).on('ready', function() {
  var sendMessage = function(msg) {
    $.ajax({
      url:  '/message',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({message: msg})
    });
  }

  $("a.reloadAll").on('click', function() {
    sendMessage("reloadAll");
  });

  $("a.broadcast").on('click', function() {
    var msg = $("textarea.msg").val().trim();

    if (msg && msg !== "") {
      sendMessage({type: "broadcast", msg: msg});
    }
  });
});