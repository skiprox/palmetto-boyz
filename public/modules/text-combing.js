'use strict';

var TextCombing = (function() {

	var checkForImage = function(text) {
		var splitArray = text.split('.');
		var lastString = splitArray[splitArray.length - 1];
		if (lastString == 'png' || lastString == 'jpg' || lastString == 'jpeg' || lastString == 'gif') {
			return true;
		}
		else {
			return false;
		}
	};

	return {
		hasImage: function(text) {
			return checkForImage(text);
		}
	}

}());

module.exports = TextCombing;