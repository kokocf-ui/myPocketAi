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
import android.os.Bundle;
import android.os.IBinder;
import android.speech.tts.TextToSpeech;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

/**
 * Explicitly started, user-visible GPS navigation session.
 * Runs independently of the WebView and keeps speaking with the screen off.
 * It never invents turns: speech comes only from verified walking route steps.
 * Force-stop, OS revocation and lost positioning can still interrupt guidance.
 */
public final class PocketNavigationService extends Service implements LocationListener, TextToSpeech.OnInitListener {
    public static final String ACTION_START="ai.mypocket.mobile.NAVIGATION_START";
    public static final String ACTION_OPEN_NAVIGATION="ai.mypocket.mobile.OPEN_ACTIVE_NAVIGATION";
    public static final String ACTION_STOP="ai.mypocket.mobile.NAVIGATION_STOP";
    public static final String ACTION_REPEAT="ai.mypocket.mobile.NAVIGATION_REPEAT";
    public static final String ACTION_MUTE="ai.mypocket.mobile.NAVIGATION_MUTE";
    public static final String EXTRA_JOURNEY="journey";
    private static final String CHANNEL="pocket_navigation_active";
    private static final String PREFS="pocket_navigation_session";
    private static final int NOTIFICATION_ID=20311;
    private LocationManager locations;
    private TextToSpeech speech;
    private boolean speechReady=false,muted=false,started=false;
    private final ArrayList<WalkingLeg> legs=new ArrayList<>();
    private final Set<String> announced=new HashSet<>();
    private int activeLeg=-1;
    private String destination="",language="ro",lastInstruction="",navigationMode="walk";
    private long lastSpokenAt=0;

