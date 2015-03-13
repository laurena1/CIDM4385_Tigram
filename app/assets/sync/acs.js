function S4() {
	return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}

function guid() {
	return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function InitAdapter(config) {
	Cloud = require("ti.cloud");
	Cloud.debug = !0;
	config.Cloud = Cloud;
}

function Sync(method, model, options) {
	var object_name = model.config.adapter.collection_name;

	if (object_name === "photos") {
		processACSPhotos(model, method, options);
	} else if (object_name === "users") {
		processACSUsers(model, method, options);
	} else if (object_name ==="reviews") {
		processACSComments (model, method, options);
	}
}


function processACSPhotos(model, method, options) {
	switch (method) {
		case "create":
			
			Cloud.Photos.create(model.toJSON(), function(e) {
				if (e.success) {

					
					model.meta = e.meta;
					if (e.reviews.length === 1) {
						opts.success && opts.success(e.reviews[0]),
					} else {
						pts.success && opts.success (e.reviwes)
					}
					
					//options.success(e.photos[0]);
	
					
					model.trigger("fetch");
			
					return;
					} else {
						
					Ti.API.error("Photos.create " + e.message);
					options.error(e.error && e.message || e);
				}
			});
			break;
			case "update":
	    case "delete":
	    break;
	    
	    function processACSComments(model, method, opts) {

	switch (method) {
	case "create":
		var params = model.toJSON();

		Cloud.Reviews.create(params, function(e) {
			if (e.success) {
				model.meta = e.meta;
				opts.success && opts.success(e.reviews[0]);
				model.trigger("fetch");
			} else {
				Ti.API.error("Comments.create " + e.message);
				opts.error && opts.error(e.message || e);
			}
		});
		break;
		
		case "delete":
		var params = {};
		params.review_id = model.id || (opts.data && opts.data.id);

		params.photo_id = opts.data && opts.data.photo_id;

		Cloud.Reviews.remove(params, function(e) {
			if (e.success) {
				model.meta = e.meta;
				opts.success && opts.success(model.attributes);
				model.trigger("fetch");
				return;
			}
			Ti.API.error(e);
			opts.error && opts.error(e.error && e.message || e);
		});
		break;
	    
	    
	    	model.id && (options.datas.photo_id = model.id);
	    	
	    	var method = model.id ? Cloud.Photos.show : Cloud.Photos.query;
	    	
	    	method((options.data || {}), function(e) {
	    		if (e.success) {
	    			model.meta = e.meta;
	    			if (e.photos.length === 1) {
	    				options.success(e.photos[0]);
	    			} else {
	    				options.success(e.photos);
	    			}
	          		model.trigger("fetch");
	          		return;
	        	} else {
	          		Ti.API.error("Cloud.Photos.query " + e.message);
	          		options.error(e.error && e.message || e);
	        	}
	      	});
	      	break;
		case "update":
		case "delete":
			alert("Not Implemented Yet");
			break;
	}
}

var _ = require("alloy/underscore")._;

module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
	config = config || {};
	config.data = {};
	InitAdapter(config);
	return config;
};

module.exports.afterModelCreate = function(Model) {
	Model = Model || {};
	Model.prototype.config.Model = Model;
	return Model;
}; 