package ai.mypocket.mobile;

import android.Manifest;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

/**
 * A single annual, local birthday greeting from Eva. No server, contacts,
 * exact-alarm permission, notification permission prompt or background process.
 * The optional account toggle respects Android notification permission.
 */
public final class ProfileBirthdayScheduler {
    static final String ACTION_FIRE="ai.mypocket.mobile.PROFILE_BIRTHDAY_FIRE";
    private static final String PREFS="pocket_user_profile";
    private static final String ENABLED="birthday_greeting_enabled";
    private static final String LAST_SENT="birthday_greeting_last_year";
    private static final String CHANNEL="pocket_profile_birthday";
    private static final int REQUEST=82091;
    private static final int NOTIFICATION_ID=82092;

    private ProfileBirthdayScheduler(){}

    // Matches Agenda's Feb 29 policy on non-leap years: celebrate on Feb 28.
    static LocalDate occurrence(int year,int month,int day){
        try {
            LocalDate first=LocalDate.of(year,month,1);
            return first.withDayOfMonth(Math.min(day,first.lengthOfMonth()));
        } catch(DateTimeException error){return null;}
    }

    private static PendingIntent pending(Context context,int flags){
        Intent intent=new Intent(context,AgendaReminderReceiver.class);
        intent.setAction(ACTION_FIRE);
        intent.setData(Uri.parse("pocketbirthday://self"));
        return PendingIntent.getBroadcast(context,REQUEST,intent,flags|PendingIntent.FLAG_IMMUTABLE);
    }

    static void reschedule(Context context){
        AlarmManager alarms=(AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        if(alarms==null)return;
        // Cancel an older birthday alarm when the user edits their birth date
        // or turns off birthday notifications.
        PendingIntent existing=pending(context,PendingIntent.FLAG_NO_CREATE);
        if(existing!=null){alarms.cancel(existing);existing.cancel();}
        SharedPreferences account=context.getSharedPreferences(PREFS,Context.MODE_PRIVATE);
        if(!account.getBoolean(ENABLED,true))return;
        String birth=account.getString("birth_date","");
        if(UserProfileDates.ageFromBirthDate(birth)==0)return;
        int month=Integer.parseInt(birth.substring(5,7)),day=Integer.parseInt(birth.substring(8,10));
        ZonedDateTime now=ZonedDateTime.now();
        int year=now.getYear();
        LocalDate date=occurrence(year,month,day);
        if(date==null)return;
        ZonedDateTime next=ZonedDateTime.of(date,LocalTime.of(9,0),ZoneId.systemDefault());
        if(!next.isAfter(now)){
            year++;
            date=occurrence(year,month,day);
            if(date==null)return;
            next=ZonedDateTime.of(date,LocalTime.of(9,0),ZoneId.systemDefault());
        }
        Intent fire=new Intent(context,AgendaReminderReceiver.class);
        fire.setAction(ACTION_FIRE);
        fire.setData(Uri.parse("pocketbirthday://self"));
        fire.putExtra("birth_date",birth);
        fire.putExtra("birthday_year",year);
        PendingIntent pi=PendingIntent.getBroadcast(context,REQUEST,fire,
            PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
        // Inexact by Android design; this is a morning greeting around 09:00.
        alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,next.toInstant().toEpochMilli(),pi);
    }

    static void fire(Context context,Intent intent){
        SharedPreferences account=context.getSharedPreferences(PREFS,Context.MODE_PRIVATE);
        if(!account.getBoolean(ENABLED,true))return;
        String birth=account.getString("birth_date","");
        if(!birth.equals(intent.getStringExtra("birth_date"))||UserProfileDates.ageFromBirthDate(birth)==0)return;
        ZonedDateTime now=ZonedDateTime.now();
        int year=now.getYear();
        if(intent.getIntExtra("birthday_year",-1)!=year)return;
        LocalDate birthday=occurrence(year,Integer.parseInt(birth.substring(5,7)),Integer.parseInt(birth.substring(8,10)));
        if(birthday==null||!birthday.equals(now.toLocalDate())||now.toLocalTime().isBefore(LocalTime.of(9,0)))return;
        // De-duplicate deliveries after repeated broadcasts or time changes.
        if(account.getInt(LAST_SENT,-1)==year)return;
        if(Build.VERSION.SDK_INT>=33&&
            ContextCompat.checkSelfPermission(context,Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)return;
        NotificationManager nm=(NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);
        if(nm==null)return;
        if(Build.VERSION.SDK_INT>=26){
            NotificationChannel channel=new NotificationChannel(CHANNEL,"Urări de ziua ta",NotificationManager.IMPORTANCE_DEFAULT);
            nm.createNotificationChannel(channel);
        }
        String name=account.getString("preferred_name","");
        name=name==null?"":name.trim();
        if(name.length()>50)name=name.substring(0,50);
        String language=context.getSharedPreferences("pocket_permissions",Context.MODE_PRIVATE)
            .getString("ui_language_native","ro");
        boolean ro="ro".equals(language);
        String title=ro?"🎂 La mulți ani"+(name.isEmpty()?"":", "+name)+"!":
            "🎂 Happy birthday"+(name.isEmpty()?"":", "+name)+"!";
        String message=ro?"Eva îți urează o zi minunată, plină de bucurii!":
            "Eva wishes you a lovely day full of happy moments!";
        Intent open=new Intent(context,AvatarLaunchActivity.class)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent tap=PendingIntent.getActivity(context,REQUEST,open,
            PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
        nm.notify(NOTIFICATION_ID,new NotificationCompat.Builder(context,CHANNEL)
            .setSmallIcon(R.mipmap.ic_launcher).setContentTitle(title)
            .setContentText(message).setStyle(new NotificationCompat.BigTextStyle().bigText(message))
            .setAutoCancel(true).setContentIntent(tap)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT).build());
        account.edit().putInt(LAST_SENT,year).apply();
    }
}
