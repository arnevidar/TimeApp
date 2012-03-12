package com.punchmachine.filehandling;


import android.app.AlarmManager;
import android.os.Environment;
import android.util.Log;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.Charset;
import java.util.Calendar;

public class EmailSettings {
    private String path ="TimeApp/emailsettings.json";
    private JSONObject jsonObject = null;

    public EmailSettings() {
        readFile();

    }

    private void readFile() {
        String jsonString = "";
        FileInputStream fIn = null;
        try {
            File dir = Environment.getExternalStorageDirectory();
            File myFile = new File(dir, path);
            fIn = new FileInputStream(myFile);
            FileChannel fc = fIn.getChannel();
            MappedByteBuffer bb = fc.map(FileChannel.MapMode.READ_ONLY, 0, fc.size());
            /* Instead of using default, pass in a decoder. */
            jsonString = Charset.defaultCharset().decode(bb).toString();
            jsonObject = new JSONObject(jsonString);
        } catch (IOException e) {
            Log.e("ReadFile", e.toString());
        } catch(JSONException je) {
            Log.e("JSON ex", je.toString());
        } finally {
            if(fIn != null) {
                try {
                    fIn.close();
                } catch (IOException ioe) {
                    Log.e("EmailSettings.java, readFile", ioe.toString());
                }
            }
        }

    }
    
    public String getRecipient() {
        String recipient ="";
        try {
            recipient = jsonObject.get("recipient").toString().trim();
        } catch (JSONException je) {
            Log.e("EmailSettings, getRecipient()", je.toString());
        }
        return recipient;
    }


    public String getSender() {
        String sender ="";
        try {
            sender = jsonObject.get("sender").toString().trim();
        } catch (JSONException je) {
            Log.e("EmailSettings, getRecipient()", je.toString());
        }
        return sender;
    }

    public String getSenderPassword() {
        String password ="";
        try {
            password = jsonObject.get("password").toString().trim();
        } catch (JSONException je) {
            Log.e("EmailSettings, getSenderPassword()", je.toString());
        }
        return password;
    }

    public String getOnorOff() {
        String toggle ="";
        try {
            toggle = jsonObject.get("toggleEmail").toString();
        } catch (JSONException je) {
            Log.e("EmailSettings, getRecipient()", je.toString());
        }
        return toggle;
    }
    
    public long getNotificationtime() {
        String time = "";
        String weekday = "";
        try {
            time = jsonObject.get("time").toString();
            weekday = jsonObject.get("weekday").toString();
        } catch(JSONException je) {
            Log.e("EmailSettings, getTime()", je.toString()); 
        }
        String[] values = time.split(":");
        int hours = Integer.parseInt(values[0]);
        int minutes = Integer.parseInt(values[1]);

        Calendar cal = Calendar.getInstance();
        int todaysDayNumber = cal.get(Calendar.DAY_OF_WEEK)-1;
        int notificationDay = 0;

        if(weekday.equals("sunday")) notificationDay = 0;
        else if(weekday.equalsIgnoreCase("monday")) notificationDay = 1;
        else if(weekday.equalsIgnoreCase("tuesday")) notificationDay = 2;
        else if(weekday.equalsIgnoreCase("wednesday")) notificationDay = 3;
        else if(weekday.equalsIgnoreCase("thursday")) notificationDay = 4;
        else if(weekday.equalsIgnoreCase("friday")) notificationDay = 5;
        else if(weekday.equalsIgnoreCase("saturday")) notificationDay = 6;

        int diffInDays = notificationDay - todaysDayNumber;
        int daysToAdd = 0;
        if(diffInDays > 0) {
            daysToAdd = diffInDays;
        } else if(diffInDays < 0) {
            daysToAdd = 7 + diffInDays;
        } else if(diffInDays == 0) {
            if(cal.get(Calendar.HOUR_OF_DAY) >= hours) {
                if(cal.get(Calendar.MINUTE) > minutes) {
                    daysToAdd = 7;
                }
            }
        }

        long daysToAddMilli = AlarmManager.INTERVAL_DAY * daysToAdd;
        cal.set(Calendar.HOUR_OF_DAY, hours);
        cal.set(Calendar.MINUTE, minutes);
        long mill =  cal.getTimeInMillis()+daysToAddMilli;
        Log.d("getD", "emailtime " + mill);
        return mill;
    }

}
