var socket = io();
var runningMan = require('running-man');
var faces = require('cool-ascii-faces');

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
		socket.on('new message', function(data) {
			addChatMessage(data);
		});
		socket.on('user joined', function(data) {
			newUser(data);
		});
	};

	var newUser = function(data) {
		console.log(data);
	};

	var addChatMessage = function(data) {
		console.log(data);
	};

	return {
		init : function() {
			_initialize();
			return this;
		}
	};

})();

Public.init();