define(['jtrans'], function(jtrans) {
	
	var view = jtrans.prototype.Constructors.ElementView.extend({
		events: {
			'click': 'doAnything'
		},
		
		doAnything: function() {
			this.Transitions.display('second');
		},
	});
	
	return view;
		
		
});
