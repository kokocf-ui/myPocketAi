package ai.mypocket.mobile;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Receives reminders even when the Pocket AI activity is not running. */
public final class AgendaReminderReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context context,Intent intent){
        if(AgendaReminderScheduler.ACTION_FIRE.equals(intent.getAction())){
            AgendaReminderScheduler.display(context,intent);
        }
        // Restore after reboot, timezone changes, and recurring birthday delivery.
        AgendaReminderScheduler.reschedule(context);
    }
}
