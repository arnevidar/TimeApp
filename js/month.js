function printMonthName(month) {
    var date = new Date();
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
    for(var i = 0; i < lastDay; ++i ) {
        var date = new Date(year, month, i);
        weekdaysAndTheirWeekNr.push(date.getWeek(date));
    }
    //alert(weekdaysAndTheirWeekNr);
    return weekdaysAndTheirWeekNr;
}

/**
 * Finds the weeks in the month and pushes them into an array,
 * and returns it. Month is in the interval [0,11].
 */
function findWeeksInMonth(month, y) {
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

function printWeeksToView(month, y) {
    if(y == null) {
        var weeksInMonth = findWeeksInMonth(month);
    } else {
        var weeksInMonth = findWeeksInMonth(month, year);
    }
    for(var i = 0; i < weeksInMonth.length; ++i ) {
        var html = '';
        html += '<ul data-role="listview">'
        html += '<li>';
        html += '<a href="" onclick="" >';
        html += '<h3>Week '+ weeksInMonth[i]+':'+'</h3>';
        html += '<p>TestunderText</p>';
        html += '</a>';
        html += '</li>';
        html += '</ul>';
        document.write(html);
    }
}

function printDaysToView(weeknr) {

}


function todayWeek(d) {
    var date = new Date(d.valueOf());
    var weekNr = d.getWeek();
    document.writeln(weekNr);
}

function getHoursInWeek(week) {
    document.write("7,5");
}