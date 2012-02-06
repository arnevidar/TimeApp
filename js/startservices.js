

/**
 *
 *	Constructor
 */
var StartServices = function() {
}


StartServices.prototype.start = function() {
    return PhoneGap.exec(null, null, 'startServices',	'notify', []);
};


/**
 * 	Load StatusBarNotification
 * */

PhoneGap.addConstructor(function() {
    PhoneGap.addPlugin('startServices', new StartServices());

//	@deprecated: No longer needed in PhoneGap 1.0. Uncomment the addService code for earlier 
//	PhoneGap releases.
//	PluginManager.addService("StatusBarNotificationPlugin","com.trial.phonegap.plugin.directorylisting.StatusBarNotificationPlugin");
});