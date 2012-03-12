package com.punchmachine.filehandling;

import java.util.Calendar;


public class Line {
    private Calendar date;
    private String company;
    private String description;
    private String hours;
    
    public Line(Calendar date, String company, String description, String hours) {
        this.date = date;
        this.company = company;
        this.description = description;
        this.hours = hours;

    }

    public Calendar getDate() {
        return date;
    }


    public String getCompany() {
        return company;
    }



    public String getDescription() {
        return description;
    }


    public String getHours() {
        return hours;
    }

}
