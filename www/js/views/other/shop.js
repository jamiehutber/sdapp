define([
	'jquery',
	'underscore',
	'backbone',
	'JST',
	'dsv',
], function ($, _, Backbone, JST) {
	'use strict';

	//set up homeview
	var managewhos = SD.defaultView.extend({
		el: 'page',
		events: {
		},
		template: JST['templates/other/shop.ejs'],
		render: function () {
			this.$el.html(this.template);
			SD.setTitle('Our Shop');
		},
	});
	return managewhos;
});