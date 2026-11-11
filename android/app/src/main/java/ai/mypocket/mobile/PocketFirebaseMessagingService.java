package ai.mypocket.mobile;

import android.content.Context;
import android.content.SharedPreferences;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

/** Receives private, data-only FCM events. No plaintext messages or contacts. */
public final class PocketFirebaseMessagingService extends FirebaseMessagingService {
    static final String PREFS="pocket_fcm_token";
    static final String KEY="registration_token";

    static String savedToken(Context context){
        return context.getSharedPreferences(PREFS,Context.MODE_PRIVATE).getString(KEY,"");
    }

    @Override public void onNewToken(String token){
        super.onNewToken(token);
        if(token!=null&&token.length()>=24&&token.length()<=4096)
            getSharedPreferences(PREFS,Context.MODE_PRIVATE).edit().putString(KEY,token).apply();
        // MainActivity sends the token via the signed Oracle API when the user opens Comunicare.
    }

    @Override public void onMessageReceived(RemoteMessage remote){
        if(remote==null)return;
        var data=remote.getData();
        if(!"mypocketai_oracle".equals(data.get("source")))return;
        String kind=data.get("kind"),target=data.get("target");
        if(kind==null||target==null)return;
        if(!target.matches("[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}"))return;
        if(!kind.matches("message|list|invite"))return;
        CommunicationNotificationHelper.show(this,kind,target);
    }
}
