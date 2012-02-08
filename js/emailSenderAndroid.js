/**
 *
 *	Constructor
 */
var EmailSenderAndroid = function() {
}

/**
 * @param day - weekday to send mail
 * @param time - time of day to send mail
 * @param email - recipient's email address
 */
EmailSenderAndroid.prototype.sendMail = function(day, time, email) {
    return PhoneGap.exec(null, null, "emailSenderAndroid",	'sendMail', [day, time, email]);
};

EmailSenderAndroid.prototype.cancelMail = function(email) {
    return PhoneGap.exec(null, null, "emailSenderAndroid", "cancelMail", [email]);
};

/**
 * 	Load EmailSender
 * */

PhoneGap.addConstructor(function() {
    PhoneGap.addPlugin("emailSenderAndroid", new EmailSenderAndroid());

});