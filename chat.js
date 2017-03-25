/**
 * Create Simple Loader Object
 */
var Loader = (function(window, document) {

	'use strict';

	var overlay = {};
	var loader = {};
	var animationFrame = null;
	var chatWindow = {};
	var progress = null;

	/**
	 * Creates the loader.
	 */
	function createLoader() {
		loader = document.createElement('div');
		loader.style.width = '30px';
		loader.style.height = '30px';
		loader.style.border = '2px solid #f3f3f3';
		loader.style.borderTop = '2px solid #aaf200';
		loader.style.borderRadius = '50%';
		loader.style.display = 'block';
		loader.style.position = 'absolute';
		loader.style.left = '50%';
		loader.style.top = '50%';
		loader.style.marginLeft = '-15px';
		loader.style.marginTop = '-15px';
		loader.style.zIndex = '2';
		loader.setAttribute('id', 'loader');
	}

	/**
	 * Creates the overlay.
	 */
	function createOverlay() {
		overlay = document.createElement('div');
		overlay.style.position = 'absolute';
		overlay.style.top = '0';
		overlay.style.left = '0';
		overlay.style.bottom = '0';
		overlay.style.right = '0';
		overlay.style.width = '100%';
		overlay.style.height = '100%';
		overlay.style.zIndex = '1';
		overlay.style.backgroundColor = 'rgba(127, 171, 218, 1)';
		overlay.setAttribute('id', 'overlay');
	}

	/**
	 * Spin the loader.
	 */
	function spinLoader() {
		animationFrame = requestAnimFrame(spinLoader);
		progress += 10;
		loader.style.webkitTransform = 'rotate('+progress+'deg)';
		loader.style.mozTransform = 'rotate('+progress+'deg)';
		loader.style.msTransform = 'rotate('+progress+'deg)';
		loader.style.oTransform = 'rotate('+progress+'deg)';
		loader.style.transform = 'rotate('+progress+'deg)';

		if(progress >= 360) progress = 0;
	}

	/**
	 * Stop the loader from spining.
	 */
	function stopSpining() {
		window.cancelAnimationFrame(animationFrame);
		animationFrame = null;
	}

	/**
	 * Add the loader to the chatbox.
	 */
	function spawnLoader() {
		chatWindow = document.getElementById('chatWindow');
		chatWindow.appendChild(overlay);
		chatWindow.appendChild(loader);
	}

	return {
		start: function() {
			createOverlay();
			createLoader();
			spawnLoader();
			spinLoader();
		},
		stop: function() {
			stopSpining();
			chatWindow.removeChild(overlay);
			chatWindow.removeChild(loader);
		}
	}
}(window, document));

/**
 * The SupportChat object
 */
