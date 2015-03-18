var DataServerActionCreators = require('../actions/DataServerActionCreators');
var $ = require('jquery');

DataWebAPIUtils = {
	getAllNodes: function() {
		$.getJSON("/api/list/2", function(data) {
			var list = data;
			$.getJSON("/api/list/2/items", function(data) {
				list.items = data;
				DataServerActionCreators.receiveAll(list);
			});
		});
	},

	saveList: function(list) {
		$.ajax({
			url: "/api/list/"+list.id,
			contentType: "application/json",
			data: JSON.stringify(list),
			dataType: "json",
			method: "PUT",
			success: function(data) {
				DataWebAPIUtils.getAllNodes();
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
			success: function(data) {
				DataWebAPIUtils.getAllNodes();
			}
		});	
	}
};
module.exports = DataWebAPIUtils;