//var androidSenderID = "991349295611"; 
/*
 * Método principal usado para registrar el manejador de PushNotifications.
 */
function pushNotificationRegister() {
	if (typeof PushNotification != "undefined") {
		try {
			/*var push = PushNotification.init({
			    android: {
			        senderID: androidSenderID
			    },
			    ios: {
			        alert: "true",
			        badge: "true",
			        sound: "true"
			    },
			    windows: {}
			});*/
			
			//Pongo en cero el badge.
			/*push.setApplicationIconBadgeNumber(function() {}, function() {}, 0);*/
			
			//Evento al registrarse el dispositivo. Envío el token al servidor.
			push.on('registration', function(data) {
				sendTokenForPushNotification(data.registrationId);
			});
			
			//Evento al recibir una notificación. Se ejecutará una vez que la App sea levantada por el usuario al hacer click sobre el mensaje
			//o si está abierta en primer plano.
			push.on('notification', function(data) {
			    // data.message,
			    // data.title,
			    // data.count,
			    // data.sound,
			    // data.image,
			    // data.additionalData
				push.setApplicationIconBadgeNumber(function() {}, function() {}, 0);
				if ( data.message ) {
					try {
				    	mui.vibrate(50);
						window.plugins.toast.showLongCenter(data.message);
					} catch (err) {
						//alert("Error al recibir notificación: " + err.message);
					}
			    }
			});
			
			push.on('error', function(e) {
			    //mui.alert('Error al registrar push: ' + e.message);
			});
				
		} catch(err) {
			//mui.alert("Catch: " + err.message, "Atención");
		}
	}
} //fin function pushNotificationRegister(tokenHandler)

/**
 * Esta función envía al servidor el tokenId del dispositivo para el envío de push notifications.
 * Envía además información sobre la plataforma, vesión, modelo, etc.
 * @param tokenId
 * @param userName
 */
function sendTokenForPushNotification(tokenId) {	
	if (mui.connectionAvailable() && mui.cordovaAvailable()) {
		$.ajax({
			url: 'https://viaja-conmigo-servidor.herokuapp.com/users/registerPush',
			crossDomain: true,
			data: {
				//tokenid: tokenId,
				devicename:device.name,
				deviceplatform:device.platform,
				devicemodel: device.model,
				deviceuuid: device.uuid,
				deviceversion: device.version,
				//lasttokenid: lastTokenId//,
				//username: userName
			}
		})
		 .done(function(data) {
			 //pushNotificationTokenId = tokenId;	//Establezco la variable global.
		 })
		 .fail(function(err) {
			 //mui.alert(err, "Atención");
		 });
	}
}

function sendPushNotification() {
	if (mui.connectionAvailable() && mui.cordovaAvailable()) {
		$.ajax({
			url: 'https://viaja-conmigo-servidor.herokuapp.com/users/sendPush',
			crossDomain: true,
			data: {
				message: 'Hola Jime'
			}
		})
		 .done(function(data) {
			 //pushNotificationTokenId = tokenId;	//Establezco la variable global.
		 })
		 .fail(function(err) {
			 //mui.alert(err, "Atención");
		 });
	}
	
	
	
	
}
