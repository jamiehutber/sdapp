/*
 ==================================================
 Table of Contents - Created by Hutber on 21/05/13.
 ==================================================
 */
define([
], function () {

	/*==================================================
	Login functions
	================================================== */
	SD.login = {
		moveToHome: function(reload){
			if(typeof reload === "undefined") {reload = false;} //if no reload is passed make it false
			sessionStorage.removeItem('appOpenedFirstTime');
			if(reload){
				location.reload();
			}else {
				window.location.href = "#home";
			}
		},
		doLogin: {
			doAjax: function(values){
				$.ajax({
					url: SD.AJAX+'users/login',
					type: 'POST',
					dataType: "json",
					data: {
						'uname': values.uname,
						'pword': values.pword
					},
					error: function(data){
						if(data.status === 200){
							SD.spinner.showme('Still Logging you in...');
							SD.login.doLogin.doAjax(values);
						}else{
							SD.message.showMessage('Sorry Login Failed: '+data.status, 'bad');
						}
						SD.spinner.hideme();
					},
					success: function(data){
						SD.login.doLogin.success(data);
						SD.spinner.hideme();
					}
				});
				return false;
			},
			success: function(data){
				if(data.privateKey){
					Object.keys(data).forEach(function(key){
						var me = data[key];
						if(typeof me === "string"){ //If I'm a string then just add it to locastorage
							localStorage.setItem(key,me);
						}else if (typeof me === "object"){ //If we are an object then stringify if
							localStorage.setItem(key,JSON.stringify(me));
						}
					});
					//we add a session marker to tell the pin view that we are coming from the login and don't display the pin
					sessionStorage.setItem('blockpin',false);
					//Now we load the home page
					SD.login.moveToHome(true);
				}else{
					SD.message.showMessage(data.message, 'bad');
				}
			}
		},
		checkPrivateKey: {
			numberOfTrys: 0,
			doAjax: function(){
				$.ajax({
					url: SD.AJAX+'users/checkKey',
					type: 'POST',
					dataType: "json",
					data: {
						'ierihias': localStorage.uid,
						'adfbse4': localStorage.privateKey
					},
					error: function(data){
						if(SD.login.checkPrivateKey.numberOfTrys===0){
							SD.login.checkPrivateKey.numberOfTrys = 1;
							SD.login.checkPrivateKey.doAjax();
						}else{
							SD.message.showMessage('There was a network error. Please try again.', 'bad');
							SD.spinner.hideme();
						}
					},
					success: SD.login.checkPrivateKey.success
				});
			},
			makeCall: function(){
				SD.spinner.showme('Security Checks', 'Looking up');
				SD.login.checkPrivateKey.doAjax();
			},
			success: function(data){
				if(data.current==="1"){
					localStorage.setItem('GLOBALSEXNUMBERS',JSON.stringify(data.GLOBALSEXNUMBERS));
					SD.login.moveToHome();
					SD.spinner.hideme();
				}else{
					SD.UI.Dialog('Private Session Key has expired.', 'This is often from logging on a different device. We will log you out for security.');
					//alert('You have logged in somewhere else since using this app. For security we\'ll need to log you out, please log back in after.');
					SD.login.doLogOut();
				}
			}
		},
		checkLoginState : function() { //We use this state to enable us to use the function on every page load to check if the user is logged in
			var hash = window.location.hash.substring(1);
			var loggedInState = true;
			if(localStorage.getItem('privateKey')=== null) {loggedInState = false;}

			if(sessionStorage.tmpPin){
				//Top level, if the user hasn't set a pin number
			}else if(loggedInState && !localStorage.pinNumber){
				window.location.href = "#setpin";
			}else if(sessionStorage.appOpenedFirstTime && hash!=="pin" && loggedInState){
				window.location.href = "#pin";
			}else if( loggedInState && (hash==="" || hash==="signup" || hash==="forgotten" || hash==="login")){
				window.location.href = "#home";
			}else if (!loggedInState && hash==="home" ){
				document.location.replace('');
			}
		},
		doLogOut: function(){
			var tmpPin = localStorage.pinNumber;
			localStorage.clear();
			localStorage.setItem('pinNumber', tmpPin);
			document.location.replace('');
			return false;
		}
	};

	return SD;
});