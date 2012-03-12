package com.punchmachine.email;

import android.app.*;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.IBinder;
import android.os.SystemClock;
import com.punchmachine.notification.NotificationBar;


public class InternetListenerService extends IntentService {
    private long sleep10Minutes = 10*60*1000; //10 minutes in milliseconds

    public InternetListenerService() {
        super("InternetListenerService");
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
    
    @Override
    protected void onHandleIntent(Intent intent) {

        while(!checkInternet()) {
            SystemClock.sleep(sleep10Minutes);
            CharSequence title = "Email report failed";
            CharSequence body = "Please connect to the Internet";
            new NotificationBar().showNotification(intent, this, title, body);
        }
        new MailSender().sendWeekReport();
        stopSelf();

    }

    @Override
    public void onCreate() {
        super.onCreate();

    }


    @Override
    public void onStart(Intent intent, int startid) {
        super.onStart(intent, startid);

    }

    private boolean checkInternet() {
        boolean internet = false;
        ConnectivityManager connectivityManager = (ConnectivityManager)getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetInfo = connectivityManager.getActiveNetworkInfo();
        if (activeNetInfo != null) {
            internet = true;
        }
        return internet;
    }
    
    @Override
    public void onDestroy() {
        super.onDestroy();
    }

}
