function doOpen() {

  if (OS_ANDROID) {
   
    var activity = $.getView().activity;
    var menuItem = null;

    activity.onCreateOptionsMenu = function(e) {

	if ($.tabGroup.activeTab.title === "Feed") {

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


user.login("cidm4385_tigram_admin", "cidm4385", function(_response) {
	
	if(_response.success)
	{
	
		$.tabGroup.open();


		$.feedController.initialize();		
	} else {
  		alert("Error starting application " + _response.error);
  		Ti.API.error('error logging in ' + _response.error);
	}
});

if (user.authenticated() === true) {
	$.userLoggedInAction();
} else {
	$.userNotLoggedInAction();
}

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

