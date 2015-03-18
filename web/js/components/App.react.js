var DataStore = require('../stores/DataStore');
var SelectionStore = require('../stores/SelectionStore');
var List = require('./List.react');
var React = require('react');

var App = React.createClass({
	getInitialState: function() {
		return {
			list: {
				name: "Enter a name for your list...", 
				items:[]
			},
			selection: null
		};
	},
	componentDidMount: function() {
		DataStore.addChangeListener(this._onChange);
		SelectionStore.addChangeListener(this._onSelect);
	},
	render: function() {
		return (
			<div>
			<List list={this.state.list} 
				selection={this.state.selection} />
			</div>
		)
	},
	_onChange: function() {
		state = this.state;
		state.list = DataStore.getAll();
		this.setState(state);
	},
	_onSelect: function() {
		state = this.state;
		state.selection = SelectionStore.get();
		this.setState(state);
	}
});

module.exports = App;
