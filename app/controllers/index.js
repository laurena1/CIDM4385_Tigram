function doOpen() {

	if (OS_ANDROID) {
		
		var activity = $.getView().activity;
		var menuItem = null;

		activity.onCreateOptionsMenu = function(e) {

			Ti.API.info('IN activity.onCreateOptionsMenu');
			Ti.API.info('Active Tab: ' + $.tabGroup.activeTab.title);

			if ($.tabGroup.activeTab.title === "Settings") {
				menuItem = e.menu.add({
					title : "Logout",
					showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
				});
				menuItem.addEventListener("click", function(e) {
					$.settingsController.handleLogoutMenuClick();
				});
			} else if ($.tabGroup.activeTab.title === "Feed") {
				menuItem = e.menu.add({
					title : "Take Photo",
					showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
					icon : Ti.Android.R.drawable.ic_menu_camera
				});

				menuItem.addEventListener("click", function(e) {
					$.feedController.cameraButtonClicked();
				});
			}
		};

		activity.invalidateOptionsMenu();

		
		$.tabGroup.addEventListener('blur', function(_event) {
			$.getView().activity.invalidateOptionsMenu();
		});
	}
}

var user = Alloy.createModel('User');


//This is now doing application setup
$.loginSuccessAction = function(_options) {

	Ti.API.info('logged in user information');
	Ti.API.info(JSON.stringify(_options.model, null, 2));

	
	$.tabGroup.open();

	
	$.tabGroup.setActiveTab(0);

	
	$.feedController.initialize();

	
	Alloy.Globals.currentUser = _options.model;

	
	$.feedController.parentController = $;
	$.friendsController.parentController = $;
	$.settingsController.parentController = $;

	
	$.loginController && $.loginController.close();
};

//presetns the lgoing controller in order to supply credentials
$.userNotLoggedInAction = function() {
	
	if (!$.loginController) {
		var loginController = Alloy.createController("login", {
			parentController : $,
			reset : true
		});

		
		$.loginController = loginController;
	}

	
	$.loginController.open(true);

};

//calls a subsequennt method to do all intial applciation setup
$.userLoggedInAction = function() {
	
	user.showMe(function(_response) {
		if (_response.success === true) {
			
			$.loginSuccessAction(_response);
		} else {
			alert("Application Error\n " + _response.error.message);
			Ti.API.error(JSON.stringify(_response.error, null, 2));

			
			$.userNotLoggedInAction();
		}
	});
};


if (user.authenticated() === true) {
	$.userLoggedInAction();
} else {
	$.userNotLoggedInAction();
}


Alloy.Globals.openCurrentTabWindow = function(_window) {
	$.tabGroup.activeTab.open(_window);
};

