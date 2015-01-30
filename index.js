var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', process.env.PORT || 5000);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  io.emit('user joined', true);
  socket.on('disconnect', function() {
  	console.log('user disconnected');
  	io.emit('user joined', false);
  });
  socket.on('chat message', function(msg) {
  	io.emit('chat message', msg);
  });
});

http.listen(app.get('port'), function(){
  console.log('listening on:' + app.get('port'));
});