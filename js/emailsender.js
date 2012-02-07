/**
 *
 *	Constructor
 */
var EmailSender = function() {
}

/**
 * @param day - weekday to send mail
 * @param time - time of day to send mail
 * @param email - recipient's email address
 */
EmailSender.prototype.sendMail = function(day, time, email) {
    return PhoneGap.exec(null, null, 'emailSender',	'sendMail', [day, time, email]);
};

EmailSender.prototype.cancelMail = function(email) {
    return PhoneGap.exec(null, null, "emailSender", "abortMail", [email]);
};

/**
 * 	Load EmailSender
 * */

PhoneGap.addConstructor(function() {
    PhoneGap.addPlugin("emailSender", new EmailSender());

});