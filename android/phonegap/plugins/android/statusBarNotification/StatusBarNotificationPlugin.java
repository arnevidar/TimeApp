/*
*
* Copyright (C) 2011 Dmitry Savchenko <dg.freak@gmail.com>
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*
*/

package phonegap.plugins.android.statusBarNotification;

import android.app.AlarmManager;
import android.os.SystemClock;
import com.punchmachine.filehandling.NotificationSettings;
import com.punchmachine.notification.NotificationReceiver;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.PendingIntent;
import android.content.Intent;
import android.util.Log;
import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;
import com.phonegap.api.PluginResult.Status;

import java.util.Calendar;

public class StatusBarNotificationPlugin extends Plugin {
    //	Action to execute
    public static final String ACTION="notify";
    public static final String DAILY_NOTI = "dailyNotification";
    public static final String CANCEL_DAILY ="cancelDaily";

    /**
     * 	Executes the request and returns PluginResult
     *
     * 	@param action		Action to execute
     * 	@param data			JSONArray of arguments to the plugin
     *  @param callbackId	The callback id used when calling back into JavaScript
     *
     *  @return				A PluginRequest object with a status
     * */
    @Override
    public PluginResult execute(String action, JSONArray data, String callbackId) {

        PluginResult result = null;
        if (ACTION.equals(action)) {
            try {
                String title = data.getString(0);
                String body = data.getString(1);

                showNotification(title, body);
                result = new PluginResult(Status.OK);
            } catch (JSONException jsonEx) {
                Log.d("NotificationPlugin", "Got JSON Exception "
                        + jsonEx.getMessage());
                result = new PluginResult(Status.JSON_EXCEPTION);
            }
        } else if(DAILY_NOTI.equalsIgnoreCase(action)) {
             dailyNotification();
        } else if(CANCEL_DAILY.equalsIgnoreCase(action)) {
            cancelDailyNotification();
        }
        else {
            result = new PluginResult(Status.INVALID_ACTION);
            Log.d("NotificationPlugin", "Invalid action : "+action+" passed");
        }
        return result;
    }

    /**
     * 	Displays status bar notification once
     *
     * 	@param contentTitle	Notification title
     *  @param contentText	Notification text
     * */
    public void showNotification( CharSequence contentTitle, CharSequence contentText) {
        Intent intent = new Intent(ctx, NotificationReceiver.class);
        intent.putExtra("contentTitle", contentTitle);
        intent.putExtra("contentText", contentText);
        intent.putExtra("typeNoti", NotificationReceiver.ONE_TIME);
        PendingIntent pi = PendingIntent.getBroadcast(ctx, 12345, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, 1);
        AlarmManager am = (AlarmManager) ctx.getSystemService(ctx.ALARM_SERVICE);
        am.set(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);

    }

    /**
     * Used for daily notification.
     * Will appear if there's not enough hours
     * registered this week.
     */
    private void dailyNotification() {
        SystemClock.sleep(800); //The notification settings has to be written to file first.
        Intent intent = new Intent(ctx, NotificationReceiver.class);
        intent.putExtra("contentTitle", "Missing hours");
        intent.putExtra("contentText", "Please register more hours this week");
        intent.putExtra("typeNoti", NotificationReceiver.EVERY_DAY);
        PendingIntent pi = PendingIntent.getBroadcast(ctx, 1234, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        long start = new NotificationSettings().getNotificationTime();
        AlarmManager am = (AlarmManager) ctx.getSystemService(ctx.ALARM_SERVICE);
        am.setRepeating(AlarmManager.RTC_WAKEUP, start, AlarmManager.INTERVAL_DAY, pi);

    }


    //Doesn't work
    private void cancelDailyNotification() {
        Intent intent = new Intent(ctx, NotificationReceiver.class);
        PendingIntent pi = PendingIntent.getBroadcast(ctx, 1234, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        AlarmManager am = (AlarmManager) ctx.getSystemService(ctx.ALARM_SERVICE);
        am.cancel(pi);
    }

}