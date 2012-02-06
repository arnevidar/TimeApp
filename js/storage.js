function setCurrentMonth() {
    var date = new Date();
    date.setFullYear(date.getFullYear(),date.getMonth(),date.getDate());
    localStorage.setItem("Month", date.getMonth());
}

function getCurrentMonth() {
    var currentMonth = localStorage.getItem("month");
    return currentMonth;
}