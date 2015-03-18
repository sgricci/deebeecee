var Item = require("./Item.react");
var NewItem = require("./NewItem.react");
var React = require('react');

var ItemList = React.createClass({
	render: function() {
		selection = this.props.selection;
		var items = this.props.list.items.map(function(item) {
			return (
				<Item entityId={item.id} key={item.id} item={item} selection={selection} />
			);
		});
		var new_item = <NewItem list={this.props.list} />
		return <table className="table table-striped">
				<thead>
					<tr>
						<th colSpan="2">Item</th>
						<th>b</th>
						<th>d</th>
						<th>c</th>
					</tr>
				</thead>
				<tbody>
					{items}
					{new_item}
				</tbody>
			</table>;
			
	}
});

module.exports = ItemList;
