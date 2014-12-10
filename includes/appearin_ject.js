opera.isReady(function() {

	var whitelistedUrlMatchers = [
		/^http[s]?:\/\/(.*\.)?appear.in\/.*$/i
	];

	var validUrlFound = false;

	for (var i = 0; i < whitelistedUrlMatchers.length; i++) {
		if(window.location.href.match(whitelistedUrlMatchers[i]) != null) {
			validUrlFound = true;
			break;
		}
	}

	if(!validUrlFound) return;

	// Inject button on appear.in
	(function waitToInjectHandOffButton(){
		setTimeout(function(){
			var container = document.querySelector(".right-aligned-button-group");

			// Keep running until we can inject our UI
			if (!container) {
				waitToInjectHandOffButton();
				return;
			}

			setupHandOffButton(container);
	   }, 50);
	})();

	var apiVersion = 5;
	var baseUrl = 'https://chrometophone.appspot.com';
	var signInUrl = baseUrl + '/signin?extret=' + encodeURIComponent('http://code.google.com/p/chrometophone/logo') + '?login&ver=' + apiVersion;
	var signOutUrl = baseUrl + '/signout?extret=' + encodeURIComponent('http://code.google.com/p/chrometophone/logo') + '?logout&ver=' + apiVersion;

	var STATUS_SUCCESS = 'success';
	var STATUS_LOGIN_REQUIRED = 'login_required';
	var STATUS_DEVICE_NOT_REGISTERED = 'device_not_registered';
	var STATUS_NO_TAB_ACCESS = 'no_tab_access';
	var STATUS_GENERAL_ERROR = 'general_error';

	function setupHandOffButton(container) {

		var button = createHandOffButton();

		button.addEventListener('click', function(evt) {
		  opera.extension.postMessage({
				action: 'send_to_phone',
				data: {
					link: window.location.href,
					title: window.document.title,
					selection: null
				}
		  });
		}, false);

		opera.extension.addEventListener('message', function(message) {
			switch (message.data.action) {
				case STATUS_SUCCESS:
					// Exit appear.in room on Desktop browser
					var signOutButton = document.querySelector(".fa-sign-out");
					signOutButton.click();

					(function changeThankYouMessage() {
						setTimeout(function() {
							var thanksEl = document.querySelector(".thank-you-message");
							if(thanksEl == null) {
								changeThankYouMessage();
								return;
							}
							var msg = document.querySelector(".thank-you-message .body");
							msg.innerText = "Your session has been transferred to your mobile device :)";
						}, 50);
					})()
					break;
				case STATUS_LOGIN_REQUIRED:
					var signinLink = '<a href="' + signInUrl + '" target="_o2pTab_ext">sign in</a>';
					showHandOffHelper("You need to " + signinLink + " with your Google account to enable Appear.in Handoff")
					break;
				case STATUS_DEVICE_NOT_REGISTERED:
					opera.extension.postMessage({
						action: 'open_tab',
						data: {
							url: 'http://code.google.com/p/chrometophone/wiki/AndroidApp'
						}
					});
					showHandOffHelper("Device not registered for user")
					break;
				case STATUS_NO_TAB_ACCESS:
					showHandOffHelper("Cannot access the current tab")
					break;
				case STATUS_GENERAL_ERROR:
					showHandOffHelper("Error sending to phone: " + message.data.action)
					break;
			}
		}, false);

		container.appendChild(button);
	}

	function createHandOffButton() {
		var div = document.createElement("div");
		div.setAttribute("class", "top-bar-button exit icon-only");
		div.setAttribute("title", "Handoff to mobile");

		var i = document.createElement("i");
		i.setAttribute("class", "fa fa-mobile");

		div.appendChild(i);
		return div;
	}

	function showHandOffHelper(text) {
		var container = document.querySelector(".in-room-notification");
		var containerClass = container.getAttribute("class");
		container.setAttribute("class", "in-room-notification ng-isolate-scope"); // remove 'ng-hide'

		var containerContent = container.querySelector(".content");
		var containerContentClass = containerContent.getAttribute("class");

		var message = containerContent.querySelector(".message");
		message.innerHTML = text;

		containerContent.setAttribute("class", containerContentClass + " visible");

		// Reset and close notification visibility
		setTimeout(function() {
			container.setAttribute("class", containerClass);
			containerContent.setAttribute("class", containerContentClass);
		}, 5000);
	}

});
