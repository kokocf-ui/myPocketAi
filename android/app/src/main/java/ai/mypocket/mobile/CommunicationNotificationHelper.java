package ai.mypocket.mobile;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

/**
 * Presentation layer for secure incoming communication notifications.
 * Oracle push transport will invoke this after a verified device push is received.
 * This class does NOT poll for messages or claim push is active by itself.
 */
public final class CommunicationNotificationHelper {
    static final String CHANNEL = "pocket_communication_events";
    static final String EXTRA_KIND = "communication_notification_kind";
    static final String EXTRA_TARGET = "communication_notification_target";

    private CommunicationNotificationHelper(){}

    public static void show(Context context,String kind,String targetId){
        if(context==null)return;
        if(!"message".equals(kind)&&!"list".equals(kind)&&!"invite".equals(kind))return;
        if(targetId==null || !targetId.matches("[A-Za-z0-9_-]{1,150}"))return;
        if(Build.VERSION.SDK_INT>=33 &&
            ContextCompat.checkSelfPermission(context,Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED)return;

        NotificationManager manager=(NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);
        if(manager==null)return;
        if(Build.VERSION.SDK_INT>=26){
            NotificationChannel channel=new NotificationChannel(CHANNEL,"Comunicare",
                NotificationManager.IMPORTANCE_DEFAULT);
            channel.setDescription("Mesaje și liste partajate din myPocketAI");
            manager.createNotificationChannel(channel);
        }
        Intent intent=new Intent(context,MainActivity.class);
        intent.putExtra(EXTRA_KIND,kind);
        intent.putExtra(EXTRA_TARGET,targetId);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP|Intent.FLAG_ACTIVITY_SINGLE_TOP);
        int notificationId=(kind+"|"+targetId).hashCode()&0x7fffffff;
        PendingIntent pending=PendingIntent.getActivity(context,notificationId,intent,
            PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
        String title="myPocketAI · Comunicare";
        String body="message".equals(kind)?"Ai primit un mesaj privat.":
            "list".equals(kind)?"Ai primit o listă de cumpărături partajată.":
                "Ai primit o invitație de conectare.";
        NotificationCompat.Builder note=new NotificationCompat.Builder(context,CHANNEL)
            .setSmallIcon(android.R.drawable.ic_dialog_email)
            .setContentTitle(title).setContentText(body).setAutoCancel(true)
            .setContentIntent(pending).setCategory(NotificationCompat.CATEGORY_MESSAGE)
            .setVisibility(NotificationCompat.VISIBILITY_PRIVATE);
        manager.notify(notificationId,note.build());
    }
}
