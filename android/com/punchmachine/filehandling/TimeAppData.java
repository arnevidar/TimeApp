package com.punchmachine.filehandling;


import android.os.Environment;
import android.util.Log;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

public class TimeAppData {
    private String path ="TimeApp/timeappdata.json";
    private JSONArray jsonArray = null;
    
    private void readFile() {
        String jsonString = "";
        FileInputStream fIn = null;
        try {
            File dir = Environment.getExternalStorageDirectory();
            File myFile = new File(dir, path);
            fIn = new FileInputStream(myFile);
            FileChannel fc = fIn.getChannel();
            MappedByteBuffer bb = fc.map(FileChannel.MapMode.READ_ONLY, 0, fc.size());
            jsonString = Charset.defaultCharset().decode(bb).toString();
            jsonArray = new JSONArray(jsonString);
        } catch (IOException e) {
            Log.e("ReadFile", e.toString());
        } catch(JSONException je) {
            Log.e("JSON ex", je.toString());
        } finally {
            if(fIn != null) {
                try {
                    fIn.close();
                } catch (IOException ioe) {
                    Log.e("TimeappData, readFile", ioe.toString());
                }
            }
        }
    }
    
    private ArrayList<Line> getDataForDate(Calendar fromDate, Calendar toDate) {
        readFile();
        ArrayList<Line> lines = new ArrayList<Line>();
        if(jsonArray != null) {
            try {
                TimeIgnoringComparator tic = new TimeIgnoringComparator();
                for(int h = 0; h < jsonArray.length(); h++) {
                    JSONObject companiesLines = jsonArray.getJSONObject(h);
                    JSONArray descArray = companiesLines.getJSONArray("desc");
                    for(int i = 0; i < descArray.length(); i++) {
                        JSONObject punchObject = descArray.getJSONObject(i);
                        JSONArray aPunch = punchObject.getJSONArray("punch");
                        
                        for(int j = 0; j < aPunch.length(); j++) {
                            Date theDate = new Date(aPunch.getJSONObject(j).getLong("date"));
                            Calendar thisDate = Calendar.getInstance();
                            thisDate.setTime(theDate);

                            if(tic.compare(thisDate, fromDate) >= 0) {
                                if(tic.compare(thisDate, toDate) <= 0) {
                                    String description = descArray.getJSONObject(i).getString("description");
                                    String hours = aPunch.getJSONObject(j).getString("totH");
                                    String companyName = companiesLines.getString("name");
                                    lines.add(new Line(thisDate, companyName, description, hours));
                                }
                            }
                        }
                    }
                }
            } catch (JSONException je) {
                Log.e("getDataForDate", je.toString());
            }
        }
        return lines;
    }


    public boolean toNotifyOrNot(Calendar toDate, int dayOfWeek) {
        Calendar fromDate = Calendar.getInstance();
        fromDate.setTime(toDate.getTime());
        int daysToMonday;
        if(dayOfWeek == 0) {
            daysToMonday = 6;  //if its sunday, we want the previous days
        } else {
            daysToMonday = dayOfWeek -1;
        }
        fromDate.add(Calendar.DAY_OF_MONTH, -daysToMonday);
        ArrayList<Line> lines = getDataForDate(fromDate, toDate);
        double[] totalHours = getTotHPerDay(lines, fromDate, toDate);
        for(int i = 0; i < totalHours.length; i++) {
            if(totalHours[i] < 7.5) {
                if(i != 6 || i != 5) {
                    return true;
                }
            }
        }
        return false;
    }


    public String getEmailBody(Calendar fromDate, Calendar toDate) {
        ArrayList<Line> lines = getDataForDate(fromDate, toDate);
        String body =  getAllLinesBody(lines, fromDate, toDate);
        body += getSumDayBody(getTotHPerDay(lines, fromDate, toDate), fromDate);
        return body;
    }
    
    public double[] getTotHPerDay(ArrayList<Line> lines, Calendar fromDate, Calendar toDate) {
        TimeIgnoringComparator tic = new TimeIgnoringComparator();
        int diff = Math.abs(tic.compare(fromDate, toDate)) +1;
        double[] totHours = new double[diff];
        Calendar currentDay = Calendar.getInstance();
        currentDay.setTime(fromDate.getTime());
        for(int i = 0; i < totHours.length; i++) {
            for(int j = 0; j < lines.size(); j++) {
                if(tic.compare(lines.get(j).getDate(), currentDay) == 0) {
                    totHours[i] += Double.parseDouble(lines.get(j).getHours());
                }
            }
            currentDay.add(Calendar.DAY_OF_MONTH, 1);
        }
        return totHours;
        
    } 
    
    
    public String getAllLinesBody(ArrayList<Line> lines, Calendar fromDate, Calendar toDate) {
        String html = "<h2>Registered hours between " + formatDate(fromDate.getTime())
                + " and " + formatDate(toDate.getTime()) +"</h2>";
        html += "<table border=\"1\" cellpadding=\"4\" style=\"border-collapse: collapse;\" >";
        html += "<tr><th>Date</th><th>Company</th><th>Description</th><th>Hours</th></tr>";
        for(Line theLine : lines) {
            html += "<tr>";
            html += "<td>" + formatDate(theLine.getDate().getTime()) + "</td>";
            html += "<td>" + theLine.getCompany() + "</td>";
            html += "<td>" + theLine.getDescription() + "</td>";
            html += "<td>" + theLine.getHours() + "</td>";
            html += "</tr>";
        }
        html += "</table>";
        return html;
    }
    
    public String getSumDayBody(double[] totHoursPerDay, Calendar fromDate) {
        Calendar currentDate = Calendar.getInstance();
        currentDate.setTime(fromDate.getTime());
        String html ="<br/><table border=\"1\" cellpadding=\"4\" style=\"border-collapse: collapse;\" >";
        html += "<tr><th>Date</th><th>Total hours</th></tr>";
        for(int i = 0; i < totHoursPerDay.length; i++) {
            html += "<tr>";
            html += "<td>" + formatDate(currentDate.getTime()) + "</td>";
            html += "<td>" + totHoursPerDay[i] + "</td>";
            html += "</tr>";
            currentDate.add(Calendar.DAY_OF_MONTH, 1);
        }
        html += "</table>";
        return html;
    }
    
    public String formatDate(Date date) {
        SimpleDateFormat formatter = new SimpleDateFormat("EEE MMM dd yyyy");
        return formatter.format(date);

    }
    
}
