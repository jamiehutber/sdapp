define([
	'dv',
	'date',
	'highcharts',
], function () {
	'use strict';

	function createData (object, type) {
		var tempType = [];
			tempType.name = type,
			tempType.data = [];
		Object.keys(object[type]).forEach(function(me){
			if(Object.keys(SD.BYMONTH['Wank']).length===1){
				tempType.data.push(0);
			}
			tempType.data.push(object[type][me].numberof);
		});
		return tempType;
	}

	//set up homeview
	var profile = SD.defaultView.extend({
		el: 'page',
		events: {
		},
		template: JST['templates/stats/graphs.ejs'],
		render: function () {

			//# Output and render the JST view ------------------------------------------------------
			this.$el.html(this.template(areaData));
			SD.setTitle('Sex Graph');

			/************************************************
				=================Graph====================
			************************************************/
			//Resize the graph
			var wantedWidth = $('body').outerWidth()/1.05,
				graph = $('#sexoverview');

			graph.css({
				'height': $('page').outerHeight()/1.1,
				'width' : wantedWidth
			});

			// #Graphs Global Vars --------------------------------------------------
			var areaData = [];

			// #set up vars --------------------------------------------------
			var details = ['Wank','Hands','Oral','Sex','Anything'];

			// #build new arrays for graph --------------------------------------------------
			details.forEach(function(me){
				var stats = createData(SD.BYMONTH, me);
//				c(stats);
				if(stats.name === "Wank")stats.name = "Selfie";
				//stats.data[0]
				if(stats.data.length>0)
				areaData.push(stats);
			});
			// #Build month names NB: This is only used labels --------------------------------------------------
			var lineLabelsDate = [];
			for(var i=0; i <= Object.keys(SD.BYMONTH['Wank']).length-1; i++){ //Count number of months used in Wank then loop through and get month string from the last x months
				lineLabelsDate.push(Date.today().addMonths(-i).toString("MMM"));
			}
			if(Object.keys(SD.BYMONTH['Wank']).length===1){
				lineLabelsDate.push(Date.today().addMonths(-1).toString("MMM"));
			}
			lineLabelsDate.reverse();

			var colors = [
				'rgba(222, 239, 255, 0.6)',
				'rgba(223, 222, 255, 0.60)',
				'#f1c40f',
				'rgba(220, 134, 177, 0.6)',
				'rgba(0, 0, 0, 0.60)',
			];

			if(SD.SEXNUMBERS.total > 0){
				$('.nostats').hide();

				graph.highcharts({
					chart: {
						backgroundColor: 'transparent',
						borderColor: '#272C33',
						type: 'spline',
						spacingLeft: 0,
						spacingTop: 20,
						marginLeft: 30,
						spacingRight: 0,
						spacingBottom: 30,
						plotBorderWidth: 0,
					},
					title:{
						text:''
					},
					credits: {
						enabled: false
					},
					colors: colors,
					plotOptions: {
						spline:{
							lineWidth: 4,
							states: {
								hover: {
									lineWidth: 5
								}
							},
							marker: {
								enabled: false
							},
							connectNulls: true,
						}
					},
					legend: {
						layout: 'vertical',
						align: 'right',
						verticalAlign: 'top',
						x: 0,
						y: 0,
						floating: true,
						backgroundColor: 'transparent',
						borderColor: 'transparent',
						itemStyle: {
							color: '#FFF',
							fontFamily: 'sdFont',
							padding: '14px',
						}
					},
					tooltip: {
						backgroundColor: 'rgba(255, 255, 255, 0.65)',
						borderColor: '#75B4B1',
						borderRadius: '2',
						shadow: false,
						style: {
							color: '#75B4B1',
							fontSize: '14px',
							padding: '8px',
							fontFamily: 'sdFont',
						},
					},
					xAxis: {
						lineColor: '#FFFFFF',
						lineWidth: 1,
						dateTimeLabelFormats: true,
						title: {
							text:'',
						},
	//					ordinal: false,
						gridLineColor: 'rgba(196, 228, 228, 0.75)',
						categories: lineLabelsDate,
						labels:  {
							overflow: 'justify',
							style: {
								color: '#fff',
								fontFamily: 'sdFont'
							}
						}
					},
					yAxis: {
						lineColor: '#FFFFFF',
						lineWidth: 1,
						gridLineColor: 'rgba(196, 228, 228, 0.75)',
						min: 0,
						title: {
							text:'',
						},
						labels: {
							style: {
								color: '#fff',
								fontFamily: 'sdFont'
							},
							formatter: function() {
								return this.value;
							}
						},
						plotBands: [
							{
								from: 0,
								to: 5,
								color: 'rgba(68, 170, 213, 0.1)',
								label: {
									text: 'Beginner',
									style: {
										color: '#FFF'
									}
								}
							},
								{
								from: 5,
								to: 15,
								label: {
									text: 'Average Joe',
									style: {
										color: '#FFF'
									}
								}
							},
								{
								from: 20,
								to: 30,
								color: 'rgba(68, 170, 213, 0.1)',
								label: {
									text: 'Player?',
									style: {
										color: '#FFF'
									}
								}
							},
							{
								from: 30,
								to: 40,
								label: {
									text: 'Fucking Rock Star!',
									style: {
										color: '#FFF'
									}
								}
							},
							{
								from: 40,
								to: 60,
								color: 'rgba(68, 170, 213, 0.1)',
								label: {
									text: 'Ok fuck off now',
									style: {
										color: '#FFF'
									}
								}
							},
							{
								from: 60,
								to: 600,
								label: {
									text: 'Porn Star',
									style: {
										color: '#FFF'
									}
								}
							}
						]
					},
					series: areaData
				});
			}else{
				$('.stats').hide();
			}
		}
	});
	return profile;
});