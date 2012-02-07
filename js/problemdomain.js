


function TimeAppDataController () {
  this.companies = [];
}
// PUBLIC

/**
 * Save data to file and localStorage
 * TODO proper success and failure,
 *
 * @param onSuccess
 * @param onFailure
 */
TimeAppDataController.prototype.saveToFile = function (success, failure) {
    var p = new Persistence();
    //p.checkAndCreateTimeAppFolder(success, failure);
    p.writefile("timeappdata", JSON.stringify(this.companies), success ,function(){alert("err2")});
    localStorage.setItem("companies", JSON.stringify(this.companies));
}

/**
 * Returns date of last workday
 * TODO return date of last workday before input date
 */

TimeAppDataController.prototype.getLastWorkday = function() {
    return new Date(this.companies[0].desc[0].punch[0].date);
}

/**
 * Adds a punch for each date between start and end date including start and end date.
 * TODO onsuccess/onfailure
 * @param newCompanyName
 * @param newDescription
 * @param startDate
 * @param endDate
 */

TimeAppDataController.prototype.addVacation = function(newCompanyName, newDescription, startDate, endDate)
{
    var endDateObj = new Date(endDate);
    var startDateObj = new Date(startDate);
    endDateObj.setHours(startDateObj.getHours());
    endDateObj.setMinutes(startDateObj.getMinutes());

    for (;startDateObj<endDateObj;) {
        this.updatePunch(newCompanyName, newDescription, startDateObj, 8.0);
        startDateObj.setDate(startDateObj.getDate()+1);
    }
    this.updatePunch(newCompanyName, newDescription, startDateObj, 8.0);
}

/**
 * Adds a new punch or updates an existing punch.
 * Update is actually delete -> create new.
 *
 * TODO proper onsuccess/onfailure
 * @param newCompanyName
 * @param newDescription
 * @param newDate
 * @param newTotH
 * @param optional oldCompanyName
 * @param optional oldDescription
 * @param optional oldDate
 * @param optional oldTotH
 */


TimeAppDataController.prototype.updatePunch = function(newCompanyName, newDescription, newDate, newTotH,
                                                       oldCompanyName, oldDescription, oldDate, oldTotH,
                                                       onSuccess){
    var onWriteFileSuccess = onSuccess;
    if (!onWriteFileSuccess) onWriteFileSuccess = function () {};


    if (newCompanyName.trim().toLowerCase() == "select company" || newCompanyName.trim() == "") return;
    if (newCompanyName.trim().toLowerCase() == "add a new company" || newCompanyName.trim() == "") return;
    if (newDescription.trim().toLowerCase() == "select description" || newDescription.trim() == "") return;
    if (newDescription.trim().toLowerCase() == "add new description" || newDescription.trim() == "") return;
    if (newTotH == 0) return;

    if ((oldCompanyName)&&
        (oldDescription)&&
        (oldDate)&&
        (oldTotH)){
            this.deleteRecord(oldCompanyName, oldDescription, oldDate, oldTotH, function() {
                var t = new TimeAppDataController();
                t.loadData(function() {}, function() {});
                t.updatePunch(newCompanyName, newDescription, newDate, newTotH, undefined, undefined, undefined, undefined, onWriteFileSuccess);
            });
            return;
    }

    var companyObject = this.getCompany(newCompanyName);
    if (!companyObject) var companyObject = this.addCompany(newCompanyName);

    var descObject = this.getDescription(companyObject, newDescription);
    if (!descObject) {
        var descObject = this.addDescription(companyObject, newDescription);
        //alert("Comp: " + companyObject.name + ". Description: " + descObject.description);
    }

    //var punchObject = this.getPunch(descObject, newDate, newTotH);
    this.addPunch(descObject, newDate, newTotH);
    this.saveToFile(onWriteFileSuccess,function(){alert("err");});
}

/**
 * Deletes a punch, if associated description and company no longer has a punch, they will also be removed
 * @param companyName
 * @param description
 * @param date
 * @param totH
 */

