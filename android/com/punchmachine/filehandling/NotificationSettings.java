package com.punchmachine.filehandling;

import android.os.Environment;
import android.util.Log;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.Charset;
import java.util.Calendar;

public class NotificationSettings {
    private String path ="TimeApp/notificationsettings.json";
    private JSONObject jsonObject = null;

    public NotificationSettings() {
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
                    Log.e("NotificationSettings.java, readFile", ioe.toString());
                }
            }
        }

    }
    
    public Boolean[] getDaysStatus() {
        Boolean[] daysStatus = new Boolean[7];
        try {
            daysStatus[0] = jsonObject.getBoolean("sunday");
            daysStatus[1] = jsonObject.getBoolean("monday");
            daysStatus[2] = jsonObject.getBoolean("tuesday");
            daysStatus[3] = jsonObject.getBoolean("wednesday");
            daysStatus[4] = jsonObject.getBoolean("thursday");
            daysStatus[5] = jsonObject.getBoolean("friday");
            daysStatus[6] = jsonObject.getBoolean("saturday");

        }catch (JSONException je) {
            Log.e("getDaysStatus", je.toString());

        }
        return daysStatus;
    }

    public long getNotificationTime() {
        String date = "";
        try {
            date = jsonObject.get("time").toString();
        } catch (JSONException je) {
            Log.e("Notificationsettings, getNotificationTime()", je.toString());
        }
        
        String[] values = date.split(":");
        int hours = Integer.parseInt(values[0]);
        int minutes = Integer.parseInt(values[1]);
        Log.d("getD", "time " + hours);
        Log.d("getD", "minutt " + minutes);
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, hours);
        cal.set(Calendar.MINUTE,minutes);
        return cal.getTimeInMillis();
    }

    


  

}
