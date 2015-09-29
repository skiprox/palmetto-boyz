var socket = io();

Public = (function(){

	// Colors for users
	var userColors 	=  [
		'#e21400', '#91580f', '#f8a700', '#f78b00',
		'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
		'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
		],
		colorsLen 	= userColors.length;

	// User variables to keep track of
	var totalUsers = 0;

	var _initialize = function() {
		_addDomListeners();
		_addSocketListeners();
		$('#login-name').select();
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
			$('#message').select();
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
		totalUsers++;
	};

	var userLeft = function(data) {
		totalUsers--;
	};

	var addChatMessage = function(data) {
		console.log(data);
		var message = data.message;
		var user = data.username;
		var number = data.usernumber;
		$('#messages').append('<li class="message"><span class="user" style="color:' + userColors[number % (colorsLen)] + '">' + user + '</span> ' + message + '</li>');
	};

	return {
		init : function() {
			_initialize();
			return this;
		}
	};

})();

Public.init();