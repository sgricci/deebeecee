var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {
	clickLinkTitle: function() {
		AppDispatcher.handleViewAction({
			type: "LIST_NAME_CLICKED"
		});
	},
	declickLinkTitle: function() {
		AppDispatcher.handleViewAction({
			type: "LIST_NAME_DECLICKED"
		});
	},
	clickItem: function(entityId) {
		AppDispatcher.handleViewAction({
			type: "ITEM_ROW_CLICKED",
			entityId: entityId
		});
	},
	clearSelection: function() {
		AppDispatcher.handleViewAction({
			type:"CLEAR_SELECTION"
		});
	}
};
