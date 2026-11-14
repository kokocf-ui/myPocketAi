package ai.mypocket.mobile;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import java.io.IOException;
import android.util.Base64;
import android.net.Uri;
import android.os.Bundle;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.RecognitionListener;
import android.media.AudioRecord;
import android.media.AudioFormat;
import android.media.MediaRecorder;
import java.io.ByteArrayOutputStream;
import android.Manifest;
import android.content.pm.PackageManager;
import android.webkit.GeolocationPermissions;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.ValueCallback;
import androidx.core.content.ContextCompat;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.os.Build;
import android.view.WindowManager;
import java.util.ArrayList;
import java.util.Locale;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.print.PrintManager;
import android.print.PrintDocumentAdapter;
import android.print.PrintDocumentInfo;
import android.print.PrintAttributes;
import android.print.PageRange;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import java.io.InputStream;
import java.io.FileOutputStream;
import android.graphics.pdf.PdfDocument;
import android.graphics.pdf.PdfRenderer;
import android.graphics.Typeface;
import java.io.OutputStream;
import android.webkit.WebResourceResponse;
import java.io.InputStream;
import android.webkit.WebSettings;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ImageView;
import android.widget.TextView;
import android.view.Gravity;
import android.view.View;
import android.util.TypedValue;

import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.PickVisualMediaRequest;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.content.FileProvider;
import androidx.core.view.WindowCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.graphics.Insets;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import java.util.Collections;

import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;

import org.json.JSONObject;
import org.json.JSONArray;
import android.graphics.Rect;

import java.io.File;
import java.io.FileInputStream;

