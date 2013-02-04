/*

	This module demonstrates many usages of the jtrans plugin.
	
	WHAT DOES jtrans DO?
	
		The jtrans jQuery Plugin allows for easily setting up transitions 
		between "pages" in an ajax based web-app.
		
		When working inside a fully Ajax-ified environment, developers 
		need to take care of transitions between multiple pages 
		(a task that is done by the browser in the non-Ajax world).
		
		Although this functionality seems to be a simple one
		in comparison to other app-specific needs, sometimes it 
		ends up cluttering the code with unnecessary complexity.
	
	
	Plugin basic usage:
	
	1.	Select a transition containing frame element with jQuery.
	
	2.	On the instantiated jQuery object, call .jtrans('obj') to
		retrieve the PluginObj that contains all transition methods
		and constructors.
		
	3.	Use PluginObj.set({ option: value, another: val2 }) to set the
		default behaviour of the transitions.
		
			globalOptions:
				overlap:			0,
				duration:			500,	(miliseconds)
				transitionType:		'fade',
				template:			'<div id="replace-with-yours">You should place your template here</div>',
				view:				Element.View
		
	4.	Build an elementOptions object containing the following data:
		(* indicates necessary fields)
		
			elementOptions:
				- id *,
				- transitionType,		(defaults to 'fade')
				- duration,				(defaults to 500 ms)
				- template,
				- dataObj,
				- elView,		(defaults to PluginObj.Element.View)
				- elCss,
				
	5.	Use PluginObj.addElement( elementOptions ), to add an element to the
		transition collection.
		
	6.	Add as many pages/elements you need.
	
	7.	Use PluginObj.to('element-id'), in order to hide all other pages and
		show the page with the passed id. If you wish to show multiple elements
		(e.g. when each Element is not a full page, but just a component) at once,
		you may also pass an array with element-ids to be shown to the 
		PluginObj.to(['id-1','id-2','id-3']). 
		In this case, the highest overlap option value counts.
	
	Advanced usage:
	
	A)	Transitions:
	
		In order to use other transitions than the default ('fade'),
		you must register a new transition object using
		PluginObj.registerTransition(transitionName, transitionObj). 
		The TransitionObj is as follows:
			TransitionObj:
				- show: function(defer) {
				
					-- do showing animations --
					
					when animation is complete, call
					-- defer.resolve() --	
					
				},
				- hide: function(defer) {
					
					-- do hiding animations --
					
					when animation is complete, call
					-- defer.resolve() --
				
				}
				
		After registering the transition, you may specify that transition
		to be used 
			(1)	by ALL elements:
				PluginObj.set({ transitionType: transitionName })
			(2)	only by specific elements:
				
				On element creation
				elementOptions:
					- id
					- transitionType: transitionName
				
				PluginObj.addElement(elementOptions);
				
						-- OR --
				
				On the fly
				PluginObj
					.get('element','element-id')
					.set({ transitionType: transitionName })
					
					
	B)	Overlap:
		
		When setting a overlap value, you must pass in a duration value.
		Whenever the element-hiding process starts, a timer which will
		fire the "page-hidden" event is started at the same moment. The
		timer initial value is given by (1 - overlap) * duration, so that 
		when the overlap value is 0, the "page-hidden" event will only fire
		when the duration of the transition is over, and when overlap = 1,
		the showing animation will start as soon as the hiding animation does.
		
	C)	Extending PluginObj.Element.View:
	
		When creating a page/element, the developer probably needs to have full
		control over the events on it.
		
		That is the purpose of the option 'view', either in the globalOptions
		or in the elementOptions objects.
		
		The options.view property sets the Backbone.View object that shall be
		used to render the element. It is highly recommended that the passed in
		view to be an extension of the PluginObj's default Element.View, 
		as it has all of the basic functionalities of the plugin.
		
		The extension should be done as follows:
		
		var customView = PluginObj.Element.View.extend({
		
			--
			do not set: 
				defaults, initialize, tagName, show, hide, 
				setDisplay, getOpt, basicRender
			--
			
			extendedInitialize: function(options) {
				
				-- this function will be run directly after the
				initialization logic
			
			},
			
			events: {
				-- put your events here as you would 
				in normal Backbone usage
			},
			
			methods...
				-- you may set any methods you wish. Just avoid the 
				used namespaces
		});
		
	D)	Setup and Teardown:
	
		Sometimes Elements need special setting up before being displayed
		and tearing down after hiding.
		
		When extending PluginObj.Element.View, you may override the setUp
		and tearDown methods. .setUp() will be run just before the show animation
		starts and .tearDown() will be run right after the hiding animation is over.
		
		They are run once everytime the page is shown or hidden.
	
	
	1) Requirements:
		The plugin was written with RequireJS modules in mind,
		so in order to use this plugin's files as provided, 
		you must use RequireJS.
		
		Nevertheless, the plugin should be easily modifiable to be used
		outside modules.
		
		List of required libraries:
			- requireJS,
			- jQuery,
			- underscore,
			- Backbone
			
	2) Initialization:
	
		The plugin initialization does not add methods directly to the 
		jQuery object. Instead, it instantiates a PluginObj which contains
		all the special methods and settings for the plugin.
	
		All following listed methods should be 
		run on a SINGLE jQuery selection.
		
		The plugin should be initialized on a "frame-element".
		All the "transitioning-elements" added to the transitions plugin
		will be positioned relative to the frame-element.
		
		Obtain PluginObj directly:
			
		- $(htmlEl).jtrans('obj') :
			- instantiates the PluginObj if not yet instantiated
				(if the htmlEl already has a PluginObj, return it)
			- saves PluginObj at jQuery.data(htmlElement, 'jtrans')
			- returns jtrans PluginObj, which contains all
				transition methods and settings
				but cannot perform jQuery methods;
	
		Instantiate plugin, but maintain jQuery chain:
		
		- $(htmlEl).jtrans() :
			- instantiates the PluginObj
			- saves PluginObj at jQuery.data(htmlElement, 'jtrans')
			- returns normal jQuery object
			- you main obtain the PluginObj at anytime by 
				calling $(htmlEl).jtrans('obj')
				
	3) Global Settings:
	
		The plugin's default settings are:
			options = {
				overlap:			0,
				transitionType:		'fade',
				duration:			500,	(miliseconds)
				template:			'<div id="replace-with-yours">You should place your template here</div>',
				view:				Element.View
			}
			
		All following methods should be called on PluginObj ( PluginObj = $(el).jtrans('obj') )
			
		
		To set the default options to ALL elements use:
		- .set(options):
			Accepts both	.set('optionName','optionValue') and
							.set({ option1: value, option2: value2 })
							
		- .get(option):
			Retrieves the default value for the option.
		
	CODE DOCUMENTATION:
	
	
		
				
*/

