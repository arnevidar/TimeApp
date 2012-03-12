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

package phonegap.plugins.android.emailSender;

import android.app.AlarmManager;
import android.os.SystemClock;
import com.punchmachine.email.EmailReceiver;
import com.punchmachine.filehandling.EmailSettings;
import org.json.JSONArray;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;
import com.phonegap.api.PluginResult.Status;

public class EmailSenderPlugin extends Plugin {
    //	Action to execute
    public static final String SEND_MAIL ="sendMail";
    public static final String CANCEL_MAIL = "cancelMail";

    private Context context;

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
        context = this.ctx.getApplicationContext();
        PluginResult result = null;
        if (SEND_MAIL.equalsIgnoreCase(action)) {
            startEmailService();
        } else if(CANCEL_MAIL.equals(action)) {
            cancelSendMail();
        }
        else {
            result = new PluginResult(Status.INVALID_ACTION);
            Log.d("EmailSenderPlugin", "Invalid action : "+action+" passed");
        }
        return result;
    }

    private void startEmailService() {
        SystemClock.sleep(800); //Email settings has to be written to file first
        EmailSettings es = new EmailSettings();
        Intent intent = new Intent(ctx, EmailReceiver.class);
        PendingIntent pi = PendingIntent.getBroadcast(ctx, 12332, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        long interval = AlarmManager.INTERVAL_DAY*7; //One week
        long start = es.getNotificationtime();
        AlarmManager am = (AlarmManager) ctx.getSystemService(ctx.ALARM_SERVICE);
        am.setRepeating(AlarmManager.RTC_WAKEUP, start, interval, pi);
    }

    //Doesn't work
    private void cancelSendMail() {
        Intent intent = new Intent(ctx, EmailReceiver.class);
        PendingIntent pi = PendingIntent.getBroadcast(ctx, 12332, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        AlarmManager am = (AlarmManager) ctx.getSystemService(ctx.ALARM_SERVICE);
        am.cancel(pi);

    }
}