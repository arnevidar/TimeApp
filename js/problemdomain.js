 	 function TimeAppData () {
	 	this.companies = [];
 	 }
 	 
 	 function Company (name) {
	 	this.name = name;
	 	this.desc = [];
	 }
	 
	 function Description (desc) {
	 	this.desc = desc;
	 	this.punch = [];
	 }
	 
	 function Punch (date, totH) {
	 	this.date = date;
	 	this.totH = totH;
	 } 

	 TimeAppData.prototype.get7comp = function() {
	 
	 }
	 
	 Company.prototype.get7desc = function () {
	 
	 }
	 
	 TimeAppData.prototype.getDataForDay = function(date) {
	 }