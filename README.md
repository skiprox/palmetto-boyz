# Palmetto Boyz

An anonymous chat application in the browser, using express and socket.io.

To run locally,

	node index.js

Also, grunt is installed. To use,

	grunt

or

	grunt watch

### This Branch

Is meant for creating a chat-roulette style chat system, where you are connected with only one user at a time. You can "skip" this user and talk to someone else. If there are no other sockets connected it should tell you that no one else is connected, and then connect you to another socket when someone else signs in.