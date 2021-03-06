var socket = io();
var TextCombing = require('./modules/text-combing');

var Public = (function(){

	// Stored DOM elements
	var UI = {
		body: null,
		loginForm: null,
		loginInput: null,
		sidebar: null,
		sidebarPeople: null,
		'main': {
			chatRoom: null,
			chatForm: null,
			chatInput: null,
			messagesList: null
		}
	};

	// To keep track of the active room
	var _activeRoom = 'main';

	// To keep track of the notifications for messages in rooms
	var _roomNotifications = [];

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
		UI['main'].chatRoom = document.getElementById('room-main');
		UI['main'].chatForm = UI['main'].chatRoom.querySelector('.chat-form');
		UI['main'].chatInput = UI['main'].chatRoom.querySelector('.chat-form__input');
		UI['main'].messagesList = UI['main'].chatRoom.querySelector('.message-list');
	};

	/**
	 * Add dom listeners, for things like form submissions
	 */
	var _addDomListeners = function() {
		UI['main'].chatForm.addEventListener('submit', function(e) {
			e.preventDefault();
			socket.emit('new message', UI['main'].chatInput.value);
			UI['main'].chatInput.value = '';
			return false;
		});
		UI.loginForm.addEventListener('submit', function(e) {
			e.preventDefault();
			socket.emit('add user', UI.loginInput.value);
			UI.loginForm.parentNode.removeChild(UI.loginForm);
			UI['main'].chatInput.select();
			return false;
		});
		UI.sidebarPeople.addEventListener('click', function(e) {
			e.preventDefault();
			var userId = e.target.getAttribute('data-id');
			// Check if the chatroom defined by the userId exists,
			// if not we create it and initiate private chat
			if (!UI[userId]) {
				// Emit that a private chat has been initiated,
				// send to user that person wants to start the chat with
				socket.emit('start private chat', e.target.getAttribute('data-id'));
				// Need to add real data from user who clicked here,
				// to create chat room for them
				var data = {
					username: e.target.textContent,
					usernumber: parseInt(e.target.getAttribute('data-usernumber'), 10),
					userId: e.target.getAttribute('data-id')
				}
				addChatRoom(data);
				changeActiveRoom(userId);
				return false;
			}
			else {
				changeActiveRoom(userId);
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
			addChatRoom(data);
		});
		socket.on('new private message', function(data) {
			addChatMessage(data);
		});
	};

	/**
	 * When someone leaves or enters the group, this gets called
	 * @param  {Object} -- includes data.username, data.usernames, data.usernumber, data.userIds, and data.userCount
	 * @param  {String} -- either "joined" or "left", from _addSocketListeners()
	 */
	var updateGroupUsers = function(data, infoString) {
		UI['main'].messagesList.innerHTML += '<li class="message notification">' + data.username + ' has ' + infoString + ' the group.</li>';
		UI['main'].messagesList.innerHTML += '<li class="message notification notification--total-number">There are now ' + data.userCount + ' users in the group.</li>';
		forceScrollToBottom();
		UI.sidebarPeople.innerHTML = '';
		UI.sidebarPeople.innerHTML += '<li id="person-main" data-id="main" data-usernumber="-1" class="person">Main Chat Room</li>';
		var i = 0;
		for (var name in data.usernames) {
			UI.sidebarPeople.innerHTML += '<li id="person-' + data.usernames[name] + '" data-id="' + data.userIds[name] + '" data-usernumber="' + i + '" class="person">' + data.usernames[name] + '</li>';
			i++;
		}
		var notificationsLen = _roomNotifications.length;
		while (notificationsLen--) {
			UI.sidebar.querySelector('[data-id="' + _roomNotifications[notificationsLen] + '"]').classList.add('new-messages');
		}
		changeActiveRoom(_activeRoom);
	};

	/**
	 * Add a new chat room based on a User ID, and append it to the DOM
	 * @param {object} -- Data object with data.userId, data.username, data.usernumber
	 */
	var addChatRoom = function(data) {
		var userId = data.userId;
		UI[userId] = {};
		UI[userId].chatRoom = UI['main'].chatRoom.cloneNode(true);
		UI[userId].chatRoom.setAttribute('id', 'room-' + userId);
		UI[userId].chatRoom.classList.remove('active');
		UI[userId].chatForm = UI[userId].chatRoom.querySelector('.chat-form');
		UI[userId].chatInput = UI[userId].chatRoom.querySelector('.chat-form__input');
		UI[userId].messagesList = UI[userId].chatRoom.querySelector('.message-list');
		UI[userId].messagesList.innerHTML = '';
		UI.body.appendChild(UI[userId].chatRoom);
		// Add the listener for private message
		UI[userId].chatForm.addEventListener('submit', function(e) {
			e.preventDefault();
			data.message = UI[userId].chatInput.value;
			socket.emit('new private message', data);
			UI[userId].chatInput.value = '';
		});
		UI[userId].messagesList.innerHTML += '<li class="message notification">Private chat with ' + data.username + '.</li>';
	};

	/**
	 * Change the active room
	 * @param  {string} -- The string of the room object we want to change to (usually a userId, or sometimes 'main')
	 */
	var changeActiveRoom = function(changeTo) {
		// If there is already an active sidebar element, remove it
		if (UI.sidebar.querySelector('.active')) {
			UI.sidebar.querySelector('.active').classList.remove('active');
		}
		// Change the active room in the sidebar
		var personDidLeave = UI.sidebar.querySelector('[data-id="' + changeTo + '"]') ? false : true;
		var sidebarQuerySelector = UI.sidebar.querySelector('[data-id="' + changeTo + '"]') ? '[data-id="' + changeTo + '"]' : '#person-main';
		UI.sidebar.querySelector(sidebarQuerySelector).classList.add('active');
		// If the room had notifications in it, get rid of those...
		if (_roomNotifications.indexOf(changeTo) !== -1) {
			UI.sidebar.querySelector('[data-id="' + changeTo + '"]').classList.remove('new-messages');
			_roomNotifications.splice(_roomNotifications.indexOf(changeTo), 1);
		}
		// Change the active chat room
		if (personDidLeave) {
			UI.body.removeChild(UI[_activeRoom].chatRoom);
			delete UI[_activeRoom];
			_activeRoom = 'main';
		}
		else if (!personDidLeave) {
			UI[_activeRoom].chatRoom.classList.remove('active');
			_activeRoom = changeTo;
		}
		UI[_activeRoom].chatRoom.classList.add('active');
		UI[_activeRoom].chatInput.select();
	};

	/**
	 * When someone submits a new message to the chat (private or public)
	 * @param {Object} -- includes data.username, data.usernumber, data.roomId, data.message
	 */
	var addChatMessage = function(data) {
		if (data.message != '') {
			var color = userColors[data.usernumber % (colorsLen)];
			var messageBody = TextCombing.hasImage(data.message) ? '<img src="' + data.message + '"/>' : data.message;
			UI[data.roomId].messagesList.innerHTML += '<li class="message"><span class="user" style="color:' + color + '">' + data.username + '</span> ' + messageBody + '</li>';
			// if the new message comes to a room that isn't open by the user, send a notification
			if (!UI.sidebar.querySelector('[data-id="' + data.roomId + '"]').classList.contains('active')) {
				_roomNotifications.push(data.roomId);
				UI.sidebar.querySelector('[data-id="' + data.roomId + '"]').classList.add('new-messages');
			}
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

}());

Public.init();