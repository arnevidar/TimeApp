function printMonthName(m) {
    var month=new Array(12);
    month[0]="January";
    month[1]="February";
    month[2]="March";
    month[3]="April";
    month[4]="May";
    month[5]="June";
    month[6]="July";
    month[7]="August";
    month[8]="September";
    month[9]="October";
    month[10]="November";
    month[11]="December";

    return month[m];
}

/**
 * Returns the name of the day, based on the value of the Date().getDay() method,
 * 0 - Sunday, 1 - Monday ... 6 - Saturday
 * @param dayNr
 */
function printDayName(d) {
    //var date = new Date(d.valueOf());
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[d];
}

/**
 * Get the ISO week date week number
 */
Date.prototype.getWeek = function (d) {
    // Create a copy of this date object
    var target  = new Date(this.valueOf()) || new Date(d.valueOf());

    // ISO week date weeks start on monday
    // so correct the day number
    var dayNr = (this.getDay() + 6) % 7 || (d.getDay() + 6) % 7;

    // ISO 8601 states that week 1 is the week
    // with the first thursday of that year.
    // Set the target date to the thursday in the target week
    target.setDate(target.getDate() - dayNr + 3);

    // Store the millisecond value of the target date
    var firstThursday = target.valueOf();

    // Set the target to the first thursday of the year
    // First set the target to january first
    target.setMonth(0, 1);
    // Not a thursday? Correct the date to the next thursday
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }

    // The weeknumber is the number of weeks between the
    // first thursday of the year and the thursday in the target week
    var weekNr =  1 + Math.floor((firstThursday - target) / 604800000); // 604800000 = 7 * 24 * 3600 * 1000
    return weekNr;
}

/**
 * Loops through each day in the month, and assign the week number to it.
 * Month is in the interval [0,11].
 */
function pushDaysToWeekArray(month, y) {
    if(y == null) {
        var year = new Date().getFullYear();
    } else {
        var year = new Date(y);
    }
    var lastDay = new Date(year, month+1, 0).getDate(); // Number of days in the month
    var weekdaysAndTheirWeekNr = [];
    for(i = 0; i < lastDay; i++) {
        var date = new Date(year, month, i);
        weekdaysAndTheirWeekNr.push(date.getWeek(date));
    }
    //alert(weekdaysAndTheirWeekNr);
    return weekdaysAndTheirWeekNr;
}

/**
 * Finds the weeks in the month and pushes them into an array,
 * and returns the array. Month is in the interval [0,11].
 */
function getWeeksInMonth(month, y) {
    if(y == null) {
        var daysInMonth = pushDaysToWeekArray(month);
    } else {
        var daysInMonth = pushDaysToWeekArray(month, y);
    }
    var currentWeek = -1;
    var weeksInMonth = [];

    for(var i = 0; i < daysInMonth.length; ++i ) {
        if( daysInMonth[i] != currentWeek ) {
            weeksInMonth.push(daysInMonth[i]);
            currentWeek = daysInMonth[i];
        }
    }
    return weeksInMonth;
}

/**
 * Returns an array with the dates in a week, used for printing the
 * dates in a week, in the Weekview.html.
 */

function printWeekDates(month, y) {
    if(y == null) {
        var fullMonth = pushDaysToWeekArray(month); //All the days and their week number
        var weeksInMonth = getWeeksInMonth(month); //Just the weeks in the month
    } else {
        var fullMonth = pushDaysToWeekArray(month, y);
        var weeksInMonth = getWeeksInMonth(month, y);
    }
    var datesInWeek = new Array();

    for(a = 0; a < weeksInMonth.length; a++) {
        for(b = 0; b < fullMonth.length; b++) {
            if(fullMonth[b] != weeksInMonth[a]) {
                continue;
            } else {
                datesInWeek.push((b+1));
            }
        }
        localStorage.setItem('weekArray'+weeksInMonth[a], datesInWeek);
        datesInWeek.length = 0;
    }
}

function todayWeek(d) {
    var date = new Date(d.valueOf());
    var weekNr = d.getWeek();
    document.writeln(weekNr);
}

/**
 * Stores the weeknumber and uses this to read it in the weekview.
 * @param week
 */

function storeWeekNr(week) {
    localStorage.setItem("week", week);
}

function readWeekNr(){
    var res = 'Week ' + localStorage.getItem("week");
    return res;
}

function getFirstDayOfWeek(week) {
    var week = localStorage.getItem('weekArray'+week);
    var weekA = week.split(",");
    return weekA[0];
}

function getLastDayOfWeek(week) {
    var week = localStorage.getItem('weekArray'+week);
    var weekA = week.split(",");
    return weekA[weekA.length-1];
}

function sendIndex(index) {
    localStorage.setItem("index", index);
}

function clearWeekNr() {
    localStorage.clear();
}


/**
 * The dates that get sent to the calendarView has to be in this format.
 */
function toISODate(y,m,d) {
    // Return an ISO 8601 date (yyyy-mm-dd)
    return String(y) + '-' + (( m < 10 ) ? "0" : "") + String(m) + '-' + ((d < 10 ) ? "0" : "") + String(d);
}

/**
 * FINISH THESE METHODS!
 */


/**
 * Pushes the finishedDates to localeStorage
 */


function getFinishedDates() {
    var finishedDates = localStorage.getItem("finishedDates");
    alert("THIS IS MONTH: " +finishedDates);
    var finishedDatesA = finishedDates.split(",");
    var res = '[';
    for( u = 0; u < finishedDatesA.length; u++ ) {
        res += finishedDatesA[u] + ", ";
    }
    res += ']';
    return res;
}

function notFinishedDates(month) {
    var notFinishedDates = new Array();
    return notFinishedDates;
}