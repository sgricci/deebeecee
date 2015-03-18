var DataServerActionCreators = require('../actions/DataServerActionCreators');
var $ = require('jquery');

DataWebAPIUtils = {
	list: null,
	getAllNodes: function(list_id) {
		$.getJSON("/api/list/"+list_id, function(data) {
			var list = data;
			$.getJSON("/api/list/"+list_id+"/items", function(data) {
				list.items = data;
				DataServerActionCreators.receiveAll(list);
			});
		});
	},
	createList: function(list, callback, params) {
		$.ajax({
			url: "/api/list",
			contentType: "application/json",
			data: JSON.stringify(list),
			dataType: "json",
			method: "POST",
			success: function(data) {
				DataWebAPIUtils.list = data;
				if (typeof callback !== "undefined") {
					params.list_id = data.id;
					console.log(data);
					console.log(params);
					callback(params);
				} else {
					DataWebAPIUtils.getAllNodes(data.id);
				}
			}
		});
	},
	saveList: function(list) {
		$.ajax({
			url: "/api/list/"+list.id,
			contentType: "application/json",
			data: JSON.stringify(list),
			dataType: "json",
			method: "PUT",
			headers: {
				'RwKey': DataWebAPIUtils.list.rw_key
			},
			success: function(data) {
				DataWebAPIUtils.getAllNodes(list.id);
			}
		});
	},
	saveItem: function(item) {
		$.ajax({
			url: "/api/item/"+item.id,
			contentType: "application/json",
			data: JSON.stringify(item),
			dataType: "json",
			method: "PUT",
			headers: {
				'RwKey': DataWebAPIUtils.list.rw_key
			},
			success: function(data) {
				DataWebAPIUtils.getAllNodes(item.list_id);
			}
		});	
	},
	addItem: function(item) {
		if (DataWebAPIUtils.list == null) {
			return DataWebAPIUtils.createList({name: "My List"}, DataWebAPIUtils.addItem, item);
		}
		$.ajax({
			url: "/api/item",
			contentType: "application/json",
			data: JSON.stringify(item),
			dataType: "json",
			method: "POST",
			headers: {
				'RwKey': DataWebAPIUtils.list.rw_key
			},
			success: function(data) {
				DataWebAPIUtils.getAllNodes(item.list_id);
			}
		});	
	},
	deleteItem: function(item_id) {
		$.ajax({
			url: "/api/item/"+item_id,
			dataType: "json",
			method: "DELETE",
			headers: {
				'RwKey': DataWebAPIUtils.list.rw_key
			},
			success: function(data) {
				DataWebAPIUtils.getAllNodes(DataWebAPIUtils.list.id);
			}
		});	
	}
};
module.exports = DataWebAPIUtils;
