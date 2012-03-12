package com.punchmachine.email;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;
import com.punchmachine.filehandling.EmailSettings;
import com.punchmachine.notification.NotificationBar;


public class EmailReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("getD", "in Emailreceiver");
        if(new EmailSettings().getOnorOff().equalsIgnoreCase("on")) {
            if(checkInternet(context)) {
                new MailSender().sendWeekReport();
            } else {
                CharSequence title = "Emailreport failed";
                CharSequence body = "Please connet to Internet";
                new NotificationBar().showNotification(intent, context, title, body);

                Intent theIntent = new Intent(context, InternetListenerService.class);
                context.startService(theIntent);
            }
        }

    }

    private boolean checkInternet(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetInfo = connectivityManager.getActiveNetworkInfo();
        if (activeNetInfo != null) {
            return true;
        }
        return false;
    }
}

