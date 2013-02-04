require.config({
	urlArgs: "bust=" + Math.random(),
	baseUrl: 'http://localhost/transitions/js',
	paths: {
		'jquery': 'lib/jquery',
		'underscore': 'lib/underscore',
		'backbone': 'lib/backbone',

		'jfill': 'src/jfill',
		'jtrans': 'src/app-v2',
		
		'text': 'lib/text',
		
		'demo': 'src/demo',
		
		'qunit': 'lib/qunit',
		'unit': 'test/unit'
	},
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'jtrans': {
			deps: ['jquery','underscore','backbone']
		},
		'unit': {                   
			deps: ['jquery','underscore','backbone','app']
		}
	}
});

if ( document.getElementById('unit-test-page') ) {
	// tell the QUnit not to autostart as we are asynchronously loading tests
	QUnit.config.autostart = false;
	
	// load the testing
	require(['unit'], function(unit) {
		
		console.log('initializing tests');
		QUnit.start();
		
		unit();
	});
	
} else {
	
	// load the main app page
	require(['demo'], function(demo) {
		
		console.log('initializing main page');
			
		demo();
	});
}


