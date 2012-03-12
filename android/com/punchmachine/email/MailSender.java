package com.punchmachine.email;


import android.util.Log;
import com.punchmachine.filehandling.EmailSettings;
import com.punchmachine.filehandling.TimeAppData;

import java.util.Calendar;

public class MailSender {
   private EmailSettings es = new EmailSettings();
    
    
    public void sendWeekReport() {
        TimeAppData timeAppData = new TimeAppData();

        Calendar toDate = Calendar.getInstance();
        toDate.add(Calendar.DAY_OF_MONTH, -1);
        Calendar fromDate = Calendar.getInstance();
        fromDate.setTime(toDate.getTime());
        fromDate.add(Calendar.DAY_OF_MONTH, -6);

        String body = timeAppData.getEmailBody(fromDate, toDate);
        String subject = "Registrered hours last week";
        String senderMail = es.getSender();
        String pass = es.getSenderPassword();
        Log.d("getD", "mail " + senderMail);
        Log.d("getD", "password " + pass);

        try {
            GMailSender sender = new GMailSender(senderMail, pass);
            sender.sendMail(subject,
                    body,
                    es.getRecipient());
        } catch (Exception e) {
            Log.e("SendMail", e.getMessage(), e);
        }
    }
    
    public void sendMail(String subject, String body) {
        try {
            GMailSender sender = new GMailSender(es.getSender(), es.getSenderPassword());
            sender.sendMail(subject,
                    body,
                    es.getRecipient());
        } catch (Exception e) {
            Log.e("SendMail", e.getMessage(), e);
        }
    }
    
}
