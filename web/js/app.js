var list = {
	id: 1,
	name: "Test",
	items: [{
		id: 1,
		item: "Test",
		b: "100",
		d: "100",
		c: "40"
	}]
};

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
var Item = React.createClass({
	render: function() {
		return (
			<tr>
				<td colSpan="2">{this.props.item.Item}</td>
				<td>{this.props.item.B}</td>
				<td>{this.props.item.D}</td>
				<td>{this.props.item.C}</td>
			</tr>
		);
	}
});

var ItemList = React.createClass({
	render: function() {
		var items = this.props.list.items.map(function(item) {
			return (
				<Item item={item} />
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

var List = React.createClass({
	render: function() {
		return <div>
				<div className="row">
					<h1 className="col-xs-12">
						<input type="text" onBlur={this.handleChange} className="col-xs-12" 
							defaultValue={this.props.list.Name} />
					</h1>
				</div>
				<div className="row">
					<ItemList list={this.props.list} />
				</div>
			</div>;
	},
	handleChange: function(event) {
		this.setState({value: event.target.value});
		save_list(event.target.value, this.props.list.Id);
	},
});

var App = React.createClass({
	render:function() {
		return <div>
			<List list={this.props.data} />
			</div>;
	}
});

save_list = function(name, list_id) {
	$.ajax({
		url: '/api/list/'+list_id,
		type: 'PUT', 
		data: JSON.stringify({Name: name}),
		headers: { "Content-Type": "application/json" },
		success: function(data) {
			get_items(data);
		}
	});
};

get_list = function(id) {
	var list;
	$.getJSON('/api/list/'+id, function(data) {
		list = data;
		get_items(list);
	});
};
get_items = function(list) {
	$.getJSON('/api/list/'+list.Id+'/items', function(data) {
		list.items = data;
 		React.render(<App data={list} />, document.getElementById('main'));
	});	
};



$(function() {
	get_list(2);
});
