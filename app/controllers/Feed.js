var geo = require ("geo");

// load sharing library
var sharing = require("sharing");


$.feedTable.addEventListener("click", processTableClicks);
var args = arguments[0] || {};

OS_IOS && $.cameraButton.addEventListener("click", function(_event) {
	$.cameraButtonClicked(_event);
});

function processTableClicks(_event) {
  if (_event.source.id === "commentButton") {
    handleCommentButtonClicked(_event);
  } else if (_event.source.id === "locationButton") {
    handleLocationButtonClicked(_event);
  } else if (_event.source.id === "shareButton") {
    handleShareButtonClicked(_event);
  }
}

function processImage(_mediaObject, _callback) {
	geo.getCurrentLocation(function(_coords) {
		var parameters = {
			"photo" : _mediaObject,
			"title" : "Sample Photo " + new Date(),
			"photo_sizes[preview]" : "320x320#",
			"photo_sizes[iphone]" : "320x320#",
			//Since we are showing hte image immediately
			"photo_sync_sizes[]" : "preview",
		};
		//if we got a lcoation, then set it
		if(_coords) {
			parameters.custom_fields = {
				coordinates : [_coords.coords.longitude,
							  _coords.coords.latitude],
							  location_string : _coords.title
			};
		}
		var photo = Alloy.createModel('Photo', parameters);
		photo.save({}, {
			success : function(_model, _response) {
				Ti.API.debug('success: ' + _model.toJSON());
				_callback({
					model : _model,
					message : null,
					success : true
				});
			},
			error : function(e) { debugger;
				Ti.API.error('error: ' + e.message);
				_callback({
					model : parameters,
					message : e.message,
					success : false
				});
		}
	});
});
}


function processTableClicks(_event) { debugger;
	if (_event.source.id === "commentButton") {
		handleCommentButtonClicked(_event);
	} else if (_event.source.id === "locationButton") {
		handleLocationButtonClicked(_event);
	} else if (_event.source.id === "shareButton") {
		handleShareButtonClicked(_event);
	}
}


function handleCommentButtonClicked(_event) {
	var collection, model = null;
	if (!_event.row) {
		model = _event.data;
	} else {
		collection = Alloy.Collections.instance("Photo");
		model = collection.get(_event.row.row._id);
	var collection,
	    model = null;
	    
	if (!_event.row) {
		model = _event.data;
	} else {
		collection = Alloy.Collections.instance("Photo");
		model = collection.get(_event.row.row_id);
	}

	var controller = Alloy.createController("comment", {
		photo : model,
		parentController : $
	});

	controller.initialize();

	Alloy.Globals.openCurrentTabWindow(controller.getView());

}


$.cameraButtonClicked = function(_event) {
	alert("user clicked the camera button");

	var photoSource = Titanium.Media.getIsCameraSupported() ? Titanium.Media.showCamera : Titanium.Media.openPhotoGallery;

	photoSource({
		success : function(event) {
			
			processImage(event.media, function(processResponse) {

				if(processResponse.success){
					
					var row = Alloy.createController("feedRow", processResponse.model);
	
					
					if ($.feedTable.getData().length === 0) {
						$.feedTable.setData([]);
						$.feedTable.appendRow(row.getView(), true);
					} else {
						$.feedTable.insertRowBefore(0, row.getView(), true);
					}
	
				} else {
					alert('Error saving photo ' + processResponse.message);					
				}

			});
		},
		cancel : function() {
			
		},
		error : function(error) {
			
			if (error.code == Titanium.Media.NO_CAMERA) {
				alert("Please run this test on a device");
			} else {
				alert("Unexpected error" + error.code);
			}
		},
		saveToPhotoGallery : false,
		allowEditing : true,
		
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
	});
};

function processImage(_mediaObject, _callback) {
	var parameters = {
		"photo" : _mediaObject,
		"title" : "Sample Photo " + new Date(),
		"photo_sizes[preview]" : "200x200#",
		"photo_sizes[iphone]" : "320x320#",
		"photo_sync_sizes[]" : "preview"
	};

	var photo = Alloy.createModel('Photo', parameters);

	photo.save({}, {
		success : function(_model, _response) { 
			Ti.API.debug('success: ' + _model.toJSON());
			_callback({
				model : _model,
				message : null,
				success : true
			});
		},
		error : function(e) {
			
			Ti.API.error('error: ' + e.message);
			_callback({
				model : parameters,
				message : e.message,
				success : false
			});
		}
	});
}

function handleShareButtonClicked(_event) {
  var collection, model;

  if (!_event.row) {
    model = _event.data;
  } else {
    collection = Alloy.Collections.instance("Photo");
    model = collection.get(_event.row.row_id);
  }

  // commonjs library for sharing
  sharing.sharingOptions({
    model : model
  });
} 
/**
 * Loads photos from ACS
 */
function loadPhotos() {
	var rows = [];

	var photos = Alloy.Collections.photo || Alloy.Collections.instance("Photo");

	var where = {
		title : {
			"$exists" : true
		}
	};

	photos.fetch({
		data : {
			order : '-created_at',
			where : where
		},
		success : function(model, response) {
			photos.each(function(photo) {
				var photoRow = Alloy.createController("feedRow", photo);
				rows.push(photoRow.getView());
			});
			$.feedTable.data = rows;
			Ti.API.info(JSON.stringify(data));
		},
		error : function(error) {
			alert('Error loading Feed ' + error.message);
			Ti.API.error(JSON.stringify(error));
		}
	});
}


$.initialize = function() {
  loadPhotos();
};

$.filter.addEventListener(OS_IOS ? 'click' : 'change',
filterTabbedBarClicked);

function filterTabbedBarClicked(_event) {
	var itemSelected = OS_IOS ? _event.index : _event.rowIndex;
	switch (itemSelected) {
		case 0:
		//List View Display
		$.mapview.visible = false;
		$.feedTable.visible = true;
		break;
		case 1:
		//Map View Display
		$.feedTable.visble = false;
		$.mapView.visible = true;
		showLocalImages();
		break;
	}
}

function showLocalImages() {
$.locationCollecton = Alloy.createCollection('photo');

geo.getCurrentLocation(function(_coords) {
	var user = Alloy.Globals.currentUser;
	
	$.locationCollection.findPhotosNearMe (user, _coords, 5, {
		success : fucniton(_collection, _response) {
			Ti.APIU.info(JSON.stringify)(_collection));
			
			if(_collection.models.length) {
				addPhotosToMap(_colleciton);
			}else{
				alert("No Local Images Found");
				filterTabbedBarClicked({
					index : 0,
					rowIndex : 0,
				});
			if(OS_ANDROID) {
				$.filter.setSelectedRow(0,0, false);
			}else{
				$.filter.setIndex(0);
			}
			}
			},
			error : function(error) {
				alert('Error loading Feed' + e.message);
				Ti.API.error(JSON.stringify(error));
			}
			});
		});
	}

