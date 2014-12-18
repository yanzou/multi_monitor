
function init() {

  var serverBaseUrl = document.domain;
  var socket = io.connect(serverBaseUrl);
  var sessionId = '';

  socket.on('connect', function() {
    sessionId = socket.io.engine.id;
    socket.emit('newUser', {id: sessionId, name: Date.now()});
    console.log('Connected ' + sessionId);
  });

  socket.on('incomingMessage', function (msg) {
    console.log('incomingMessage', msg)

    var urls,
      frames,
      frame;

    if (msg.message === "reloadAll") {
      urls = msg.urls
      if (urls && urls.length) {
        $.each(urls, function(idx, url) {
          frame = $('iframe[name='+ url +']')[0];
          if (frame) {frame.src = frame.src;}
        });
      } else {
        frames = $('iframe');
        $.each(frames, function(idx, frame) {
          frame.src = frame.src;
        });
      }
    } else {
      if (msg.message.type === "broadcast") {
        $("div.broadcast").text(msg.message.msg).removeClass('hide');
      }
      //JSON.parse(
    }
  });

  socket.on('error', function (reason) {
    console.log('Unable to connect to server', reason);
  });


  // var sendMessage = function(msg) {
  //   $.ajax({
  //     url:  '/message',
  //     type: 'POST',
  //     contentType: 'application/json',
  //     dataType: 'json',
  //     data: JSON.stringify({message: msg})
  //   });
  // }

  // $("a.reloadAll").on('click', function() {
  //   sendMessage("reloadAll");
  // });
}



$(document).on('ready', function() {
  init();
});

