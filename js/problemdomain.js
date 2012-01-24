function TimeAppDataController () {
  this.companies = [];
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
        comp.push(this.companies[i]);
    }
    return comp;
}

/**
 * Returns array with 7 latest descriptions used with selected company
 * @param company
 */

TimeAppDataController.prototype.get7descriptions = function (company) {

    var descr = [];
    var i = 0;
    for (i = 0; i < 7 && i < company.desc.length; i++) {
        company.descr.add(descr[i]);
    }
    return desc;
}

function punchComparator(a, b) {
 if (a.date>b.date) return -1;
 return 1;
}

function descriptionComparator(a, b) {
 if (a.punch[0].date>b.punch[0].date) return -1;
 return 1;
}

function companyComparator(a, b) {
    if (a.desc[0].punch[0].date>b.desc[0].punch[0].date) return -1;
  return 1;
}

/**
 * Loads test/dummy data
 */

TimeAppDataController.prototype.loadData = function () {
    var dnb = this.addCompany("DNB");
    var dnb_koding = this.addDescription(dnb, "dnbkoding");
    var dnb_date = this.getTodaysDate();
    dnb_date.setDate(dnb_date.getDate()+0);
    var dnb_koding_punch = this.addPunch(dnb_koding, dnb_date, 2);

    var obs = this.addCompany("OBS");
    var obs_koding = this.addDescription(obs, "obskoding");
    var obs_date = this.getTodaysDate();
    obs_date.setDate(obs_date.getDate()+0)
    var obs_koding_punch = this.addPunch(obs_koding, obs_date, 3);

    var obs_koding2 = this.addDescription(obs, "obskoding2");
    var obs_koding_punch = this.addPunch(obs_koding2, obs_date, 4);

    var obs_koding3 = this.addDescription(obs, "obskoding3");
    var obs_koding_punch = this.addPunch(obs_koding3, dnb_date, 5);

    var aba = this.addCompany("ABA");
    var aba_koding = this.addDescription(aba, "adakoding");
    var aba_koding_punch = this.addPunch(aba_koding, obs_date, 10);
}


/**
 * Returns array of objects with these variables:
 * date - date of punch
 * name - company name
 * description - description of work done
 * totH - total hours worked on this punch
 *
 * @param dateToFetch
 */

TimeAppDataController.prototype.getDataForDay = function (dateToFetch) {
    var startDate = this.createDate(dateToFetch);
    // startDate.getFullYear() startDate.getMonth() startDate.getDay()

    // find first instance of date
    var companiesToInclude = [];
    for (compIndex in this.companies) {
        companyDate = new Date(this.companies[compIndex].desc[0].punch[0].date);
        if (companyDate.getFullYear()>dateToFetch.getFullYear())  continue;
        if ((companyDate.getFullYear()==dateToFetch.getFullYear()) &&
            (companyDate.getMonth()>dateToFetch.getMonth())) continue;
        if ((companyDate.getFullYear()==dateToFetch.getFullYear()) &&
            (companyDate.getMonth()==dateToFetch.getMonth())&&
            (companyDate.getDay()>dateToFetch.getDay())) continue;
        companiesToInclude.push(this.companies[compIndex]);
    }
    var results = [];
    for (compIdex in companiesToInclude) {
        for (descIndex in companiesToInclude[compIndex].desc) {
            for (punchIndex in companiesToInclude[compIndex].desc[descIndex].punch){
                punchDate = new Date(companiesToInclude[compIndex].desc[descIndex].punch[punchIndex].date);
                if ((punchDate.getFullYear()==dateToFetch.getFullYear()) &&
                    (punchDate.getMonth()==dateToFetch.getMonth())&&
                    (punchDate.getDay()==dateToFetch.getDay())) {
                    results.push({"date": companiesToInclude[compIndex].desc[descIndex].punch[punchIndex].date,
                                  "name": companiesToInclude[compIndex].name,
                                  "description": companiesToInclude[compIndex].desc[descIndex].description,
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