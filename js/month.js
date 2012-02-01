function printMonthName(month, y) {
    var date = new Date(y, month);
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

    document.write(month[date.getMonth()]);
}

/**
 * Returns the name of the day, based on the value of the Date().getDay() method,
 * 0 - Sunday, 1 - Monday ... 6 - Saturday
 * @param dayNr
 */
function printDayName(d) {
    var date = new Date(d.valueOf());
    var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";

    return weekdays[date.getDay()];
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
    var weekNr =  1 + Math.ceil((firstThursday - target) / 604800000); // 604800000 = 7 * 24 * 3600 * 1000
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
    //alert(weeksInMonth.length);
    //alert(fullMonth.length);
    for(a = 0; a < weeksInMonth.length; a++) {
        for(b = 0; b < fullMonth.length; b++) {
            if(fullMonth[b] != weeksInMonth[a]) {
                continue;
            } else {
                datesInWeek.push((b+1));
            }
        }
        //alert('index '+a + '\t' + datesInWeek);
        //localStorage.clear();
        localStorage.setItem('array'+weeksInMonth[a], datesInWeek);
        //alert('array'+a +'\t'+ localStorage.getItem('array'+a));
        //document.write(datesInWeek);
        datesInWeek.length = 0;
    }
    //alert(datesInWeek);
    //return datesInWeek+'<br>';
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

function clearWeekNr() {
    localStorage.clear();
}


function getTotalRegisteredHoursInWeek() {
    return 30;
}