define(['jtrans'], function(jtrans) {
	
	return function() {
			
		// namespace to store all jtrans instances
		window.Transitions = [
			$('#playground-1').jtrans('obj'),
			$('#playground-2').jtrans('obj'),
			$('#playground-3').jtrans('obj'),
			$('#playground-4').jtrans('obj')
		];
		
		/*
			Demonstrate basic usage:
			
			1 - extend the default Backbone View provided 
				in ~ $('#id').jtrans('obj').Element.View ~
				in order to set events inside the "page" and other 
				Backbone.View functionalities
				
			2 - create a 'elementOptions' object, which may contain the 
				following properties (default values in brackets):
					- overlap 			[0]
					- transitionType*	['fade']
					- duration 			[500] (in ms)
					- template
					- view
				
			2 - use $('#id').jtrans('obj').addElement
			
		*/
		
		var els = [
			{
				id: 'first',
				elCss: {
					backgroundColor: 'red'
				},
				dependencies: [
					{
						modules: 'http://localhost/transitions/templates/demo-remote-temp.htm',
						type: 'template'
					},
					{
						modules: 'http://localhost/transitions/js/src/demo-remote-view.js',
						type: 'elView'
					}
				],
				htmlMap: ['#first-field', '#first-image'],
				route: 'transitions/first/:test_var/:img_src'
			},
			
			{
				id: 'second',
				template: '<div id="fff">this is for the second damn element</div>',
				template_data: {
					text: ' qwke pqkew oqwke opqkwe okwqe pokwqe opkqwe '
				},
				elCss: {
					backgroundColor: 'green',
					width: '50%'
				}, 
				route: 'transitions'
			}, 
			
			{
				id: 'third',
				template: '<div id="ssss">this is for the third</div>',
				elCss: {
					backgroundColor: 'blue',
					height: '50%'
				},
				route: 'transitions/third/:ss',
				dependencies: [
					{
						type: 'elView',
						modules: 'http://localhost/transitions/js/src/third-remote-view.js'
					}
				]
			}
		];
		
		Transitions[0].addElement(els[0]);
		Transitions[0].addElement(els[1]);
		Transitions[0].addElement(els[2]);
		
		Backbone.history.start({pushState: true});
		
		Transitions[0].navigate('transitions/first/diamaosd/fff', {trigger: true});
	}
});