public final class MainActivity extends ComponentActivity {
    private boolean firebasePushConfigured=false;
    private void forwardFcmToken(String token){
        if(token==null||token.length()<24||token.length()>4096||web==null)return;
        String current=web.getUrl();
        Uri page=current==null?null:Uri.parse(current);
        if(page==null||!"https".equalsIgnoreCase(page.getScheme())||!APP_HOST.equalsIgnoreCase(page.getHost()))return;
        web.evaluateJavascript("if(window.pocketPushTokenReceived)window.pocketPushTokenReceived("+JSONObject.quote(token)+");",null);
    }
    private void initializePocketFcm(){
        // A valid Firebase project config must be supplied by the owner; no fake token.
        if(BuildConfig.FCM_API_KEY.isEmpty()||BuildConfig.FCM_APP_ID.isEmpty()
            ||BuildConfig.FCM_PROJECT_ID.isEmpty()||BuildConfig.FCM_SENDER_ID.isEmpty())return;
        try{
            FirebaseOptions options=new FirebaseOptions.Builder()
                .setApiKey(BuildConfig.FCM_API_KEY)
                .setApplicationId(BuildConfig.FCM_APP_ID)
                .setProjectId(BuildConfig.FCM_PROJECT_ID)
                .setGcmSenderId(BuildConfig.FCM_SENDER_ID).build();
            if(FirebaseApp.getApps(this).isEmpty())FirebaseApp.initializeApp(this,options);
            firebasePushConfigured=true;
            FirebaseMessaging.getInstance().getToken().addOnSuccessListener(token->{
                if(token!=null&&token.length()>=24&&token.length()<=4096){
                    getSharedPreferences(PocketFirebaseMessagingService.PREFS,MODE_PRIVATE)
                        .edit().putString(PocketFirebaseMessagingService.KEY,token).apply();
                    forwardFcmToken(token);
                }
            });
        }catch(Exception ignored){firebasePushConfigured=false;}
    }
    private String pendingCommunicationInvite = null;
    private String pendingCommunicationKind = null;
    private String pendingCommunicationTarget = null;
    private void loadCommunicationNotification(Intent intent){
        pendingCommunicationKind=intent==null?null:intent.getStringExtra(CommunicationNotificationHelper.EXTRA_KIND);
        pendingCommunicationTarget=intent==null?null:intent.getStringExtra(CommunicationNotificationHelper.EXTRA_TARGET);
        if(pendingCommunicationKind!=null&&!pendingCommunicationKind.matches("message|list|invite"))
            pendingCommunicationKind=null;
        if(pendingCommunicationTarget!=null&&!pendingCommunicationTarget.matches("[A-Za-z0-9_-]{1,150}"))
            pendingCommunicationTarget=null;
    }
    private void dispatchCommunicationNotification(){
        if(web==null||pendingCommunicationKind==null||pendingCommunicationTarget==null)return;
        String kind=pendingCommunicationKind,target=pendingCommunicationTarget;
        pendingCommunicationKind=null;pendingCommunicationTarget=null;
        web.evaluateJavascript("(function(){var n=document.querySelector('[data-nav=communication]');if(n)n.click();if(window.pocketCommunicationNotificationOpen)window.pocketCommunicationNotificationOpen("
            +JSONObject.quote(kind)+","+JSONObject.quote(target)+");})()",null);
    }
    private static String communicationInviteCode(Intent intent) {
        if (intent==null)return null;
        String forwarded=intent.getStringExtra("communication_invite");
        if(forwarded!=null && forwarded.matches("[A-Za-z0-9_-]{32,150}"))return forwarded;
        if(intent.getData()==null)return null;
        Uri data=intent.getData();
        if (!"mypocketai".equalsIgnoreCase(data.getScheme()) || !"invite".equalsIgnoreCase(data.getHost())) return null;
        if (data.getPathSegments().size()!=1) return null;
        String token=data.getPathSegments().get(0);
        return token.matches("[A-Za-z0-9_-]{32,150}")?token:null;
    }
    private void dispatchCommunicationInvite() {
        if (web==null || pendingCommunicationInvite==null) return;
        String token=pendingCommunicationInvite;
        pendingCommunicationInvite=null;
        String quoted=JSONObject.quote(token);
        web.evaluateJavascript("(function(){var n=document.querySelector('[data-nav=communication]');if(n)n.click();if(window.pocketInviteReceived)window.pocketInviteReceived("+quoted+");})()",null);
    }
    @Override protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        pendingCommunicationInvite=communicationInviteCode(intent);
        loadCommunicationNotification(intent);
        if(pendingCommunicationInvite!=null && web!=null)dispatchCommunicationInvite();
        if(pendingCommunicationKind!=null && web!=null)dispatchCommunicationNotification();
    }
    private static final String APP_URL = "https://lifewise-ai-v2.kokocf.workers.dev/";
    private static final String APP_HOST = "lifewise-ai-v2.kokocf.workers.dev";
    private WebView web;
    private final ArrayList<WebView> educationPrintWebs=new ArrayList<>();
    private FrameLayout appFrame;
    private Uri cameraUri;
    private boolean waitingForPhoto = false;
    // This flag is intentionally limited to the Education camera/gallery bridge.
    private boolean educationMathPhoto=false;
    // URI only in Activity memory, and only sent after a separate opt-in tap.
    private Uri mathVisionSourceUri=null;
    // User-selected document photos only; the WebView gets one chooser result, not broad file access.
    private ValueCallback<Uri[]> documentPhotoCallback;
    private Uri documentCameraUri;
    private boolean scanNextDocumentPhoto=false;
    private TextToSpeech tts;
    private boolean ttsReady=false;
    // A stale QUEUE_FLUSH callback must never restart lips after a newer voice.
    private volatile String activeTtsUtteranceId=null;
    private int nextTtsUtterance=0;
    private String speechMode="dictation";
    private SpeechRecognizer speechRecognizer;
    private boolean nativeListening=false;
    // Separate one-take Math pilot recording; never affects legacy speech modules.
    private volatile boolean mathPcmRecording=false;
    private AudioRecord mathPcmRecorder;
    private int mathPcmCaptureSequence=0;
    private boolean pendingMathAudioPermission=false;
    private static final int MATH_AUDIO_HZ=16000;
    private static final int MATH_AUDIO_MAX_BYTES=960000; // 30 seconds mono PCM16

    private GeolocationPermissions.Callback pendingGeoCallback;
    private String pendingGeoOrigin;
    private String pendingSpeechLocale="ro-RO";
    private static final String FIRST_MIC_PERMISSION_FLAG="first_microphone_permission_requested";
    private boolean microphoneRequestedForListening=false;
    private final Handler voiceEndpointHandler=new Handler(Looper.getMainLooper());
    private Runnable voiceEndpointTask;
    private String lastVoicePartial="";

    // Notification authorization now belongs exclusively to the native
    // Android prompt after the first-launch information screen.
    // Opening Agenda must not show another permission dialogue.

    private final ActivityResultLauncher<PickVisualMediaRequest> gallery =
        registerForActivityResult(new ActivityResultContracts.PickVisualMedia(),
            uri -> { waitingForPhoto=false; if (uri != null) recognize(uri); else notifyWeb("cancelled", ""); });

    private final ActivityResultLauncher<Intent> documentPhotos =
        registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
            ValueCallback<Uri[]> callback=documentPhotoCallback;
            documentPhotoCallback=null;
            if(callback==null)return;
            Uri selected=result.getData()!=null?result.getData().getData():null;
            if(result.getResultCode()==Activity.RESULT_OK && selected==null)selected=documentCameraUri;
            scanNextDocumentPhoto=false;
            // Return the selected image to the page. The Documents workspace
            // explicitly sends its saved, resized photo back for native OCR.
            callback.onReceiveValue(result.getResultCode()==Activity.RESULT_OK && selected!=null?new Uri[]{selected}:null);
            documentCameraUri=null;
        });

    private final ActivityResultLauncher<Intent> camera =
        registerForActivityResult(new ActivityResultContracts.StartActivityForResult(),
            result -> {
                waitingForPhoto=false;
                if (result.getResultCode() == Activity.RESULT_OK && cameraUri != null) recognize(cameraUri);
                else notifyWeb("cancelled", "");
            });

    private final ActivityResultLauncher<String> micPermission =
        registerForActivityResult(new ActivityResultContracts.RequestPermission(),granted -> {
            boolean resumeListening=microphoneRequestedForListening;
            boolean mathPermissionRequested=pendingMathAudioPermission;
            microphoneRequestedForListening=false;
            pendingMathAudioPermission=false;
            // A denied Math pilot permission must return to its own recording
            // callback, otherwise the Maths UI stays stuck in "recording" mode.
            if(mathPermissionRequested){
                if(granted)startMathPcmRecording();
                else notifyMathAudio("permissionDenied","",0);
            }else if(granted && resumeListening)beginEmbeddedListening();
            else if(granted)notifyVoice("permissionGranted","","permission");
            else notifyVoice("permissionDenied","","permission");
        });
    private final ActivityResultLauncher<String[]> locationPermission =
        registerForActivityResult(new ActivityResultContracts.RequestMultiplePermissions(),result -> {
            boolean granted=Boolean.TRUE.equals(result.get(Manifest.permission.ACCESS_FINE_LOCATION)) ||
                Boolean.TRUE.equals(result.get(Manifest.permission.ACCESS_COARSE_LOCATION));
            if(pendingGeoCallback!=null) {
                pendingGeoCallback.invoke(pendingGeoOrigin,granted,false);
                pendingGeoCallback=null;pendingGeoOrigin=null;
            }
            notifyLocationPermission(granted);
        });
    private void notifyLocationPermission(boolean granted) {
        try {
            String js="window.dispatchEvent(new CustomEvent('pocketandroidlocation',{detail:{granted:"+granted+"}}));";
            if(web!=null)web.evaluateJavascript(js,null);
        }catch(Exception ignored){}
    }
    private void ensureLocationPermission() {
        boolean granted=ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_COARSE_LOCATION)==PackageManager.PERMISSION_GRANTED;
        if(granted){notifyLocationPermission(true);return;}
        locationPermission.launch(new String[]{Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.ACCESS_COARSE_LOCATION});
    }
    private void provideLocalUserProfile(WebView view){
        // Only a non-contact conversation profile enters the trusted app WebView.
        // Email remains native and is used only on explicit PDF sharing.
        android.content.SharedPreferences saved=getSharedPreferences("pocket_user_profile",Context.MODE_PRIVATE);
        String name=saved.getString("preferred_name","");
        int age=UserProfileDates.ageFromBirthDate(saved.getString("birth_date",""));
        if(age==0)age=saved.getInt("age",0); // Legacy account before birth-date support
        String sex=saved.getString("sex","undisclosed");
        if(name==null||name.isEmpty()||age<1||age>120)return;
        if(!"male".equals(sex)&&!"female".equals(sex))sex="undisclosed";
        try{
            JSONObject profile=new JSONObject();
            profile.put("preferred_name",name);
            profile.put("age",age);
            profile.put("sex",sex);
            String js="(function(){try{window.__pocketNativeProfile=JSON.parse("
                +JSONObject.quote(profile.toString())+");window.dispatchEvent(new Event('pocket-profile-ready'))}catch(e){}})()";
            view.evaluateJavascript(js,null);
        }catch(Exception ignored){}
    }
    private void sendPocketAccount(WebView view,boolean saved, String error){
        if(view==null)return;
        try{
            android.content.SharedPreferences prefs=getSharedPreferences("pocket_user_profile",Context.MODE_PRIVATE);
            String birth=prefs.getString("birth_date","");
            int age=UserProfileDates.ageFromBirthDate(birth);
            if(age==0)age=prefs.getInt("age",0);
            JSONObject profile=new JSONObject();
            profile.put("email",prefs.getString("email",""));
            profile.put("preferred_name",prefs.getString("preferred_name",""));
            profile.put("birth_date",birth);
            profile.put("age",age); // internal compatibility, never shown in Cont
            profile.put("birthday_greeting_enabled",prefs.getBoolean("birthday_greeting_enabled",true));
            profile.put("sex",prefs.getString("sex","undisclosed"));
            profile.put("saved",saved);
            if(error!=null&&!error.isEmpty())profile.put("error",error);
            view.evaluateJavascript("window.pocketAccountNativeResponse && window.pocketAccountNativeResponse("
                +profile.toString()+");",null);
        }catch(Exception ignored){}
    }
    private void handlePocketAccount(WebView view,String payload){
        if(payload==null||payload.length()>3000)return;
        try{
            JSONObject input=new JSONObject(payload);
            String action=input.optString("action","");
            if("read".equals(action)){sendPocketAccount(view,false,null);return;}
            if(!"save".equals(action))return;
            String email=input.optString("email","").trim();
            String name=input.optString("preferred_name","").trim().replaceAll("\\s+"," ");
            String dob=input.optString("birth_date","").trim();
            String sex=input.optString("sex","undisclosed");
            boolean birthdayGreetings=input.optBoolean("birthday_greeting_enabled",true);
            if(!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()||email.length()>254){
                sendPocketAccount(view,false,"Adresa de e-mail nu este validă.");return;
            }
            if(name.length()<2||name.length()>50){
                sendPocketAccount(view,false,"Numele trebuie să aibă 2–50 de caractere.");return;
            }
            int age;
            if(!dob.isEmpty()){
                age=UserProfileDates.ageFromBirthDate(dob);
                if(age==0){sendPocketAccount(view,false,"Data nașterii nu este validă.");return;}
            }else{
                age=getSharedPreferences("pocket_user_profile",Context.MODE_PRIVATE).getInt("age",0);
                if(age<1||age>120){sendPocketAccount(view,false,"Completează data nașterii.");return;}
            }
            if(!"male".equals(sex)&&!"female".equals(sex))sex="undisclosed";
            getSharedPreferences("pocket_user_profile",Context.MODE_PRIVATE).edit()
                .putString("email",email).putString("preferred_name",name)
                .putString("birth_date",dob).putInt("age",age).putString("sex",sex)
                .putBoolean("birthday_greeting_enabled",birthdayGreetings).apply();
            ProfileBirthdayScheduler.reschedule(this);
            provideLocalUserProfile(view);
            sendPocketAccount(view,true,null);
        }catch(Exception ignored){sendPocketAccount(view,false,"Nu am putut salva profilul.");}
    }
    private void prefillEmailForSharedPdf(Intent send){
        String email=getSharedPreferences("pocket_user_profile",Context.MODE_PRIVATE)
            .getString("email","");
        if(email!=null&&android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches())
            send.putExtra(Intent.EXTRA_EMAIL,new String[]{email});
    }
    private void requestMicrophonePermissionOnce() {
        if(ContextCompat.checkSelfPermission(this,Manifest.permission.RECORD_AUDIO)==PackageManager.PERMISSION_GRANTED)return;
        var prefs=getSharedPreferences("pocket_permissions",Context.MODE_PRIVATE);
        // A user who denied permission is not repeatedly interrupted on every launch.
        if(prefs.getBoolean(FIRST_MIC_PERMISSION_FLAG,false))return;
        prefs.edit().putBoolean(FIRST_MIC_PERMISSION_FLAG,true).apply();
        micPermission.launch(Manifest.permission.RECORD_AUDIO);
    }
    private void cancelVoiceEndpoint() {
        if(voiceEndpointTask!=null)voiceEndpointHandler.removeCallbacks(voiceEndpointTask);
        voiceEndpointTask=null;
    }
    private void scheduleVoiceEndpoint(String recognized) {
        if(!nativeListening || recognized==null || recognized.trim().isEmpty())return;
        // Dictation should remain manual. Conversational voice and exit commands
        // finish shortly after the last *changed* partial result.
        if("dictation".equals(speechMode) || "budget".equals(speechMode) ||
           "agenda".equals(speechMode) || "tasks".equals(speechMode) ||
           "reminders".equals(speechMode) || "notes".equals(speechMode) ||
           "daily".equals(speechMode) || "shopping".equals(speechMode) ||
           "documents".equals(speechMode) || "math".equals(speechMode))return;
        String normalized=recognized.trim();
        if(normalized.equals(lastVoicePartial))return;
        lastVoicePartial=normalized;
        cancelVoiceEndpoint();
        voiceEndpointTask=()->{
            voiceEndpointTask=null;
            if(nativeListening && speechRecognizer!=null) {
                try{speechRecognizer.stopListening();}catch(Exception ignored){}
            }
        };
        voiceEndpointHandler.postDelayed(voiceEndpointTask,1100L);
    }
    private void beginEmbeddedListening() {
        if(!SpeechRecognizer.isRecognitionAvailable(this)){notifyVoice("error","Speech recognizer unavailable",speechMode);return;}
        stopEmbeddedListening();
        lastVoicePartial="";
        try {
            speechRecognizer=SpeechRecognizer.createSpeechRecognizer(this);
            speechRecognizer.setRecognitionListener(new RecognitionListener(){
                @Override public void onReadyForSpeech(Bundle params){notifyVoice("listening","",speechMode);}
                @Override public void onBeginningOfSpeech(){}
                @Override public void onRmsChanged(float rmsdB){}
                @Override public void onBufferReceived(byte[] buffer){}
                @Override public void onEndOfSpeech(){cancelVoiceEndpoint();}
                @Override public void onPartialResults(Bundle results){
                    ArrayList<String> values=results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                    if(values!=null&&!values.isEmpty()){
                        notifyVoice("partial",values.get(0),speechMode);
                        scheduleVoiceEndpoint(values.get(0));
                    }
                }
                @Override public void onResults(Bundle results){
                    cancelVoiceEndpoint();nativeListening=false;
                    ArrayList<String> values=results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                    notifyVoice("recognized",values!=null&&!values.isEmpty()?values.get(0):"",speechMode,
                        "math".equals(speechMode)?values:null);
                    releaseRecognizer();
                }
                @Override public void onError(int error){
                    cancelVoiceEndpoint();nativeListening=false;
                    if(error==SpeechRecognizer.ERROR_NO_MATCH||error==SpeechRecognizer.ERROR_SPEECH_TIMEOUT)
                        notifyVoice("recognized","",speechMode);
                    else notifyVoice("error","Speech recognizer error "+error,speechMode);
                    releaseRecognizer();
                }
                @Override public void onEvent(int eventType,Bundle params){}
            });
            Intent intent=new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE,pendingSpeechLocale);
            intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS,true);
            // Request alternative math transcripts: the top hypothesis can omit "-1".
            // Only mathematical dictation reads these alternatives.
            if("math".equals(speechMode))intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS,5);
            // Mathematics contains spoken brackets, operators and numbers. Allow
            // natural pauses before Android produces a partial/final result.
            // Some recognizers ignore these hints, so the web session restarts
            // automatically after each final chunk as in Organize.
            boolean mathDictation="math".equals(speechMode);
            intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS,mathDictation?4800L:2200L);
            intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS,mathDictation?2600L:1400L);
            intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS,1000L);
            nativeListening=true;
            speechRecognizer.startListening(intent);
        }catch(Exception ex){nativeListening=false;releaseRecognizer();notifyVoice("error","Speech recognizer unavailable",speechMode);}
    }
    private void releaseRecognizer(){if(speechRecognizer!=null){speechRecognizer.destroy();speechRecognizer=null;}}
    private void stopEmbeddedListening(){cancelVoiceEndpoint();lastVoicePartial="";nativeListening=false;if(speechRecognizer!=null){speechRecognizer.cancel();releaseRecognizer();}}
    private void nativeVoice(String message) {
        try {
            JSONObject data=new JSONObject(message);
            String action=data.optString("action","");
            if("stop".equals(action)) { activeTtsUtteranceId=null;if(tts!=null) tts.stop();stopEmbeddedListening(); return; }
            if("stopListen".equals(action)){stopEmbeddedListening();return;}
            if("startMathAudio".equals(action)){
                if(ContextCompat.checkSelfPermission(this,Manifest.permission.RECORD_AUDIO)==PackageManager.PERMISSION_GRANTED)
                    startMathPcmRecording();
                else {pendingMathAudioPermission=true;microphoneRequestedForListening=false;
                    micPermission.launch(Manifest.permission.RECORD_AUDIO);}
                return;
            }
            if("stopMathAudio".equals(action)){stopMathPcmRecording();return;}
            if("speak".equals(action)) {
                if(!ttsReady || tts==null){notifyVoice("error","Voice engine is not ready","tts");return;}
                String text=data.optString("text","");
                if(text.isEmpty())return;
                if(text.length()>16000)text=text.substring(0,16000);
                String language=data.optString("language","ro-RO");
                int languageSupport=tts.setLanguage(Locale.forLanguageTag(language));
                if(languageSupport==TextToSpeech.LANG_MISSING_DATA || languageSupport==TextToSpeech.LANG_NOT_SUPPORTED){
                    notifyVoice("error","Voice data unavailable for "+language,"tts");
                    return;
                }
                double requestedRate=data.optDouble("rate",0.96);
                if(Double.isNaN(requestedRate)||Double.isInfinite(requestedRate))requestedRate=0.96;
                tts.setSpeechRate((float)Math.max(0.65,Math.min(1.15,requestedRate)));
                String utteranceId="pocket-native-voice-"+(++nextTtsUtterance);
                activeTtsUtteranceId=utteranceId;
                int status=tts.speak(text,TextToSpeech.QUEUE_FLUSH,null,utteranceId);
                if(status==TextToSpeech.ERROR){activeTtsUtteranceId=null;notifyVoice("error","Could not start speech","tts");}
            }else if("listen".equals(action)) {
                speechMode=data.optString("mode","dictation");
                pendingSpeechLocale=data.optString("language","ro-RO");
                if(ContextCompat.checkSelfPermission(this,Manifest.permission.RECORD_AUDIO)==PackageManager.PERMISSION_GRANTED)beginEmbeddedListening();
                else {microphoneRequestedForListening=true;micPermission.launch(Manifest.permission.RECORD_AUDIO);}
            }
        }catch(Exception ex){notifyVoice("error","Speech service unavailable","tts");}
    }



    // Private on-device voice note capture for Communication. The trusted
    // WebMessage origin and Android RECORD_AUDIO permission are both required.
    // Only encrypted application uploads can send the resulting media to Oracle.
    private MediaRecorder commVoiceRecorder;
    private File commVoiceFile;
    private final Handler commVoiceHandler = new Handler(Looper.getMainLooper());
    private Runnable commVoiceTimeout;
    private Runnable commVoiceStartTask;
    private boolean commVoiceStarting=false;
    private int commVoiceSession = 0;
    private static final int COMM_VOICE_MAX_BYTES = 11 * 1024 * 1024;

    private void notifyCommVoice(String status, int session, String error, int part, int parts, String encoded) {
        try {
            JSONObject event = new JSONObject();
            event.put("status",status);
            event.put("session",session);
            if(error!=null)event.put("error",error);
            if(part>=0){event.put("part",part);event.put("parts",parts);}
            if(encoded!=null)event.put("data",encoded);
            final String js="window.pocketAndroidCommunicationVoiceResult&&window.pocketAndroidCommunicationVoiceResult("
                +event.toString()+");";
            runOnUiThread(()->{
                if(web==null)return;
                String url=web.getUrl();
                Uri page=url==null?null:Uri.parse(url);
                if(page!=null && "https".equalsIgnoreCase(page.getScheme())
                    && APP_HOST.equalsIgnoreCase(page.getHost()))
                    web.evaluateJavascript(js,null);
            });
        }catch(Exception ignored){}
    }

    private void startCommVoice() {
        if(commVoiceRecorder!=null||commVoiceStarting)return;
        final int session=++commVoiceSession;
        if(ContextCompat.checkSelfPermission(this,Manifest.permission.RECORD_AUDIO)!=PackageManager.PERMISSION_GRANTED){
            notifyCommVoice("error",session,"MIC_PERMISSION_DENIED",-1,0,null);return;
        }
        // Eva's speech recognition and Maths AudioRecord must relinquish the
        // microphone before this new, independent native communication capture.
        stopEmbeddedListening();
        stopMathPcmRecording();
        commVoiceStarting=true;
        // SpeechRecognizer.cancel/destroy and AudioRecord.release can complete
        // asynchronously, so allow the audio stack a brief release interval.
        commVoiceStartTask=()->{
            commVoiceStartTask=null;
            if(!commVoiceStarting||session!=commVoiceSession)return;
            commVoiceStarting=false;
            beginCommVoiceCapture(session);
        };
        commVoiceHandler.postDelayed(commVoiceStartTask,350L);
    }

    private void beginCommVoiceCapture(int session){
        if(commVoiceRecorder!=null||session!=commVoiceSession)return;
        String failure="MIC_BUSY_OR_UNAVAILABLE";
        // Some Android encoders reject explicit 44.1 kHz / bitrate settings.
        // Retry once using device defaults; always release failed MediaRecorder.
        for(int attempt=0;attempt<2;attempt++){
            MediaRecorder recorder=null;
            File file=null;
            try{
                file=File.createTempFile("pocket-voice-", ".m4a",getCacheDir());
                recorder=Build.VERSION.SDK_INT>=31?new MediaRecorder(this):new MediaRecorder();
                recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
                recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
                recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
                if(attempt==0){
                    recorder.setAudioChannels(1);
                    recorder.setAudioEncodingBitRate(64000);
                    recorder.setAudioSamplingRate(44100);
                }
                recorder.setOutputFile(file.getAbsolutePath());
                recorder.prepare();
                recorder.start();
                commVoiceRecorder=recorder;
                commVoiceFile=file;
                notifyCommVoice("started",session,null,-1,0,null);
                commVoiceTimeout=()->finishCommVoice(true);
                commVoiceHandler.postDelayed(commVoiceTimeout,60000L);
                return;
            }catch(SecurityException ex){
                failure="MIC_PERMISSION_DENIED";
                if(recorder!=null)try{recorder.reset();recorder.release();}catch(Exception ignored){}
                if(file!=null)file.delete();
                break;
            }catch(Exception ex){
                if(recorder!=null)try{recorder.reset();recorder.release();}catch(Exception ignored){}
                if(file!=null)file.delete();
            }
        }
        commVoiceRecorder=null;commVoiceFile=null;
        notifyCommVoice("error",session,failure,-1,0,null);
    }

    private void finishCommVoice(boolean send) {
        if(commVoiceStarting){
            commVoiceStarting=false;
            if(commVoiceStartTask!=null)commVoiceHandler.removeCallbacks(commVoiceStartTask);
            commVoiceStartTask=null;
            notifyCommVoice("cancelled",commVoiceSession,null,-1,0,null);
            return;
        }
        if(commVoiceRecorder==null)return;
        final MediaRecorder recorder=commVoiceRecorder;
        final File file=commVoiceFile;
        final int session=commVoiceSession;
        commVoiceRecorder=null;commVoiceFile=null;
        if(commVoiceTimeout!=null)commVoiceHandler.removeCallbacks(commVoiceTimeout);
        commVoiceTimeout=null;
        boolean valid=false;
        try{recorder.stop();valid=true;}catch(RuntimeException ignored){}
        try{recorder.reset();recorder.release();}catch(Exception ignored){}
        if(!send){if(file!=null)file.delete();notifyCommVoice("cancelled",session,null,-1,0,null);return;}
        if(!valid||file==null||file.length()<256){
            if(file!=null)file.delete();
            notifyCommVoice("error",session,"RECORD_TOO_SHORT",-1,0,null);return;
        }
        if(file.length()>COMM_VOICE_MAX_BYTES){
            file.delete();notifyCommVoice("error",session,"RECORD_TOO_LARGE",-1,0,null);return;
        }
        // Read the temporary recording outside the UI thread; it is deleted
        // even when a WebView is gone or a conversion fails.
        new Thread(()->{
            try(FileInputStream input=new FileInputStream(file)){
                final byte[] buffer=new byte[48*1024];
                final int parts=(int)((file.length()+buffer.length-1)/buffer.length);
                int part=0,count;
                while((count=input.read(buffer))!=-1){
                    byte[] chunk=java.util.Arrays.copyOf(buffer,count);
                    notifyCommVoice("chunk",session,null,part++,parts,Base64.encodeToString(chunk,Base64.NO_WRAP));
                }
                notifyCommVoice("complete",session,null,-1,parts,null);
            }catch(Exception ex){
                notifyCommVoice("error",session,"RECORD_READ_FAILED",-1,0,null);
            }finally{file.delete();}
        },"pocket-communication-voice-read").start();
    }
    private void handleCommVoiceCommand(String action){
        if("start".equals(action))startCommVoice();
        else if("stop".equals(action))finishCommVoice(true);
        else if("cancel".equals(action))finishCommVoice(false);
    }

    private static void mathWavU16(byte[] out,int off,int value){
        out[off]=(byte)(value&255);out[off+1]=(byte)((value>>8)&255);
    }
    private static void mathWavU32(byte[] out,int off,int value){
        for(int i=0;i<4;i++)out[off+i]=(byte)((value>>(8*i))&255);
    }
    private static byte[] mathWavFromPcm(byte[] pcm){
        byte[] wav=new byte[44+pcm.length];
        byte[] riff=new byte[]{'R','I','F','F','W','A','V','E','f','m','t',' ','d','a','t','a'};
        System.arraycopy(riff,0,wav,0,4);
        mathWavU32(wav,4,pcm.length+36);
        System.arraycopy(riff,4,wav,8,8);
        mathWavU32(wav,16,16);mathWavU16(wav,20,1);mathWavU16(wav,22,1);
        mathWavU32(wav,24,MATH_AUDIO_HZ);mathWavU32(wav,28,MATH_AUDIO_HZ*2);
        mathWavU16(wav,32,2);mathWavU16(wav,34,16);
        System.arraycopy(riff,12,wav,36,4);mathWavU32(wav,40,pcm.length);
        System.arraycopy(pcm,0,wav,44,pcm.length);
        return wav;
    }
    private void notifyMathAudio(String status,String audio,int durationMs,int id,int index,int count){
        try{
            JSONObject response=new JSONObject();
            response.put("status",status);
            response.put("duration_ms",durationMs);
            response.put("capture_id",id);
            if(index>=0){response.put("part_index",index);response.put("part_count",count);}
            if(audio!=null&&!audio.isEmpty())response.put("audio",audio);
            String js="window.pocketAndroidMathAudioResult && window.pocketAndroidMathAudioResult("+response.toString()+");";
            runOnUiThread(()->{
                if(web!=null && APP_HOST.equals(Uri.parse(web.getUrl()==null?"":web.getUrl()).getHost()))
                    web.evaluateJavascript(js,null);
            });
        }catch(Exception ignored){}
    }
    private void notifyMathAudio(String status,String audio,int durationMs){
        notifyMathAudio(status,audio,durationMs,mathPcmCaptureSequence,-1,0);
    }
    private void startMathPcmRecording(){
        if(mathPcmRecording)return;
        stopEmbeddedListening(); // release Android's speech engine before AudioRecord
        int minimum=AudioRecord.getMinBufferSize(MATH_AUDIO_HZ,AudioFormat.CHANNEL_IN_MONO,AudioFormat.ENCODING_PCM_16BIT);
        if(minimum<=0){notifyMathAudio("error","",0);return;}
        final AudioRecord recorder;
        try{
            recorder=new AudioRecord(MediaRecorder.AudioSource.MIC,MATH_AUDIO_HZ,
                AudioFormat.CHANNEL_IN_MONO,AudioFormat.ENCODING_PCM_16BIT,Math.max(minimum,4096));
            if(recorder.getState()!=AudioRecord.STATE_INITIALIZED){
                recorder.release();notifyMathAudio("error","",0);return;
            }
            recorder.startRecording();
        }catch(Exception error){notifyMathAudio("error","",0);return;}
        mathPcmRecorder=recorder;
        mathPcmRecording=true;
        final int captureId=++mathPcmCaptureSequence;
        notifyMathAudio("recording","",0,captureId,-1,0);
        new Thread(()->{
            ByteArrayOutputStream pcm=new ByteArrayOutputStream(96000);
            byte[] buffer=new byte[4096];
            long began=android.os.SystemClock.elapsedRealtime();
            try{
                while(mathPcmRecording && pcm.size()<MATH_AUDIO_MAX_BYTES){
                    int wanted=Math.min(buffer.length,MATH_AUDIO_MAX_BYTES-pcm.size());
                    int n=recorder.read(buffer,0,wanted);
                    if(n>0)pcm.write(buffer,0,n);
                    else if(n<0)break;
                }
            }catch(Exception ignored){}finally{
                mathPcmRecording=false;
                try{recorder.stop();}catch(Exception ignored){}
                recorder.release();
                mathPcmRecorder=null;
            }
            byte[] samples=pcm.toByteArray();
            int duration=Math.min(30000,(int)((long)samples.length*1000/(MATH_AUDIO_HZ*2)));
            if(samples.length>=16000){
                byte[] wav=mathWavFromPcm(samples);
                String encoded=Base64.encodeToString(wav,Base64.NO_WRAP);
                // Android WebView Binder transactions can reject ~1 MB strings.
                // Send at most 48 KB per JS callback; never store audio to disk.
                final int chunkSize=48000;
                final int parts=(encoded.length()+chunkSize-1)/chunkSize;
                for(int i=0;i<parts;i++){
                    String piece=encoded.substring(i*chunkSize,Math.min(encoded.length(),(i+1)*chunkSize));
                    notifyMathAudio("chunk",piece,duration,captureId,i,parts);
                }
                notifyMathAudio("captured","",duration,captureId,-1,parts);
            }else notifyMathAudio("error","",duration,captureId,-1,0);
        },"pocket-math-audio-pilot").start();
    }
    private void stopMathPcmRecording(){
        mathPcmRecording=false;
        // Worker releases its recorder and emits exactly one captured callback.
        AudioRecord recorder=mathPcmRecorder;
        if(recorder!=null)try{recorder.stop();}catch(Exception ignored){}
    }

    private void notifyVoice(String status,String value,String mode) {
        notifyVoice(status,value,mode,null);
    }
    private void notifyVoice(String status,String value,String mode,ArrayList<String> alternatives) {
        try {
            JSONObject data=new JSONObject();
            data.put("status",status);
            data.put("text",value);
            data.put("mode",mode);
            if("math".equals(mode)&&alternatives!=null){
                JSONArray choices=new JSONArray();
                for(int i=0;i<Math.min(5,alternatives.size());i++){
                    String candidate=alternatives.get(i);
                    if(candidate!=null&&!candidate.trim().isEmpty())
                        choices.put(candidate.length()>3500?candidate.substring(0,3500):candidate);
                }
                data.put("alternatives",choices);
            }
            String js="window.pocketAndroidVoiceResult && window.pocketAndroidVoiceResult("+data.toString()+");" ;
            runOnUiThread(()->{
                if(web!=null && APP_HOST.equals(Uri.parse(web.getUrl()==null?"":web.getUrl()).getHost()))
                    web.evaluateJavascript(js,null);
            });
        }catch(Exception ignored){}
    }

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        pendingCommunicationInvite=communicationInviteCode(getIntent());
        loadCommunicationNotification(getIntent());
        WindowCompat.setDecorFitsSystemWindows(getWindow(),true);
        getWindow().getDecorView().setSystemUiVisibility(0);
        getWindow().setStatusBarColor(Color.rgb(6,20,32));
        getWindow().setNavigationBarColor(Color.rgb(6,20,32));
        initializePocketFcm();
        web = new WebView(this);
        FrameLayout root=new FrameLayout(this);
        appFrame=root;
        root.setBackgroundColor(Color.rgb(6,20,32));
        root.addView(web,new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,FrameLayout.LayoutParams.MATCH_PARENT));
        // Show the actual application instead of a separate photographic splash.
        // Android displays its normal system launch screen briefly.
        web.setBackgroundColor(Color.rgb(6,20,32));
        ViewCompat.setOnApplyWindowInsetsListener(root,(view,insets)->{
            Insets bars=insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            FrameLayout.LayoutParams params=(FrameLayout.LayoutParams)web.getLayoutParams();
            if(params.topMargin!=bars.top||params.bottomMargin!=bars.bottom||
               params.leftMargin!=bars.left||params.rightMargin!=bars.right){
                params.setMargins(bars.left,bars.top,bars.right,bars.bottom);
                web.setLayoutParams(params);
            }
            return insets;
        });
        setContentView(root);
        WebSettings settings=web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        // Native app HTML is delivered by Cloudflare and changes independently of the APK.
        // Never reuse a stale cached home screen after an app update or relaunch.
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true); // Required for user-selected content:// images; file:// access remains disabled.
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setGeolocationEnabled(true);
        web.setWebChromeClient(new WebChromeClient(){
            @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params){
                if(web==null || !APP_HOST.equals(Uri.parse(web.getUrl()==null?"":web.getUrl()).getHost())){callback.onReceiveValue(null);return true;}
                if(documentPhotoCallback!=null){documentPhotoCallback.onReceiveValue(null);documentPhotoCallback=null;}
                documentPhotoCallback=callback;
                // The document chooser itself starts on-device OCR. Do not rely on a
                // separate asynchronous WebMessage arriving before the photo result.
                String requestedTypes="";
                if(params!=null && params.getAcceptTypes()!=null)
                    requestedTypes=android.text.TextUtils.join(",",params.getAcceptTypes());
                boolean includesOtherMedia=requestedTypes.contains("video/")||requestedTypes.contains("audio/")
                    ||requestedTypes.contains("application/pdf");
                boolean textSelection=requestedTypes.contains("text/")||requestedTypes.contains(".txt")
                    ||requestedTypes.contains(".md")||requestedTypes.contains(".csv")
                    ||requestedTypes.contains(".json")||requestedTypes.contains("application/json");
                boolean imageSelection=!includesOtherMedia&&!textSelection;
                scanNextDocumentPhoto=imageSelection;
                try{
                    Intent pick=new Intent(Intent.ACTION_GET_CONTENT);
                    pick.addCategory(Intent.CATEGORY_OPENABLE);
                    if(includesOtherMedia){
                        pick.setType("*/*");
                        pick.putExtra(Intent.EXTRA_MIME_TYPES,new String[]{"image/*","video/*","audio/*","application/pdf"});
                    }else if(textSelection){
                        pick.setType("*/*");
                        pick.putExtra(Intent.EXTRA_MIME_TYPES,new String[]{"text/plain","text/markdown","text/csv","application/json"});
                    }else pick.setType("image/*");
                    Intent chooser=Intent.createChooser(pick,includesOtherMedia?"Alege fișierul pentru Comunicare":
                        textSelection?"Alege documentul text":"Alege fotografia documentului");
                    // An optional camera action stays separate from OCR and never uploads images.
                    try{
                        File folder=new File(getCacheDir(),"document-camera");
                        if(!folder.exists())folder.mkdirs();
                        File image=File.createTempFile("document_",".jpg",folder);
                        documentCameraUri=FileProvider.getUriForFile(MainActivity.this,getPackageName()+".fileprovider",image);
                        Intent capture=new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                        capture.putExtra(MediaStore.EXTRA_OUTPUT,documentCameraUri);
                        capture.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION|Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                        if(!includesOtherMedia)chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS,new Intent[]{capture});
                    }catch(Exception ignored){documentCameraUri=null;}
                    documentPhotos.launch(chooser);
                }catch(Exception ex){documentPhotoCallback=null;documentCameraUri=null;callback.onReceiveValue(null);}
                return true;
            }
            @Override public void onGeolocationPermissionsShowPrompt(String origin,GeolocationPermissions.Callback callback) {
                if(!APP_HOST.equals(Uri.parse(origin).getHost())){callback.invoke(origin,false,false);return;}
                boolean granted=ContextCompat.checkSelfPermission(MainActivity.this,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED ||
                    ContextCompat.checkSelfPermission(MainActivity.this,Manifest.permission.ACCESS_COARSE_LOCATION)==PackageManager.PERMISSION_GRANTED;
                if(granted)callback.invoke(origin,true,false);
                else if(getSharedPreferences("pocket_permissions",Context.MODE_PRIVATE)
                    .getBoolean("first_setup_complete_v1",false)) {
                    // Never re-prompt automatically on the home screen after a
                    // first-install opt-out or an Android denial.
                    callback.invoke(origin,false,false);
                }else {pendingGeoCallback=callback;pendingGeoOrigin=origin;ensureLocationPermission();}
            }
            @Override public void onGeolocationPermissionsHidePrompt(){pendingGeoCallback=null;pendingGeoOrigin=null;}
            @Override public void onPermissionRequest(PermissionRequest request) {
                // Only the trusted app origin may request audio recording.
                // Never grant camera, geolocation or other WebView resources.
                runOnUiThread(()->{
                    if(request==null)return;
                    Uri origin=request.getOrigin();
                    boolean trusted=origin!=null
                        && "https".equalsIgnoreCase(origin.getScheme())
                        && APP_HOST.equalsIgnoreCase(origin.getHost());
                    String[] resources=request.getResources();
                    boolean audioOnly=resources!=null&&resources.length==1
                        && PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resources[0]);
                    boolean granted=ContextCompat.checkSelfPermission(MainActivity.this,
                        Manifest.permission.RECORD_AUDIO)==PackageManager.PERMISSION_GRANTED;
                    if(trusted&&audioOnly&&granted)
                        request.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
                    else request.deny();
                });
            }
        });
        web.setWebViewClient(new WebViewClient(){
            @Override public void onPageFinished(WebView view,String url){
                super.onPageFinished(view,url);
                if(!"https".equals(Uri.parse(url).getScheme())||!APP_HOST.equals(Uri.parse(url).getHost()))return;
                dispatchCommunicationInvite();
                dispatchCommunicationNotification();
                if(firebasePushConfigured)forwardFcmToken(
                    PocketFirebaseMessagingService.savedToken(MainActivity.this));
                // Event-driven native locale sync; no repeating background tests.
                view.evaluateJavascript("(function(){if(window.__pocketNativeLocaleSync)return;window.__pocketNativeLocaleSync=true;"
                    +"function send(){try{var lang=localStorage.getItem('mypocketai.language');"
                    +"if(lang&&window.PocketAndroidLocale)window.PocketAndroidLocale.postMessage(lang)}catch(e){}}"
                    +"var picker=document.getElementById('languageSelect');"
                    +"if(picker)picker.addEventListener('change',function(){setTimeout(send,0)});"
                    +"document.addEventListener('visibilitychange',send);window.addEventListener('pagehide',send);send()})()",null);
                provideLocalUserProfile(view);
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request) {
                Uri resource=request.getUrl();
                if("https".equals(resource.getScheme()) && APP_HOST.equals(resource.getHost())
                    && "/avatar-production.html".equals(resource.getPath())) {
                    try {
                        // Intercept only this same-origin static resource. Other requests
                        // still follow the normal secure Cloudflare connection.
                        InputStream source=getAssets().open("avatar-production.html");
                        WebResourceResponse response=new WebResourceResponse("text/html","UTF-8",source);
                        response.setResponseHeaders(Collections.singletonMap("Cache-Control","no-store"));
                        return response;
                    } catch(Exception ignored) { return null; } // Network fallback
                }
                return super.shouldInterceptRequest(view,request);
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                Uri url=req.getUrl();
                if (!req.isForMainFrame()) return false;
                if ("https".equals(url.getScheme()) && APP_HOST.equals(url.getHost())) return false;
                if ("sms".equals(url.getScheme()) || "smsto".equals(url.getScheme())) {
                    try { startActivity(new Intent(Intent.ACTION_SENDTO,url)); } catch(Exception ignored) {}
                    return true;
                }
                if ("https".equals(url.getScheme()) && url.getHost()!=null) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, url)); } catch(Exception ignored) {}
                }
                return true;
            }
        });
        // Profile bridge is available only to the app's trusted first-party page.
        // Email never enters window.__pocketNativeProfile or the AI request.
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){
            WebViewCompat.addWebMessageListener(web,"PocketAndroidAccount",
                Collections.singleton("https://"+APP_HOST),
                (view,message,origin,isMainFrame,replyProxy)->{
                    if(!isMainFrame||!"https".equals(origin.getScheme())||!APP_HOST.equals(origin.getHost()))return;
                    final String payload=message.getData();
                    runOnUiThread(()->handlePocketAccount(view,payload));
                });
        }
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            WebViewCompat.addWebMessageListener(web, "PocketAndroidOCR",
                Collections.singleton("https://" + APP_HOST),
                (view, message, origin, isMainFrame, replyProxy) -> {
                    if (!isMainFrame || !APP_HOST.equals(origin.getHost())) return;
                    String source=message.getData();
                    runOnUiThread(() -> {
                        if (waitingForPhoto) return;
                        waitingForPhoto=true;
                        educationMathPhoto="camera:math".equals(source)||"gallery:math".equals(source);
                        if(educationMathPhoto)mathVisionSourceUri=null;
                        if ("camera".equals(source)||"camera:math".equals(source)) launchCamera();
                        else if ("gallery".equals(source)||"gallery:math".equals(source)) gallery.launch(new PickVisualMediaRequest.Builder()
                            .setMediaType(ActivityResultContracts.PickVisualMedia.ImageOnly.INSTANCE).build());
                        else {waitingForPhoto=false;educationMathPhoto=false;}
                    });
                });
        }
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){
            WebViewCompat.addWebMessageListener(web,"PocketAndroidDocuments",
                Collections.singleton("https://"+APP_HOST),
                (view,message,origin,isMainFrame,replyProxy)->{
                    if(!isMainFrame||!"https".equals(origin.getScheme())||!APP_HOST.equals(origin.getHost()))return;
                    final String request=message.getData();
                    if(request==null||request.length()>(
                        request.startsWith("share-many:")||request.startsWith("delete-many:")?60000:220))return;
                    runOnUiThread(()->{
                        if("list".equals(request))listEducationDocuments();
                        else if(request.startsWith("share-many:"))shareManyEducationDocuments(request.substring(11));
                        else if(request.startsWith("delete-many:"))deleteManyEducationDocuments(request.substring(12));
                        else if(request.startsWith("print:"))printEducationDocumentByName(request.substring(6));
                        else if(request.startsWith("share:"))shareEducationDocumentByName(request.substring(6));
                        else if(request.startsWith("open:"))openEducationDocumentByName(request.substring(5));
                        else if(request.startsWith("delete:"))deleteEducationDocumentByName(request.substring(7));
                    });
                });
        }
        // Capability marker for new native mathematics OCR. Older installed APKs do
        // not expose this bridge; the web frontend then uses legacy camera/gallery.
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){
            WebViewCompat.addWebMessageListener(web,"PocketAndroidMathOCR",
                Collections.singleton("https://"+APP_HOST),
                (view,message,origin,isMainFrame,replyProxy)->{ /* feature detection only */ });
        }
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){
            WebViewCompat.addWebMessageListener(web,"PocketAndroidMathVision",
                Collections.singleton("https://"+APP_HOST),
                (view,message,origin,isMainFrame,replyProxy)->{
                    if(!isMainFrame||!APP_HOST.equals(origin.getHost()))return;
                    String command=message.getData();
                    if(command==null||!command.matches("capture:[A-Za-z0-9_-]{1,50}"))return;
                    String id=command.substring("capture:".length());
                    runOnUiThread(()->sendMathVisionPhoto(id));
                });
        }
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){
            WebViewCompat.addWebMessageListener(web,"PocketAndroidDocumentScan",
                Collections.singleton("https://"+APP_HOST),
                (view,message,origin,isMainFrame,replyProxy)->{
                    if(!isMainFrame||!APP_HOST.equals(origin.getHost()))return;
                    final String payload=message.getData();
                    runOnUiThread(()->scanDocumentBytes(payload));
                });
        }
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){
            WebViewCompat.addWebMessageListener(web,"PocketAndroidPrint",
                Collections.singleton("https://"+APP_HOST),
                (view,message,origin,isMainFrame,replyProxy)->{
                    if(!isMainFrame||!"https".equals(origin.getScheme())||!APP_HOST.equals(origin.getHost()))return;
                    final String payload=message.getData();
                    if(payload==null||payload.length()>600000)return;
                    runOnUiThread(()->requestEducationPdfSave(payload));
                });
        }
        tts=new TextToSpeech(this,status -> {
            ttsReady=status==TextToSpeech.SUCCESS;
            if(!ttsReady)notifyVoice("error","Android voice engine unavailable","tts");
        });
        tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override public void onStart(String id){if(id.equals(activeTtsUtteranceId))notifyVoice("start","","tts");}
            // Android 8+ delivers progress at word/phoneme boundaries for TTS
            // engines that support it. This aligns lips to actual audio time.
            @Override public void onRangeStart(String id,int start,int end,int frame){
                if(id.equals(activeTtsUtteranceId))notifyVoice("boundary",String.valueOf(start),"tts");
            }
            @Override public void onDone(String id){
                if(id.equals(activeTtsUtteranceId)){activeTtsUtteranceId=null;notifyVoice("done","","tts");}
            }
            @Override public void onStop(String id,boolean interrupted){
                if(id.equals(activeTtsUtteranceId)){activeTtsUtteranceId=null;notifyVoice("done","","tts");}
            }
            @Override public void onError(String id){
                if(id.equals(activeTtsUtteranceId)){activeTtsUtteranceId=null;notifyVoice("error","Speech playback failed","tts");}
            }
        });
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            WebViewCompat.addWebMessageListener(web,"PocketAndroidMathAudio",
                Collections.singleton("https://"+APP_HOST),
                (view,message,origin,isMainFrame,replyProxy)->{
                    if(!isMainFrame||!APP_HOST.equals(origin.getHost()))return;
                    final String payload=message.getData();
                    runOnUiThread(()->nativeVoice(payload));
                });
        }
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            WebViewCompat.addWebMessageListener(web,"PocketAndroidCommunicationVoice",
                Collections.singleton("https://"+APP_HOST),
                (view,message,origin,isMainFrame,replyProxy)->{
                    if(!isMainFrame||origin==null
                        ||!"https".equalsIgnoreCase(origin.getScheme())
                        ||!APP_HOST.equalsIgnoreCase(origin.getHost()))return;
                    final String command=message.getData();
                    if(!"start".equals(command)&&!"stop".equals(command)&&!"cancel".equals(command))return;
                    runOnUiThread(()->handleCommVoiceCommand(command));
                });
        }
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            WebViewCompat.addWebMessageListener(web,"PocketAndroidVoice",
                Collections.singleton("https://"+APP_HOST),
                (view,message,origin,isMainFrame,replyProxy)->{
                    if(!isMainFrame||!APP_HOST.equals(origin.getHost()))return;
                    runOnUiThread(()->nativeVoice(message.getData()));
                });
        }
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){
            WebViewCompat.addWebMessageListener(web,"PocketAndroidAgenda",
                Collections.singleton("https://"+APP_HOST),
                (view,message,origin,isMainFrame,replyProxy)->{
                    if(!isMainFrame||!APP_HOST.equals(origin.getHost()))return;
                    String payload=message.getData();
                    runOnUiThread(()->{
                        try{
                            JSONObject data=new JSONObject(payload);
                            String action=data.optString("action","");
                            if("open".equals(action))return; // permission was requested on first installation
                            if(!"sync".equals(action))return;
                            AgendaReminderScheduler.sync(MainActivity.this,data.getJSONArray("events").toString());
                        }catch(Exception ignored){}
                    });
                });
        }
        AgendaReminderScheduler.reschedule(this);
        ProfileBirthdayScheduler.reschedule(this);
        // The native back action must use the app's own view stack, not WebView history.
        getOnBackPressedDispatcher().addCallback(this,new OnBackPressedCallback(true){
            @Override public void handleOnBackPressed(){
                if(web!=null)web.evaluateJavascript("window.pocketAndroidBack && window.pocketAndroidBack();",null);
            }
        });
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){
            WebViewCompat.addWebMessageListener(web,"PocketAndroidNavigation",
                Collections.singleton("https://"+APP_HOST),
                (view,message,origin,isMainFrame,replyProxy)->{
                    if(!isMainFrame||!APP_HOST.equals(origin.getHost()))return;
                    if("exit".equals(message.getData()))runOnUiThread(()->finish());
                });
        }
        // The launcher is a separate WebView. Persist explicit language changes
        // so its greeting matches the next launch rather than defaulting to Romanian.
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){
            WebViewCompat.addWebMessageListener(web,"PocketAndroidLocale",
                Collections.singleton("https://"+APP_HOST),
                (view,message,origin,isMainFrame,replyProxy)->{
                    if(!isMainFrame||!"https".equals(origin.getScheme())||!APP_HOST.equals(origin.getHost()))return;
                    String locale=message.getData();
                    if(locale!=null&&locale.matches("ro|en|fr|de|it|es|pt|nl|ru|pl|hr|sr|hu|tr|cs|sk|sl|bg|el|fi|sv|no|da|is|et|lv|lt|uk|bs|mk|sq|be|ca|ga|cy|mt|eu|gl|lb|fo|rm"))
                        getSharedPreferences("pocket_permissions",Context.MODE_PRIVATE)
                            .edit().putString("ui_language_native",locale).apply();
                });
        }
        // Unique document URL prevents WebView/HTTP intermediary caches from showing an old UI.
        // No cookies, offline documents or localStorage are cleared.
        String setupLanguage=getIntent().getStringExtra("first_setup_language");
        String langParam=setupLanguage!=null && setupLanguage.matches("ro|en|fr|de|it|es|pt|nl|ru|pl|hr|sr|hu|tr|cs|sk|sl|bg|el|fi|sv|no|da|is|et|lv|lt|uk|bs|mk|sq|be|ca|ga|cy|mt|eu|gl|lb|fo|rm")
            ?"&first_setup_language="+Uri.encode(setupLanguage):"";
        web.loadUrl(APP_URL + "?nativeLaunch=1&uiFresh=" + System.currentTimeMillis()+langParam);
        // Permissions were requested after the first-launch information screen.
        // Microphone is requested during first-install setup; voice features may request it again only after a previous denial.
        boolean granted=ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_COARSE_LOCATION)==PackageManager.PERMISSION_GRANTED;
        notifyLocationPermission(granted);
    }

    private void launchCamera() {
        try {
            File folder=new File(getCacheDir(), "camera");
            if (!folder.exists() && !folder.mkdirs()) throw new IllegalStateException("cache folder unavailable");
            File photo=File.createTempFile("pocket_", ".jpg",folder);
            cameraUri=FileProvider.getUriForFile(this, getPackageName()+".fileprovider",photo);
            Intent intent=new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            intent.putExtra(MediaStore.EXTRA_OUTPUT,cameraUri);
            intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION|Intent.FLAG_GRANT_READ_URI_PERMISSION);
            camera.launch(intent);
        } catch(Exception ex) {
            waitingForPhoto=false;
            notifyWeb("error","Camera unavailable");
        }
    }

    // ML Kit Latin text recognition is NOT a handwriting/math formula OCR engine.
    // Use an independent contrast-enhanced pass for Education mathematics and
    // expose uncertainty to the learner instead of silently accepting fragments.
    private boolean educationMathPlausible(String text){
        if(text==null)return false;
        String raw=text.replaceAll("\\s+","");
        if(raw.length()<5||raw.length()>800||!raw.matches("(?s).*\\d.*"))return false;
        int depth=0;
        for(int i=0;i<raw.length();i++){
            char c=raw.charAt(i);
            if(c=='(')depth++;
            if(c==')'&&--depth<0)return false;
        }
        if(depth!=0||raw.matches("(?s).*[=+\\-*/(]$"))return false;
        if(raw.indexOf('=')>=0){
            String[] sides=raw.split("=", -1);
            for(String side:sides)if(side.isEmpty())return false;
        }
        return true;
    }
    private int educationMathScore(String text){
        if(text==null)return -9999;
        String raw=text.replaceAll("\\s+","");
        int score=educationMathPlausible(raw)?600:0;
        for(int i=0;i<raw.length();i++){
            char c=raw.charAt(i);
            if(Character.isDigit(c))score+=4;
            else if("xXyYzZ=+-*/()^÷×√".indexOf(c)>=0)score+=3;
            else if(Character.isLetter(c))score-=3;
        }
        score+=Math.min(100,raw.length());
        return score;
    }
    // Vision models receive an upright, colour-preserving source image.
    // Do not reuse the grayscale/contrast ML Kit variant: it can erase the
    // thin diagonal or horizontal strokes that distinguish √, − and ^2.
    private Bitmap educationVisionBitmap(Uri imageUri) throws IOException{
        BitmapFactory.Options bounds=new BitmapFactory.Options();
        bounds.inJustDecodeBounds=true;
        try(InputStream src=getContentResolver().openInputStream(imageUri)){
            if(src==null)throw new IOException("Image unavailable");
            BitmapFactory.decodeStream(src,null,bounds);
        }
        if(bounds.outWidth<60||bounds.outHeight<60)throw new IOException("Image too small");
        int maxDimension=Math.max(bounds.outWidth,bounds.outHeight);
        BitmapFactory.Options options=new BitmapFactory.Options();
        options.inPreferredConfig=Bitmap.Config.ARGB_8888;
        options.inSampleSize=1;
        while(maxDimension/options.inSampleSize>2600)options.inSampleSize*=2;
        Bitmap decoded;
        try(InputStream src=getContentResolver().openInputStream(imageUri)){
            if(src==null)throw new IOException("Image unavailable");
            decoded=BitmapFactory.decodeStream(src,null,options);
        }
        if(decoded==null)throw new IOException("Image cannot be decoded");
        int angle=0;
        try(InputStream src=getContentResolver().openInputStream(imageUri)){
            if(src!=null){
                android.media.ExifInterface exif=new android.media.ExifInterface(src);
                int orientation=exif.getAttributeInt(android.media.ExifInterface.TAG_ORIENTATION,
                    android.media.ExifInterface.ORIENTATION_NORMAL);
                if(orientation==android.media.ExifInterface.ORIENTATION_ROTATE_90)angle=90;
                else if(orientation==android.media.ExifInterface.ORIENTATION_ROTATE_180)angle=180;
                else if(orientation==android.media.ExifInterface.ORIENTATION_ROTATE_270)angle=270;
            }
        }catch(Exception ignored){}
        if(angle==0)return decoded;
        Matrix matrix=new Matrix();matrix.postRotate(angle);
        Bitmap upright=Bitmap.createBitmap(decoded,0,0,decoded.getWidth(),decoded.getHeight(),matrix,true);
        if(upright!=decoded)decoded.recycle();
        return upright;
    }

    private Bitmap educationEnhancedBitmap(Uri imageUri) throws IOException{
        BitmapFactory.Options bounds=new BitmapFactory.Options();
        bounds.inJustDecodeBounds=true;
        try(InputStream src=getContentResolver().openInputStream(imageUri)){
            if(src==null)throw new IOException("Image unavailable");
            BitmapFactory.decodeStream(src,null,bounds);
        }
        if(bounds.outWidth<60||bounds.outHeight<60)throw new IOException("Image too small");
        int maxDimension=Math.max(bounds.outWidth,bounds.outHeight);
        BitmapFactory.Options options=new BitmapFactory.Options();
        options.inSampleSize=1;
        while(maxDimension/options.inSampleSize>2800)options.inSampleSize*=2;
        options.inPreferredConfig=Bitmap.Config.ARGB_8888;
        Bitmap decoded;
        try(InputStream src=getContentResolver().openInputStream(imageUri)){
            if(src==null)throw new IOException("Image unavailable");
            decoded=BitmapFactory.decodeStream(src,null,options);
        }
        if(decoded==null)throw new IOException("Image unavailable");
        int angle=0;
        try(InputStream src=getContentResolver().openInputStream(imageUri)){
            if(src!=null){
                android.media.ExifInterface exif=new android.media.ExifInterface(src);
                int orientation=exif.getAttributeInt(android.media.ExifInterface.TAG_ORIENTATION,
                    android.media.ExifInterface.ORIENTATION_NORMAL);
                if(orientation==android.media.ExifInterface.ORIENTATION_ROTATE_90)angle=90;
                else if(orientation==android.media.ExifInterface.ORIENTATION_ROTATE_180)angle=180;
                else if(orientation==android.media.ExifInterface.ORIENTATION_ROTATE_270)angle=270;
            }
        }catch(Exception ignored){}
        Bitmap upright=decoded;
        if(angle!=0){
            Matrix matrix=new Matrix();matrix.postRotate(angle);
            upright=Bitmap.createBitmap(decoded,0,0,decoded.getWidth(),decoded.getHeight(),matrix,true);
            if(upright!=decoded)decoded.recycle();
        }
        Bitmap enhanced=Bitmap.createBitmap(upright.getWidth(),upright.getHeight(),Bitmap.Config.ARGB_8888);
        Canvas canvas=new Canvas(enhanced);
        ColorMatrix grayscale=new ColorMatrix();grayscale.setSaturation(0f);
        ColorMatrix contrast=new ColorMatrix(new float[]{
            1.6f,0,0,0,-72f,
            0,1.6f,0,0,-72f,
            0,0,1.6f,0,-72f,
            0,0,0,1,0
        });
        grayscale.postConcat(contrast);
        Paint paint=new Paint(Paint.FILTER_BITMAP_FLAG);
        paint.setColorFilter(new ColorMatrixColorFilter(grayscale));
        canvas.drawBitmap(upright,0,0,paint);
        upright.recycle();
        return enhanced;
    }
    private void finishEducationMathOcr(com.google.mlkit.vision.text.TextRecognizer recognizer,
                                         String initial,String alternate,String upper,String lower){
        String a=initial==null?"":initial.trim(),b=alternate==null?"":alternate.trim();
        boolean chooseAlternate=educationMathScore(b)>educationMathScore(a);
        String selected=chooseAlternate?b:a;
        String other=chooseAlternate?a:b;
        StringBuilder supplements=new StringBuilder();
        for(String regional:new String[]{upper,lower}){
            String crop=regional==null?"":regional.trim();
            if(crop.isEmpty()||crop.equals(selected)||crop.equals(other))continue;
            if(supplements.length()>0)supplements.append('\n');
            supplements.append(crop);
        }
        if(supplements.length()>0)other=(other.isEmpty()?"":other+"\n")+supplements;
        if(selected.equals(other))other="";
        // Return full-page plus region OCR as unverified alternatives.
        notifyWeb(educationMathPlausible(selected)?"review":"partial",selected,other);
        recognizer.close();
    }
    private void scanEducationMathRegions(
        com.google.mlkit.vision.text.TextRecognizer recognizer,Bitmap processed,
        String initial,String alternate){
        // Two 63% overlapping regions give small labels and formula glyphs a
        // second chance. Neither crop is authoritative; the frontend still
        // requires the learner to review and explicitly confirm one exercise.
        Bitmap first=null,second=null;
        try{
            int width=processed.getWidth(),height=processed.getHeight();
            if(width<120||height<120){
                processed.recycle();
                finishEducationMathOcr(recognizer,initial,alternate,"","");
                return;
            }
            if(height>=width){
                int band=Math.min(height,Math.max(1,Math.round(height*0.63f)));
                first=Bitmap.createBitmap(processed,0,0,width,band);
                second=Bitmap.createBitmap(processed,0,height-band,width,band);
            }else{
                int band=Math.min(width,Math.max(1,Math.round(width*0.63f)));
                first=Bitmap.createBitmap(processed,0,0,band,height);
                second=Bitmap.createBitmap(processed,width-band,0,band,height);
            }
        }catch(Exception error){
            if(first!=null && first!=processed && !first.isRecycled())first.recycle();
            if(second!=null && second!=processed && !second.isRecycled())second.recycle();
            if(!processed.isRecycled())processed.recycle();
            finishEducationMathOcr(recognizer,initial,alternate,"","");
            return;
        }
        final Bitmap firstRegion=first,secondRegion=second;
        final String[] firstRead={""},secondRead={""};
        try{
            recognizer.process(InputImage.fromBitmap(firstRegion,0))
                .addOnSuccessListener(result->firstRead[0]=result.getText())
                .addOnCompleteListener(task->{
                    if(!firstRegion.isRecycled())firstRegion.recycle();
                    try{
                        recognizer.process(InputImage.fromBitmap(secondRegion,0))
                            .addOnSuccessListener(result->secondRead[0]=result.getText())
                            .addOnCompleteListener(last->{
                                if(!secondRegion.isRecycled())secondRegion.recycle();
                                if(!processed.isRecycled())processed.recycle();
                                finishEducationMathOcr(recognizer,initial,alternate,firstRead[0],secondRead[0]);
                            });
                    }catch(Exception error){
                        if(!secondRegion.isRecycled())secondRegion.recycle();
                        if(!processed.isRecycled())processed.recycle();
                        finishEducationMathOcr(recognizer,initial,alternate,firstRead[0],"");
                    }
                });
        }catch(Exception error){
            if(!firstRegion.isRecycled())firstRegion.recycle();
            if(!secondRegion.isRecycled())secondRegion.recycle();
            if(!processed.isRecycled())processed.recycle();
            finishEducationMathOcr(recognizer,initial,alternate,"","");
        }
    }
    private void scanEducationMathEnhanced(Uri imageUri,
                com.google.mlkit.vision.text.TextRecognizer recognizer,String initial){
        // Decode and enhance off the UI thread. Alongside two full-page reads,
        // independently inspect overlapping image regions on the device.
        new Thread(()->{
            Bitmap enhanced=null;
            try{enhanced=educationEnhancedBitmap(imageUri);}
            catch(Exception ignored){
                finishEducationMathOcr(recognizer,initial,"","","");
                return;
            }
            final Bitmap processed=enhanced;
            runOnUiThread(()->{
                try{
                    recognizer.process(InputImage.fromBitmap(processed,0))
                        .addOnSuccessListener(result->scanEducationMathRegions(recognizer,processed,initial,result.getText()))
                        .addOnFailureListener(error->scanEducationMathRegions(recognizer,processed,initial,""));
                }catch(Exception error){
                    if(!processed.isRecycled())processed.recycle();
                    finishEducationMathOcr(recognizer,initial,"","","");
                }
            });
        },"pocket-education-math-image").start();
    }
    private void recognize(Uri imageUri) {
        final boolean math=educationMathPhoto;
        if(math)mathVisionSourceUri=imageUri;
        educationMathPhoto=false;
        try {
            InputImage input=InputImage.fromFilePath(this,imageUri);
            var recognizer=TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
            recognizer.process(input)
                .addOnSuccessListener(result -> {
                    if(math)scanEducationMathEnhanced(imageUri,recognizer,result.getText());
                    else {notifyWeb("success",result.getText());recognizer.close();}
                })
                .addOnFailureListener(error -> {
                    if(math)scanEducationMathEnhanced(imageUri,recognizer,"");
                    else {notifyWeb("error","Text recognition failed");recognizer.close();}
                });
        } catch(Exception ex) { notifyWeb("error","Image cannot be opened"); }
    }

    private void scanDocumentBytes(String payload){
        String id="";
        try{
            JSONObject request=new JSONObject(payload);
            if(!"scan".equals(request.optString("action")))return;
            id=request.optString("id","");
            final boolean passportRequested="passport".equals(request.optString("type",""));
            final boolean identityRequested="identity".equals(request.optString("type",""));
            if(!id.matches("[a-zA-Z0-9_-]{1,100}"))return;
            String encoded=request.optString("base64","");
            if(encoded.length()<32||encoded.length()>6000000){
                notifyDocumentScan("error","",id);return;
            }
            byte[] bytes=Base64.decode(encoded,Base64.DEFAULT);
            if(bytes.length>4500000){notifyDocumentScan("error","",id);return;}
            BitmapFactory.Options opts=new BitmapFactory.Options();
            opts.inJustDecodeBounds=true;
            BitmapFactory.decodeByteArray(bytes,0,bytes.length,opts);
            if(opts.outWidth<100||opts.outHeight<100||opts.outWidth>4096||opts.outHeight>4096){
                notifyDocumentScan("error","",id);return;
            }
            opts.inJustDecodeBounds=false;
            Bitmap bitmap=BitmapFactory.decodeByteArray(bytes,0,bytes.length,opts);
            if(bitmap==null){notifyDocumentScan("error","",id);return;}
            notifyDocumentScan("started","",id);
            final String docId=id;
            var recognizer=TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
            scanDocumentOrientation(recognizer,bitmap,docId,0,null,-1,passportRequested,identityRequested);
        }catch(Exception error){if(!id.isEmpty())notifyDocumentScan("error","",id);}
    }
    // Document photos can arrive sideways from different camera applications.
    // Try alternate orientations only when the first reading looks insufficient.
    private int passportMrzDigit(String text){
        int[] w={7,3,1};int sum=0;
        for(int i=0;i<text.length();i++){
            char c=text.charAt(i);
            int value=c=='<'?0:(c>='0'&&c<='9'?c-'0':(c>='A'&&c<='Z'?c-'A'+10:-1));
            if(value<0)return -1;
            sum+=value*w[i%3];
        }
        return sum%10;
    }
    private boolean documentHasValidPassportMrz(String raw){
        if(raw==null||raw.isEmpty())return false;
        String[] original=raw.toUpperCase(Locale.ROOT).split("\\R");
        String[] lines=new String[original.length];
        for(int i=0;i<original.length;i++)
            lines[i]=original[i].replaceAll("[^A-Z0-9<]","");
        for(int i=0;i<lines.length;i++){
            if(!lines[i].startsWith("P<"))continue;
            for(int upperCount=1;upperCount<=3&&i+upperCount<=lines.length;upperCount++){
                StringBuilder a=new StringBuilder();
                for(int x=i;x<i+upperCount;x++)a.append(lines[x]);
                if(a.length()!=44)continue;
                for(int lowerCount=1;lowerCount<=3&&i+upperCount+lowerCount<=lines.length;lowerCount++){
                    StringBuilder b=new StringBuilder();
                    for(int x=i+upperCount;x<i+upperCount+lowerCount;x++)b.append(lines[x]);
                    if(b.length()!=44)continue;
                    String lower=b.toString();
                    if(!Character.isDigit(lower.charAt(9))||
                       !Character.isDigit(lower.charAt(27)))continue;
                    if(passportMrzDigit(lower.substring(0,9))==Character.digit(lower.charAt(9),10)&&
                       passportMrzDigit(lower.substring(21,27))==Character.digit(lower.charAt(27),10))
                        return true;
                }
            }
        }
        return false;
    }
    private boolean documentHasCompletePassportMrz(com.google.mlkit.vision.text.Text result){
        return documentHasValidPassportMrz(result.getText());
    }
    private boolean documentHasCompleteIdentityMrz(com.google.mlkit.vision.text.Text result){
        String[] lines=result.getText().toUpperCase(Locale.ROOT).split("\\R");
        for(int i=0;i<lines.length;i++){
            String a=lines[i].replaceAll("\\s+","");
            if(!a.matches("[IAC][A-Z<][A-Z0-9<]+"))continue;
            if(a.length()==36&&i+1<lines.length){
                String b=lines[i+1].replaceAll("\\s+","");
                if(b.length()==36)return true;
            }
            if(a.length()==30&&i+2<lines.length){
                String b=lines[i+1].replaceAll("\\s+","");
                String c=lines[i+2].replaceAll("\\s+","");
                if(b.length()==30&&c.length()==30)return true;
            }
        }
        return false;
    }
    private int documentReadabilityScore(com.google.mlkit.vision.text.Text result){
        String t=result.getText().toLowerCase(Locale.ROOT);
        String[] labels={"nume","prenume","surname","given name","first name",
            "efternavn","fornavn","date of birth","data nasterii","naissance",
            "date of expiry","data expirarii","expiry","valabil","emiterii",
            "passport number","pasnummer","serie","cnp","numar","number"};
        int score=0;
        for(String label:labels)if(t.contains(label))score+=3;
        if(t.contains("<<"))score+=7;
        if(t.contains("p<"))score+=15;
        if(documentHasCompletePassportMrz(result))score+=90;
        if(documentHasCompleteIdentityMrz(result))score+=90;
        if(java.util.regex.Pattern.compile("[0-9]{2}[./-][0-9]{2}[./-][0-9]{4}").matcher(t).find())score+=3;
        return score;
    }
    private void finishDocumentScan(com.google.mlkit.vision.text.TextRecognizer recognizer,
                                    Bitmap bitmap,String id,com.google.mlkit.vision.text.Text result){
        finishDocumentScan(recognizer,bitmap,id,result,"");
    }
    private void finishDocumentScan(com.google.mlkit.vision.text.TextRecognizer recognizer,
                                    Bitmap bitmap,String id,com.google.mlkit.vision.text.Text result,String extraText){
        try{
            JSONArray lines=new JSONArray();
            // Line coordinates make it possible to find values beside captions.
            for(com.google.mlkit.vision.text.Text.TextBlock block:result.getTextBlocks()){
                for(com.google.mlkit.vision.text.Text.Line line:block.getLines()){
                    if(lines.length()>=150)break;
                    Rect bounds=line.getBoundingBox();
                    if(bounds==null)continue;
                    try{
                        JSONObject row=new JSONObject();
                        row.put("text",line.getText());
                        row.put("left",bounds.left);
                        row.put("top",bounds.top);
                        row.put("right",bounds.right);
                        row.put("bottom",bounds.bottom);
                        lines.put(row);
                    }catch(Exception ignored){}
                }
            }
            String complete=result.getText()+(extraText.isEmpty()?"":"\n"+extraText);
            notifyDocumentScan("success",complete,id,lines);
        }finally{
            recognizer.close();
            bitmap.recycle();
        }
    }
    // Passport MRZ is printed at the bottom of the biodata page. General
    // full-page OCR often loses small machine-readable letters; scan the
    // bottom region separately at every orientation, entirely on device.
    private void scanPassportMrzCrop(com.google.mlkit.vision.text.TextRecognizer recognizer,
                                     Bitmap bitmap,String id,
                                     com.google.mlkit.vision.text.Text fullResult,
                                     int attempt,String bestMrzText,int bestMrzScore){
        final int[] angles={0,90,270,180};
        if(attempt>=angles.length){
            finishDocumentScan(recognizer,bitmap,id,fullResult,bestMrzText);
            return;
        }
        Bitmap rotated=null,region=null;
        try{
            if(angles[attempt]==0){
                rotated=bitmap;
            }else{
                Matrix matrix=new Matrix();
                matrix.postRotate(angles[attempt]);
                rotated=Bitmap.createBitmap(bitmap,0,0,bitmap.getWidth(),bitmap.getHeight(),matrix,true);
            }
            int x=Math.max(0,Math.round(rotated.getWidth()*0.025f));
            int y=Math.max(0,Math.round(rotated.getHeight()*0.55f));
            int width=Math.max(1,rotated.getWidth()-2*x);
            int height=Math.max(1,rotated.getHeight()-y);
            Bitmap cropped=Bitmap.createBitmap(rotated,x,y,width,height);
            if(rotated!=bitmap)rotated.recycle();
            // Upscale the MRZ region only; do not enlarge the saved photo.
            float multiplier=Math.min(2.0f,3000f/Math.max(1,width));
            if(multiplier>1.10f){
                region=Bitmap.createScaledBitmap(cropped,
                    Math.max(1,Math.round(width*multiplier)),
                    Math.max(1,Math.round(height*multiplier)),true);
                if(region!=cropped)cropped.recycle();
            }else region=cropped;
        }catch(Exception ex){
            if(rotated!=null&&rotated!=bitmap&&!rotated.isRecycled())rotated.recycle();
            scanPassportMrzCrop(recognizer,bitmap,id,fullResult,attempt+1,bestMrzText,bestMrzScore);
            return;
        }
        final Bitmap candidate=region;
        recognizer.process(InputImage.fromBitmap(candidate,0))
            .addOnSuccessListener(result->{
                candidate.recycle();
                String mrzText=result.getText();
                boolean valid=documentHasValidPassportMrz(mrzText);
                int score=valid?1000:Math.min(150,mrzText.replaceAll("[^A-Z0-9<]","").length());
                if(mrzText.toUpperCase(Locale.ROOT).contains("P<"))score+=80;
                String nextText=score>bestMrzScore?mrzText:bestMrzText;
                int nextScore=Math.max(bestMrzScore,score);
                if(valid)finishDocumentScan(recognizer,bitmap,id,fullResult,mrzText);
                else scanPassportMrzCrop(recognizer,bitmap,id,fullResult,attempt+1,nextText,nextScore);
            })
            .addOnFailureListener(error->{
                candidate.recycle();
                scanPassportMrzCrop(recognizer,bitmap,id,fullResult,attempt+1,bestMrzText,bestMrzScore);
            });
    }
    private void scanDocumentOrientation(com.google.mlkit.vision.text.TextRecognizer recognizer,
                                         Bitmap bitmap,String id,int attempt,
                                         com.google.mlkit.vision.text.Text best,int bestScore,
                                         boolean passportRequested,boolean identityRequested){
        final int[] rotations={0,90,270,180};
        recognizer.process(InputImage.fromBitmap(bitmap,rotations[attempt]))
            .addOnSuccessListener(result->{
                int score=documentReadabilityScore(result);
                com.google.mlkit.vision.text.Text selected=score>bestScore?result:best;
                int selectedScore=Math.max(bestScore,score);
                // Passport scans should not stop merely because headings read well.
                if((score>=12&&(!passportRequested||documentHasCompletePassportMrz(result))&&
                    (!identityRequested||documentHasCompleteIdentityMrz(result)))||attempt==rotations.length-1){
                    com.google.mlkit.vision.text.Text chosen=selected==null?result:selected;
                    if(passportRequested&&!documentHasCompletePassportMrz(chosen))
                        scanPassportMrzCrop(recognizer,bitmap,id,chosen,0,"",-1);
                    else finishDocumentScan(recognizer,bitmap,id,chosen);
                }else{
                    scanDocumentOrientation(recognizer,bitmap,id,attempt+1,selected,selectedScore,passportRequested,identityRequested);
                }
            })
            .addOnFailureListener(error->{
                if(attempt<rotations.length-1){
                    scanDocumentOrientation(recognizer,bitmap,id,attempt+1,best,bestScore,passportRequested,identityRequested);
                }else if(best!=null){
                    if(passportRequested&&!documentHasCompletePassportMrz(best))
                        scanPassportMrzCrop(recognizer,bitmap,id,best,0,"",-1);
                    else finishDocumentScan(recognizer,bitmap,id,best);
                }else{
                    notifyDocumentScan("error","",id);
                    recognizer.close();bitmap.recycle();
                }
            });
    }
    private void notifyDocumentScan(String status,String text,String id){
        notifyDocumentScan(status,text,id,new JSONArray());
    }
    private void notifyDocumentScan(String status,String text,String id,JSONArray lines){
        try{
            JSONObject result=new JSONObject();
            result.put("status",status);result.put("text",text);result.put("id",id);
            result.put("lines",lines);
            String js="window.pocketAndroidDocumentScanResult && window.pocketAndroidDocumentScanResult("+result.toString()+");";
            runOnUiThread(()->{
                if(web!=null && APP_HOST.equals(Uri.parse(web.getUrl()==null?"":web.getUrl()).getHost()))
                    web.evaluateJavascript(js,null);
            });
        }catch(Exception ignored){}
    }

    // The Cloudflare vision pilot may access only the last Math photo, and only
    // after the user explicitly asks for image comparison in the review dialog.
    private void notifyMathVisionPhoto(String status,String chunk,String id){
        try{
            JSONObject message=new JSONObject();
            message.put("status",status);message.put("id",id);
            if(chunk!=null&&!chunk.isEmpty())message.put("chunk",chunk);
            String script="window.pocketAndroidMathVisionResult && window.pocketAndroidMathVisionResult("+message.toString()+");";
            runOnUiThread(()->{
                if(web!=null&&APP_HOST.equals(Uri.parse(web.getUrl()==null?"":web.getUrl()).getHost()))
                    web.evaluateJavascript(script,null);
            });
        }catch(Exception ignored){}
    }
    private void sendMathVisionPhoto(String id){
        final Uri photo=mathVisionSourceUri;
        if(photo==null){notifyMathVisionPhoto("error","",id);return;}
        new Thread(()->{
            Bitmap original=null,scaled=null;
            try{
                original=educationVisionBitmap(photo);
                int w=original.getWidth(),h=original.getHeight();
                float factor=Math.min(1f,2000f/Math.max(w,h));
                scaled=factor<1f?Bitmap.createScaledBitmap(original,Math.max(1,Math.round(w*factor)),Math.max(1,Math.round(h*factor)),true):original;
                ByteArrayOutputStream out=new ByteArrayOutputStream();
                scaled.compress(Bitmap.CompressFormat.JPEG,78,out);
                if(out.size()>950000){out.reset();scaled.compress(Bitmap.CompressFormat.JPEG,62,out);}
                if(out.size()>950000){out.reset();scaled.compress(Bitmap.CompressFormat.JPEG,45,out);}
                if(out.size()>950000){notifyMathVisionPhoto("error","",id);return;}
                String encoded=Base64.encodeToString(out.toByteArray(),Base64.NO_WRAP);
                for(int i=0;i<encoded.length();i+=48000)
                    notifyMathVisionPhoto("chunk",encoded.substring(i,Math.min(i+48000,encoded.length())),id);
                notifyMathVisionPhoto("complete","",id);
            }catch(Exception ignored){
                notifyMathVisionPhoto("error","",id);
            }finally{
                if(scaled!=null&&scaled!=original&&!scaled.isRecycled())scaled.recycle();
                if(original!=null&&!original.isRecycled())original.recycle();
            }
        },"pocket-math-vision-optin").start();
    }
    private void notifyWeb(String status,String text) {
        notifyWeb(status,text,"");
    }
    private void notifyWeb(String status,String text,String alternative) {
        try {
            JSONObject payload=new JSONObject();
            payload.put("status",status);
            payload.put("text",text);
            if(alternative!=null&&!alternative.isEmpty())payload.put("alternative",alternative);
            String js="window.pocketAndroidOcrResult && window.pocketAndroidOcrResult("+payload.toString()+");";
            runOnUiThread(() -> {
                if (web!=null && APP_HOST.equals(Uri.parse(web.getUrl()==null?"":web.getUrl()).getHost()))
                    web.evaluateJavascript(js,null);
            });
        }catch(Exception ignored){}
    }

    private void notifyEducationPdf(String status){
        try{
            String script="window.pocketEduPrintResult&&window.pocketEduPrintResult("+JSONObject.quote(status)+");";
            if(web!=null&&APP_HOST.equals(Uri.parse(web.getUrl()==null?"":web.getUrl()).getHost()))
                web.evaluateJavascript(script,null);
        }catch(Exception ignored){}
    }

    // Android Storage Access Framework always creates an application/pdf file.
    // Print requests must complete this save before the system print sheet opens.
    private File educationDocumentsFolder(){
        File folder=new File(getFilesDir(),"documentele_mele");
        if(!folder.exists()&&!folder.mkdirs())throw new IllegalStateException("Documents directory unavailable");
        return folder;
    }
    private String educationSafeFilename(String title){
        String name=(title==null?"":title).replaceAll("[^\\p{L}\\p{N} _.-]","_").replaceAll("\\s+","_");
        name=name.replaceAll("^\\.+","").trim();
        if(name.length()>90)name=name.substring(0,90);
        if(name.isEmpty())name="Material_educational";
        if(!name.toLowerCase(Locale.ROOT).endsWith(".pdf"))name+=".pdf";
        return name;
    }
    private void requestEducationPdfSave(String payload){
        try{
            JSONObject data=new JSONObject(payload);
            String text=data.optString("text","").trim();
            if(text.isEmpty()||text.length()>160000){notifyEducationPdf("error");return;}
            String title=data.optString("title","Material educațional").trim();
            if(title.isEmpty())title="Material educațional";
            File folder=educationDocumentsFolder();
            String requested=educationSafeFilename(title);
            String basename=requested.substring(0,requested.length()-4);
            File output=new File(folder,requested);
            int suffix=2;
            while(output.exists()){output=new File(folder,basename+"_"+suffix+".pdf");suffix++;}
            if(!saveEducationPdf(output,title,text,data.optBoolean("color",true),data.optJSONArray("figures")))throw new IOException("PDF write failed");
            notifyEducationPdf("saved");
            if("print".equals(data.optString("mode","save")))printSavedEducationPdf(output,title);
        }catch(Exception ignored){notifyEducationPdf("error");}
    }
    private void listEducationDocuments(){
        try{
            File[] files=educationDocumentsFolder().listFiles((dir,name)->name.toLowerCase(Locale.ROOT).endsWith(".pdf"));
            JSONArray records=new JSONArray();
            if(files!=null){
                java.util.Arrays.sort(files,(a,b)->Long.compare(b.lastModified(),a.lastModified()));
                for(File file:files){
                    if(records.length()>=250)break;
                    if(!file.isFile())continue;
                    JSONObject record=new JSONObject();
                    record.put("name",file.getName());
                    record.put("bytes",file.length());
                    record.put("date",file.lastModified());
                    records.put(record);
                }
            }
            String js="window.pocketEducationDocuments&&window.pocketEducationDocuments("+records.toString()+");";
            if(web!=null&&APP_HOST.equals(Uri.parse(web.getUrl()==null?"":web.getUrl()).getHost()))web.evaluateJavascript(js,null);
        }catch(Exception ignored){notifyEducationPdf("error");}
    }
    private void printEducationDocumentByName(String filename){
        try{
            if(filename==null||!filename.matches("[^/\\\\]{1,150}\\.pdf"))return;
            File folder=educationDocumentsFolder();
            File file=new File(folder,filename);
            if(!file.getCanonicalPath().startsWith(folder.getCanonicalPath()+File.separator)||!file.isFile())return;
            printSavedEducationPdf(file,filename.replaceFirst("(?i)\\.pdf$",""));
        }catch(Exception ignored){notifyEducationPdf("error");}
    }

    // Shares only a previously saved PDF through Android's chooser, never its raw text.
    private void shareEducationDocumentByName(String filename){
        try{
            if(filename==null||!filename.matches("[^/\\\\]{1,150}\\.pdf"))return;
            File folder=educationDocumentsFolder();
            File file=new File(folder,filename);
            if(!file.getCanonicalPath().startsWith(folder.getCanonicalPath()+File.separator)||!file.isFile())return;
            Uri uri=FileProvider.getUriForFile(this,getPackageName()+".fileprovider",file);
            Intent send=new Intent(Intent.ACTION_SEND);
            send.setType("application/pdf");
            send.putExtra(Intent.EXTRA_STREAM,uri);
            send.putExtra(Intent.EXTRA_SUBJECT,filename);
            prefillEmailForSharedPdf(send);
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            send.setClipData(android.content.ClipData.newUri(getContentResolver(),filename,uri));
            startActivity(Intent.createChooser(send,"Trimite documentul PDF"));
        }catch(Exception ignored){notifyEducationPdf("shareUnavailable");}
    }

    // Render the exact saved PDF bytes inside the app. No third-party viewer is launched.
    // Keep only one page bitmap in memory; page changes do not accumulate bitmaps.
    private void renderEducationPdfPage(PdfRenderer renderer,int index,ImageView image,TextView count,Bitmap[] active){
        try(PdfRenderer.Page page=renderer.openPage(index)){
            int displayWidth=getResources().getDisplayMetrics().widthPixels;
            int width=Math.min(1200,Math.max(480,displayWidth*2));
            int height=Math.max(1,Math.round(width*(page.getHeight()/(float)page.getWidth())));
            Bitmap bitmap=Bitmap.createBitmap(width,height,Bitmap.Config.ARGB_8888);
            bitmap.eraseColor(Color.WHITE);
            page.render(bitmap,null,null,PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);
            Bitmap previous=active[0];
            image.setImageBitmap(bitmap);
            active[0]=bitmap;
            if(previous!=null&&!previous.isRecycled())previous.recycle();
            count.setText("Pagina "+(index+1)+" din "+renderer.getPageCount());
        }catch(Exception ignored){
            count.setText("Pagina PDF nu poate fi afișată.");
        }
    }
    private void openEducationDocumentByName(String filename){
        ParcelFileDescriptor descriptor=null;
        PdfRenderer renderer=null;
        try{
            if(filename==null||!filename.matches("[^/\\\\]{1,150}\\.pdf"))return;
            File folder=educationDocumentsFolder();
            File file=new File(folder,filename);
            if(!file.getCanonicalPath().startsWith(folder.getCanonicalPath()+File.separator)||!file.isFile())return;
            descriptor=ParcelFileDescriptor.open(file,ParcelFileDescriptor.MODE_READ_ONLY);
            renderer=new PdfRenderer(descriptor);
            if(renderer.getPageCount()<1)throw new IOException("Empty PDF");
            final PdfRenderer pdf=renderer;
            final ParcelFileDescriptor handle=descriptor;
            android.app.Dialog dialog=new android.app.Dialog(this);
            LinearLayout root=new LinearLayout(this);
            root.setOrientation(LinearLayout.VERTICAL);
            root.setBackgroundColor(Color.rgb(10,31,45));
            LinearLayout top=new LinearLayout(this);
            top.setOrientation(LinearLayout.HORIZONTAL);
            top.setGravity(Gravity.CENTER_VERTICAL);
            android.widget.Button back=new android.widget.Button(this);
            back.setText("← Înapoi");
            back.setOnClickListener(v->dialog.dismiss());
            TextView heading=new TextView(this);
            heading.setText(filename);
            heading.setTextColor(Color.WHITE);
            heading.setTextSize(TypedValue.COMPLEX_UNIT_SP,15);
            heading.setMaxLines(2);
            heading.setEllipsize(android.text.TextUtils.TruncateAt.END);
            top.addView(back,new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,LinearLayout.LayoutParams.WRAP_CONTENT));
            top.addView(heading,new LinearLayout.LayoutParams(0,
                LinearLayout.LayoutParams.WRAP_CONTENT,1f));
            root.addView(top,new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,LinearLayout.LayoutParams.WRAP_CONTENT));
            android.widget.ScrollView scroll=new android.widget.ScrollView(this);
            scroll.setFillViewport(true);
            scroll.setBackgroundColor(Color.rgb(224,229,234));
            ImageView pageImage=new ImageView(this);
            pageImage.setAdjustViewBounds(true);
            pageImage.setScaleType(ImageView.ScaleType.FIT_CENTER);
            pageImage.setBackgroundColor(Color.WHITE);
            final int pad=Math.round(10*getResources().getDisplayMetrics().density);
            scroll.setPadding(pad,pad,pad,pad);
            scroll.addView(pageImage,new android.widget.ScrollView.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,LinearLayout.LayoutParams.WRAP_CONTENT));
            root.addView(scroll,new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,0,1f));
            LinearLayout navigation=new LinearLayout(this);
            navigation.setGravity(Gravity.CENTER);
            navigation.setOrientation(LinearLayout.HORIZONTAL);
            android.widget.Button prev=new android.widget.Button(this);
            prev.setText("◀");
            android.widget.Button next=new android.widget.Button(this);
            next.setText("▶");
            TextView pageLabel=new TextView(this);
            pageLabel.setTextColor(Color.WHITE);
            pageLabel.setGravity(Gravity.CENTER);
            pageLabel.setTextSize(TypedValue.COMPLEX_UNIT_SP,14);
            navigation.addView(prev,new LinearLayout.LayoutParams(0,
                LinearLayout.LayoutParams.WRAP_CONTENT,1f));
            navigation.addView(pageLabel,new LinearLayout.LayoutParams(0,
                LinearLayout.LayoutParams.WRAP_CONTENT,2f));
            navigation.addView(next,new LinearLayout.LayoutParams(0,
                LinearLayout.LayoutParams.WRAP_CONTENT,1f));
            root.addView(navigation,new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,LinearLayout.LayoutParams.WRAP_CONTENT));
            final int[] index={0};
            final Bitmap[] active={null};
            Runnable render=()->{
                renderEducationPdfPage(pdf,index[0],pageImage,pageLabel,active);
                prev.setEnabled(index[0]>0);
                next.setEnabled(index[0]<pdf.getPageCount()-1);
                scroll.scrollTo(0,0);
            };
            prev.setOnClickListener(v->{if(index[0]>0){index[0]--;render.run();}});
            next.setOnClickListener(v->{if(index[0]+1<pdf.getPageCount()){index[0]++;render.run();}});
            dialog.setContentView(root);
            dialog.setOnDismissListener(v->{
                pageImage.setImageDrawable(null);
                if(active[0]!=null&&!active[0].isRecycled())active[0].recycle();
                try{pdf.close();}catch(Exception ignored){}
                try{handle.close();}catch(Exception ignored){}
            });
            dialog.show();
            if(dialog.getWindow()!=null){
                dialog.getWindow().setLayout(
                    android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                    android.view.ViewGroup.LayoutParams.MATCH_PARENT);
            }
            render.run();
        }catch(Exception ignored){
            try{if(renderer!=null)renderer.close();}catch(Exception ignoredClose){}
            try{if(descriptor!=null)descriptor.close();}catch(Exception ignoredClose){}
            notifyEducationPdf("openUnavailable");
        }
    }
    // A single Android chooser sends all selected PDFs together.
    private void shareManyEducationDocuments(String payload){
        try{
            JSONArray files=new JSONArray(payload);
            if(files.length()<1||files.length()>250)return;
            File folder=educationDocumentsFolder();
            ArrayList<Uri> uris=new ArrayList<>();
            java.util.HashSet<String> unique=new java.util.HashSet<>();
            for(int i=0;i<files.length();i++){
                String name=files.optString(i,"");
                if(!name.matches("[^/\\\\]{1,150}\\.pdf")||!unique.add(name))continue;
                File file=new File(folder,name);
                if(!file.getCanonicalPath().startsWith(folder.getCanonicalPath()+File.separator)||!file.isFile())continue;
                uris.add(FileProvider.getUriForFile(this,getPackageName()+".fileprovider",file));
            }
            if(uris.isEmpty())return;
            Intent send=new Intent(Intent.ACTION_SEND_MULTIPLE);
            send.setType("application/pdf");
            send.putParcelableArrayListExtra(Intent.EXTRA_STREAM,uris);
            prefillEmailForSharedPdf(send);
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            android.content.ClipData clip=android.content.ClipData.newUri(
                getContentResolver(),"Documentele mele",uris.get(0));
            for(int i=1;i<uris.size();i++)clip.addItem(new android.content.ClipData.Item(uris.get(i)));
            send.setClipData(clip);
            startActivity(Intent.createChooser(send,"Trimite documentele PDF"));
        }catch(Exception ignored){notifyEducationPdf("shareUnavailable");}
    }
    // One confirmation in the UI, one atomic selection batch; no file outside the app folder.
    private void deleteManyEducationDocuments(String payload){
        try{
            JSONArray files=new JSONArray(payload);
            if(files.length()<1||files.length()>250)return;
            File folder=educationDocumentsFolder();
            java.util.HashSet<String> unique=new java.util.HashSet<>();
            for(int i=0;i<files.length();i++){
                String name=files.optString(i,"");
                if(!name.matches("[^/\\\\]{1,150}\\.pdf")||!unique.add(name))continue;
                File file=new File(folder,name);
                if(!file.getCanonicalPath().startsWith(folder.getCanonicalPath()+File.separator)||!file.isFile())continue;
                file.delete();
            }
            listEducationDocuments();
        }catch(Exception ignored){notifyEducationPdf("error");}
    }
    // Called only after explicit confirmation in the document library UI.
    private void deleteEducationDocumentByName(String filename){
        try{
            if(filename==null||!filename.matches("[^/\\\\]{1,150}\\.pdf"))return;
            File folder=educationDocumentsFolder();
            File file=new File(folder,filename);
            if(!file.getCanonicalPath().startsWith(folder.getCanonicalPath()+File.separator)||!file.isFile())return;
            if(file.delete())listEducationDocuments();
            else notifyEducationPdf("error");
        }catch(Exception ignored){notifyEducationPdf("error");}
    }

    // Structured A4 PDF: explicit paragraphs, headings and page numbers.
    // Colour is optional; black-and-white output remains available.
    private boolean saveEducationPdf(File destination,String title,String content,boolean useColor,JSONArray figures){
        PdfDocument document=new PdfDocument();
        try{
            final int width=595,height=842,margin=48,usable=width-2*margin;
            final int accent=useColor?Color.rgb(26,106,154):Color.BLACK;
            Paint body=new Paint(Paint.ANTI_ALIAS_FLAG);
            body.setColor(Color.rgb(35,43,48));body.setTextSize(11.5f);
            body.setTypeface(Typeface.create("sans-serif",Typeface.NORMAL));
            Paint heading=new Paint(Paint.ANTI_ALIAS_FLAG);
            heading.setColor(accent);heading.setTextSize(15.5f);
            heading.setTypeface(Typeface.create("sans-serif",Typeface.BOLD));
            Paint mainTitle=new Paint(Paint.ANTI_ALIAS_FLAG);
            mainTitle.setColor(accent);mainTitle.setTextSize(19f);
            mainTitle.setTypeface(Typeface.create("sans-serif",Typeface.BOLD));
            Paint footer=new Paint(Paint.ANTI_ALIAS_FLAG);
            footer.setColor(useColor?Color.rgb(92,115,126):Color.DKGRAY);
            footer.setTextSize(9f);
            Paint rule=new Paint(Paint.ANTI_ALIAS_FLAG);rule.setColor(accent);rule.setStrokeWidth(1.5f);
            PdfDocument.Page page=null;Canvas canvas=null;
            int pageNumber=0;float y=margin+14;
            String cleanTitle=title==null?"Material educațional":title.trim();
            String[] paragraphs=(cleanTitle+"\n\n"+content.replace("\r","")).split("\n",-1);
            boolean first=true,blankBefore=false;
            for(String raw:paragraphs){
                // Convert Markdown styling to native PDF typography, not literal "**" glyphs.
                // Correct a confirmed erroneous AI heading ("Lehul/Lehula") conservatively.
                boolean markedHeading=raw.trim().matches("^\\*\\*[^*]{3,90}\\*\\*$");
                String paragraph=raw.replaceAll("(?iu)\\bLehul(?:a)?\\b","Lecția")
                    .replace("**","").replace("__","").replaceAll("[ \\t]+"," ").trim();
                if(paragraph.isEmpty()){blankBefore=true;continue;}
                boolean isTitle=first;
                boolean isHeading=!first&&(markedHeading||paragraph.matches("(?iu)^(?:#{1,4}\\s*)?(?:\\d{1,2}[.)]\\s+)?(?:introducere|concluzii?|rezumat|personaje(?: principale)?|prezentarea acțiunii|analiză|context(?: istoric)?|bibliografie|cuprins|definiții|teorie|metodologie|rezolvare|rezultate|interpretare|observații|exemple|capitolul?\\s+\\w+)(?:\\s*[:—–-].*)?$")||paragraph.matches("^#{1,4}\\s+.+")||paragraph.matches("^\\d{1,2}\\.\\s+[^.]{3,85}$"));
                String lineText=paragraph.replaceFirst("^#{1,4}\\s+","");
                Paint paint=isTitle?mainTitle:(isHeading?heading:body);
                float lineHeight=isTitle?27f:(isHeading?22f:18f);
                if(page==null||y+lineHeight+(isHeading?14:0)>height-margin-28){
                    if(page!=null){
                        canvas.drawLine(margin,height-53,width-margin,height-53,rule);
                        canvas.drawText("Pagina "+pageNumber, width-margin-footer.measureText("Pagina "+pageNumber),height-37,footer);
                        document.finishPage(page);
                    }
                    page=document.startPage(new PdfDocument.PageInfo.Builder(width,height,++pageNumber).create());
                    canvas=page.getCanvas();y=margin+14;
                }
                if(blankBefore&&!isTitle)y+=isHeading?9f:7f;
                if(isHeading&&y>margin+20)y+=5f;
                if(y+lineHeight>height-margin-28){
                    canvas.drawLine(margin,height-53,width-margin,height-53,rule);
                    canvas.drawText("Pagina "+pageNumber,width-margin-footer.measureText("Pagina "+pageNumber),height-37,footer);
                    document.finishPage(page);
                    page=document.startPage(new PdfDocument.PageInfo.Builder(width,height,++pageNumber).create());
                    canvas=page.getCanvas();y=margin+14;
                }
                boolean bullet=!isHeading&&!isTitle&&lineText.matches("^[-•*]\\s+.*");
                if(bullet)lineText=lineText.replaceFirst("^[-•*]\\s+","• ");
                String remaining=lineText;
                boolean firstLine=true;
                while(!remaining.isEmpty()){
                    float inset=isTitle||isHeading?0:(firstLine?16:0);
                    float available=usable-inset;
                    if(y+lineHeight>height-margin-28){
                        canvas.drawLine(margin,height-53,width-margin,height-53,rule);
                        canvas.drawText("Pagina "+pageNumber,width-margin-footer.measureText("Pagina "+pageNumber),height-37,footer);
                        document.finishPage(page);
                        page=document.startPage(new PdfDocument.PageInfo.Builder(width,height,++pageNumber).create());
                        canvas=page.getCanvas();y=margin+14;
                    }
                    int take=paint.breakText(remaining,true,available,null);
                    take=Math.max(1,Math.min(take,remaining.length()));
                    if(take<remaining.length()){
                        int space=remaining.lastIndexOf(' ',take);
                        if(space>take/2)take=space;
                    }
                    String line=remaining.substring(0,take).trim();
                    if(!line.isEmpty())canvas.drawText(line,margin+inset,y,paint);
                    y+=lineHeight;
                    remaining=remaining.substring(take).trim();
                    firstLine=false;
                }
                if(isTitle){
                    y+=9;
                    canvas.drawLine(margin,y,width-margin,y,rule);
                    y+=13;
                }
                first=false;blankBefore=false;
            }
            // Append captured figures in their original colors, with proportional scaling.
            // Never decode unbounded images supplied by web content.
            if(figures!=null&&figures.length()>0){
                for(int i=0;i<Math.min(3,figures.length());i++){
                    JSONObject figure=figures.optJSONObject(i);
                    if(figure==null)continue;
                    String encoded=figure.optString("data","");
                    if(!encoded.startsWith("data:image/jpeg;base64,")||encoded.length()>115000)continue;
                    byte[] bytes=Base64.decode(encoded.substring(encoded.indexOf(',')+1),Base64.DEFAULT);
                    BitmapFactory.Options bounds=new BitmapFactory.Options();bounds.inJustDecodeBounds=true;
                    BitmapFactory.decodeByteArray(bytes,0,bytes.length,bounds);
                    if(bounds.outWidth<=0||bounds.outHeight<=0||bounds.outWidth>2000||bounds.outHeight>2000)continue;
                    Bitmap bitmap=BitmapFactory.decodeByteArray(bytes,0,bytes.length);
                    if(bitmap==null)continue;
                    try{
                        float targetWidth=Math.min(usable,bitmap.getWidth());
                        float targetHeight=targetWidth*bitmap.getHeight()/Math.max(1f,bitmap.getWidth());
                        float limit=height-2*margin-90;
                        if(targetHeight>limit){targetHeight=limit;targetWidth=targetHeight*bitmap.getWidth()/bitmap.getHeight();}
                        if(page==null||y+targetHeight+38>height-margin-28){
                            if(page!=null){
                                canvas.drawLine(margin,height-53,width-margin,height-53,rule);
                                canvas.drawText("Pagina "+pageNumber,width-margin-footer.measureText("Pagina "+pageNumber),height-37,footer);
                                document.finishPage(page);
                            }
                            page=document.startPage(new PdfDocument.PageInfo.Builder(width,height,++pageNumber).create());
                            canvas=page.getCanvas();y=margin+14;
                        }
                        y+=10;
                        Paint figurePaint=new Paint(Paint.ANTI_ALIAS_FLAG|Paint.FILTER_BITMAP_FLAG);
                        if(!useColor){
                            android.graphics.ColorMatrix saturation=new android.graphics.ColorMatrix();
                            saturation.setSaturation(0);
                            figurePaint.setColorFilter(new ColorMatrixColorFilter(saturation));
                        }
                        canvas.drawBitmap(bitmap,null,new android.graphics.RectF(margin,y,margin+targetWidth,y+targetHeight),figurePaint);
                        y+=targetHeight+18;
                        String label=figure.optString("label","Figură").replaceAll("[\r\n]+"," ").trim();
                        if(label.length()>75)label=label.substring(0,75);
                        canvas.drawText(label,margin,y,footer);y+=18;
                    }finally{bitmap.recycle();}
                }
            }
            if(page==null){
                page=document.startPage(new PdfDocument.PageInfo.Builder(width,height,1).create());
                canvas=page.getCanvas();pageNumber=1;
            }
            canvas.drawLine(margin,height-53,width-margin,height-53,rule);
            canvas.drawText("Pagina "+pageNumber,width-margin-footer.measureText("Pagina "+pageNumber),height-37,footer);
            document.finishPage(page);
            try(OutputStream stream=new FileOutputStream(destination)){
                document.writeTo(stream);
                stream.flush();
            }
            return true;
        }catch(Exception ignored){return false;}
        finally{document.close();}
    }

    // Print exactly the PDF that was saved, instead of regenerating a second document.
    private void printSavedEducationPdf(File savedPdf,String title){
        try{
            PrintManager manager=(PrintManager)getSystemService(Context.PRINT_SERVICE);
            if(manager==null){notifyEducationPdf("printUnavailable");return;}
            final String job=title.trim().isEmpty()?"Material educațional":title.trim();
            PrintDocumentAdapter adapter=new PrintDocumentAdapter(){
                @Override public void onLayout(PrintAttributes oldAttributes,PrintAttributes newAttributes,
                        CancellationSignal cancellation,LayoutResultCallback callback,Bundle extras){
                    if(cancellation.isCanceled()){callback.onLayoutCancelled();return;}
                    PrintDocumentInfo info=new PrintDocumentInfo.Builder(job+".pdf")
                        .setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT)
                        .setPageCount(PrintDocumentInfo.PAGE_COUNT_UNKNOWN).build();
                    callback.onLayoutFinished(info,true);
                }
                @Override public void onWrite(PageRange[] pages,ParcelFileDescriptor destination,
                        CancellationSignal cancellation,WriteResultCallback callback){
                    try(InputStream input=new java.io.FileInputStream(savedPdf);
                        FileOutputStream output=new FileOutputStream(destination.getFileDescriptor())){
                        if(input==null)throw new IOException("Cannot read PDF");
                        byte[] buffer=new byte[16384];int read;
                        while((read=input.read(buffer))!=-1){
                            if(cancellation.isCanceled()){callback.onWriteCancelled();return;}
                            output.write(buffer,0,read);
                        }
                        output.flush();
                        callback.onWriteFinished(new PageRange[]{PageRange.ALL_PAGES});
                    }catch(Exception ignored){callback.onWriteFailed("PDF unavailable");}
                }
            };
            manager.print(job,adapter,null);
        }catch(Exception ignored){notifyEducationPdf("printUnavailable");}
    }

    // Print only text explicitly submitted from the Education preview, never the entire app UI.
    // Android's system print sheet supports physical printers and "Save as PDF".
    private void printEducationalMaterial(String payload){
        try{
            JSONObject data=new JSONObject(payload);
            String title=data.optString("title","Material educațional").trim();
            String text=data.optString("text","").trim();
            if(text.isEmpty()||text.length()>160000||appFrame==null)return;
            if(title.isEmpty())title="Material educațional";
            if(title.length()>120)title=title.substring(0,120);
            final String jobTitle=title;
            final WebView printable=new WebView(this);
            educationPrintWebs.add(printable);
            printable.setBackgroundColor(Color.WHITE);
            FrameLayout.LayoutParams layout=new FrameLayout.LayoutParams(1,1);
            appFrame.addView(printable,layout);
            String safeTitle=android.text.TextUtils.htmlEncode(title);
            String safeText=android.text.TextUtils.htmlEncode(text);
            String html="<html><head><meta charset='utf-8'><style>@page{size:A4;margin:16mm}body{font:11pt Arial,sans-serif;color:#111;line-height:1.5}h1{font-size:18pt;page-break-after:avoid}article{white-space:pre-wrap;overflow-wrap:anywhere}</style></head><body><h1>"+safeTitle+"</h1><article>"+safeText+"</article></body></html>";
            printable.setWebViewClient(new WebViewClient(){
                private boolean started=false;
                @Override public void onPageFinished(WebView view,String url){
                    if(started)return;started=true;
                    try{
                        PrintManager manager=(PrintManager)getSystemService(Context.PRINT_SERVICE);
                        if(manager==null)return;
                        PrintDocumentAdapter adapter=printable.createPrintDocumentAdapter(jobTitle);
                        manager.print(jobTitle,adapter,null);
                    }catch(Exception ignored){}
                }
            });
            printable.loadDataWithBaseURL("https://"+APP_HOST+"/",html,"text/html","UTF-8",null);
        }catch(Exception ignored){}
    }

    @Override protected void onDestroy(){finishCommVoice(false);if(documentPhotoCallback!=null){documentPhotoCallback.onReceiveValue(null);documentPhotoCallback=null;}stopMathPcmRecording();stopEmbeddedListening();if(tts!=null){tts.stop();tts.shutdown();}mathVisionSourceUri=null;if(web!=null){web.destroy();}for(WebView printable:educationPrintWebs){printable.destroy();}educationPrintWebs.clear();super.onDestroy();}

}
