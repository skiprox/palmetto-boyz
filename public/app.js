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
			_printMessage(msg);
			var msgArray = msg.split('.'),
				msgEnding = msgArray[msgArray.length - 1];
			if (msgEnding === 'jpg' || msgEnding === 'jpeg' || msgEnding === 'png' || msgEnding === 'gif') {
				$('#messages').append($('<li><img src="' + msg + '"></li>'));
			}
			else if (msg.match(/\barnold\b/) !== null) {
				$('#messages').append($('<li class="arnold">').text(runningMan.quote()));
			}
			else if (msg.match(/\bface\b/) !== null) {
				$('#messages').append($('<li class="face">').text(faces()));
			}
			$('html, body').animate({scrollTop: $('body').height()}, 200);
		});

		socket.on('user joined', function(obj) {
			console.log(obj);
			if (obj.didJoin) {
				$('#messages').append($('<li class="room-activity">').text('[A user has joined (' + obj.users + ' in room)]'));
			}
			else {
				$('#messages').append($('<li class="room-activity">').text('[A user has left (' + obj.users + ' in room)]'));
			}
		});
	};

	var _printMessage = function(msg) {
		if (msg !== '') {
			$('#messages').append($('<li>').text(msg));
		}
	}

	return {
		initialize : function() {
			_initialize();
			return this;
		}
	};

})();

APP.Application.initialize();