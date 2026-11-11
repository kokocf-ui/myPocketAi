package ai.mypocket.mobile;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Receives reminders even when the Pocket AI activity is not running. */
public final class AgendaReminderReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context context,Intent intent){
        String action=intent==null?"":intent.getAction();
        if(AgendaReminderScheduler.ACTION_FIRE.equals(action))
            AgendaReminderScheduler.display(context,intent);
        else if(ProfileBirthdayScheduler.ACTION_FIRE.equals(action))
            ProfileBirthdayScheduler.fire(context,intent);
        // Restore both user events and the optional profile greeting after
        // reboot, timezone/time changes or delivery; no duplicate alarms.
        AgendaReminderScheduler.reschedule(context);
        ProfileBirthdayScheduler.reschedule(context);
    }
}
