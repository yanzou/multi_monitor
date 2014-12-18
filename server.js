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

/* Socket.IO events */
io.on("connection", function(socket){

  socket.on("newUser", function(data) {
    clients.push({id: data.id, name: data.name});
    //io.sockets.emit("newConnection", {clients: clients});
    // setTimeout(function() {
    //   io.sockets.emit("refresh", {urls: ["baidu", "taobao"]});
    // }, 6000);
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


