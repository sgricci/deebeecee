var React = require('react');

var NewItem = React.createClass({
	render: function() {
		return (
			<tr>
				<td className="add">
					<i onClick={this.onClick} className="fa fa-check"></i>
				</td>
				<td>
					<input type="text" name="Item" defaultValue="" placeholder="Name..." className="form-control" />
				</td>
				<td>
					<input type="text" name="B" defaultValue="" placeholder="Breadth" className="form-control" />
				</td>
				<td>
					<input type="text" name="D" defaultValue="" placeholder="Depth" className="form-control" />
				</td>
				<td>
					<input type="text" name="C" defaultValue="" placeholder="Cost to build" className="form-control" />
				</td>
			</tr>
		);
	},
	onClick: function(event) {
		$this = $(event.nativeEvent.originalTarget).parent().parent();
		var params = {
		};
		$this.find('input').each(function(i, el) {
			var name = $(el).attr('name');
			if (name != "Item") {
				params[name] = parseInt($(el).val(),10);
			}
			else {
				params[name] = $(el).val();
			}
			$(el).val('');
		});
		params['ListId'] = this.props.list.Id;
		$.ajax({
			url: '/api/item', 
			type: 'POST',
			headers: { "Content-Type": "application/json" },
			data: JSON.stringify(params), 
			success: function(data) {
			get_items(params['ListId']);
		}});
	}
});

module.exports = NewItem;
