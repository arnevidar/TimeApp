package com.punchmachine.notification;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import com.punchmachine.R;

public class NotificationBar {

    public void showNotification(Intent intent, Context context, CharSequence title, CharSequence body) {
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        int icon = R.drawable.notification;
        long when = System.currentTimeMillis();
        PendingIntent notiIntent = PendingIntent.getActivity(context, 0, intent, 0);

        Notification notification = new Notification(icon, title, when);
        notification.setLatestEventInfo(context, title, body, notiIntent);
        nm.notify(1, notification);
    }
}