var SupportChat = (function(window, document, Loader){
	
	'use strict';

	var settings = {
		title: 'Chat',
		titleColor: '#ffffff',
		event: 'send-message',
		background: '#009688',
	};

	var chatStatus = 'closed';
	var minimizer = {};
	var chatbox = {};
	var chatContent = {};
	var progress = null;

	/**
	 * - Check present of dependencies
	 * - Override the settings
	 */
	function init(devSettings) {
		// check that the developer added socket.io libary, 
		// if not add that dependency to the head tags.
		importSocketIOLibary();
		
		settings = extend(settings, devSettings);
	}

	/**
	 * Import socket.io libary if not exist.
	 */
	function importSocketIOLibary() {

		var scripts = document.getElementsByTagName('script'),
			head = document.getElementsByTagName('head').item(0),
			socketIOPath = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.js';

		for(var i = 0; i < scripts.length; i++) {
			if(scripts[i].src == socketIOPath) {
				return;
			}
			
		}
		
		var socketIOScriptTag = document.createElement('script');
		socketIOScriptTag.src =  socketIOPath;

		head.appendChild(socketIOScriptTag);
	}

	/**
	 * Will create the chatbox.
	 */
	function create() {

		var h3 = document.createElement('h3');

		minimizer = document.createElement('div');
		chatbox = document.createElement('div');
		chatContent = document.createElement('div');

		h3.innerHTML = settings.title;
		h3.style.color = settings.titleColor;
		h3.style.textAlign = 'center';
		h3.style.height = '60px';
		h3.style.lineHeight = '60px';
		h3.style.width = '100%';
		h3.style.position = 'absolute';
		h3.style.top = '0';
		h3.style.left = '0';
		h3.style.zIndex = '3';
		h3.style.background = settings.background;

		minimizer.innerHTML = getIcon('enlarge');
		minimizer.style.width = '30px';
		minimizer.style.height = '5px';
		minimizer.style.position = 'absolute';
		minimizer.style.top = '10px';
		minimizer.style.left = '5px';
		minimizer.style.cursor = 'pointer';

		chatContent.style.top = '60px';
		chatContent.style.maxHeight = '300px';
		chatContent.style.width = '100%';
		chatContent.style.margin = '0 auto';
		chatContent.style.padding = '10px 10px';
		chatContent.style.position = 'relative';
		chatContent.setAttribute('id', 'chatContent');

		chatbox.style.overflow = 'hidden';
		chatbox.style.width = '325px';
		chatbox.style.minHeight = '60px';
		chatbox.style.maxHeight = '300px';
		chatbox.style.position = 'fixed';
		chatbox.style.bottom = '0';
		chatbox.style.right = '0';
		chatbox.style.background = '#ffffff';
		chatbox.style.border = '1px solid #000000';
		chatbox.setAttribute('id', 'chatWindow');
		
		h3.appendChild(minimizer);
		chatbox.appendChild(h3);
		chatbox.appendChild(chatContent);
		document.body.appendChild(chatbox);
	}

	/**
	 * Opens the chat
	 */
	function open() {

		var animationFrame = requestAnimFrame(open);
		
		progress += 10;
		chatContent.style.height = progress+'px';
				
		if(progress >= 300) {
			minimizer.innerHTML = getIcon('minimize');
			chatStatus = 'opened';
			cancelAnimationFrame(animationFrame);
			loadContent();
			return;
		}
	}

	/**
	 * After opening the chat will load the content
	 * via Ajax.
	 */
	function loadContent() {
		Loader.start();
	}

	/**
	 * Closes the chat
	 */
	function close() {
		
		var animationFrame = requestAnimFrame(close);
		
		progress -= 10;
		chatContent.style.height = progress+'px';
				
		if(progress <= 0) {
			minimizer.innerHTML = getIcon('enlarge');
			chatStatus = 'closed';
			cancelAnimationFrame(animationFrame);
			Loader.stop();
			return;
		}
	}

	/**
	 * Event Listeners
	 */
	window.onload = function() {
		
		minimizer.onclick = function () {

			if(chatStatus == 'closed') {
				open();
			} else if(chatStatus == 'opened') {
				close();
			}
		}
	}

	/**
	 * Extend an object
	 */
	function extend(currentObj, newObj ) {

		var extended = {};
	    var prop;

	    for (prop in currentObj) {
	        if (Object.prototype.hasOwnProperty.call(currentObj, prop)) {
	            extended[prop] = currentObj[prop];
	        }
	    }

	    for (prop in newObj) {
	        if (Object.prototype.hasOwnProperty.call(newObj, prop)) {
	            extended[prop] = newObj[prop];
	        }
	    }

	    return extended;
	}

	/**
	 * Retrieve the requested Icon.
	 */
	function getIcon(iconName) {

		var icon = document.createElement('span');

		switch(iconName) {
			case 'minimize':
				icon.style.borderRadius = "15px 15px";
				icon.style.position = "absolute";
				icon.style.width = "100%";
				icon.style.height = "6px";
				icon.style.left = "0px";
				icon.style.top = "10px";
				icon.style.background = '#ffffff';
				break;
			case 'enlarge':
				icon.innerHTML = '+';
				icon.style.color = '#ffffff';
				icon.style.fontSize = '2.3em';
				icon.style.lineHeight = '0.6em';
				break;
		}

		icon.style.userSelect = 'none';
		icon.setAttribute('id', 'minimizer');

		return icon.outerHTML;
	}

	/**
	 * Return the animation frame rate, support most browsers versions.
	 */
	function getAnimationFrame() {

		return window.requestAnimationFrame ||
			   window.mozRequestAnimationFrame ||
			   window.webKitRequestAnimationFrame ||
			   window.msRequestAnimationFrame;
	}

	return {
		init: function(devSettings) {
			init(devSettings);
			this.after.call(this);
		},
		after: function() {},
		create: create,
		open: function() {
			socket.emit('send-message', message.value);
			var socket = io.connect();
		},

	}

}(window, document, Loader));

/**
 * Return the animation frame rate, support most browsers versions.
 * thanks to Paul Irish :-)
 */
window.requestAnimFrame = (function(){
  	return  window.requestAnimationFrame       ||
          	window.webkitRequestAnimationFrame ||
          	window.mozRequestAnimationFrame    ||
          	function( callback ){
            	window.setTimeout(callback, 1000 / 60);
          	};
})();

