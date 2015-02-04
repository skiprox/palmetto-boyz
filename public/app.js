var APP = APP || {};
var socket = io();
var runningMan = require('running-man');
var faces = require('cool-ascii-faces');

APP.Application = (function(){

	var _initialize = function() {
		_addDomListeners();
		_addSocketListeners();
	};

	var _addDomListeners = function() {
		$('form').submit(function() {
			socket.emit('chat message', $('#message').val());
			$('#message').val('');
			return false;
		});
	};

	var _addSocketListeners = function() {
		socket.on('chat message', function(msg) {
			var msgArray = msg.split('.'),
				msgEnding = msgArray[msgArray.length - 1];
			if (msgEnding === 'jpg' || msgEnding === 'jpeg' || msgEnding === 'png' || msgEnding === 'gif') {
				$('#messages').append($('<li><img src="' + msg + '"></li>'));
			}
			else if (msg.match(/quote/gi) !== null) {
				$('#messages').append($('<li class="arnold">').text(runningMan.quote()));
			}
			else if (msg.match(/face/gi) !== null) {
				$('#messages').append($('<li class="face">').text(faces()));
			}
			else if (msg !== '') {
				$('#messages').append($('<li>').text(msg));
			}
			$('html, body').animate({scrollTop: $('body').height()}, 200);
		});

		socket.on('user joined', function(obj) {
			if (obj.didJoin) {
				$('#messages').append($('<li class="room-activity">').text('[A USER HAS JOINED]'));
			}
			else {
				$('#messages').append($('<li class="room-activity">').text('[A USER HAS LEFT]'));
			}
		});
	};

	return {
		initialize : function() {
			_initialize();
			return this;
		}
	};

})();

APP.Application.initialize();