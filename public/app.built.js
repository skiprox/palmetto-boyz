(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
			newUser(data);
		});
		socket.on('user left', function(data) {
			userLeft(data);
		});
		socket.on('new message', function(data) {
			addChatMessage(data);
		});
	};

	var newUser = function(data) {
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
},{}]},{},[1]);
