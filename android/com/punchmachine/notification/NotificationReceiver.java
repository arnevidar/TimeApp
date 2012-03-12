package com.punchmachine.notification;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import com.punchmachine.PunchMachineActivity;
import com.punchmachine.filehandling.NotificationSettings;
import com.punchmachine.filehandling.TimeAppData;

import java.util.Calendar;


public class NotificationReceiver extends BroadcastReceiver {
    public static final int ONE_TIME = 0;
    public static final int EVERY_DAY = 1;

    
    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle contents = intent.getExtras();
        int typeNoti = contents.getInt("typeNoti");
        CharSequence title = contents.getString("contentTitle");
        CharSequence body = contents.getString("contentText");
        Intent myActivityIntent = new Intent(context, PunchMachineActivity.class);
        NotificationBar nb = new NotificationBar();
        if(typeNoti == ONE_TIME) {
            nb.showNotification(myActivityIntent, context, title, body);

        } else if(typeNoti == EVERY_DAY) {
            Boolean[] daysStatus = new NotificationSettings().getDaysStatus();
            Calendar todaysDate = Calendar.getInstance();
            int dayNumber = todaysDate.get(Calendar.DAY_OF_WEEK)-1;
            if(daysStatus[dayNumber]) {
                if(new TimeAppData().toNotifyOrNot(todaysDate, dayNumber)) {
                    nb.showNotification(myActivityIntent, context, title, body);
                }
            }
        }
    }
}