    private static final class Point {
        final double lat,lon;
        Point(double lat,double lon){this.lat=lat;this.lon=lon;}
    }
    private static final class Maneuver {
        final double along;
        final String text;
        Maneuver(double along,String text){this.along=along;this.text=text;}
    }
    private static final class WalkingLeg {
        final int index;
        final String from,to;
        final ArrayList<Point> points=new ArrayList<>();
        final ArrayList<Maneuver> maneuvers=new ArrayList<>();
        double totalMeters=0;
        WalkingLeg(int index,String from,String to){this.index=index;this.from=from;this.to=to;}
    }
    @Override public void onCreate(){
        super.onCreate();
        locations=(LocationManager)getSystemService(Context.LOCATION_SERVICE);
        speech=new TextToSpeech(getApplicationContext(),this);
        NotificationManager manager=(NotificationManager)getSystemService(NOTIFICATION_SERVICE);
        manager.createNotificationChannel(new NotificationChannel(CHANNEL,"Navigație activă",NotificationManager.IMPORTANCE_LOW));
    }
    private Notification notification(){
        Intent open=new Intent(this,MainActivity.class).setAction(ACTION_OPEN_NAVIGATION);
        open.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP|Intent.FLAG_ACTIVITY_SINGLE_TOP|Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        PendingIntent toApp=PendingIntent.getActivity(this,20,open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
        Intent stop=new Intent(this,PocketNavigationService.class).setAction(ACTION_STOP);
        PendingIntent stopIntent=PendingIntent.getService(this,21,stop,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
        return new NotificationCompat.Builder(this,CHANNEL)
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setContentTitle("Eva • navigație GPS activă")
            .setContentText(destination.isEmpty()?(navigationMode.equals("drive")?"Traseu auto în curs":"Traseu pietonal în curs"):destination)
            .setContentIntent(toApp).setOngoing(true).setOnlyAlertOnce(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel,"Încheie",stopIntent)
            .build();
    }
    private boolean hasLocation(){
        return ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED||
            ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_COARSE_LOCATION)==PackageManager.PERMISSION_GRANTED;
    }
    @Override public int onStartCommand(Intent intent,int flags,int startId){
        String action=intent==null?null:intent.getAction();
        if(ACTION_STOP.equals(action)){shutdown();return START_NOT_STICKY;}
        if(ACTION_REPEAT.equals(action)){if(!lastInstruction.isEmpty())say(lastInstruction);return START_STICKY;}
        if(ACTION_MUTE.equals(action)){muted=!muted;if(muted&&speech!=null)speech.stop();return START_STICKY;}
        if(!ACTION_START.equals(action)&&!started){
            String saved=getSharedPreferences(PREFS,MODE_PRIVATE).getString("journey","");
            if(saved.isEmpty()){stopSelf();return START_NOT_STICKY;}
            begin(saved);return started?START_STICKY:START_NOT_STICKY;
        }
        if(ACTION_START.equals(action)){
            String payload=intent.getStringExtra(EXTRA_JOURNEY);
            begin(payload);return started?START_STICKY:START_NOT_STICKY;
        }
        return START_STICKY;
    }
    private void begin(String payload){
        if(!hasLocation()||payload==null||payload.length()>250000){shutdown();return;}
        try{
            JSONObject json=new JSONObject(payload);
            JSONArray stages=json.optJSONArray("walkingLegs");
            if(stages==null||stages.length()==0||stages.length()>30)throw new IllegalArgumentException("No verified route geometry");
            legs.clear();announced.clear();activeLeg=-1;muted=false;
            language=json.optString("language","ro");
            navigationMode="drive".equals(json.optString("navigationMode"))?"drive":"walk";
            destination=json.optString("destination","").trim();
            if(destination.length()>160)destination=destination.substring(0,160);
            for(int i=0;i<stages.length();i++){
                JSONObject raw=stages.optJSONObject(i);if(raw==null)continue;
                WalkingLeg stage=new WalkingLeg(raw.optInt("index",i),
                    raw.optString("from",""),raw.optString("to",""));
                JSONArray path=raw.optJSONArray("coordinates");
                if(path==null||path.length()<2||path.length()>3000)continue;
                for(int k=0;k<path.length();k++){
                    JSONArray pair=path.optJSONArray(k);
                    if(pair==null||pair.length()<2)continue;
                    double lon=pair.optDouble(0,Double.NaN),lat=pair.optDouble(1,Double.NaN);
                    if(Double.isFinite(lat)&&Double.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180)
                        stage.points.add(new Point(lat,lon));
                }
                if(stage.points.size()<2)continue;
                for(int k=1;k<stage.points.size();k++)stage.totalMeters+=meters(stage.points.get(k-1),stage.points.get(k));
                if(stage.totalMeters<5||stage.totalMeters>(navigationMode.equals("drive")?2500000:100000))continue;
                JSONArray instructions=raw.optJSONArray("steps");double along=0;
                if(instructions!=null){
                    for(int j=0;j<instructions.length()&&j<100;j++){
                        JSONObject step=instructions.optJSONObject(j);if(step==null)continue;
                        String phrase=step.optString("text","").trim();
                        if(!phrase.isEmpty()&&phrase.length()<=180&&along<=stage.totalMeters+80)
                            stage.maneuvers.add(new Maneuver(along,phrase));
                        along+=Math.max(0,Math.min(50000,step.optDouble("distanceMeters",0)));
                    }
                }
                legs.add(stage);
            }
            if(legs.isEmpty())throw new IllegalArgumentException("No validated route geometry");
            // Android 14+ requires an active visible Activity and a granted
            // while-in-use location permission BEFORE starting this service.
            if(Build.VERSION.SDK_INT>=29)startForeground(NOTIFICATION_ID,notification(),ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION);
            else startForeground(NOTIFICATION_ID,notification());
            started=true;
            getSharedPreferences(PREFS,MODE_PRIVATE).edit().putString("journey",payload).putBoolean("active",true).apply();
            locations.removeUpdates(this);
            boolean registered=false;
            if(locations.isProviderEnabled(LocationManager.GPS_PROVIDER)){
                locations.requestLocationUpdates(LocationManager.GPS_PROVIDER,1500L,4f,this);registered=true;
            }
            if(!registered&&locations.isProviderEnabled(LocationManager.NETWORK_PROVIDER)){
                locations.requestLocationUpdates(LocationManager.NETWORK_PROVIDER,2500L,6f,this);registered=true;
            }
            if(!registered)lastInstruction="GPS indisponibil. Verifică serviciile de locație.";
            else say(language.equals("ro")?"Navigația cu Eva este activă.":"Eva navigation is active.");
        }catch(Exception failure){
            android.util.Log.w("PocketNavigation","Navigation could not start",failure);
            shutdown();
        }
    }
    private static double meters(Point a,Point b){
        double dy=(b.lat-a.lat)*111320;
        double dx=(b.lon-a.lon)*111320*Math.cos(Math.toRadians((a.lat+b.lat)/2));
        return Math.hypot(dx,dy);
    }
    private static final class Projection {
        final double away,along;
        Projection(double away,double along){this.away=away;this.along=along;}
    }
    private static Projection project(WalkingLeg leg,Point pos){
        double travel=0,best=Double.POSITIVE_INFINITY,along=0;
        for(int i=1;i<leg.points.size();i++){
            Point a=leg.points.get(i-1),b=leg.points.get(i);
            double scale=111320*Math.cos(Math.toRadians(pos.lat));
            double dx=(b.lon-a.lon)*scale,dy=(b.lat-a.lat)*111320;
            double px=(pos.lon-a.lon)*scale,py=(pos.lat-a.lat)*111320;
            double size=dx*dx+dy*dy,t=size>0?Math.max(0,Math.min(1,(px*dx+py*dy)/size)):0;
            double away=Math.hypot(px-dx*t,py-dy*t),length=Math.sqrt(size);
            if(away<best){best=away;along=travel+length*t;}
            travel+=length;
        }
        return new Projection(best,along);
    }
    private String localize(String text){
        if(!"ro".equals(language))return text;
        return text.replaceAll("(?i)^turn right","Virați la dreapta")
            .replaceAll("(?i)^turn left","Virați la stânga")
            .replaceAll("(?i)^continue straight","Mergeți înainte")
            .replaceAll("(?i)^keep right","Țineți dreapta")
            .replaceAll("(?i)^keep left","Țineți stânga");
    }
    private String spokenRouteLengthKm(double meters){
        double km=Math.max(0,meters)/1000.0;
        int decimalPlaces=km<1?2:1;
        Locale locale=Locale.forLanguageTag("ro".equals(language)?"ro-RO":"en-GB");
        return String.format(locale,"%."+decimalPlaces+"f",km)+
            ("ro".equals(language)?" kilometri":" kilometres");
    }
    private void say(String text){
        if(text==null||text.isEmpty())return;
        lastInstruction=text;if(muted)return;
        if(!speechReady)return;
        long now=System.currentTimeMillis();
        if(now-lastSpokenAt<3500)return;
        lastSpokenAt=now;
        speech.speak(text,TextToSpeech.QUEUE_FLUSH,null,"pocket-guide-"+now);
    }
    @Override public void onLocationChanged(Location fix){
        if(!started||fix==null||!fix.hasAccuracy()||fix.getAccuracy()>35||
           Math.abs(System.currentTimeMillis()-fix.getTime())>30000)return;
        Point here=new Point(fix.getLatitude(),fix.getLongitude());
        WalkingLeg closest=null;Projection nearest=null;int index=-1;
        for(int i=0;i<legs.size();i++){
            WalkingLeg leg=legs.get(i);Projection p=project(leg,here);
            if(nearest==null||p.away<nearest.away){nearest=p;closest=leg;index=i;}
        }
        if(nearest==null||nearest.away>Math.max(50,fix.getAccuracy()*2))return;
        if(activeLeg!=index){activeLeg=index;announced.clear();
            say(("ro".equals(language)?
                (navigationMode.equals("drive")?"Urmează traseul auto către ":"Începe mersul pe jos către "):
                (navigationMode.equals("drive")?"Follow the driving route towards ":"Start walking towards "))+closest.to+
               (". "+("ro".equals(language)?"Distanță ":"Distance ")+spokenRouteLengthKm(closest.totalMeters)+"."));
        }
        final WalkingLeg active=closest;final double along=nearest.along;
        for(int j=0;j<active.maneuvers.size();j++){
            Maneuver m=active.maneuvers.get(j);
            if(j==0)continue; // First instruction has already started with the leg.
            double remaining=m.along-along;
            String key=index+":"+j;
            if(remaining>0&&remaining<=(navigationMode.equals("drive")?1300:500)&&remaining>(navigationMode.equals("drive")?180:70)&&announced.add(key+":early")){
                say(("ro".equals(language)?"Peste ":"In ")+Math.round(remaining/10)*10+
                    ("ro".equals(language)?" de metri, ":" meters, ")+localize(m.text));break;
            }
            // At 20m use only high-accuracy GPS; never assert an exact turn
            // with a coarse fix on the wrong side of an intersection.
            if(remaining>=0&&remaining<=(navigationMode.equals("drive")?70:20)&&fix.getAccuracy()<=15&&announced.add(key+":near")){
                say(("ro".equals(language)?(navigationMode.equals("drive")?"În aproximativ 70 de metri, ":"În aproximativ 20 de metri, "):(navigationMode.equals("drive")?"In approximately 70 meters, ":"In about 20 meters, "))+localize(m.text));break;
            }
        }
        if(active.totalMeters-along<18&&fix.getAccuracy()<=15&&announced.add(index+":arrived"))
            say(("ro".equals(language)?"Ai ajuns la ":"You have reached ")+active.to);
    }
    @Override public void onProviderEnabled(String provider){}
    @Override public void onProviderDisabled(String provider){}
    @Override public void onStatusChanged(String provider,int status,Bundle extras){}
    @Override public void onInit(int status){
        speechReady=status==TextToSpeech.SUCCESS;
        if(speechReady){
            Locale locale=Locale.forLanguageTag("ro".equals(language)?"ro-RO":language);
            speech.setLanguage(locale);
            speech.setSpeechRate(.95f);
        }
    }
    private void shutdown(){
        started=false;
        try{if(locations!=null)locations.removeUpdates(this);}catch(SecurityException ignored){}
        if(speech!=null)speech.stop();
        getSharedPreferences(PREFS,MODE_PRIVATE).edit().remove("journey").putBoolean("active",false).apply();
        stopForeground(STOP_FOREGROUND_REMOVE);stopSelf();
    }
    @Override public void onDestroy(){
        if(locations!=null){try{locations.removeUpdates(this);}catch(SecurityException ignored){}}
        if(speech!=null){speech.stop();speech.shutdown();}
        super.onDestroy();
    }
    @Override public IBinder onBind(Intent intent){return null;}
}
