define([
	'dsv',
], function () {
	'use strict';
	//set up homeview
	var pin = SD.defaultView.extend({
		el: 'page',
		template: JST['templates/users/pinsave.ejs'],
		render: function () {
			this.$el.html(this.template);
			SD.setTitle('Pin Saved');
		},
	});
	return pin;
});