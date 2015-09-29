var socket = io();

Public = (function(){

	var _initialize = function() {
		_addDomListeners();
		_addSocketListeners();
	};

	var _addDomListeners = function() {
		$('#chat-form').submit(function() {
			socket.emit('new message', $('#message').val());
			$('#message').val('');
			return false;
		});
		$('#login-form').submit(function() {
			socket.emit('add user', $('#login-name').val());
			$('#login-name').val('');
			$('#login-form').remove();
			return false;
		});
	};

	var _addSocketListeners = function() {
		socket.on('user joined', function(data) {
			userJoined(data);
		});
		socket.on('user left', function(data) {
			userLeft(data);
		});
		socket.on('new message', function(data) {
			addChatMessage(data);
		});
	};

	var userJoined = function(data) {
		console.log(data);
	};

	var addChatMessage = function(data) {
		console.log(data);
		var message = data.message;
		var user = data.username;
		$('#messages').append('<li><span class="user">' + user + '</span> ' + message + '</li>');
	};

	return {
		init : function() {
			_initialize();
			return this;
		}
	};

})();

Public.init();