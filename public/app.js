var socket = io();
$('form').submit(function() {
	socket.emit('chat message', $('#message').val());
	$('#message').val('');
	return false;
});
socket.on('chat message', function(msg) {
	var msgArray = msg.split('.'),
		msgEnding = msgArray[msgArray.length - 1];
	if (msgEnding === 'jpg' || msgEnding === 'jpeg' || msgEnding === 'png' || msgEnding === 'gif') {
		$('#messages').append($('<li><img src="' + msg + '"></li>'));
	}
	else if (msg !== '') {
		$('#messages').append($('<li>').text(msg));
	}
	$('html, body').animate({scrollTop: $('body').height()}, 200);
});