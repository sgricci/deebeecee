var AppDispatcher = require('../dispatcher/AppDispatcher');
var DataWebAPIUtils = require('../utils/DataWebAPIUtils');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var _nodes = {};

var DataStore = merge(EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},
	get: function(id) {
		return _nodes[id];
	},
	getAll: function() {
		return _nodes;
	},
	setName: function(name) {
		_nodes.name = name;
		list = {
			name: name,
			id: _nodes.id
		};
		DataWebAPIUtils.saveList(list);
	},
	updateItem: function(id, item) {
		var _item = null;
		var key;
		for (i in _nodes.items) {
			if (_nodes.items[i].id == id) {
				_item = _nodes.items[i];
				key = i;
			}
		}
		if (_item == null) {
			return;
		}
		_item.item = item.item;
		_item.b = parseFloat(item.b);
		_item.d = parseFloat(item.d);
		_item.c = parseFloat(item.c);
		_nodes.items[key] = _item;
		DataWebAPIUtils.saveItem(_item);
		return _item;
	}
});

DataStore.dispatchToken = AppDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.type) {
		case "RECEIVE_RAW_NODES":
			_nodes = action.rawNodes;
			DataStore.emitChange();
			break;
		case "UPDATE_LIST_NAME":
			DataStore.setName(action.name);
			DataStore.emitChange();
			break;
		case "UPDATE_ITEM":
			DataStore.updateItem(action.item.id, action.item);
			DataStore.emitChange();
			break;
		default:
			// do nothing
	}
});
module.exports = DataStore;
