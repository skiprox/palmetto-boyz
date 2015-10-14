var socket = io();
var TextCombing = require('./modules/text-combing');

Public = (function(){

	// Stored DOM elements
	var UI = {
		body: null,
		loginForm: null,
		loginInput: null,
		sidebar: null,
		sidebarPeople: null,
		main: {
			chatRoom: null,
			chatForm: null,
			chatInput: null,
			messagesList: null
		}
	};

	// Stored DOM values
	var UIValues = {
		bodyHeight: null
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
		UI.body = document.body;
		UIValues.bodyHeight = UI.body.scrollHeight;
		UI.loginForm = document.getElementById('login-form');
		UI.loginInput = document.getElementById('login-input');
		UI.sidebar = document.getElementById('sidebar');
		UI.sidebarPeople = document.getElementById('sidebar-people');
		UI.main.chatRoom = document.getElementById('room-main');
		UI.main.chatForm = UI.main.chatRoom.querySelector('.chat-form');
		UI.main.chatInput = UI.main.chatRoom.querySelector('.chat-form__input');
		UI.main.messagesList = UI.main.chatRoom.querySelector('.message-list');
	};

	/**
	 * Add dom listeners, for things like form submissions
	 */
	var _addDomListeners = function() {
		UI.main.chatForm.addEventListener('submit', function(e) {
			e.preventDefault();
			socket.emit('new message', UI.main.chatInput.value);
			UI.main.chatInput.value = '';
			return false;
		});
		UI.loginForm.addEventListener('submit', function(e) {
			e.preventDefault();
			socket.emit('add user', UI.loginInput.value);
			UI.loginForm.parentNode.removeChild(UI.loginForm);
			UI.main.chatInput.select();
			return false;
		});
		UI.sidebarPeople.addEventListener('click', function(e) {
			e.preventDefault();
			var userId = e.target.getAttribute('data-id');
			// Check if the chatroom defined by the userId exists,
			// if not we create it and initiate private chat
			if (!UI[userId]) {
				// Create the chat room
				UI[userId] = {};
				UI[userId].chatRoom = UI.main.chatRoom.cloneNode(true);
				UI[userId].chatRoom.setAttribute('id', 'room-' + userId);
				UI[userId].chatForm = UI[userId].chatRoom.querySelector('.chat-form');
				UI[userId].chatInput = UI[userId].chatRoom.querySelector('.chat-form__input');
				UI[userId].messagesList = UI[userId].chatRoom.querySelector('.message-list');
				UI[userId].messagesList.innerHTML = '';
				UI.body.appendChild(UI[userId].chatRoom);
				socket.emit('start private chat', e.target.getAttribute('data-id'));
				// Need to add real data from user who clicked here
				var data = {
					username: e.target.textContent,
					usernumber: parseInt(e.target.getAttribute('data-usernumber'), 10),
					userId: e.target.getAttribute('data-id')
				}
				openChatRoomWith(data);
				return false;
			}
			else {
				return false;
			}
		});
	};

	/**
	 * Add socket listeners
	 */
	var _addSocketListeners = function() {
		socket.on('user joined', function(data) {
			updateGroupUsers(data, 'joined');
		});
		socket.on('user left', function(data) {
			updateGroupUsers(data, 'left');
		});
		socket.on('new message', function(data) {
			addChatMessage(data);
		});
		socket.on('start private chat', function(data) {
			openChatRoomWith(data);
		});
	};

	/**
	 * When someone leaves or enters the group, this gets called
	 * @param  {Object} -- includes data.username, data.usernames, data.usernumber, data.userIds, and data.userCount
	 * @param  {String} -- either "joined" or "left", from _addSocketListeners()
	 */
	var updateGroupUsers = function(data, infoString) {
		UI.main.messagesList.innerHTML += '<li class="message notification">' + data.username + ' has ' + infoString + ' the group.</li>';
		UI.main.messagesList.innerHTML += '<li class="message notification notification--total-number">There are now ' + data.userCount + ' users in the group.</li>';
		forceScrollToBottom();
		UI.sidebarPeople.innerHTML = '';
		var i = 0;
		for (var name in data.usernames) {
			UI.sidebarPeople.innerHTML += '<li id="person-' + data.usernames[name] + '" data-id="' + data.userIds[name] + '" data-usernumber="' + i + '" class="person">' + data.usernames[name] + '</li>';
			i++;
		}
	};

	/**
	 * Open a private chat room with a user
	 * @param  {object} -- includes data.username, data.usernumber, and data.userId
	 */
	var openChatRoomWith = function(data) {
		// Here we want to open up a new window, that's the same as the existing chat window but instead has a listener for 'new private message'. Then when we send a private message we want to produce it on the screen, and then ping it directly to the socket we want to see it.
	};

	/**
	 * When someone submits a new message to the chat
	 * @param {Object} -- includes data.username and data.message
	 */
	var addChatMessage = function(data) {
		if (data.message != '') {
			var color = userColors[data.usernumber % (colorsLen)];
			var messageBody = TextCombing.hasImage(data.message) ? '<img src="' + data.message + '"/>' : data.message;
			UI.main.messagesList.innerHTML += '<li class="message"><span class="user" style="color:' + color + '">' + data.username + '</span> ' + messageBody + '</li>';
			forceScrollToBottom();
		}
	};

	/**
	 * Force scroll to the bottom of the page
	 */
	var forceScrollToBottom = function() {
		UIValues.bodyHeight = UI.body.scrollHeight;
		window.scrollTo(0, UIValues.bodyHeight);
	};

	return {
		init : function() {
			_initialize();
			return this;
		}
	};

})();

Public.init();