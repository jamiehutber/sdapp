define([
	'dsv',
], function () {
	'use strict';

	//set up homeview
	var calendar = SD.defaultView.extend({
		el: 'page',
		events: {
		},
		template: JST['templates/users/calendar.ejs'],
		render: function () {
			this.$el.html(this.template);
			SD.setTitle('Sex Calendar');
		},
	});
	return calendar;
});