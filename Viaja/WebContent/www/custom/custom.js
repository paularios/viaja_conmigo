//All ready!. Page &  Cordova loaded.
//Todo listo!. Página & Cordova cargados.
document.write('<script src="gmaps/map.js"></script>');

function deviceReady() {
	try {
		//Example when Internet connection is needed but not mandatory
		//Ejemplo de cuando se necesita conexióna a Internet pero no es obligatoria.
		if (!mui.connectionAvailable()){
			if ('plugins' in window && 'toast' in window.plugins)
				mui.toast('We recommend you connect your device to the Internet');
			else
				mui.alert('We recommend you connect your device to the Internet');
		}
		//mui.viewport.showPage('home-page', 'DEF');
		//Install events, clicks, resize, online/offline, etc. 
		installEvents();
		//Hide splash.
		//Ocultar el splash.
		if (navigator.splashscreen) {
			navigator.splashscreen.hide();
		}

	} catch (e) {
		//your decision
		//tu decisión
	}
}

/**
 * Install events, clicks, resize, online/offline, etc., on differents HTML elements.
 * Instala eventos, clicks, resize, online/offline, etc., sobre diferentes elementos HTML.
 */
function installEvents() {
	
	mui.util.installEvents([
		//Mail list click/touch events. See that if the event is not specified, click is assumed.
		{
			id: '.mui-backarrow',	//Important!
			fn: () => {
				mui.history.back();
				return false;
			}
		},
		{
			id: '#vc-log-in-btn',	//Important!
			ev: 'click',
			fn: () => {
				mui.viewport.showPage('log-in-page', 'DEF');
				return false;
			}
		},
		{
			id: '#vc-sign-up-btn',	//Important!
			ev: 'click',
			fn: () => {
				mui.viewport.showPage('sign-up-page', 'DEF');
				return false;
			}
		},
		{
			id: '#user-edit-profile',	//Important!
			ev: 'click',
			fn: () => {
				mui.history.back();
				mui.viewport.showPage('profile-page', 'DEF');
				return false;
			}
		},
		{
			id: '#sign-up-send-mail-btn',
			ev: 'click',	
			fn: () => {	
				var email = $('#sign-up-mail').val();
				if(email.split('@')[1] != 'correo.um.edu.uy' && email.split('@')[1] != 'um.edu.uy' ) {
					$('#sign-up-alert').html('La dirección no pertenece al dominio UM.');
					document.getElementById('sign-up-alert').style.visibility = 'visible';
				} else {
					document.getElementById('sign-up-alert').style.visibility = 'hidden';
					$.ajax({ 
			    		type: 'GET', 
			    		url: 'https://viaja-conmigo-servidor.herokuapp.com/users/validMail?email='+email,
			    		success: function (result) {
			    			if(result === 'si'){
			    				$('#sign-up-alert').html('La dirección no está disponible.');
			    				document.getElementById('sign-up-alert').style.visibility = 'visible';
			    				$('#sign-up-mail').addClass('input-invalid');
			    				mui.vibrate();
			    			} 
			    			else if (result === 'no') {
			    				$('#sign-up-mail').removeClass('input-invalid');
			    				$('#sign-up-mail').addClass('input-valid');
			    				document.getElementById('sign-up-alert').style.visibility = 'hidden';
			    				mui.busy(true);
			    				$.ajax({ 
			    		    		type: 'GET', 
			    		    		url: 'https://viaja-conmigo-servidor.herokuapp.com/users/createUser?email='+email,
			    		    		success: function () {
			    		    			document.getElementById('sign-up-send-mail-btn').style.display = 'none';
			    		    			$('#passwordDiv').animate({
			    		    	            height: 'toggle',
			    		    	        });	
			    		    			mui.busy(false);
			    		    		}
			    		    	});
			    			}
			    		}
			    	});
				}
			}
		},
		{
			id: '#sign-up-btn',
			ev: 'click',	
			fn: () => {
				var email = $('#sign-up-mail').val();
				var password = $('#sign-up-password').val();
				$.ajax({ 
		    		type: 'GET', 
		    		url: 'https://viaja-conmigo-servidor.herokuapp.com/users/logIn?email='+email+'&password='+password,
		    		success: function (result) {
		    			if(result === 'unAuthorized'){
		    				$('#sign-up-alert').html('El usuario y la contraseña no coinciden.');
		    				document.getElementById('sign-up-alert').style.visibility = 'visible';
		    				$('#password').value = null;
		    				mui.vibrate();
		    			}
		    			else {
		    				pushNotificationRegister();
		    				document.getElementById('sign-up-alert').style.visibility = 'hidden';
		    				mui.viewport.showPage('profile-page', 'DEF');
		    			}
		    		}
		    	});
				return false;
			}
		},
		{
			id: '#log-in-btn',
			ev: 'click',	
			fn: () => {
				var email = $('#log-in-mail').val();
				var password = $('#log-in-password').val();
				mui.busy(true);
				$.ajax({ 
		    		type: 'GET', 
		    		url: 'https://viaja-conmigo-servidor.herokuapp.com/users/logIn?email='+email+'&password='+password,
		    		success: function (result) {
		    			mui.busy(false);
		    			if(result === 'unAuthorized'){
		    				$('#log-in-alert').html('El usuario y la contraseña no coinciden.');
		    				document.getElementById('log-in-alert').style.visibility = 'visible';
		    				$('#password').value = null;
		    				mui.vibrate();
		    			}
		    			else {
		    				pushNotificationRegister();
		    				document.getElementById('log-in-alert').style.visibility = 'hidden';
		    				mui.viewport.showPage('home-page', 'DEF');
		    			}
		    		}
		    	});
				return false;
			}
		},
		{
			id: '#profile-btn',
			ev: 'click',	
			fn: () => {	
				var email = $('#sign-up-mail').val();
				var name = $('#profile-name').val();
				var lastname = $('#profile-lastname').val();
				var password = $('#profile-password').val();
				var confPassword = $('#profile-confirm-password').val();
				if(name == null || lastname == null || password == null || confPassword == null) {
					$('#profile-alert').html('Todos los campos son obligatorios.');
    				document.getElementById('profile-alert').style.visibility = 'visible';
    				mui.vibrate();
				}
				else if(password.length < 8 || confPassword.length < 8){
					$('#profile-alert').html('Contraseña menor a 8 caracteres.');
    				document.getElementById('profile-alert').style.visibility = 'visible';
    				mui.vibrate();
				}
				else if(password.length > 32 || confPassword.length > 32){
					$('#profile-alert').html('Contraseña mayor a 32 caracteres.');
    				document.getElementById('profile-alert').style.visibility = 'visible';
    				mui.vibrate();
				}
				else if(password != confPassword){
					$('#profile-alert').html('Las contraseñas no coinciden.');
    				document.getElementById('profile-alert').style.visibility = 'visible';
    				mui.vibrate();
				}
				else {
					document.getElementById('profile-alert').style.visibility = 'hidden';
					mui.busy(true);
					$.ajax({ 
			    		type: 'GET', 
			    		url: 'https://viaja-conmigo-servidor.herokuapp.com/users/editUser?password='+password+'&name='+name+'&lastname='+lastname,
			    		success: function (result) {
			    			mui.busy(false);
			    			if(result === 'unAuthorized'){
			    				$('#profile-alert').html('Error. Cambios no guardados');
			    				document.getElementById('profile-alert').style.visibility = 'visible';
			    				$('#password').value = null;
			    				mui.vibrate();
			    			}
			    			else if (result === 'updated') {
			    				
			    				document.getElementById('profile-alert').style.visibility = 'hidden';
			    				mui.viewport.showPage('home-page', 'DEF');
			    			}
			    		}
			    	});
				}
				
				return false;
			}
		},
		{
			id: '#profile-pic-overlay',	//Important!
			ev: 'click',
			fn: () => {
				navigator.camera.getPicture(function(result){
					console.log(result);
					},function(error){
					console.log(error);
					},{
					sourceType : Camera.PictureSourceType.CAMERA
				});
				return false;
			}
		},
		{
			//**********************************************
			//**********************************************
			//************************************************* CORREGIR ANIMACION
			id: '#home-page-btn',	//Important!
			ev: 'click',
			fn: () => {
				if ($('#destination').val() == null) {
					mui.alert('tab 1','Selected');
				} else {
					sendPushNotification();
					mui.screen.showPanel('ride-panel', 'FLOAT_DOWN');
				}
				
				return false;
			}
		},
		{
			id: '#home-page-profile-btn',	//Important!
			ev: 'click',
			fn: () => {
				mui.screen.showPanel('profile-panel', 'FLOAT_RIGHT');
				return false;
			}
		},
		{
			id: '#home-page-history-btn',	//Important!
			ev: 'click',
			fn: () => {
				mui.screen.showPanel('history-panel', 'FLOAT_RIGHT');
				return false;
			}
		},
		{
			id: '#home-page-notifications-btn',	//Important!
			ev: 'click',
			fn: () => {
				mui.screen.showPanel('notifications-panel', 'FLOAT_RIGHT');
				return false;
			}
		},
/*		{
			id: '.mui-headmenu',
			ev: 'click',	//If not, it assumes click
			fn: () => {
				//ATTENTION!!! mui.screen instead of mui.viewport
				mui.screen.showPanel('menu-panel', 'SLIDE_LEFT');
				return false;
			}
		},*/
		//MobileUI viewport specific event.
		{
			vp: mui.viewport,
			ev: 'swiperight',
			fn: () => {
				if (!mui.viewport.panelIsOpen()) {
					mui.history.back();
				}
			}
		},
		{
			vp: mui.viewport,
			ev: 'swipedowndiscover',
			fn: () => {
				if (!mui.viewport.panelIsOpen()) {
					mui.screen.showPanel('ride-panel', 'SLIDE_DOWN');	//ATENTION!!! mui.screen instead mui.viewport
					return false;
				}
			}
		},
		//It's a good idea to consider what happens when the device is switched on and off the internet.
		//Es buena idea considerar que pasa cuando el dispositivo se conecta y desconecta a Internet.
		{
			id: document,
			ev: 'online',
			fn: () => {
				//Do something
			}
		},
		{
			id: document,
			ev: 'offline',
			fn: () => {
				//Do something
			}
		},
		//Typically fired when the device changes orientation.
		//Típicamente disparado cuando el dispositivo cambia de orientación.
		{
			id: window,
			ev: 'resize',
			fn: () => {
				//Do something if you need
			}
		},
		{ // ACA NO HAY CONTROLES TODAVIA
			id: '#create-ride-btn',
			ev: 'click',	
			fn: () => {	
				var exitTime = $('#exit-time').val();
				var numberOfPassengers = $('#number-of-passengers').val();
				var carRegistration = $('#car-registration').val();
				var carBrand = $('#car-brand').val();
				var driverOrigin = $('#origin').val();
				var driverDestination = $('#destination').val();
				/*setTimeOut(function(){
					coordsOverAroute = obtainMultipleCoordsOverAroute(driver_origin, driver_destination);
				}, 7000);*/
				console.log(exitTime);
				console.log(numberOfPassengers);
				console.log(carRegistration);
				console.log(carBrand);
				console.log(driverOrigin);
				console.log(driverDestination);
				//console.log(coordsOverAroute);
				mui.busy(true);
				$.ajax({ 
		    		url: 'https://viaja-conmigo-servidor.herokuapp.com/users/createRide',
		    		type: 'GET',
		    		crossDomain: true,
		    		data: {
		    			driverOrigin: 'origen',
		    			driverDestination: 'destino',
		    			carRegistration: carRegistration.toString(),
		    			carBrand: carBrand,
		    			numberOfPassengers: numberOfPassengers,
		    			exitTime: 'hora'
		    			/*+'&coordsOverAroute='+coordsOverAroute,*/
		    		},
		    		success: function (result) {
		    			mui.busy(false);
		    			if(result === 'unAuthorized'){
		    				mui.alert("Error. No se pudo crear el viaje.");
		    				mui.vibrate();
		    			}
		    			else if (result === 'updated') {
		    				mui.alert("Viaje creado correctamente.");
		    				mui.viewPort.closePanel();    			
		    			}
		    		}
				});
				return false;
			}
		}
	]);

}

