var express = require("express")
  , app = express()
  , server = require("http").createServer(app)
  , bodyParser = require("body-parser")
  , io = require("socket.io")(server)
  , _ = require("underscore");

var clients = [];

app.set("port", 8080);
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(express.static("public", __dirname + "/public"));
app.use(bodyParser.json());


/* Server routing */
app.get("/", function(req, resp) {
    resp.render("index");
});

app.get("/admin", function(req, resp) {
    resp.render("admin");
});


app.post("/message", function(request, response) {
  var message = request.body.message;
  var name = request.body.name;
  console.log("incomingMessage", message, name);

  if(_.isUndefined(message) || _.isEmpty(message)) {
    return response.json(400, {error: "Message is invalid"});
  }

  io.sockets.emit("incomingMessage", {message: message, name: name});

  response.json(200, {message: "Message received"});

});

var urls = [
  "https://rally1.rallydev.com/#/18139297458d/custom/26410441219",
  "https://rally1.rallydev.com/#/18139297458d/defects?tpsV=sq%3A24555682024",
  "https://rally1.rallydev.com/#/18139297458d/defects?tpsV=sq%3A21297327970",
  "https://rally1.rallydev.com/#/18139297458d/releaseplanning",
  "https://rally1.rallydev.com/#/15100140825d/oiterationstatus?iterationKey=19798500213",
  "https://rally1.rallydev.com/#/15100140825d/custom/22296015722",
  "https://rally1.rallydev.com/#/15100139854d/oiterationstatus?iterationKey=19798500205",
  "https://rally1.rallydev.com/#/15100139854d/custom/22296015722",
  "http://smarttestdb.cal.ci.spirentcom.com/stapp/state_report/",
  "http://dashboard.cal.ci.spirentcom.com:8080/spd/",
  "http://avalanche-jenkins.spirentcom.com:8080/view/AV-NEXT%20Release/",
  "http://avalanche-jenkins.spirentcom.com:8080/view/Integration/",
  "http://avalanche-jenkins.spirentcom.com:8080/view/Release/"
],
  counter = 0;
/* Socket.IO events */
io.on("connection", function(socket){

  socket.on("newUser", function(data) {
    clients.push({id: data.id, name: data.name});
    //io.sockets.emit("newConnection", {clients: clients});
    console.log("newUser", data);
    io.sockets.emit("incomingMessage", {message: 'reload', url: urls[counter++]});
    setInterval(function() {
      if (counter >= urls.length) counter = 0;
      io.sockets.emit("incomingMessage", {message: 'reload', url: urls[counter++]});
    }, 120000);
  });

  // socket.on("updateAll", function(data) {
  //   clients = _.without(clients, _.findWhere(clients, {id: socket.id}));
  //   io.sockets.emit("refresh", {});
  // });

  socket.on("disconnect", function() {
    clients = _.without(clients, _.findWhere(clients, {id: socket.id}));
    io.sockets.emit("userDisconnected", {id: socket.id, sender:"system"});
  });

});

server.listen(app.get("port"), function() {
    console.log("Server up and running at port: " + app.get("port"));
});