TimeAppDataController.prototype.deleteRecord = function (companyName, description, date, totH, onSuccess) {

        var companyObject = this.getCompany(companyName);
        var descObject = this.getDescription(companyObject, description);
        var punchObject = this.getPunch(descObject, date, totH);
        this.removePunch(descObject, punchObject);
        this.verifyDesc(companyObject, descObject);
        this.verifyComp(companyObject);
        this.saveToFile(onSuccess, function(e){alert("err" + e);});
}



/**
 * Returns array with the 7 latest updated companies
 */
TimeAppDataController.prototype.get7companies = function() {
    var comp = [];
    var i = 0;
    for (i = 0; i < 7 && i < this.companies.length; i++) {
        if (this.companies[i].name != "Internal"){
            comp.push(this.companies[i].name);
        }
    }
    return comp;
}

/**
 * Returns array with 7 latest descriptions used with selected company
 * @param companyName
 */

TimeAppDataController.prototype.get7descriptions = function (companyName) {
    var internalChoices = ["Time off", "Day off", "Vacation"];
    if(companyName === "Internal") {
        return internalChoices;
    } else {
        var company  = this.getCompany(companyName);
        if(company) {
            var descr = [];
            var i = 0;
            for (i = 0; i < 7 && i < company.desc.length; i++) {
                descr.push(company.desc[i].description);
            }
            return descr;
        }
    }
    return null;
}



/**
 * Loads data fra local storage to object
 */


TimeAppDataController.prototype.loadData = function (onSuccess, onFailure) {
    if (localStorage.getItem("companies")){
        this.companies = JSON.parse(localStorage.getItem("companies"));
        onSuccess();
    }
    else {
        //var p = new Persistence();
        //this.companies = JSON.parse(p.readfile("timeappdata", function(){},function(){alert("err2")}));
        onFailure();
    }

    /*

     var p = new Persistence();
     p.readfile("timeapp", tadc, function(data, timeappdatacontroller){
     if (data) {
     localStorage.setItem("companies", data);
     tadc.companies = JSON.parse(data);
     }
     else {
     tadc.loadMockData();
     }
     onSuccess;
     }, onFailure);
     */
}


/**
 * Returns array of objects for a day, with these variables:
 * date - date of punch
 * name - company name
 * desc - description of work done
 * totH - total hours worked on this punch
 * TODO optimize alg, o(n), should be avg log(n)
 * @param dateToFetch
 */

TimeAppDataController.prototype.getDataForDay = function (dateToFetch) {
    var startDate = this.createDate(dateToFetch);

    var companiesToInclude = this.companies

    var results = [];
    for (compIndex in companiesToInclude) {
        for (descIndex in companiesToInclude[compIndex].desc) {
            for (punchIndex in companiesToInclude[compIndex].desc[descIndex].punch){
                punchDate = new Date(companiesToInclude[compIndex].desc[descIndex].punch[punchIndex].date);
                if ((punchDate.getFullYear()==dateToFetch.getFullYear()) &&
                    (punchDate.getMonth()==dateToFetch.getMonth())&&
                    (punchDate.getDate()==dateToFetch.getDate())) {
                    results.push({"date": companiesToInclude[compIndex].desc[descIndex].punch[punchIndex].date,
                        "name": companiesToInclude[compIndex].name,
                        "desc": companiesToInclude[compIndex].desc[descIndex].description,
                        "totH": companiesToInclude[compIndex].desc[descIndex].punch[punchIndex].totH
                    });
                }
            }
        }
    }
    return results;

}


// PRIVATE

TimeAppDataController.prototype.getTodaysDate = function () {
    var dateTemp = new Date();
//    dateTemp.setHours(12);
    var onlyDate = new Date(dateTemp.getFullYear(), dateTemp.getMonth(), dateTemp.getDate(), 13);
    return onlyDate;
}

TimeAppDataController.prototype.createDate = function (orgRate) {
    var onlyDate = new Date(orgRate.getFullYear(), orgRate.getMonth(), orgRate.getDate(), 13);
    return onlyDate;
}



