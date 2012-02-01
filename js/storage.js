function setCurrentMonth() {
    var date = new Date();
    localStorage.setItem("month", date.getMonth());
}

function getCurrentMonth() {
    var currentMonth = localStorage.getItem("month");
    return currentMonth;
}