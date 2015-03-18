var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var CLICK_EVENT = 'click';

var selection = null;

var SelectionStore = merge(EventEmitter.prototype, {
	emitSelection: function() {
		this.emit(CLICK_EVENT);
	},
	addChangeListener: function(callback) {
		this.on(CLICK_EVENT, callback);
	},
	get: function() {
		return selection;
	},
	clear: function() {
		selection = null;
	}
});

SelectionStore.dispatchToken = AppDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.type) {
		case "LIST_NAME_CLICKED":
			selection = {name: "LIST_NAME"};
			SelectionStore.emitSelection();
			break;
		case "LIST_NAME_DECLICKED":
			SelectionStore.clear();
			SelectionStore.emitSelection();
			break;
		case "CLEAR_SELECTION":
			SelectionStore.clear();
			SelectionStore.emitSelection();
			break;
		case "ITEM_ROW_CLICKED":
			selection = {name: "ITEM_ROW", entityId: action.entityId}
			SelectionStore.emitSelection();
			break;
		default:
			// do nothing
	}
});
module.exports = SelectionStore;