function installEvents2() {

	//It's a good idea to consider what happens when the device is switched on and off the internet.
	//Es buena idea considerar que pasa cuando el dispositivo se conecta y desconecta a Internet.
	document.addEventListener('online', function() {
		//somthing
	}, false);
	
	//Back button.
	$('.mui-backarrow').click(function() {
		mui.history.back();
		return false;
	});
	
	//Open menu.
/*	$('.mui-headmenu').click(function() {
		mui.screen.showPanel('menu-panel', 'SLIDE_LEFT');	//ATTENTION!!! mui.screen instead of mui.viewport
		return false;
	});*/

	$('#tabbar-button1').click(function() {
		mui.alert('tab 1','Selected');
		return false;
	});
	
	$('#tabbar-button2').click(function() {
		mui.alert('tab 1','Selected');
		return false;
	});
	
	$('#tabbar-button3').click(function() {
		mui.alert('tab 3','Selected');
		return false;
	});
	
	$('#tabbar-button4').click(function() {
		mui.alert('tab 4','Selected');
		return false;
	});
	
	$('#tabbar-button5').click(function() {
		mui.alert('tab 5','Selected');
		return false;
	});
	
	$('#menuoptions').click(function() {
		return false;
	});
	
	/*******************************************************************************/
	/*Swipe Test --------------------------------------------------------------------*/
	/*******************************************************************************/	
	//Swipe touch events. Cool for best App user experience!
	//Evento de desplazamiento tactil. Buenisimo para una óptima experiencia de usuario en App!
	/*mui.viewport.on('swiperight', function(currentPageId, originalTarget, event, startX, startY, endX, endY) {
		if (!mui.viewport.panelIsOpen()) {
			mui.history.back();
		}
	});*/
}
