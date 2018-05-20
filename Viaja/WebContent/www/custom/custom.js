//All ready!. Page &  Cordova loaded.
//Todo listo!. Página & Cordova cargados.
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
			id: '#sign-up-send-mail-btn',
			ev: 'click',	
			fn: () => {	
				var email = $("#sign-up-mail").val();
				if(email.split("@")[1] != "correo.um.edu.uy" && email.split("@")[1] != "um.edu.uy" ) {
					$("#sign-up-alert").html("La dirección no pertenece al dominio UM.");
					document.getElementById("sign-up-alert").style.visibility = "visible";
				} else {
					document.getElementById("sign-up-alert").style.visibility = "hidden";
					$.ajax({ 
			    		type: 'GET', 
			    		url: 'https://viaja-conmigo-servidor.herokuapp.com/users/mailExists?email='+email,
			    		success: function (result) {
			    			if(result === 'si'){
			    				$("#sign-up-alert").html("La dirección no está disponible.");
			    				document.getElementById("sign-up-alert").style.visibility = "visible";
			    				$("#sign-up-mail").addClass("input-invalid");
			    			}
			    			else if (result === 'no') {
			    				$("#sign-up-mail").removeClass("input-invalid");
			    				$("#sign-up-mail").addClass("input-valid");
			    				document.getElementById("sign-up-alert").style.visibility = "hidden";
			    				$.ajax({ 
			    		    		type: 'GET', 
			    		    		url: 'https://viaja-conmigo-servidor.herokuapp.com/users/createUser?email='+email,
			    		    		success: function () {
			    		    			document.getElementById("sign-up-send-mail-btn").style.display = "none";
			    		    			$("#passwordDiv").animate({
			    		    	            height: 'toggle',
			    		    	        });		
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
				var email = $("#sign-up-mail").val();
				var password = $("#sign-up-password").val();
				$.ajax({ 
		    		type: 'GET', 
		    		url: 'https://viaja-conmigo-servidor.herokuapp.com/users/userExists?email='+email+'&password='+password,
		    		success: function (result) {
		    			if(result === 'si'){
		    				document.getElementById("sign-up-alert").style.visibility = "hidden";
		    				mui.viewport.showPage("profile-page", "DEF");
		    			}
		    			else if (result === 'no') {
		    				$("#sign-up-alert").html("El usuario y la contraseña no coinciden.");
		    				document.getElementById("sign-up-alert").style.visibility = "visible";
		    				$("#password").value = null;
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
				var email = $("#sign-up-mail").val();
				var name = $("#profile-name").val();
				var lastname = $("#profile-lastname").val();
				var password = $("#profile-password").val();
				var confPassword = $("#profile-confirm-password").val();
				if(name == null || lastname == null || password == null || confPassword == null) {
					$("#profile-alert").html("Todos los campos son obligatorios.");
    				document.getElementById("profile-alert").style.visibility = "visible";
				}
				else if(password.length < 8 || confPassword.length < 8){
					$("#profile-alert").html("Contraseña menor a 8 caracteres.");
    				document.getElementById("profile-alert").style.visibility = "visible";
				}
				else if(password.length > 32 || confPassword.length > 32){
					$("#profile-alert").html("Contraseña mayor a 32 caracteres.");
    				document.getElementById("profile-alert").style.visibility = "visible";
				}
				else if(password != confPassword){
					$("#profile-alert").html("Las contraseñas no coinciden.");
    				document.getElementById("profile-alert").style.visibility = "visible";
				}
				else {
					document.getElementById("profile-alert").style.visibility = "hidden";
					var hash = md5(password);
					$.ajax({ 
			    		type: 'GET', 
			    		url: 'https://viaja-conmigo-servidor.herokuapp.com/users/editUser?email='+email+'&password='+hash+'&name='+name+'&lastname='+lastname,
			    		success: function () {
			    			mui.viewport.showPage("home-page", "DEF");
			    		}
			    	});
				}
				return false;
			}
		},
		{
			id: '.mui-headmenu',
			ev: 'click',	//If not, it assumes click
			fn: () => {
				//ATTENTION!!! mui.screen instead of mui.viewport
				mui.screen.showPanel("menu-panel", "SLIDE_LEFT");
				return false;
			}
		},
		{
			id: '#delete-me',
			ev: 'click',	//If not, it assumes click
			fn: () => {
				mui.viewport.showPage("template-page", "DEF");
				return false;
			}
		},
		{
			id: '#option1',
			fn: () => {
				mui.screen.closePanel(function() {
					mui.viewport.showPage("home-page", "DEF");
				});
				return false;
			}
		},
		{
			id: '#option2',
			fn: () => {
				mui.screen.closePanel(function() {
					mui.viewport.showPage("template-page", "DEF");
				});
				return false;
			}
		},
		//Toolbar options ------------------------------------------
		{
			id: '#tabbar-button1',
			fn: () => {
				mui.alert("tab 1","Selected");
				return false;
			}
		},
		{
			id: '#tabbar-button2',
			fn: () => {
				mui.alert("tab 2","Selected");
				return false;
			}
		},
		{
			id: '#tabbar-button3',
			fn: () => {
				mui.alert("tab 3","Selected");
				return false;
			}
		},
		{
			id: '#tabbar-button4',
			fn: () => {
				mui.alert("tab 4","Selected");
				return false;
			}
		},
		{
			id: '#tabbar-button5',
			fn: () => {
				mui.alert("tab 5","Selected");
				return false;
			}
		},
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
			ev: 'swipeleftdiscover',
			fn: () => {
				if (!mui.viewport.panelIsOpen()) {
					mui.screen.showPanel('menu-panel', 'SLIDE_LEFT');	//ATENTION!!! mui.screen instead mui.viewport
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
	]);
}

function installEvents2() {

	//It's a good idea to consider what happens when the device is switched on and off the internet.
	//Es buena idea considerar que pasa cuando el dispositivo se conecta y desconecta a Internet.
	document.addEventListener("online", function() {
		//somthing
	}, false);
	
	//Back button.
	$(".mui-backarrow").click(function() {
		mui.history.back();
		return false;
	});
	
	//Open menu.
	$(".mui-headmenu").click(function() {
		mui.screen.showPanel("menu-panel", "SLIDE_LEFT");	//ATTENTION!!! mui.screen instead of mui.viewport
		return false;
	});

	$("#tabbar-button1").click(function() {
		mui.alert("tab 1","Selected");
		return false;
	});
	
	$("#tabbar-button2").click(function() {
		mui.alert("tab 1","Selected");
		return false;
	});
	
	$("#tabbar-button3").click(function() {
		mui.alert("tab 3","Selected");
		return false;
	});
	
	$("#tabbar-button4").click(function() {
		mui.alert("tab 4","Selected");
		return false;
	});
	
	$("#tabbar-button5").click(function() {
		mui.alert("tab 5","Selected");
		return false;
	});
	
	$("#menuoptions").click(function() {
		return false;
	});
	
	/*******************************************************************************/
	/*Swipe Test --------------------------------------------------------------------*/
	/*******************************************************************************/	
	//Swipe touch events. Cool for best App user experience!
	//Evento de desplazamiento tactil. Buenisimo para una óptima experiencia de usuario en App!
	mui.viewport.on("swiperight", function(currentPageId, originalTarget, event, startX, startY, endX, endY) {
		if (!mui.viewport.panelIsOpen()) {
			mui.history.back();
		}
	});
}
