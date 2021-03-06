/*global define*/
define([
    'jquery',
    'backbone',
    'sd'
], function ($, Backbone, SD) {
    'use strict';

	//routes from the home page
    var Router = Backbone.Router.extend({
        routes: {
            '': 'index',
			'selector': 'login',
			'login': 'login',
			'forgotten': 'forgotten',
			'signup': 'signup',

			//Sex Selection
			'home': 'home',
			'wank': 'wank',
			'hands': 'hands',
			'oral': 'oral',
			'sex': 'sex',
			'anything': 'anything',

			//Details
			'who': 'who',
			'whoadd': 'whoadd',
			'place': 'place',
			'diary' : 'diary',
			'extra' : 'extra',
			'positions' : 'positions',

			//Stats
			'overview': 'overview',
			'graphs': 'graphs',

			//Users
			'setpin' : 'setpin',
			'confirmpin' : 'confirmpin',
			'pinsave' : 'pinsave',
			'pin' : 'pin',
			'userhistory': 'userhistory',
			'managewhos': 'managewhos',
			'settings': 'settings',
			'calendar': 'calendar',

			//Other
			'shop' : 'shop',
			'privacy' : 'privacy',
			'terms' : 'terms',
        }
    });

    return Router;
});