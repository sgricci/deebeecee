var ListViewActionCreators = require('../actions/ListViewActionCreators');
var DataServerActionCreators = require('../actions/DataServerActionCreators');
var React = require('react');

var Item = React.createClass({
	render: function() {
		if (this.props.selection !== null && 
			this.props.selection.name == "ITEM_ROW" && 
			this.props.selection.entityId == this.props.entityId) {
			item = this._getSelected();
		} else {
			item = (
				<tr onDoubleClick={this._onDoubleClick}>
					<td colSpan="2">{this.props.item.item}</td>
					<td>{this.props.item.b}</td>
					<td>{this.props.item.d}</td>
					<td>{this.props.item.c}</td>
				</tr>
			);	
		}
		return item;
	},
	_getSelected: function() {
		return (
			<tr className="item_row_edit">
				<td>
					<a href="javascript:void(0);" onClick={this._onSave}>
						<i className="fa fa-floppy-o"></i>
					</a>
				</td>
				<td>
					<input type="text" onKeyDown={this._onKeyDown} className="item" name="item" defaultValue={this.props.item.item} />
				</td>
				<td>
					<input type="text" onKeyDown={this._onKeyDown} className="b" name="b" defaultValue={this.props.item.b} />
				</td>
				<td>
					<input type="text" onKeyDown={this._onKeyDown} className="d" name="d" defaultValue={this.props.item.d} />
				</td>
				<td>
					<input type="text" onKeyDown={this._onKeyDown} className="c" name="c" defaultValue={this.props.item.c} />
				</td>
			</tr>
		);
	},
	_onDoubleClick: function(event) {
		ListViewActionCreators.clickItem(this.props.entityId);
	},
	_onSave: function(event) {
		var item_row = $('.item_row_edit');
		var item = {
			id: this.props.entityId,
			item: item_row.find('input.item').val(),
			b: item_row.find('input.b').val(),
			d: item_row.find('input.d').val(),
			c: item_row.find('input.c').val()
		};

		DataServerActionCreators.updateItem(item);
		ListViewActionCreators.clearSelection();
	},
	_onKeyDown: function(event) {
		if (event.nativeEvent.which == 13) {
			this._onSave(event);
		} else {
			return;
		}
	}
});

module.exports = Item;