var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var App = (function() {

  var usernames = {},
      userCount = 0;

  var setup = function() {
    app.set('port', process.env.PORT || 5000);
    app.use(express.static(__dirname + '/public'));
    app.get('/', function(req, res){
      res.sendfile('index.html');
    });
  };

  var onIO = function() {
    io.on('connection', function(socket) {
      // We haven't added the user yet
      var addedUser = false;

      // Add listener for new messages
      socket.on('new message', function(data) {
        socket.broadcast.emit('new message', {
          username: socket.username,
          message: data
        });
      });

      // Add listener for added user
      socket.on('add user', function(username) {
        // Store the usernmae in the socket session for this client
        socket.username = username;
        // Add the username to the global list
        usernames[username] = username;
        userCount++;
        addedUser = true;
        socket.emit('login', {
          userCount: userCount
        });
        // echo globally that a person has connected
        socket.broadcast.emit('user joined', {
          username: socket.username,
          userCount: userCount
        });
      });

      // Add listener for typing
      socket.on('typing', function() {
        socket.broadcast.emi('typing', {
          username: socket.username
        });
      });

      // Add listener for stopping typing
      socket.on('stop typing', function() {
        socket.broadcast.emit('stop typing', {
          username: socket.username
        });
      });

      // Add listener for user disconnect
      socket.on('disconnect', function() {
        // remove the username from the global usernames list
        if (addedUser) {
          delete usernames[socket.username];
          userCount--;
          // Echo globally that user has left
          socket.broadcast.emit('user left', {
            username: socket.username,
            userCount: userCount
          });
        }
      });

    });
  };

  var listen = function() {
    http.listen(app.get('port'), function(){
      console.log('listening on:' + app.get('port'));
    });
  };

  return {
    init: function() {
      setup();
      onIO();
      listen();
    }
  }

}());

App.init();