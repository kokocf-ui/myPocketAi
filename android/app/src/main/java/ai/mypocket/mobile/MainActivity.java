package ai.mypocket.mobile;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.RecognitionListener;
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

public final class MainActivity extends ComponentActivity {
    private static final String APP_URL = "https://lifewise-ai-v2.kokocf.workers.dev/";
    private static final String APP_HOST = "lifewise-ai-v2.kokocf.workers.dev";
    private WebView web;
    private Uri cameraUri;
    private boolean waitingForPhoto = false;
    // User-selected document photos only; the WebView gets one chooser result, not broad file access.
    private ValueCallback<Uri[]> documentPhotoCallback;
    private Uri documentCameraUri;
    private boolean scanNextDocumentPhoto=false;
    private TextToSpeech tts;
    private boolean ttsReady=false;
    private String speechMode="dictation";
    private SpeechRecognizer speechRecognizer;
    private boolean nativeListening=false;
    private GeolocationPermissions.Callback pendingGeoCallback;
    private String pendingGeoOrigin;
    private String pendingSpeechLocale="ro-RO";
    private static final String FIRST_MIC_PERMISSION_FLAG="first_microphone_permission_requested";
    private boolean microphoneRequestedForListening=false;
    private final Handler voiceEndpointHandler=new Handler(Looper.getMainLooper());
    private Runnable voiceEndpointTask;
    private String lastVoicePartial="";

    private static final String NOTIFICATION_PERMISSION_FLAG="agenda_notification_permission_requested";
    private final ActivityResultLauncher<String> notificationPermission =
        registerForActivityResult(new ActivityResultContracts.RequestPermission(), granted -> {
            // Events have already been persisted and scheduled in the native scheduler.
            // The OS displays them when permission is granted.
        });

