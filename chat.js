/**
 * Create Simple Loader Object.
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

	/**
	 * Removes the Overlay and the Loader.
	 */
	function removeOverlayAndLoader() {
		chatWindow.removeChild(overlay);
		chatWindow.removeChild(loader);
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
			removeOverlayAndLoader();
		}
	}
}(window, document));

/**
 * The SupportChat object.
 */
var SupportChat = function(devSettings) {
	
	'use strict';

	devSettings = devSettings || null;

	var settings = {
		title: 'Chat',
		titleColor: '#ffffff',
		event: 'send-message',
		background: '#009688',
		url: 'dev.cms-cloud.com',
		port: '3000',
		protocol: 'http'
	};

	/**
	 * Stores all the events.
	 */
	var events = [];

	/**
	 * Chat Status.
	 */
	var chatStatus = 'closed';
	
	/**
	 * Minimizer icon.
	 */
	var minimizer = {};
	
	/**
	 * Chatbox HTML-Element.
	 */
	var chatbox = {};

	/**
	 * Welcome form as the chat is opened.
	 */
	var form = {};

	/**
	 * Chat Content.
	 */
	var chatContent = '';
	
	/**
	 * Chat Input As the chat starts.
	 */
	var chatInput = '';

	/**
	 * Progress of opening / Closing animation. 
	 */
	var progress = null;
	
	/**
	 * IO Client Libary.
	 */
	var io = null;

	/**
	 * Current socket connection.
	 */
	var socket = null;

	// Event for when the module is fully loaded.
	listen('SupportChatIsFullyLoaded', function() {
		// Set the errors handler.
		errorHandler();

		// Make sure the developer passed an object, if not give feedback.
		if(typeof devSettings != 'object') {
			throw new InvalidArgumentException('Please pass an object for the settings');
		} else {
			init(devSettings);
		}
	});

	// Event for when script tags were passed to the form inputs.
	listen('hackingAttempted', function() {
		// incase you want to log it or something.
	});

	// Event for when the chatbox is being opened.
	listen('openingChatbox', function() {
		Loader.start();
	});

	// Event for when the chatbox has been opened.
	listen('chatboxIsOpened', function() {
		minimizer.innerHTML = getIcon('minimize');
		chatStatus = 'opened';
		displayForm();
		Loader.stop();
	});

	// Event for when the chatbox is being closed.
	listen('closingChatbox', function() {
		Loader.start();
	});

	// Event for when the chatbox has been closed.
	listen('chatboxIsClosed', function() {
		minimizer.innerHTML = getIcon('enlarge');
		chatStatus = 'closed';
		flushChat();
		if(socket) socket.disconnect();
		Loader.stop();
	});

	// Event for when the form validation has passed.
	// We can now build the socket connection.
	listen('formValidationPassed', function() {
		chatContent.removeChild(form);
		loadContent(socket, name);
	});

	listen('formValidationFailed', function(inputName) {
		// In case validations fails
	});

	// Event for when the chat has started.
	listen('handshakeWithClientCreated', function(socket) {
		socket.emit('receive', inputs);
	});


	function listen(name, callback) {
		if(typeof callback !== 'function') {
			throw new InvalidArgumentException;
		}

		events[name] = callback;
	}

	function triggerEvent(name, data) {

		data = data || null;

		if(typeof events[name] !== 'function') {
			throw new BadEventCallException;
		}

		if(data != null && data instanceof Array) {
			var one = data[0] || undefined;
			var two = data[1] || undefined;
			var three = data[2] || undefined;
			return events[name](one, two, three);
		}

		events[name]();
	}

	/**
	 * - Check present of dependencies
	 * - Override the settings
	 */
	function init(devSettings) {
		// check that the developer added socket.io libary, 
		// if not add that dependency to the head tags.
		importSocketIOLibary();

		settings = extend(settings, devSettings);

		window.onload = function() { 
			io = window.io;
		};
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
	 * Creates the chatbox.
	 */
	function create() {

		var h3 = document.createElement('h3');
		var data = '';

		minimizer = document.createElement('div');
		chatbox = document.createElement('div');
		chatContent = document.createElement('div');
		chatInput = document.createElement('input');

		h3.innerHTML = settings.title;
		h3.style.color = settings.titleColor;
		h3.style.textAlign = 'center';
		h3.style.height = '60px';
		h3.style.lineHeight = '60px';
		h3.style.width = '100%';
		h3.style.position = 'absolute';
		h3.style.margin = '0';
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

		chatInput.style.width = '100%';
		chatInput.style.height = '40px';
		chatInput.style.padding = '0 5px 0 5px';
		chatInput.style.bottom = '0';
		chatInput.style.position = 'absolute';
		chatInput.style.display = 'block';
		chatInput.setAttribute('id', 'chatInput');

		chatbox.style.overflow = 'hidden';
		chatbox.style.width = '325px';
		chatbox.style.minHeight = '60px';
		chatbox.style.maxHeight = '370px';
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

		minimizer.onclick = function () {
			
			if(chatStatus == 'closed') {
				triggerEvent('openingChatbox');
				open();
			} else if(chatStatus == 'opened') {
				triggerEvent('closingChatbox');
				close();
			}
		};

		chatInput.onkeydown = function(e) {
			data = chatInput.value;
			if(e.keyCode == 13) {
				sendData(data);
			}
		};

		return this;
	}

	/**
	 * Opens the chat.
	 */
	function open() {
		
		var animationFrame = requestAnimFrame(open);

		progress += 10;
		chatContent.style.height = progress+'px';
				
		if(progress >= 300) {
			cancelAnimationFrame(animationFrame);
			triggerEvent('chatboxIsOpened');
			return;
		}
	}

	/**
	 * Displays the form for entering the chat.
	 */
	function displayForm() {
		if(chatbox.querySelector('#chatInput')) {
			chatbox.removeChild(chatInput);
			chatInput.value = '';
		}

		form = document.createElement('form');
		
		var p1 = document.createElement('p');
		var p2 = document.createElement('p');
		var p3 = document.createElement('p');
		var labelName = document.createElement('label');
		var labelEmail = document.createElement('label');
		var inputName = document.createElement('input');
		var inputEmail = document.createElement('input');
		var start = document.createElement('button');

		labelName.innerHTML = 'What\'s your Name ?';
		labelEmail.innerHTML = 'And your Email ?';
		start.innerHTML = 'Start';

		form.style.width = '300px';
		form.style.textAlign = 'center';

		labelName.style.display = 'block';
		inputName.style.width = '80%';
		inputName.style.height = '30px';
		inputName.style.padding = '0 5px';
		inputName.setAttribute('name', 'username');
		inputName.setAttribute('id', 'username');

		labelEmail.style.marginTop = '25px';
		labelEmail.style.display = 'block';
		inputEmail.style.width = '80%';
		inputEmail.style.height = '30px';
		inputEmail.style.padding = '0 5px';
		inputEmail.setAttribute('name', 'email');
		inputEmail.setAttribute('id', 'email');

		start.style.marginTop = '25px';
		start.style.padding = '10px 16px';
		start.style.backgroundColor = '#7fabda';
		start.style.border = '0';
		start.style.color = '#ffffff';
		start.style.cursor = 'pointer';
		start.setAttribute('type', 'submit');
		start.setAttribute('id', 'start');
		
		p1.appendChild(labelName);
		p1.appendChild(inputName);
		form.appendChild(p1);
		p2.appendChild(labelEmail);
		p2.appendChild(inputEmail);
		form.appendChild(p2);
		p3.appendChild(start);
		form.appendChild(p3);

		chatContent.appendChild(form);

		form.onsubmit = function(e) {
			e.preventDefault();

			inputEmail.style.backgroundColor = '#ffffff';
			inputName.style.backgroundColor = '#ffffff';
			
			if(validation([inputName, inputEmail]).fails) return;

			triggerEvent('formValidationPassed', [inputName.value, inputEmail.value]);

			if(socket = io(
				settings.protocol+'://'+settings.url+':'+settings.port,
				{query:'name='+name+'&email='+email}
			)) {
				triggerEvent('handshakeWithClientCreated', [socket]);
			} else {
				throw new HandshakeException;
			}
		};
	};

	/**
	 * Validate the inputs.
	 */
	function validation(inputs) {

		var validation = {};

		validation.fails = false;

		inputs.forEach(function (input, index) {
			
			input.value = stripScripts(input.value);

			if(input.value == '') {
				input.style.backgroundColor = '#f2dede';
				validation.fails = true;
				triggerEvent('formValidationFailed', [input.name]);
			}

			if(input.name == 'email' && ! validateEmail(input.value)) {
				input.style.backgroundColor = '#f2dede';
				validation.fails = true;
				triggerEvent('formValidationFailed', [input.name]);
			}

			stripScripts(input.value);
		});

		return validation;
	}

	/**
	 * Validate the email address.
	 */
	function validateEmail(email) {
    	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	}

	/**
	 * Make sure we remove script tags.
	 */
	function stripScripts(input) {
	    var div = document.createElement('div');
	    div.innerHTML = input;
	    var scripts = div.getElementsByTagName('script');
	    var scriptsIndex = scripts.length;
	    
	    if(scriptsIndex > 0 ) triggerEvent('hackingAttempted');

	    while(scriptsIndex--) {
	    	scripts[scriptsIndex].parentNode.removeChild(scripts[scriptsIndex]);
	    }
	    
	    return div.innerHTML;
  	}

	/**
	 * After opening the chat will load the content
	 * via Ajax.
	 */
	function loadContent(socket, name) {
		chatbox.appendChild(chatInput);
		chatContent.innerHTML = 'Welcome '+name;
	}

	/**
	 * Closes the chat.
	 */
	function close() {
		var animationFrame = requestAnimFrame(close);
		
		progress -= 10;
		chatContent.style.height = progress+'px';
				
		if(progress <= 0) {
			cancelAnimationFrame(animationFrame);
			triggerEvent('chatboxIsClosed');
			return;
		}
	}

	/**
	 * Simply removes all chat content.
	 */
	function flushChat() {
		chatContent.innerHTML = "";
	}

	/**
	 * Extend an object.
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
	 * Handle all the errors
	 */
	function errorHandler() {
		
		window.onerror = function(message, source, lineno, colno, error) {
			if(error instanceof InvalidArgumentException) {
				console.error('InvalidArgumentException in '+source+' on line '+lineno);
			} else if(error instanceof HandshakeException) {
				console.error('HandshakeException in '+source+' on line '+lineno);
			} else if(error instanceof BadEventCallException) {
				console.error('BadEventCallException in '+source+' on line '+lineno);
			} else {
				return false;
			}

			return true;
		};

	}

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

	window.requestXHR = (function(){
	  	return new XMLHttpRequest || 
	  		   new ActiveXObject('Microsoft.XMLHTTP');
	})();


	// decalre some custom exceptions
	function HandshakeException() {};
	function InvalidArgumentException() {};
	function BadEventCallException() {};

	triggerEvent('SupportChatIsFullyLoaded');

	return {
		after: function() {},
		create: create,
	}
};
