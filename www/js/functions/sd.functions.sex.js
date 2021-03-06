/*
 ==================================================
 Table of Contents - Created by Hutber on 17/05/14.
 ==================================================
 */
define([
], function () {

	SD.sex = {};

	SD.sex.sexDefaults = function() {
		return {
			sextype: 'default',
			sexnumber: 0,
			sextime:[false,false],
			place: null,
			who: null,
			rating: 0,
			location: [false, 'Click to get your location'],
			diary: "",
			duration: [false,false],
			positions: null,
			extra: {}
		}
	};
	SD.sex.buildMissing = function(data, sid){
		//set up defaults
		return {
			location:function(){
				if(SD.SEXDEFAULTS.location[0] !== false){
					return SD.location.buildObject(SD.SEXDEFAULTS.location[0]);
				}else{
					return null;
				}
			}(),
			datetring:Date.parse(data.sextime).toString('ddd dS HH:mm'),
			id:sid,
			rating:""+data.rating,
			sexnumber:""+data.sexnumber,
			sexstring:(typeof data.sexstring !== "undefined") ? data.sexstring: SD.format.toString(parseInt(data.sexnumber)),
			sextime:data.sextime,
			uid:localStorage.uid,
			diary:data.diary,
			extra:data.extra,
			place:(typeof data.place !== "undefined") ? data.place : null,
			duration:(typeof data.duration !== "undefined") ? data.duration : null,
			who:(typeof data.who !== "undefined") ? data.who : null,
			positions:(typeof data.positions !== "undefined") ? data.positions : null,
		};
	};
	SD.sex.convertPhp = function(){
		var php = {};
		php.sexnumber = SD.SEXDEFAULTS.sexnumber;

		if(typeof SD.SEXDEFAULTS.sextime[0] === "object"){
			php.sextime = Date.parse(SD.SEXDEFAULTS.sextime[0].getDate()).toString('s');
		}else{
			php.sextime = Date.parse(SD.SEXDEFAULTS.sextime[0]).toString('s');
		}
		php.rating = SD.SEXDEFAULTS.rating;
		php.diary = SD.SEXDEFAULTS.diary;
		php.extra = SD.SEXDEFAULTS.extra;

		php.duration = (SD.SEXDEFAULTS.duration[1][0]*60)+SD.SEXDEFAULTS.duration[1][1];

		if(SD.SEXDEFAULTS.location[0]!==false){
			php.location = SD.SEXDEFAULTS.location[0];
		}
		if(SD.SEXDEFAULTS.who !== null){
			php.who = SD.SEXDEFAULTS.who;
		}
		if(SD.SEXDEFAULTS.positions !== null){
			php.positions = SD.SEXDEFAULTS.positions;
		}
		if(SD.SEXDEFAULTS.place !== null){
			php.place = SD.SEXDEFAULTS.place;
		}
		return php;
	};
	SD.sex.save = function(){
		if(localStorage.privateKey){
			SD.spinner.showme('Saving Your Sex...');
			var saveSexDetails = SD.sex.convertPhp(),
				dataToSend = function(){
					if(SD.SEXDEFAULTS.edit){
						return {
							info: saveSexDetails,
							id: SD.SEXDEFAULTS.id,
							privateKey: localStorage.privateKey
						};
					}else{
						return {
							info: saveSexDetails,
							privateKey: localStorage.privateKey
						};
					}
				}();
			$.ajax({
				url: SD.AJAX+'add',
				type: 'POST',
				dataType: "json",
				data: dataToSend,
				error: function(data){
					SD.spinner.hideme();
					SD.message.showMessage('Adding Failed, server side problem: '+ data.status, 'bad');
				},
				success: function(data){
					if(SD.SEXDEFAULTS.edit){SD.sex.removeSexStat(SD.SEXDEFAULTS.id);}
					if(isNumber(data)){
						/*==================================================
						Update FULLSEX and create some var's
						================================================== */
						// Build a new array to add to SD.FULLSEX
						var newSexDetail  = SD.sex.buildMissing(saveSexDetails, data);
						var sexTime = Date.parse(saveSexDetails.sextime);
						//Grab current moth as string
						var currentMonthString = sexTime.toString("MMMyy");
						//unshift currently converted sex details to array
						if(typeof SD.FULLSEX[currentMonthString] !== "undefined") {
							SD.FULLSEX[currentMonthString].unshift(newSexDetail);
							SD.saveVar('FULLSEX');
						} else {
							var tmpArray = {};
							tmpArray[currentMonthString] = [newSexDetail];
							Object.keys(SD.FULLSEX).forEach(function(item){
								tmpArray[item] = SD.FULLSEX[item];
							});
							SD.FULLSEX = tmpArray;
							localStorage.FULLSEX = JSON.stringify(tmpArray);
						}

						/*==================================================
						Update Sex Data Graph
						================================================== */
						var sexTypeString = newSexDetail.sexstring;
						//Make sure we have added a sex before
						if(typeof SD.BYMONTH[sexTypeString][currentMonthString] !== "undefined") {
							//plus 1 to the number off in a given month
							SD.BYMONTH[sexTypeString][currentMonthString].numberof++;
							SD.saveVar('BYMONTH');
						} else {
							//TODO shoudlnt' get the date from today, as user could have set it in the past
							SD.BYMONTH[sexTypeString][currentMonthString] = {"numberof":1,"date": sexTime.toString("Myy")};
							localStorage.setItem('BYMONTH',JSON.stringify(SD.BYMONTH));
						}

						/*==================================================
						Update Whos - Find the who then add the who
						================================================== */
						if(saveSexDetails.who){
							Object.keys(saveSexDetails.who).forEach(function(myself){
								SD.WHO.forEach(function(me){
									if(me.who===myself){
										me.useage++;
										me.useage = me.useage+"";
									}
								});
							});
							SD.saveVar('WHO');
						}

						/*==================================================
						Update Sex Numbers
						================================================== */
						SD.GLOBALSEXNUMBERS[Object.keys(SD.GLOBALSEXNUMBERS)[saveSexDetails.sexnumber-1]]++;
						SD.GLOBALSEXNUMBERS.total++;
						SD.saveVar('GLOBALSEXNUMBERS');
						SD.SEXNUMBERS[Object.keys(SD.SEXNUMBERS)[saveSexDetails.sexnumber-1]]++;
						SD.SEXNUMBERS.total++;
						SD.saveVar('SEXNUMBERS');
						SD.TOTALSEXNUMBERS[Object.keys(SD.TOTALSEXNUMBERS)[saveSexDetails.sexnumber-1]]++;
						SD.TOTALSEXNUMBERS.total++;
						SD.saveVar('TOTALSEXNUMBERS');
						//Reset sex defaults after
						SD.SEXDEFAULTS = SD.sex.sexDefaults();

						/*==================================================
						Now clean up save sex page and move to where we need to be.
						================================================== */
						SD.pageLoad('overview');
						SD.spinner.hideme();
						SD.message.showMessage('Sex Saved', 'good', 2500);
					}else{
						if(data==="We could not get your User Id, sorry"){
							SD.UI.Dialog('Private Session Key has expired.', 'this is often from logging on a different device. We will log you out for security');
							SD.login.doLogOut();
						}
						SD.message.showMessage('Something went wrong whilst adding the entry. Ek ermm... check if its there maybe?', 'bad', 6000);
					}
				}
			});
		}else{
			SD.message.showMessage('You appear to not be logged in?', 'bad');
		}
	};
	SD.sex.removeSexStat = function(sexId){
		var toDeleteIndex = -1,
			toDeleteMonth = '',
			toDeleteSexString = '';

		//Loopthough all sexes in fullsex
		Object.keys(SD.FULLSEX).forEach(function(me){
			var i = 0;
			SD.FULLSEX[me].forEach(function(myself){
				var sid = parseInt(myself.id);
				if(parseInt(sexId) === sid){
					toDeleteMonth = me;
					toDeleteSexString = myself.sexstring;
					toDeleteIndex = i;
				}
				i++;
			});
		});
		SD.FULLSEX[toDeleteMonth].splice(toDeleteIndex, 1);
		//Replace localstorage for saving for user
		SD.saveVar('FULLSEX');

		//Remove sex stats from SD.BYMONTH
		SD.BYMONTH[toDeleteSexString][toDeleteMonth].numberof = SD.BYMONTH[toDeleteSexString][toDeleteMonth].numberof-1;
		//Replace localstorage for saving for user
		SD.saveVar('BYMONTH');

		/*==================================================
		Update Sex Numbers
		================================================== */
		SD.GLOBALSEXNUMBERS[toDeleteSexString]--;
		SD.GLOBALSEXNUMBERS.total--;
		SD.saveVar('GLOBALSEXNUMBERS');
		SD.SEXNUMBERS[toDeleteSexString]--;
		SD.SEXNUMBERS.total--;
		SD.saveVar('SEXNUMBERS');
		SD.TOTALSEXNUMBERS[toDeleteSexString]--;
		SD.TOTALSEXNUMBERS.total--;
		SD.saveVar('TOTALSEXNUMBERS');
	};
	SD.sex.removeSexFromHistoryPage = function(sexId, text, deleteArea){
		SD.UI.Dialog('Remove an entry?', 'Do you really want to delete ' + text +'?', ['Cancel', 'Remove it baby!'], function(){
			SD.spinner.showme('Removing Sex Entry');
			$.ajax({
				url: SD.AJAX+'sex/deletesex',
				type: 'POST',
				data: {
					'id': sexId,
					'privateKey': localStorage.privateKey,
				},
				error: function(data){
					SD.spinner.hideme();
					SD.message.showMessage('A server error occured, please try again >:|', 'bad', 1500);
				},
				success: function(data){
					SD.spinner.hideme();
					if(data === ""){

						//delete stat from SD.FULLSEX
						SD.sex.removeSexStat(sexId);

						//update dropdown list
						var selectNewValue = $('#month option:selected'),
							selectedVal = selectNewValue.val(),
							selectedNextVal = selectNewValue.next().val(),
							statsLength = SD.FULLSEX[selectedVal].length;
						if(selectNewValue && statsLength > 0){
							selectNewValue.html(selectNewValue.html().replace(/\(.*?\)/, "("+ statsLength +")"));
						}else{
							selectNewValue.remove();
							delete SD.FULLSEX[selectedVal];
							SD.saveVar('FULLSEX');
							$('.historyContent').html(SD.VIEWS.userhistoryView.template(SD.FULLSEX[selectedNextVal]));
						}

						deleteArea.fadeOut('500');
					}else{
						SD.message.showMessage('A server error occured, please try again :(', 'bad', 1500);
					}
				}
			});
		}, 'confirm');
	};
	SD.sex.edit = {
		checkParseOrObject: function(data){
			if(data !== null && typeof data !== "object"){
				return JSON.parse(data);
			} else if (typeof data === "object"){
				return data;
			} else {
				return null;
			}
		},
		convert: function(data){
			//Create tmp object
			var dataConverted = {};

			//load from defaults
			dataConverted = SD.sex.sexDefaults();

			//Build date to work with
			var tmpDate = Date.parse(data.sextime);
			dataConverted.sextime[1] = [tmpDate.toString('dd'),tmpDate.toString('MM'),tmpDate.toString('yyyy'),tmpDate.toString('HH'),tmpDate.toString('mm'),0], //DD,MM,YY,HH,MM,SS

			// #Rating #Diary -----------------------------------------------------
			//flat converts
			dataConverted.rating = data.rating,
			dataConverted.extra = data.extra,
			dataConverted.diary = (data.diary === null) ? '' : data.diary;

			// #Location -----------------------------------------------------
			//Work out if we should add location to edit
			if(data.location !== null){
				dataConverted.location[0] = data.location,
				dataConverted.location[1] = data.location.city+', '+data.location.country;
			}

			// #Duration -----------------------------------------------------
			dataConverted.duration = function(){
				var totalDuration = [false,false],
					tmpNumber = null,
					covertedNumber = 0;
				if(data.duration !== 0) {
					covertedNumber = data.duration/60+'';
					tmpNumber = covertedNumber.split(".");
					totalDuration[1] = [parseInt(tmpNumber[0]),parseInt(tmpNumber[1])];
				}
				return totalDuration;
			}();

			// #Place #Who -----------------------------------------------------
			//a little more complicated
			dataConverted.place = this.checkParseOrObject(data.place),
			dataConverted.who = this.checkParseOrObject(data.who),

			// #Positions -----------------------------------------------------
			//we need to convert positions, we need to check against SD.POSITIONS
			dataConverted.positions = function(){
				if(data.positions !== null){
					var tempOb = {},
						tempPos = (typeof data.positions !== "object") ? JSON.parse(data.positions) : data.positions;
					Object.keys(tempPos).forEach(function(item){
						tempOb[item] = SD.POSITIONS[item];
					});
					return tempOb;
				}else{
					return null;
				}
			}(),

			dataConverted.edit = true,
			dataConverted.id = data.id;

			return dataConverted;
		}
	};

	return SD;
});