function addPhotoToMap(_collection) {
	var annotationArray = [];
	var lastLat;
	
	$.mapview.removeAllAnnotations();
	
	var annotationRightButton = function() {
		var button = Ti.UI.createButton({
			title : "X",
		});
		return button;
	};
	for (var i in _collection.models) {
		var mapData = _colleciton.models[i].toJSON();
		var coords = mapData.custom_fields.coordinates;
		var annotaiton = Alloy.Globals.Map.createAnnotation({
			latittude : Number(coords[0][1]),
			longitude : Number(coords[0][0]),
			subtitle : mapData.custom_fields.locations_string,
			title : mapData.title,
			data : _collection.models[i].clone()
		});
		if(OS_IOS) {
			annotation.setPincolor(Alloy.Globals.Map.ANNOTATION_RED);9
			annotation.setRightButton(Titanium.UI.iPhone.SystemButton.DISCLOSURE);
		}else{
			annotation.setRightButton(annotiationRightButton);
		}
		annotationArray.push(annotiation);
		}
		var region = geo.calculateMapRegion(annotationArray);
		var parameters = argument[0] || {};
		var currentPhoto = parameters.photo || {};
		var parentController = parameters.parentController || {};
		
		$.image.image = currentPhoto.attributres.urls.preview;
		$.titleLabel.text = currentPhoto.attributes.title || '';
		
		//get comment count from object
		var count = currentPhoto.attributes.reviews_count !== undefined ?
		currentPhoto.attributes.reviews_count : 0;
		
		if(count !== 0) {
			$.commentButton.title = "Comments (" + count + ")";
		}
		$.buttonContainer.addEventListener('click', function(_event) {
			_event.data = currentPhoto;
			parameters.clickHandler(_event);
		});
		$.getView().addEventListener("androidback", androidBackEventHandler);
		
		function androidBackEventHandler(_event) {
			_event.cancelBubble = true;
			_event.bubbles = false;
			$.getView().removeEventListener("androidback", andrdoidBackEventHandler);
			$.getView().close();
		}
		
		$.getView().addEventListener("open", function() {
			OS_ANDROID && ($.getView().activity.onCreateOptionsMenu = function() {
				var actionBar = $.getView().activity.actionBar;
				if(actionBar) {
					actionBar.displayHomeAsUp = true;
					actionBar.onHomeIconItemSelected = function() {
						$.getView().removeEventListener("androidback", androidBackEventHandler);
						$.getView().close();
					};
				}
			});
		});
			
		