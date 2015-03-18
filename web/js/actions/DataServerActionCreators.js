var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {
	receiveAll: function(rawNodes) {
		AppDispatcher.handleServerAction({
			type: "RECEIVE_RAW_NODES",
			rawNodes: rawNodes
		});
	},
	updateListName: function(name) {
		AppDispatcher.handleServerAction({
			type: "UPDATE_LIST_NAME",
			name: name
		});
	},
	updateItem: function(item) {
		AppDispatcher.handleServerAction({
			type: "UPDATE_ITEM",
			item: item
		});
	},
	addItem: function(item) {
		AppDispatcher.handleServerAction({
			type:"ADD_ITEM",
			item: item
		});
	},
	deleteItem: function(id) {
		AppDispatcher.handleServerAction({
			type:"DELETE_ITEM",
			id: id
		});
	}
};
