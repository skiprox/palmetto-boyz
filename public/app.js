var socket = io();

Public = (function(){

	// Stored DOM elements
	var UI = {
		loginForm: null,
		loginInput: null,
		chatForm: null,
		chatInput: null,
		messages: null
	};

	// Colors for users
	var userColors 	=  [
		'#e21400', '#91580f', '#f8a700', '#f78b00',
		'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
		'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
		],
		colorsLen 	= userColors.length;

	/**
	 * Initalize function, to focus the login name input,
	 * and add listeners for dom events and socket events
	 */
	var _initialize = function() {
		_cacheElements();
		_addDomListeners();
		_addSocketListeners();
		UI.loginInput.select();
	};

	/**
	 * Cache all the UI elements
	 */
	var _cacheElements = function() {
		UI.loginForm = document.getElementById('login-form');
		UI.loginInput = document.getElementById('login-input');
		UI.chatForm = document.getElementById('chat-form');
		UI.chatInput = document.getElementById('chat-input');
		UI.messages = document.getElementById('messages');
	};

	/**
	 * Add dom listeners, for things like form submissions
	 */
	var _addDomListeners = function() {
		UI.chatForm.addEventListener('submit', function(e) {
			e.preventDefault();
			socket.emit('new message', UI.chatInput.value);
			UI.chatInput.value = '';
			return false;
		});
		UI.loginForm.addEventListener('submit', function(e) {
			e.preventDefault();
			socket.emit('add user', UI.loginInput.value);
			UI.loginForm.parentNode.removeChild(UI.loginForm);
			UI.chatInput.select();
			return false;
		});
	};

	/**
	 * Add socket listeners
	 */
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

	/**
	 * When someone leaves or enters the group, this gets called
	 * @param  {Object} -- includes data.username and data.userCount
	 * @param  {String} -- either "joined" or "left", from _addSocketListeners()
	 */
	var groupChangeNotification = function(data, infoString) {
		UI.messages.innerHTML += '<li class="message notification">' + data.username + ' has ' + infoString + ' the group.</li>';
		UI.messages.innerHTML += '<li class="message notification notification--total-number">There are now ' + data.userCount + ' users in the group.</li>';
	};

	/**
	 * When someone submits a new message to the chat
	 * @param {Object} -- includes data.username and data.message
	 */
	var addChatMessage = function(data) {
		var color = userColors[data.usernumber % (colorsLen)]
		UI.messages.innerHTML += '<li class="message"><span class="user" style="color:' + color + '">' + data.username + '</span> ' + data.message + '</li>';
	};

	return {
		init : function() {
			_initialize();
			return this;
		}
	};

})();

Public.init();