TimeAppDataController.prototype.removePunch = function (description, punch) {
    var indexOfPunch = description.punch.indexOf(punch);
    description.punch.splice(indexOfPunch, 1);
    description.punch.sort(punchComparator);
}

TimeAppDataController.prototype.verifyDesc = function (company, description) {
    if (description.punch.length<1) {
        var indexOfDesc = company.desc.indexOf(description);
        company.desc.splice(indexOfDesc, 1);
    }
    company.desc.sort(descriptionComparator);
}

TimeAppDataController.prototype.verifyComp = function (company) {
    if (company.desc.length<1) {
        var indexOfComp = this.companies.indexOf(company);
        this.companies.splice(indexOfComp, 1);
    }
    this.companies.sort(companyComparator);
}

TimeAppDataController.prototype.getPunch = function (description, dateToFind, totH) {
    for (punchIndex in description.punch) {
        var dateObjToFind = new Date(dateToFind);
        var thisPunchDate = new Date(description.punch[punchIndex].date);
        if ((description.punch[punchIndex].totH = totH )&&(description.punch[punchIndex].totH = totH )){
            if ((dateObjToFind.getYear() == thisPunchDate.getYear()) &&
                (dateObjToFind.getDate() == thisPunchDate.getDate()) &&
                (dateObjToFind.getMonth() == thisPunchDate.getMonth())) {
            return description.punch[punchIndex];
            }
        }
    }
}

TimeAppDataController.prototype.getDescription = function (companyObj, description){
    for (descIndex in companyObj.desc) {
        if(companyObj.desc[descIndex].description == description) return companyObj.desc[descIndex];
    }
}

TimeAppDataController.prototype.getCompany = function (companyName) {
    for (compIndex in this.companies) {
        if (this.companies[compIndex].name == companyName) return this.companies[compIndex];
    }
}

TimeAppDataController.prototype.getTotHDay = function(dateToFetch) {
    var totalHours = 0;
    //var startDate = this.createDate(dateToFetch);
    // startDate.getFullYear() startDate.getMonth() startDate.getDay()

    // find first instance of date
    var startDate = this.createDate(dateToFetch);
    // startDate.getFullYear() startDate.getMonth() startDate.getDay()

    // find first instance of date
    var companiesToInclude = this.companies;
    for (compIndex in companiesToInclude) {
        for (descIndex in companiesToInclude[compIndex].desc) {
            for (punchIndex in companiesToInclude[compIndex].desc[descIndex].punch){
                punchDate = new Date(companiesToInclude[compIndex].desc[descIndex].punch[punchIndex].date);
                if ((punchDate.getFullYear()==dateToFetch.getFullYear()) &&
                    (punchDate.getMonth()==dateToFetch.getMonth())&&
                    (punchDate.getDate()==dateToFetch.getDate())) {
                    totalHours += companiesToInclude[compIndex].desc[descIndex].punch[punchIndex].totH;
                }
            }
        }
    }
    return totalHours;
}

TimeAppDataController.prototype.getTotHWeek = function(startDate, endDate) {
    var totalHours = 0;
    var one_day = 1000 * 60 * 60 * 24;
    var startDate_m = startDate.getTime(), endDate_m = endDate.getTime();
    var diff = Math.abs(endDate.getTime() - startDate.getTime());
    for( j = startDate_m; j <= endDate_m; j += one_day ) {
        var jj = new Date(j);
        totalHours += this.getTotHDay(jj);
    }
    return totalHours;
}

/**
 * Pushes the finisted dates (dates with more than 7 hours registered) to localstorage.
 * The dates are converted into the ISO standard, which is used in the Datebox-plugin,
 */

