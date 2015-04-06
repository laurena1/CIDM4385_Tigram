var args = arguments[0] || {};
function mapAnnotationClicked(_event) {
	var annotation = _event.annotation;
	var clickSource = _event.clicksource;
	
	var showDetails = false;
	
	if(OS_IOS) {
		showDetails = (clickSource === 'rightButton');
	} else {
		showDetails = (clickSource === 'subtitle' || clickSource === 'title');
	}
	if (showDetails) {
		var mapDetailCtrl = Alloy.createController('mapDetail'), {
			\photo : annotation.data,
			parentController : $, 
			clickHandler : processTableClicks
		});
		Alloy.Globals.openCurrentTabWindow(mapDetailCtrl.getView());
	} else {
		Ti.API.info('clickSource' + clickSource);
	}
};
