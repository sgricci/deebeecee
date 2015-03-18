var DataServerActionCreators = require('../actions/DataServerActionCreators');
var React = require('react');

var NewItem = React.createClass({
	render: function() {
		return (
			<tr className="item_row_add">
				<td className="add">
					<i onClick={this._onSave} className="fa fa-check"></i>
				</td>
				<td>
					<input type="text" onKeyDown={this._onKeyDown} name="item" defaultValue="" placeholder="Name..." className="form-control item" />
				</td>
				<td>
					<input type="text" onKeyDown={this._onKeyDown} name="b" defaultValue="" placeholder="Breadth" className="form-control b" />
				</td>
				<td>
					<input type="text" onKeyDown={this._onKeyDown} name="d" defaultValue="" placeholder="Depth" className="form-control d" />
				</td>
				<td>
					<input type="text" onKeyDown={this._onKeyDown} name="c" defaultValue="" placeholder="Cost to build" className="form-control c" />
				</td>
			</tr>
		);
	},
	_onSave: function(event) {
		var item_row = $('.item_row_add');
		var item = {
			item: item_row.find('input.item').val(),
			list_id: this.props.list.id,
			b: item_row.find('input.b').val(),
			d: item_row.find('input.d').val(),
			c: item_row.find('input.c').val()
		};
		DataServerActionCreators.addItem(item);
		item_row.find('input').val('');
		item_row.find('input.item').focus();
	},
	_onKeyDown: function(event) {
		if (event.nativeEvent.which == 13) {
			return this._onSave(event);
		} else {
			return;
		}
	}
});

module.exports = NewItem;