TimeAppDataController.prototype.pushFinishedDatesToLS = function(d) {
    var finishedDatesArray = new Array();
    var notFinishedDatesArray = new Array();
    var one_day = 1000 * 3600 * 24;
    var firstDayInMonth_m = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
    var lastDayInMonth_m = new Date(d.getFullYear(), d.getMonth()+1, 0).getTime();
    for( m = firstDayInMonth_m; m <= lastDayInMonth_m; m += one_day ) {
        var newDate = new Date(m);
        alert("THIS IS newDATE " + newDate);
        var isoDay = toISODate(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
        if( this.getTotHDay(newDate) > 7 ) {
            finishedDatesArray.push("\""+isoDay+"\"");
        } else {
            notFinishedDatesArray.push("\""+isoDay+"\"");
        }
    }
    localStorage.setItem('finishedDates', finishedDatesArray);
    localStorage.setItem('notFinishedDates', notFinishedDatesArray);
}


TimeAppDataController.prototype.addCompany = function (name){
    var company = new Object();
    company.name = name;
    company.desc = [];
    this.companies.push(company);
    return company;
}

TimeAppDataController.prototype.addDescription = function (company, descriptionTxt) {
    var description = new Object();
    description.description = descriptionTxt;
    description.punch = [];
    company.desc.push(description);
    return description;
}

TimeAppDataController.prototype.addPunch = function (description, date, totalTime) {
    //alert("Punch: " + JSON.stringify(description) + " " + date + " " + totalTime);
    var punch = new Object();
    correctDate = this.createDate(date);
    punch.date = Date.parse(correctDate);
    punch.totH = totalTime;
    description.punch.push(punch);
    description.punch.sort(punchComparator);
    for (compIndex in this.companies) {
        if (this.companies[compIndex].desc.indexOf(description) != -1) {
            this.companies[compIndex].desc.sort(descriptionComparator);
            break;
        }
    }
    this.companies.sort(companyComparator);

    return punch;
}


/**
 * Returns array with the 7 latest updated companies
 */
TimeAppDataController.prototype.get7companies = function() {
    var comp = [];
    var i = 0;
    for (i = 0; i < 7 && i < this.companies.length; i++) {
        if(this.companies[i].name!= "Internal") {
            comp.push(this.companies[i].name);
        }
    }
    return comp;
}

/**
 * Returns array with 7 latest descriptions used with selected company
 * @param companyName
 */

TimeAppDataController.prototype.get7descriptions = function (companyName) {
    var internalChoices = ["Time off", "Day off", "Vacation"];
    if(companyName === "Internal") {
        return internalChoices;
    } else {
        var company  = this.getCompany(companyName);
        if(company) {
            var descr = [];
            var i = 0;
            for (i = 0; i < 7 && i < company.desc.length; i++) {
                descr.push(company.desc[i].description);
            }
            return descr;
        }
    }
    return null;
}

function punchComparator(a, b) {
 if (a.date>b.date) return -1;
 return 1;
}

function descriptionComparator(a, b) {
 if (a.punch[0].date>b.punch[0].date) return -1;
 if (a.punch[0].date<b.punch[0].date) return 1;
 if (a.description<b.description) return -1;
 return 1;
}

function companyComparator(a, b) {
    if (a.desc[0].punch[0].date>b.desc[0].punch[0].date) return -1;
    if (a.desc[0].punch[0].date<b.desc[0].punch[0].date) return 1;
    if (a.name<b.name) return -1;
  return 1;
}

// DEBUG


TimeAppDataController.prototype.loadData = function (onSuccess, onFailure) {
    if (localStorage.getItem("companies")){
        this.companies = JSON.parse(localStorage.getItem("companies"));
        onSuccess();
    }
    else {
        alert("ingen local storage?");
        //var p = new Persistence();
        //this.companies = JSON.parse(p.readfile("timeappdata", function(){},function(){alert("err2")}));
        //onFailure();
        //this.loadMockData();
    }
/*
    var p = new Persistence();
    p.readfile("timeapp", tadc, function(data, timeappdatacontroller){
        if (data) {
            localStorage.setItem("companies", data);
            timeappdatacontroller.companies = JSON.parse(data);
        }
        else {
            timeappdatacontroller.loadMockData();
        }
        onSuccess;
    }, onFailure);
*/
}

TimeAppDataController.prototype.loadMockData = function () {
    var dnb = this.addCompany("DNB");
    var dnb_koding = this.addDescription(dnb, "dnbkoding");
    var dnb_date = this.getTodaysDate();
    dnb_date.setDate(dnb_date.getDate());
    var dnb_koding_punch = this.addPunch(dnb_koding, dnb_date, "2.0");

    var obs = this.addCompany("OBS");
    var obs_koding = this.addDescription(obs, "obskoding");
    var obs_date = this.getTodaysDate();
    obs_date.setDate(obs_date.getDate()-1)
    var obs_koding_punch = this.addPunch(obs_koding, obs_date, "3.0");

    var obs_koding2 = this.addDescription(obs, "obskoding2");
    var obs_koding_punch = this.addPunch(obs_koding2, obs_date, "4.0");

    var obs_koding3 = this.addDescription(obs, "obskoding3");
    var obs_koding_punch = this.addPunch(obs_koding3, obs_date, "5.0");

    var aba = this.addCompany("ABA");
    var aba_koding = this.addDescription(aba, "adakoding");
    var aba_koding_punch = this.addPunch(aba_koding, dnb_date, "10.0");

}


/**
 * Returns array of objects with these variables:
 * date - date of punch
 * name - company name
 * desc - description of work done
 * totH - total hours worked on this punch
 *
 * @param dateToFetch
 */

TimeAppDataController.prototype.getDataForDay = function (dateToFetch) {
    var startDate = this.createDate(dateToFetch);
    // startDate.getFullYear() startDate.getMonth() startDate.getDay()

    // find first instance of date
    var companiesToInclude = this.companies
    /*
    for (compIndex in this.companies) {
        companyDate = new Date(this.companies[compIndex].desc[0].punch[0].date);
        if (companyDate.getFullYear()<dateToFetch.getFullYear())  continue;
        if ((companyDate.getFullYear()==dateToFetch.getFullYear()) &&
            (companyDate.getMonth()<dateToFetch.getMonth())) continue;
        if ((companyDate.getFullYear()==dateToFetch.getFullYear()) &&
            (companyDate.getMonth()==dateToFetch.getMonth())&&
            (companyDate.getDay()<dateToFetch.getDay())) continue;
        companiesToInclude.push(this.companies[compIndex]);
    }*/

    var results = [];
    for (compIndex in companiesToInclude) {
        for (descIndex in companiesToInclude[compIndex].desc) {
            for (punchIndex in companiesToInclude[compIndex].desc[descIndex].punch){
                punchDate = new Date(companiesToInclude[compIndex].desc[descIndex].punch[punchIndex].date);
                if ((punchDate.getFullYear()==dateToFetch.getFullYear()) &&
                    (punchDate.getMonth()==dateToFetch.getMonth())&&
                    (punchDate.getDate()==dateToFetch.getDate())) {
                    results.push({"date": companiesToInclude[compIndex].desc[descIndex].punch[punchIndex].date,
                                  "name": companiesToInclude[compIndex].name,
                                  "desc": companiesToInclude[compIndex].desc[descIndex].description,
                                  "totH": companiesToInclude[compIndex].desc[descIndex].punch[punchIndex].totH
                    });
                }
            }
        }
    }
    return results;
    //return companiesToInclude.length;
    // find last instance of date
    //var lastInstance;
}

TimeAppDataController.prototype.getTodaysDate = function () {
    var dateTemp = new Date();
//    dateTemp.setHours(12);
    var onlyDate = new Date(dateTemp.getFullYear(), dateTemp.getMonth(), dateTemp.getDate(), 13);
    return onlyDate;
}

TimeAppDataController.prototype.createDate = function (orgRate) {
    var onlyDate = new Date(orgRate.getFullYear(), orgRate.getMonth(), orgRate.getDate(), 13);
    return onlyDate;
}
