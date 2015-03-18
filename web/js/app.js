var App = require('./components/App.react');
var DataWebAPIUtils = require('./utils/DataWebAPIUtils');

var React = require('react');

//DataWebAPIUtils.getAllNodes();

React.render(
	<App />,
	document.getElementById('main')
);
