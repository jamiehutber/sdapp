/**
 * Created by Hutber on 04/02/14.
 */
define([
	'sd',
	'dv',
	'mobiscroll',
	'mobiscrollScroller',
	'mobiscrollDate',
], function (SD) {
	'use strict';

	// The default sex view view ----------------------------------------------------------
	SD.defaultSexView = function(){
		//set up homeview
		var sexView = SD.defaultView.extend({
			el: 'page',

			template: JST['app/www/js/templates/sexTemplate.ejs'],
			ownView: JST['app/www/js/templates/sex.ejs'],
			openASex: function(el){ //Define the click events for the sex details page
				var name = el.currentTarget.localName;
				this[name](el);
			},
			when: function(){
				$('when').scroller('show');
			},
			who: function(){
				SD.pageLoad('who');
			},
			rating: function(el){
				//set up a rating
				var currentIndex, finalIndex;

				if(typeof el !=="undefined")
					var myself = $(el.target).parent();

				//If no rating has been set, quickly grab settings from the global
				if(typeof myself ==="undefined"){
					currentIndex = SD.SEXDEFAULTS.rating,
						finalIndex = --currentIndex,
						currentIndex = finalIndex;
				}else{
					//If a rating has been set then we are in the view of an already set rating
					currentIndex = myself.index();

					//frist remove all classes
					$('face.selected').removeAttr('class');

					myself.addClass('selected');
				}

				$('rating face').each(function(){
					if($(this).index()<= currentIndex){
						$(this).addClass('selected');
					}
				});

				if(typeof myself !=="undefined"){
					finalIndex = ++currentIndex;
					SD.SEXDEFAULTS.rating = finalIndex;
				}
			},
			location: function(){
				if(SD.SEXDEFAULTS.location[1] === "Click to get your location"){
					SD.overlay.showme('Please wait for us to find you');
					navigator.geolocation.getCurrentPosition(function(details){
						SD.locationSucess(details);
					}, function(details){
						SD.locationFail(details);
					});
				}
			},
			where: function(){
				SD.pageLoad('where');
			},
			extra: function(){
				c('extra');
			},
			save: function(el){
				var errorYes = true, me = $(el.currentTarget), disabled = me.hasClass('disabled');

				if(SD.SEXDEFAULTS.sexnumber===0 || SD.SEXDEFAULTS.sexnumber==="" || typeof SD.SEXDEFAULTS.sexnumber=== "undefined"){
					SD.message.showMessage('Somehow a category of sex has not been selected', 'notice');
					errorYes = false;
				}

				if(SD.SEXDEFAULTS.sextime===0 || SD.SEXDEFAULTS.sextime==="" || typeof SD.SEXDEFAULTS.sextime=== "undefined"){
					SD.message.showMessage('This is technically impossble, but a time hasn\'t been set', 'notice');
					errorYes = false;
				}

				if(disabled && SD.SEXDEFAULTS.rating===0 || SD.SEXDEFAULTS.rating==="" || typeof SD.SEXDEFAULTS.rating=== "undefined"){
					SD.message.showMessage('Set a rating maybe? You don\'t have to, would be nice though', 'notice');
					me.removeClass('disabled');
					errorYes = false;
				}

//						if(disabled && SD.SEXDEFAULTS.location[0]===false){
//							SD.message.showMessage('You know we can record where u fucking fucked, click it', 'notice');
//							me.removeClass('disabled');
//							errorYes = false;
//						}

				if(disabled &&
					SD.SEXDEFAULTS.where.length===0 || SD.SEXDEFAULTS.where==="" || typeof SD.SEXDEFAULTS.where=== "undefined"){
					SD.message.showMessage('Bit boring if you don\'t set where you did it', 'notice');
					me.removeClass('disabled');
					errorYes = false;
				}

				//If we have no errors save the sex
				if(errorYes) {SD.addSex.save();}
			},

			// #DataChecker is used in the sex views/sex/*.js if the same type of data is passed from the sex view it over writes the default. ---------------------------------------
			dataChecker: function(data){
				if(typeof data !=="undefined"){
					//Loop through the sexdefaults and then cross check them against the sex views data, if the sex view has some data that we have update the SD.defaults
					for	(var index in SD.SEXDEFAULTS) {
						if(typeof data[index] !== "undefined"){
							SD.SEXDEFAULTS[index] = data[index];
						}
					}
				}
				//return the updateed sexdefaults build from the SD.SEXDEFAULTS and the data supplied from the view
				return SD.SEXDEFAULTS;
			},

			loadSaveSex: {
				that: this,
				//Load in a save default sex
				pre: function(){
					//TODO add more script if statement
					if (!$('.royalSlider').length){
						$('sexnav .selected').removeClass('selected');
						//if we have the sex nav open on load select the correct class
						$('div[data-type='+window.location.hash.substring(1)+']').addClass('selected');
					}
				},
				//Load in a save default sex after html has been complied
				post: function(){
					//update correct sexnumber in SD.SEXDEFAULTS.sexnumber
					var sexnumber = $('sexnav .selected').index();
					SD.SEXDEFAULTS.sexnumber = ++sexnumber;

					//Display the correct rating
					SD.DSV.rating();


					//Time date picker
					$('when').mobiscroll({
						preset: 'datetime',
						dateFormat: 'DD d M yy',
						timeFormat: 'H:ii',
						maxDate: new Date(),
						ampm: false,
//						height: SD.pageHeight/20,
						dateOrder: 'dMyy',
						onSelect: function(el) {
							$('when date').html(el);
							SD.SEXDEFAULTS.sextime[1] = el,
								SD.SEXDEFAULTS.sextime[2] = SD.SEXDEFAULTS.sextime[0].values;
						},
						onBeforeShow: function(){
							if(SD.SEXDEFAULTS.sextime[0]){
								SD.SEXDEFAULTS.sextime[0].setValue(SD.SEXDEFAULTS.sextime[2]);
							}
						}
					});
					SD.SEXDEFAULTS.sextime[0] = $('when').mobiscroll('getInst'),
					SD.SEXDEFAULTS.sextime[1] = SD.SEXDEFAULTS.sextime[0].val;
					$('when date').html(SD.SEXDEFAULTS.sextime[1]);
				}
			},
			render: function (data) {
				//Check to see if we have a value
				if(typeof data === "undefined"){
					data = SD.SEXDEFAULTS;
				}

				//Build up the sexnumbers, //TODO only for dev envoiment
				SD.convertSexNumbers.init();
				if(!SD.FULLSEX.length) {
					SD.FULLSEX = JSON.parse(localStorage.grabFullSex);
				}

				//----- The global sex render --------------------------------------------------
				//update the website with the current view
				var compiled = this.template();
				this.$el.html(compiled);

				//Check are we a details page or the sex selection page
				if(SD.CURRENTSEX === "na"){
					$('sexdetails').html();
				}else{
					this.loadSaveSex.pre();

					//Update generated html with new updated details
					$('sexdetails').html(SD.DSV.ownView(data));

					this.loadSaveSex.post();
				}
			}
		});

		SD.DSV = new sexView();
		return sexView;
	}();
});