    private void ensureAgendaNotificationPermission(){
        if(Build.VERSION.SDK_INT<33 || ContextCompat.checkSelfPermission(this,
            Manifest.permission.POST_NOTIFICATIONS)==PackageManager.PERMISSION_GRANTED)return;
        var prefs=getSharedPreferences("pocket_permissions",Context.MODE_PRIVATE);
        if(prefs.getBoolean(NOTIFICATION_PERMISSION_FLAG,false))return;
        prefs.edit().putBoolean(NOTIFICATION_PERMISSION_FLAG,true).apply();
        notificationPermission.launch(Manifest.permission.POST_NOTIFICATIONS);
    }

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
            microphoneRequestedForListening=false;
            if(granted && resumeListening)beginEmbeddedListening();
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
            requestMicrophonePermissionOnce();
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
        if(granted){notifyLocationPermission(true);requestMicrophonePermissionOnce();return;}
        locationPermission.launch(new String[]{Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.ACCESS_COARSE_LOCATION});
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
           "documents".equals(speechMode))return;
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
                    notifyVoice("recognized",values!=null&&!values.isEmpty()?values.get(0):"",speechMode);
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
            intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS,2200L);
            intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS,1400L);
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
            if("stop".equals(action)) { if(tts!=null) tts.stop();stopEmbeddedListening(); return; }
            if("stopListen".equals(action)){stopEmbeddedListening();return;}
            if("speak".equals(action)) {
                if(!ttsReady || tts==null){notifyVoice("error","Voice engine is not ready","tts");return;}
                String text=data.optString("text","");
                if(text.isEmpty())return;
                if(text.length()>16000)text=text.substring(0,16000);
                String language=data.optString("language","ro-RO");
                tts.setLanguage(Locale.forLanguageTag(language));
                tts.setSpeechRate(0.96f);
                int status=tts.speak(text,TextToSpeech.QUEUE_FLUSH,null,"pocket-native-voice");
                if(status==TextToSpeech.ERROR)notifyVoice("error","Could not start speech","tts");
            }else if("listen".equals(action)) {
                speechMode=data.optString("mode","dictation");
                pendingSpeechLocale=data.optString("language","ro-RO");
                if(ContextCompat.checkSelfPermission(this,Manifest.permission.RECORD_AUDIO)==PackageManager.PERMISSION_GRANTED)beginEmbeddedListening();
                else {microphoneRequestedForListening=true;micPermission.launch(Manifest.permission.RECORD_AUDIO);}
            }
        }catch(Exception ex){notifyVoice("error","Speech service unavailable","tts");}
    }

    private void notifyVoice(String status,String value,String mode) {
        try {
            JSONObject data=new JSONObject();
            data.put("status",status);
            data.put("text",value);
            data.put("mode",mode);
            String js="window.pocketAndroidVoiceResult && window.pocketAndroidVoiceResult("+data.toString()+");";
            runOnUiThread(()->{
                if(web!=null && APP_HOST.equals(Uri.parse(web.getUrl()==null?"":web.getUrl()).getHost()))
                    web.evaluateJavascript(js,null);
            });
        }catch(Exception ignored){}
    }

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        WindowCompat.setDecorFitsSystemWindows(getWindow(),true);
        getWindow().getDecorView().setSystemUiVisibility(0);
        getWindow().setStatusBarColor(Color.rgb(6,20,32));
        getWindow().setNavigationBarColor(Color.rgb(6,20,32));
        web = new WebView(this);
        FrameLayout root=new FrameLayout(this);
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
                boolean imageSelection=false;
                if(params!=null)for(String accepted:params.getAcceptTypes()){
                    if(accepted!=null && accepted.startsWith("image/"))imageSelection=true;
                }
                scanNextDocumentPhoto=imageSelection;
                try{
                    Intent pick=new Intent(Intent.ACTION_GET_CONTENT);
                    pick.setType("image/*");pick.addCategory(Intent.CATEGORY_OPENABLE);
                    Intent chooser=Intent.createChooser(pick,"Alege fotografia documentului");
                    // An optional camera action stays separate from OCR and never uploads images.
                    try{
                        File folder=new File(getCacheDir(),"document-camera");
                        if(!folder.exists())folder.mkdirs();
                        File image=File.createTempFile("document_",".jpg",folder);
                        documentCameraUri=FileProvider.getUriForFile(MainActivity.this,getPackageName()+".fileprovider",image);
                        Intent capture=new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                        capture.putExtra(MediaStore.EXTRA_OUTPUT,documentCameraUri);
                        capture.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION|Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                        chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS,new Intent[]{capture});
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
                else {pendingGeoCallback=callback;pendingGeoOrigin=origin;ensureLocationPermission();}
            }
            @Override public void onGeolocationPermissionsHidePrompt(){pendingGeoCallback=null;pendingGeoOrigin=null;}
            @Override public void onPermissionRequest(PermissionRequest request) {
                runOnUiThread(()->request.deny());
            }
        });
        web.setWebViewClient(new WebViewClient(){
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
                if ("https".equals(url.getScheme()) && url.getHost()!=null) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, url)); } catch(Exception ignored) {}
                }
                return true;
            }
        });
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            WebViewCompat.addWebMessageListener(web, "PocketAndroidOCR",
                Collections.singleton("https://" + APP_HOST),
                (view, message, origin, isMainFrame, replyProxy) -> {
                    if (!isMainFrame || !APP_HOST.equals(origin.getHost())) return;
                    String source=message.getData();
                    runOnUiThread(() -> {
                        if (waitingForPhoto) return;
                        waitingForPhoto=true;
                        if ("camera".equals(source)) launchCamera();
                        else if ("gallery".equals(source)) gallery.launch(new PickVisualMediaRequest.Builder()
                            .setMediaType(ActivityResultContracts.PickVisualMedia.ImageOnly.INSTANCE).build());
                        else waitingForPhoto=false;
                    });
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
        tts=new TextToSpeech(this,status -> {
            ttsReady=status==TextToSpeech.SUCCESS;
            if(!ttsReady)notifyVoice("error","Android voice engine unavailable","tts");
        });
        tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override public void onStart(String id){notifyVoice("start","","tts");}
            @Override public void onDone(String id){notifyVoice("done","","tts");}
            @Override public void onError(String id){notifyVoice("error","Speech playback failed","tts");}
        });
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
                            if(!"sync".equals(data.optString("action","")))return;
                            AgendaReminderScheduler.sync(MainActivity.this,data.getJSONArray("events").toString());
                            ensureAgendaNotificationPermission();
                        }catch(Exception ignored){}
                    });
                });
        }
        AgendaReminderScheduler.reschedule(this);
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
        web.loadUrl(APP_URL + "?nativeLaunch=1");
        // The translucent launcher already asked for both permissions. Do not
        // immediately show a duplicate prompt if the user declined either one.
        if(getSharedPreferences("pocket_permissions",Context.MODE_PRIVATE)
            .getBoolean("startup_location_requested_v3",false)) {
            boolean granted=ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(this,Manifest.permission.ACCESS_COARSE_LOCATION)==PackageManager.PERMISSION_GRANTED;
            notifyLocationPermission(granted);
            requestMicrophonePermissionOnce();
        } else {
            ensureLocationPermission();
        }
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

    private void recognize(Uri imageUri) {
        try {
            InputImage input=InputImage.fromFilePath(this,imageUri);
            var recognizer=TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
            recognizer.process(input)
                .addOnSuccessListener(result -> {
                    notifyWeb("success",result.getText());
                    recognizer.close();
                })
                .addOnFailureListener(error -> {
                    notifyWeb("error","Text recognition failed");
                    recognizer.close();
                });
        } catch(Exception ex) { notifyWeb("error","Image cannot be opened"); }
    }

    private void scanDocumentBytes(String payload){
        String id="";
        try{
            JSONObject request=new JSONObject(payload);
            if(!"scan".equals(request.optString("action")))return;
            id=request.optString("id","");
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
            recognizer.process(InputImage.fromBitmap(bitmap,0))
                .addOnSuccessListener(result->{
                    JSONArray lines=new JSONArray();
                    // ML Kit exposes positions of text lines. Keep this OCR-only data
                    // on the device and use it to pair labels with their actual values.
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
                    notifyDocumentScan("success",result.getText(),docId,lines);
                    recognizer.close();bitmap.recycle();
                })
                .addOnFailureListener(error->{
                    notifyDocumentScan("error","",docId);
                    recognizer.close();bitmap.recycle();
                });
        }catch(Exception error){if(!id.isEmpty())notifyDocumentScan("error","",id);}
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

    private void notifyWeb(String status,String text) {
        try {
            JSONObject payload=new JSONObject();
            payload.put("status",status);
            payload.put("text",text);
            String js="window.pocketAndroidOcrResult && window.pocketAndroidOcrResult("+payload.toString()+");";
            runOnUiThread(() -> {
                if (web!=null && APP_HOST.equals(Uri.parse(web.getUrl()==null?"":web.getUrl()).getHost()))
                    web.evaluateJavascript(js,null);
            });
        }catch(Exception ignored){}
    }

    @Override protected void onDestroy(){if(documentPhotoCallback!=null){documentPhotoCallback.onReceiveValue(null);documentPhotoCallback=null;}stopEmbeddedListening();if(tts!=null){tts.stop();tts.shutdown();}if(web!=null){web.destroy();}super.onDestroy();}

}
