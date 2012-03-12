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
import org.apache.cordova.api.CordovaInterface.*;
import org.apache.cordova.api.PluginResult.Status;

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
        Log.d("getD", "beginning of emailService");
        EmailSettings es = new EmailSettings();
        Intent intent = new Intent(context, EmailReceiver.class);
        PendingIntent pi = PendingIntent.getBroadcast(context, 12332, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        long interval = AlarmManager.INTERVAL_DAY*7; //One week
        long start = es.getNotificationtime();
        AlarmManager am = (AlarmManager) ctx.getSystemService(context.ALARM_SERVICE);
        am.setRepeating(AlarmManager.RTC_WAKEUP, start, interval, pi);
        Log.d("getD", "startEmailService");
    }

    //Doesn't work
    private void cancelSendMail() {
        Intent intent = new Intent(context, EmailReceiver.class);
        PendingIntent pi = PendingIntent.getBroadcast(context, 12332, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        AlarmManager am = (AlarmManager) ctx.getSystemService(context.ALARM_SERVICE);
        am.cancel(pi);

    }
}