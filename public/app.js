var socket = io();

Public = (function(){

	// Colors for users
	var userColors 	=  [
		'#e21400', '#91580f', '#f8a700', '#f78b00',
		'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
		'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
		],
		colorsLen 	= userColors.length;

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
			groupChangeNotification(data, 'joined');
		});
		socket.on('user left', function(data) {
			groupChangeNotification(data, 'left');
		});
		socket.on('new message', function(data) {
			addChatMessage(data);
		});
	};

	var groupChangeNotification = function(data, infoString) {
		$('#messages').append('<li class="message notification">' + data.username + ' has ' + infoString + ' the group.' + '</li>');
		$('#messages').append('<li class="message notification notification--total-number">There are now ' + data.userCount + ' users in the group</li>');
	};

	var addChatMessage = function(data) {
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