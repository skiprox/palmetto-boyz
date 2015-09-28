var socket = io();
var runningMan = require('running-man');
var faces = require('cool-ascii-faces');

Public = (function(){

	var _initialize = function() {
		_addDomListeners();
		_addSocketListeners();
	};

	var _addDomListeners = function() {
		$('form').submit(function() {
			socket.emit('new message', $('#message').val());
			$('#message').val('');
			return false;
		});
	};

	var _addSocketListeners = function() {
		socket.on('new message', function(data) {
			addChatMessage(data);
		});
	};

	var addChatMessage = function(data) {

	};

	return {
		initialize : function() {
			_initialize();
			return this;
		}
	};

})();

APP.Application.initialize();