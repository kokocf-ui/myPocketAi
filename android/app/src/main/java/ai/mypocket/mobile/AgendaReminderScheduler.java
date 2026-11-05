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
import org.json.JSONArray;
import org.json.JSONObject;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

/** Resilient device reminders. No network or background WebView required. */
public final class AgendaReminderScheduler {
    static final String PREFS="pocket_agenda_reminders";
    static final String CONTENT="events_json";
    static final String KEYS="scheduled_keys";
    static final String CHANNEL="pocket_agenda_events";
    static final String ACTION_FIRE="ai.mypocket.mobile.AGENDA_REMINDER_FIRE";
    private AgendaReminderScheduler(){}

    static void sync(Context context,String json){
        if(json==null||json.length()>200000)return;
        try{
            JSONArray events=new JSONArray(json);
            context.getSharedPreferences(PREFS,Context.MODE_PRIVATE).edit().putString(CONTENT,events.toString()).apply();
            reschedule(context);
        }catch(Exception ignored){}
    }

    static void reschedule(Context context){
        SharedPreferences p=context.getSharedPreferences(PREFS,Context.MODE_PRIVATE);
        AlarmManager alarm=(AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        if(alarm==null)return;
        Set<String> previous=new HashSet<>(p.getStringSet(KEYS,new HashSet<>()));
        for(String key:previous){
            PendingIntent pending=pending(context,key,null,PendingIntent.FLAG_NO_CREATE);
            if(pending!=null){alarm.cancel(pending);pending.cancel();}
        }
        Set<String> keys=new HashSet<>();
        try{
            JSONArray events=new JSONArray(p.getString(CONTENT,"[]"));
            ZonedDateTime now=ZonedDateTime.now();
            for(int i=0;i<events.length()&&i<1500;i++){
                JSONObject e=events.optJSONObject(i);
                if(e==null)continue;
                String title=e.optString("title","").trim();
                String id=e.optString("id","").trim();
                if(title.isEmpty()||id.isEmpty())continue;
                if(title.length()>140)title=title.substring(0,140);
                boolean birthday="birthday".equals(e.optString("kind",""));
                ZonedDateTime event;
                if(birthday){
                    int m=e.optInt("birthdayMonth",-1),d=e.optInt("birthdayDay",-1);
                    if(m<1||m>12||d<1||d>31)continue;
                    LocalDate check=LocalDate.of(2000,m,1);
                    if(d>check.lengthOfMonth())continue;
                    // Birthdays are all-day; 9 AM is the reminder reference time.
                    event=birthdayOccurrence(now.getYear(),m,d,now.getZone());
                    if(!event.isAfter(now.minusDays(1)))event=birthdayOccurrence(now.getYear()+1,m,d,now.getZone());
                }else{
                    try{event=Instant.parse(e.getString("when")).atZone(ZoneId.systemDefault());}
                    catch(Exception ex){continue;}
                    if(event.isBefore(now))continue;
                }
                // Previous evening at 19:00 local time and two hours beforehand.
                ZonedDateTime evening=ZonedDateTime.of(event.toLocalDate().minusDays(1),LocalTime.of(19,0),ZoneId.systemDefault());
                ZonedDateTime twoHours=event.minusHours(2);
                scheduleFuture(context,alarm,keys,id,"evening",title,event,evening,now,birthday);
                scheduleFuture(context,alarm,keys,id,"two-hours",title,event,twoHours,now,birthday);
                if(birthday){
                    // Once this year's reminder has elapsed, prepare next year's same reminder.
                    ZonedDateTime next=birthdayOccurrence(event.getYear()+1,e.optInt("birthdayMonth"),e.optInt("birthdayDay"),ZoneId.systemDefault());
                    if(!evening.isAfter(now))scheduleFuture(context,alarm,keys,id,"evening",title,next,ZonedDateTime.of(next.toLocalDate().minusDays(1),LocalTime.of(19,0),ZoneId.systemDefault()),now,true);
                    if(!twoHours.isAfter(now))scheduleFuture(context,alarm,keys,id,"two-hours",title,next,next.minusHours(2),now,true);
                }
            }
        }catch(Exception ignored){}
        p.edit().putStringSet(KEYS,keys).apply();
    }

    private static ZonedDateTime birthdayOccurrence(int year,int month,int day,ZoneId zone){
        LocalDate first=LocalDate.of(year,month,1);
        return ZonedDateTime.of(first.withDayOfMonth(Math.min(day,first.lengthOfMonth())),LocalTime.of(9,0),zone);
    }

    private static PendingIntent pending(Context context,String key,Intent template,int flags){
        Intent intent=template==null?new Intent(context,AgendaReminderReceiver.class):template;
        intent.setAction(ACTION_FIRE);
        intent.setData(Uri.parse("pocketagenda://reminder/"+Uri.encode(key)));
        return PendingIntent.getBroadcast(context,key.hashCode(),intent,flags|PendingIntent.FLAG_IMMUTABLE);
    }

    private static void scheduleFuture(Context context,AlarmManager alarm,Set<String> keys,String id,String type,String title,ZonedDateTime event,ZonedDateTime trigger,ZonedDateTime now,boolean birthday){
        if(!trigger.isAfter(now))return;
        String key=id+":"+type;
        Intent intent=new Intent(context,AgendaReminderReceiver.class);
        intent.putExtra("title",title);
        intent.putExtra("type",type);
        intent.putExtra("birthday",birthday);
        intent.putExtra("eventAt",event.toInstant().toEpochMilli());
        PendingIntent pi=pending(context,key,intent,PendingIntent.FLAG_UPDATE_CURRENT);
        // Inexact while-idle alarms work without Android's restricted exact-alarm permission.
        alarm.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,trigger.toInstant().toEpochMilli(),pi);
        keys.add(key);
    }

    static void display(Context context,Intent intent){
        if(Build.VERSION.SDK_INT>=33&&ContextCompat.checkSelfPermission(context,Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)return;
        NotificationManager manager=(NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);
        if(manager==null)return;
        if(Build.VERSION.SDK_INT>=26)manager.createNotificationChannel(new NotificationChannel(CHANNEL,"Agenda Pocket AI",NotificationManager.IMPORTANCE_DEFAULT));
        boolean birthday=intent.getBooleanExtra("birthday",false);
        String title=intent.getStringExtra("title");if(title==null||title.isEmpty())return;
        String type=intent.getStringExtra("type");
        String message="evening".equals(type)?"Mâine: ":"În aproximativ două ore: ";
        if(birthday)message="evening".equals(type)?"Mâine este ziua de naștere: ":"Astăzi este ziua de naștere: ";
        Intent open=new Intent(context,AvatarLaunchActivity.class);
        open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent tap=PendingIntent.getActivity(context,0,open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
        int notificationId=String.valueOf(intent.getData()).hashCode();
        manager.notify(notificationId,new NotificationCompat.Builder(context,CHANNEL)
            .setSmallIcon(R.mipmap.ic_launcher).setContentTitle("Pocket AI · Agenda")
            .setContentText(message+title).setStyle(new NotificationCompat.BigTextStyle().bigText(message+title))
            .setAutoCancel(true).setContentIntent(tap).setPriority(NotificationCompat.PRIORITY_DEFAULT).build());
    }
}
