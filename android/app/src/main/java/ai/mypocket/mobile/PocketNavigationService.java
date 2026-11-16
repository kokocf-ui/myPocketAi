package ai.mypocket.mobile;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.IBinder;
import android.os.SystemClock;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

/**
 * Foreground LOCATION service ONLY for an explicitly started navigation session.
 * No background WebView, chat, microphone, route recomputation or remote calls.
 * GPS updates remain in process memory and are never logged or persisted.
 */
public final class PocketNavigationService extends Service implements LocationListener {
    public static final String ACTION_START="ai.mypocket.mobile.NAV_START";
    public static final String ACTION_STOP="ai.mypocket.mobile.NAV_STOP";
    public static final String EXTRA_SESSION="navigation_session";
    public static final String EXTRA_DESTINATION="navigation_destination";
    public static final String EXTRA_MODE="navigation_mode";
    public static final String EXTRA_STEPS="navigation_steps";
    public static final String EXTRA_RESUME="navigation_resume";
    public static final String CHANNEL="pocket_active_navigation";
    public static final int NOTIFICATION_ID=6802;
    private LocationManager locationManager;
    private String sessionId="";
    private String destination="";
    private String mode="";
    private String steps="";
    public static String activeSession(){return activeService!=null&&activeService.active?activeService.sessionId:null;}
    public static String activeDestination(){return activeService!=null&&activeService.active?activeService.destination:null;}
    public static String activeSteps(){return activeService!=null&&activeService.active?activeService.steps:null;}
    private boolean active=false;
    private long lastNotice=0L;

    public static boolean isActive(){ return activeService!=null&&activeService.active; }
    private static volatile PocketNavigationService activeService=null;
    public static Intent startIntent(Context context,String session,String target,String travelMode,String routeSteps){
        return new Intent(context,PocketNavigationService.class).setAction(ACTION_START)
            .putExtra(EXTRA_SESSION,session).putExtra(EXTRA_DESTINATION,target)
            .putExtra(EXTRA_MODE,travelMode).putExtra(EXTRA_STEPS,routeSteps);
    }
    public static Intent stopIntent(Context context){
        return new Intent(context,PocketNavigationService.class).setAction(ACTION_STOP);
    }
    @Override public IBinder onBind(Intent intent){return null;}

    @Override public void onCreate(){
        super.onCreate();
        if(Build.VERSION.SDK_INT>=26){
            NotificationChannel channel=new NotificationChannel(CHANNEL,
                "Navigare în desfășurare",NotificationManager.IMPORTANCE_LOW);
            channel.setDescription("Se afișează numai când navigația este activă");
            NotificationManager nm=(NotificationManager)getSystemService(NOTIFICATION_SERVICE);
            if(nm!=null)nm.createNotificationChannel(channel);
        }
    }
    private boolean permitted(){
        return ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED
            ||ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_COARSE_LOCATION)==PackageManager.PERMISSION_GRANTED;
    }
    @Override public int onStartCommand(Intent intent,int flags,int startId){
        if(intent==null)return START_NOT_STICKY;
        if(ACTION_STOP.equals(intent.getAction())){
            stopNavigation();
            return START_NOT_STICKY;
        }
        if(!ACTION_START.equals(intent.getAction()))return START_NOT_STICKY;
        String id=intent.getStringExtra(EXTRA_SESSION);
        String target=intent.getStringExtra(EXTRA_DESTINATION);
        String kind=intent.getStringExtra(EXTRA_MODE);
        if(id==null||!id.matches("[A-Za-z0-9_-]{8,80}")
            ||target==null||target.isBlank()||target.length()>120
            ||kind==null||!kind.matches("walking|transit|mixed|driving")
            ||!permitted()){
            stopNavigation();return START_NOT_STICKY;
        }
        sessionId=id;destination=target;mode=kind;
        String described=intent.getStringExtra(EXTRA_STEPS);
        steps=described==null?"":described.substring(0,Math.min(2800,described.length()));
        try{
            if(Build.VERSION.SDK_INT>=29)
                startForeground(NOTIFICATION_ID,notification(),
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION);
            else startForeground(NOTIFICATION_ID,notification());
            active=true;activeService=this;
            requestLocation();
        }catch(SecurityException|IllegalStateException e){
            stopNavigation();
        }
        // User initiation is required on every journey. Do not restart silently.
        return START_NOT_STICKY;
    }
    private Notification notification(){
        Intent open=new Intent(this,MainActivity.class)
            .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP|Intent.FLAG_ACTIVITY_SINGLE_TOP)
            .putExtra(EXTRA_RESUME,true).putExtra(EXTRA_SESSION,sessionId);
        PendingIntent resume=PendingIntent.getActivity(this,810,
            open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
        PendingIntent stop=PendingIntent.getService(this,811,stopIntent(this),
            PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
        String content="Apasă pentru a reveni la traseul curent";
        return new NotificationCompat.Builder(this,CHANNEL)
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setContentTitle("Navigare activă · "+destination)
            .setContentText(content)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(
                "Navigarea "+(mode.equals("walking")?"pietonală":"cu transport")+
                " este activă. Apasă pentru traseul curent."))
            .setContentIntent(resume)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel,"Oprește navigația",stop)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setOngoing(true).setOnlyAlertOnce(true).setPriority(NotificationCompat.PRIORITY_LOW)
            .build();
    }
    private void requestLocation(){
        if(!permitted())return;
        locationManager=(LocationManager)getSystemService(LOCATION_SERVICE);
        if(locationManager==null)return;
        try{
            String provider=null;
            if(locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
                &&ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED)
                provider=LocationManager.GPS_PROVIDER;
            else if(locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER))
                provider=LocationManager.NETWORK_PROVIDER;
            if(provider!=null)locationManager.requestLocationUpdates(provider,5000L,12f,this);
        }catch(SecurityException|IllegalArgumentException ignored){
            // Keep notification/session; never invent device position.
        }
    }
    @Override public void onLocationChanged(Location location){
        // Privacy: never store, transmit or log location. A native routing engine
        // can consume these ephemeral coordinates in a future reviewed change.
        lastNotice=SystemClock.elapsedRealtime();
    }
    private void stopNavigation(){
        active=false;
        if(activeService==this)activeService=null;
        if(locationManager!=null){
            try{locationManager.removeUpdates(this);}catch(SecurityException ignored){}
            locationManager=null;
        }
        stopForeground(STOP_FOREGROUND_REMOVE);
        stopSelf();
    }
    @Override public void onDestroy(){
        active=false;
        if(activeService==this)activeService=null;
        if(locationManager!=null){
            try{locationManager.removeUpdates(this);}catch(SecurityException ignored){}
            locationManager=null;
        }
        super.onDestroy();
    }
}
