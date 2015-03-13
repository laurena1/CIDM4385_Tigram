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

