var ListViewActionCreators = require('../actions/ListViewActionCreators');
var DataServerActionCreators = require('../actions/DataServerActionCreators');
var ItemList = require('./ItemList.react');
var React = require('react');

var List = React.createClass({
	render: function() {
		var name = this._getName();
		
		return (<div>
				<div className="row">
					<h1 onClick={this.onClick} className="col-xs-12">
						{name} 
					</h1>
				</div>
				<div className="row">
					<ItemList list={this.props.list} selection={this.props.selection} />
				</div>
			</div>);
	},
	_getName: function() {
		selection = this.props.selection;
		if (selection !== null && selection.name == "LIST_NAME") {
			return <input name="list_name" onBlur={this.handleChange} defaultValue={this.props.list.name} />;
		} else {
			return this.props.list.name;
		}
	},
	handleChange: function(event) {
		ListViewActionCreators.declickLinkTitle();
		DataServerActionCreators.updateListName(event.target.value);
	},
	onClick: function(event) {
		$this = $(event.nativeEvent.target);
		ListViewActionCreators.clickLinkTitle();
	}
});

module.exports = List;
