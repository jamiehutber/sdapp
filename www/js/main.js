/*
==================================================
Table of Contents - Created by Hutber on 04/10/13.
==================================================
 #Require JS Config
 #Require Routes set up
 #Arguments
 #isMobile If
 #SD init
 #Route Vars
 #Routes
 #On Ready
 */

'use strict';
/*==================================================
 Require JS Config
==================================================*/
require.config({
	waitSeconds: 200,
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		date: {
			exports: 'date'
		},
		ui: {
			deps: ['jquery', 'slider']
		},
		iap: {
			exports: 'SD.IAP'
		},
		sd: {
			deps: ['iap','ui']
		},
        sl: {
            deps: ['ss']
        },
		sloc: {
			deps: ['sl']
		},
		dv: {
			deps: ['sd']
		},
		ge: {
			deps: ['dv']
		},
		JST: {
			deps: ['underscore'],
			exports: 'JST'
		},
		slider: {
			deps: ['jquery'],
			exports: 'jQuery.fn.touchCarousel'
		},
		slidervisibleNearby: {
			deps: ['slider'],
			exports: 'jQuery.fn.visibleNearby'
		},
		sliderthumbnails: {
			deps: ['slidervisibleNearby'],
			exports: 'jQuery.fn.thumbnails'
		},
		sliderCaption: {
			deps: ['sliderthumbnails'],
			exports: 'jQuery.fn.global-caption'
		},
		mboi: {
			deps: ['slider', 'ui']
		},
		mobiscroll: {
			deps: ['jquery'],
			exports: 'jQuery.fn.mobiscroll'
		},
		mobiscrollScroller: {
			deps: ['jquery','mobiscroll']
		},
		mobiscrollDate: {
			deps: ['jquery','mobiscrollScroller']
		},
		mobiscrollDuration: {
			deps: ['jquery','mobiscrollDate']
		},
		forms: {
			deps: ['jquery']
		},
		highcharts : {
			deps: ['jquery'],
			exports: 'highcharts'
		},
	},
	paths: {
		jquery: 'libs/jquery.min',
		backbone: 'libs/backbone-min',
		underscore: 'libs/underscore-min',
		modernizr: 'libs/modernizr-dev',
		slider: 'libs/plugins/jquery.royalslider',
		fastclick: 'libs/plugins/FastClick',
		mobiscroll: 'libs/plugins/date/mobiscroll.core',
		mobiscrollScroller: 'libs/plugins/date/mobiscroll.scroller',
		mobiscrollDate: 'libs/plugins/date/mobiscroll.datetime',
		mobiscrollDuration: 'libs/plugins/date/mobiscroll.duration',
		forms: 'libs/plugins/hutber.forms',
		highcharts: 'libs/plugins/highcharts',
		hammerjs: 'libs/plugins/hammer.min',
		date: 'libs/plugins/date',
		ui : 'functions/sd.functions.ui',
		sd : 'functions/sd.functions.globals',
		iap : 'functions/sd.functions.iap',
		sf : 'functions/sd.functions.sex',
		sl : 'functions/sd.functions.login',
		ss : 'functions/sd.functions.selection',
		ge : 'functions/sd.functions.globalEvents',
		onoff : 'functions/sd.functions.onoff',
		mboi : 'functions/sd.functions.mobi',
		sloc : 'functions/sd.functions.location',
		dv : 'views/defaultView',
		dsv : 'views/defaultSexView',
		JST : 'templates'
	}
});

/*==================================================
Routers
==================================================*/
// Requires ----------------
require([
		'backbone',
		'modernizr',
		'sd',
// Routes ----------------
		'routes/router',
// Views ----------------
		'views/indexView',
		'views/homeView',
		'views/loginView',
		'views/forgottenView',
		'views/signUpView',
		'views/sex/wank',
		'views/sex/hands',
		'views/sex/oral',
		'views/sex/sex',
		'views/sex/anything',
// Sex Details Pages --------------------,
		'views/whos/who',
		'views/whos/whoAdd',
		'views/place/place',
// Stats --------------------,
		'views/stats/overview',
		'views/stats/graphs',
// User Pages --------------------,
		'views/users/userhistory',
		'views/whos/managewhos',
		'views/users/settings',
		'views/users/calendar',
// Other Pages --------------------,
		'views/other/shop',
		'views/other/privacy',
		'views/users/setpin',
		'views/users/confirmpin',
		'views/users/pinsave',
		'views/users/pin',
		'views/other/terms',
		'views/diary/diary',

// Positions -----------------------
		'views/positions/positions',

// Extra -----------------------
		'views/extra/extra',

// Functions -----------------------
		'iap',
		'sf',
		'ss',
		'sl',
		'sloc',
		'dv',
		'dsv',
		'ui',
		'ge',

], function () {
/*==================================================
set arguments to values for ease of reading arguments
================================================== */
    var Backbone = arguments[0],
        Router = arguments[3],
		SD = arguments[36],
		IndexView = arguments[4],
        HomeView = arguments[5],
		myself = arguments;

	/*==================================================
	Start up SD global object.
	================================================== */
	SD.init();

	var runEverthing = function(){
		/*==================================================
		Routes Vars
		================================================== */
		// initiate routers ----------------
		SD.ROUTER = new Router();

		// views ---------------------------
		SD.VIEWS.indexView = new IndexView();
		SD.VIEWS.homeView = new HomeView();

		/*==================================================
		Routes
		================================================== */
		var names = [];
		names[6] = 'login';
		names[7] = 'forgotten';
		names[8] = 'signup';
		names[9] = 'wank';
		names[10] = 'hands';
		names[11] = 'oral';
		names[12] = 'sex';
		names[13] = 'anything';
		names[14] = 'who';
		names[15] = 'whoadd';
		names[16] = 'place';
		names[17] = 'overview';
		names[18] = 'graphs';
		names[19] = 'userhistory';
		names[20] = 'managewhos';
		names[21] = 'settings';
		names[22] = 'calendar';
		names[23] = 'shop';
		names[24] = 'privacy';
		names[25] = 'setpin';
		names[26] = 'confirmpin';
		names[27] = 'pinsave';
		names[28] = 'pin';
		names[29] = 'terms';
		names[30] = 'diary';
		names[31] = 'positions';
		names[32] = 'extra';
		var myArgs = myself;

		names.forEach(function(me, key){
			var functionName = me+"View";
			SD.VIEWS[functionName] = new myArgs[key]();
			SD.ROUTER.on('route:'+me, function(){
				SD.VIEWS[functionName].render(); // succeeds
			});
		});

	//# Default router ----------------------------------------------------------------
		SD.ROUTER.on('route:index route:home', function(){
			if(localStorage.getItem('privateKey')!==null){
				SD.VIEWS.homeView.render();
			}else{
				SD.VIEWS.indexView.render();
			}
		});


		SD.DEVICE = function(){
			if(typeof window.device !== "undefined"){
				return window.device.platform;
			}else{
				return 'Android';
			}
		}();

        if(SD.DEVICE)
        //Add which device we are on into the html
            $('html').addClass(SD.DEVICE);
	};

/*==================================================
On Device Ready
================================================== */
	if(SD.isMobile){
		document.addEventListener("deviceready", function(){
			navigator.splashscreen.hide()
			runEverthing();
			Backbone.history.start();
			SD.checkConnection();

			//hook into physical buttons on phone
			document.addEventListener("menubutton", SD.DV.openMenu, false);
		}, true);
	}else{
		$(document).ready(function() {
			runEverthing();
			Backbone.history.start();
		});
	}
});