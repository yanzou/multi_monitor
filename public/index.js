
function init() {

  var serverBaseUrl = document.domain;
  var socket = io.connect(serverBaseUrl);
  var sessionId = '';

  socket.on('connect', function() {
    sessionId = socket.io.engine.id;
    socket.emit('newUser', {id: sessionId, name: Date.now()});
    console.log('Connected ' + sessionId);
  });

  socket.on('refresh', function (data) {
    console.log('refresh', data)
    var urls = data.urls,
      frames,
      frame;

    if (urls && urls.length) {
      $.each(urls, function(idx, url) {
        frame = $('frame[name='+ url +']')[0];
        if (frame) {frame.src = frame.src;}
      });
    } else {
      frames = $('frame');
      $.each(frames, function(idx, frame) {
        frame.src = frame.src;
      });
    }
  });

  socket.on('error', function (reason) {
    console.log('Unable to connect to server', reason);
  });

}

$(document).on('ready', init);
