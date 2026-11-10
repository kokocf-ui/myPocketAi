package ai.mypocket.mobile;

import android.app.Activity;
import android.Manifest;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import java.util.ArrayList;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;

import java.util.Collections;
import java.util.Locale;

/**
 * A genuine translucent startup Activity. The model is loaded only from
 * APK assets and rendered with alpha over the wallpaper / previous screen.
 * No permission to draw over other apps is necessary.
 */
public final class AvatarLaunchActivity extends Activity {
    private static final String ORIGIN = "https://appassets.androidplatform.net";
    private static final String GREETING = "Salut! Cum te pot ajuta?";
    private static final String UTTERANCE_ID = "pocket-intro-greeting";

    private final Handler handler = new Handler(Looper.getMainLooper());
    private WebView avatarView;
    private TextToSpeech speech;
    private boolean modelReady = false;
    private boolean ttsReady = false;
    private boolean startedSpeaking = false;
    private boolean finishingLaunch = false;
    private int voiceInitAttempts = 0;
    private static final int ONBOARDING_PERMISSIONS_REQUEST=4832;
    private static final String PREFS_NAME="pocket_permissions";
    private boolean introStarted=false;
    private boolean firstSetupShownThisLaunch=false;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WALLPAPER);
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND);
        getWindow().setDimAmount(0);
        getWindow().getDecorView().setBackgroundColor(Color.TRANSPARENT);

        WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();
        avatarView = new WebView(this);
        avatarView.setBackgroundColor(Color.TRANSPARENT);
        avatarView.setAlpha(0f); // no black or rectangular flash before 3D is ready
        avatarView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
        WebSettings settings = avatarView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        avatarView.setWebChromeClient(new WebChromeClient());
        avatarView.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                if ("https".equals(url.getScheme()) && "appassets.androidplatform.net".equals(url.getHost()))
                    return loader.shouldInterceptRequest(url);
                return null;
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !"appassets.androidplatform.net".equals(request.getUrl().getHost());
            }
            @Override public void onPageFinished(WebView view,String url) {
                super.onPageFinished(view,url);
                if(!url.startsWith(ORIGIN+"/assets/avatar-production.html"))return;
                // Run the production model as the TOP WebView document. The
                // launcher-only mist controller is loaded from the APK assets.
                view.evaluateJavascript("(function(){var s=document.createElement('script');s.src='/assets/avatar-enter.js';document.head.appendChild(s)})()",null);
            }
        });
        setContentView(avatarView);

        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            WebViewCompat.addWebMessageListener(avatarView, "PocketAvatarLaunch",
                Collections.singleton(ORIGIN),
                (view, message, sourceOrigin, isMainFrame, replyProxy) -> {
                    if (!isMainFrame || !ORIGIN.equals(sourceOrigin.toString())) return;
                    String command = message.getData();
                    runOnUiThread(() -> {
                        if ("ready".equals(command) && !finishingLaunch) {
                            if(modelReady)return;
                            modelReady = true;
                            avatarView.setAlpha(1f);
                            // Fog comes first; the face slowly emerges during this interval.
                            handler.postDelayed(this::beginGreeting, 1450L);
                        } else if ("error".equals(command)) {
                            openMain();
                        }
                    });
                });
        }
        speech = new TextToSpeech(this, status -> {
            ttsReady = status == TextToSpeech.SUCCESS;
            if (ttsReady && speech != null) {
                speech.setLanguage(Locale.forLanguageTag("ro-RO"));
                speech.setSpeechRate(0.98f);
            }
        });
        speech.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override public void onStart(String utteranceId) {
                if (UTTERANCE_ID.equals(utteranceId))
                    runOnUiThread(() -> sendToAvatar("window.pocketLaunchSpeak && window.pocketLaunchSpeak(true,'Salut! Cum te pot ajuta?');"));
            }
            @Override public void onDone(String utteranceId) {
                if (UTTERANCE_ID.equals(utteranceId))
                    runOnUiThread(() -> {
                        sendToAvatar("window.pocketLaunchSpeak && window.pocketLaunchSpeak(false);");
                        handler.postDelayed(AvatarLaunchActivity.this::openMain, 480L);
                    });
            }
            @Override public void onError(String utteranceId) {
                if (UTTERANCE_ID.equals(utteranceId))
                    runOnUiThread(AvatarLaunchActivity.this::openMain);
            }
        });

        // Permission prompts belong to the FIRST application opening, not a
        // subsequent tap on the avatar. Once permission questions are answered,
        // the clean translucent 3D entrance begins.
        requestStartupPermissions();
    }

    // This is application-level consent. Android itself may show a separate
    // location prompt after Continue; camera capture uses ACTION_IMAGE_CAPTURE
    // (the device camera app, so no CAMERA runtime permission is required).
    // Notification permission is NEVER asked until the user enters Agenda.
    private String initialSetupLanguage="en";
    private String onboardingString(String ro,String en,String fr,String de,String it,String es,String pt,String nl,String ru,String pl) {
        switch(initialSetupLanguage){
            case "ro":return ro;case "fr":return fr;case "de":return de;
            case "it":return it;case "es":return es;case "pt":return pt;
            case "nl":return nl;case "ru":return ru;case "pl":return pl;
            default:return en;
        }
    }
    private static String firstSetupLanguageForCountry(String region,String phoneLanguage){
        String cc=(region==null?"":region).toUpperCase(Locale.ROOT);
        switch(cc){
            case "RO":case "MD":return "ro";
            case "FR":case "MC":return "fr";
            case "DE":case "AT":case "LI":return "de";
            case "IT":case "SM":case "VA":return "it";
            case "ES":case "MX":case "AR":case "CL":return "es";
            case "PT":case "BR":return "pt";
            case "NL":case "BE":return "nl";
            case "RU":case "BY":return "ru";
            case "PL":return "pl";
            case "GB":case "UK":case "IE":case "US":case "CA":case "AU":return "en";
            default:
                String code=phoneLanguage==null?"":phoneLanguage.toLowerCase(Locale.ROOT);
                return java.util.Arrays.asList("ro","en","fr","de","it","es","pt","nl","ru","pl").contains(code)?code:"en";
        }
    }
    private String detectFirstSetupLanguage(){
        Locale device=Locale.getDefault();
        String region=device.getCountry();
        try{
            android.telephony.TelephonyManager tm=(android.telephony.TelephonyManager)
                getSystemService(Context.TELEPHONY_SERVICE);
            if(tm!=null){
                String network=tm.getNetworkCountryIso();
                if(network!=null && !network.trim().isEmpty())region=network;
                else if(tm.getSimCountryIso()!=null && !tm.getSimCountryIso().isEmpty())region=tm.getSimCountryIso();
            }
        }catch(Exception ignored){}
        return firstSetupLanguageForCountry(region,device.getLanguage());
    }
    private int setupDp(int amount){return (int)(amount*getResources().getDisplayMetrics().density+.5f);}
    private android.graphics.drawable.GradientDrawable setupBackground(int color,int stroke,int corners){
        android.graphics.drawable.GradientDrawable bg=new android.graphics.drawable.GradientDrawable();
        bg.setColor(color);bg.setCornerRadius(setupDp(corners));
        if(stroke!=0)bg.setStroke(setupDp(1),stroke);
        return bg;
    }
    private android.widget.TextView setupLabel(String value,int sp,int color,boolean bold){
        android.widget.TextView label=new android.widget.TextView(this);
        label.setText(value);label.setTextColor(color);label.setTextSize(sp);
        if(bold)label.setTypeface(null,android.graphics.Typeface.BOLD);
        return label;
    }
    private void showFirstInstallationPanel(){
        firstSetupShownThisLaunch=true;
        final int foreground=Color.rgb(239,250,255),soft=Color.rgb(175,210,226),cyan=Color.rgb(87,218,232);
        android.app.Dialog panel=new android.app.Dialog(this);
        panel.getWindow();panel.setCancelable(false);
        android.widget.LinearLayout column=new android.widget.LinearLayout(this);
        column.setOrientation(android.widget.LinearLayout.VERTICAL);
        column.setPadding(setupDp(20),setupDp(22),setupDp(20),setupDp(20));
        column.setBackground(setupBackground(Color.rgb(10,39,57),Color.rgb(72,137,167),22));
        android.widget.TextView tag=setupLabel("myPocket AI",16,cyan,true);column.addView(tag);
        android.widget.TextView title=setupLabel(onboardingString(
            "Bun venit!","Welcome!","Bienvenue !","Willkommen!","Benvenuto!","¡Bienvenido!","Bem-vindo!","Welkom!","Добро пожаловать!","Witamy!"),24,foreground,true);
        android.widget.LinearLayout.LayoutParams titleLp=new android.widget.LinearLayout.LayoutParams(-1,-2);
        titleLp.topMargin=setupDp(10);column.addView(title,titleLp);
        android.widget.TextView desc=setupLabel(onboardingString(
            "Alege ce funcții dorești să activezi. Poți continua fără să bifezi nimic.",
            "Choose which features to enable. You can continue without selecting any.",
            "Choisissez les fonctions à activer. Aucune sélection n'est obligatoire.",
            "Wähle die gewünschten Funktionen. Du kannst auch ohne Auswahl fortfahren.",
            "Scegli le funzioni da attivare. Puoi continuare senza selezionarle.",
            "Elige las funciones que deseas activar. Puedes continuar sin seleccionar ninguna.",
            "Escolhe as funções a ativar. Podes continuar sem selecionar nenhuma.",
            "Kies welke functies je activeert. Je kunt doorgaan zonder iets te kiezen.",
            "Выберите функции. Можно продолжить без разрешений.",
            "Wybierz funkcje. Możesz kontynuować bez zaznaczania opcji."),14,soft,false);
        android.widget.LinearLayout.LayoutParams descLp=new android.widget.LinearLayout.LayoutParams(-1,-2);
        descLp.topMargin=setupDp(10);descLp.bottomMargin=setupDp(18);column.addView(desc,descLp);
        android.widget.CheckBox location=new android.widget.CheckBox(this);
        location.setText(onboardingString("Localizare — pentru trasee și locuri apropiate",
            "Location — routes and nearby places","Localisation — trajets et lieux proches",
            "Standort — Routen und Orte in der Nähe","Posizione — percorsi e luoghi vicini",
            "Ubicación — rutas y lugares cercanos","Localização — rotas e lugares próximos",
            "Locatie — routes en plaatsen dichtbij","Геолокация — маршруты и места рядом",
            "Lokalizacja — trasy i pobliskie miejsca"));
        android.widget.CheckBox camera=new android.widget.CheckBox(this);
        camera.setText(onboardingString("Fotografiere — pentru scanarea documentelor și exercițiilor",
            "Camera — scan documents and exercises","Appareil photo — numériser documents et exercices",
            "Kamera — Dokumente und Übungen scannen","Fotocamera — scansiona documenti ed esercizi",
            "Cámara — escanear documentos y ejercicios","Câmara — digitalizar documentos e exercícios",
            "Camera — documenten en opgaven scannen","Камера — сканировать документы и задания",
            "Aparat — skanowanie dokumentów i zadań"));
        android.widget.CheckBox notification=new android.widget.CheckBox(this);
        notification.setText(onboardingString("Notificări — cerere Android doar când deschizi Agenda",
            "Notifications — Android asks only when you open Agenda",
            "Notifications — demande Android à l'ouverture de l'agenda",
            "Benachrichtigungen — Android fragt erst beim Öffnen der Agenda",
            "Notifiche — Android chiede solo quando apri l'Agenda",
            "Notificaciones — Android pregunta al abrir la Agenda",
            "Notificações — Android pergunta ao abrir a Agenda",
            "Meldingen — Android vraagt pas bij het openen van de agenda",
            "Уведомления — запрос Android только при открытии календаря",
            "Powiadomienia — Android zapyta dopiero po otwarciu kalendarza"));
        for(android.widget.CheckBox item:new android.widget.CheckBox[]{location,camera,notification}){
            item.setTextColor(foreground);item.setTextSize(15);item.setButtonTintList(
                android.content.res.ColorStateList.valueOf(cyan));item.setPadding(0,setupDp(8),0,setupDp(8));
            column.addView(item,new android.widget.LinearLayout.LayoutParams(-1,-2));
        }
        android.widget.TextView locale=setupLabel(onboardingString(
            "Limba inițială este aleasă automat din regiunea telefonului.",
            "Initial language is selected automatically from the phone region.",
            "La langue initiale dépend de la région du téléphone.",
            "Die Anfangssprache richtet sich nach der Telefonregion.",
            "La lingua iniziale dipende dalla regione del telefono.",
            "El idioma inicial se elige según la región del teléfono.",
            "O idioma inicial depende da região do telemóvel.",
            "De starttaal is gebaseerd op de telefoonregio.",
            "Начальный язык определяется регионом телефона.",
            "Język początkowy zależy od regionu telefonu."),12,soft,false);
        android.widget.LinearLayout.LayoutParams localeLp=new android.widget.LinearLayout.LayoutParams(-1,-2);
        localeLp.topMargin=setupDp(10);column.addView(locale,localeLp);
        android.widget.Button continueButton=new android.widget.Button(this);
        continueButton.setAllCaps(false);
        continueButton.setText(onboardingString("Continuă","Continue","Continuer","Weiter","Continua","Continuar","Continuar","Doorgaan","Продолжить","Kontynuuj"));
        continueButton.setTextColor(foreground);continueButton.setTextSize(17);
        continueButton.setBackground(setupBackground(Color.rgb(19,105,145),cyan,13));
        android.widget.LinearLayout.LayoutParams continueLp=new android.widget.LinearLayout.LayoutParams(-1,setupDp(52));
        continueLp.topMargin=setupDp(20);column.addView(continueButton,continueLp);
        android.widget.TextView skip=setupLabel(onboardingString("Nu acum","Not now","Pas maintenant","Nicht jetzt","Non ora","Ahora no","Agora não","Niet nu","Не сейчас","Nie teraz"),14,soft,false);
        skip.setGravity(android.view.Gravity.CENTER);
        android.widget.LinearLayout.LayoutParams skipLp=new android.widget.LinearLayout.LayoutParams(-1,setupDp(44));
        skipLp.topMargin=setupDp(6);column.addView(skip,skipLp);
        android.widget.ScrollView scroll=new android.widget.ScrollView(this);scroll.setFillViewport(false);
        scroll.addView(column);
        panel.setContentView(scroll);
        android.view.Window window=panel.getWindow();
        if(window!=null){
            window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            window.setLayout(getResources().getDisplayMetrics().widthPixels-setupDp(28),-2);
            window.addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND);
            WindowManager.LayoutParams p=window.getAttributes();p.dimAmount=.86f;window.setAttributes(p);
        }
        final Runnable commit=()->{
            panel.dismiss();
            SharedPreferences prefs=getSharedPreferences(PREFS_NAME,Context.MODE_PRIVATE);
            prefs.edit().putBoolean("first_setup_complete_v1",true)
                .putBoolean("first_setup_location",location.isChecked())
                .putBoolean("first_setup_camera",camera.isChecked())
                .putBoolean("first_setup_notifications",notification.isChecked())
                .putBoolean("startup_location_requested_v3",true)
                .putBoolean("startup_microphone_requested_v3",true)
                .putBoolean("first_microphone_permission_requested",true)
                .apply();
            if(location.isChecked() && checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)!=PackageManager.PERMISSION_GRANTED
                && checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)!=PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.ACCESS_COARSE_LOCATION,
                    Manifest.permission.ACCESS_FINE_LOCATION},ONBOARDING_PERMISSIONS_REQUEST);
            } else startAvatarEntrance();
        };
        continueButton.setOnClickListener(v->commit.run());
        skip.setOnClickListener(v->{
            location.setChecked(false);camera.setChecked(false);notification.setChecked(false);
            commit.run();
        });
        panel.show();
        if(panel.getWindow()!=null)panel.getWindow().setLayout(
            getResources().getDisplayMetrics().widthPixels-setupDp(28),
            android.view.WindowManager.LayoutParams.WRAP_CONTENT);
    }

    private void requestStartupPermissions() {
        SharedPreferences prefs=getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        if(prefs.getBoolean("first_setup_complete_v1",false)){startAvatarEntrance();return;}
        // An APK update is not a first installation: preserve previous consent.
        boolean updated=false;
        try{
            android.content.pm.PackageInfo info=getPackageManager().getPackageInfo(getPackageName(),0);
            updated=info.lastUpdateTime>info.firstInstallTime+3000L;
        }catch(Exception ignored){}
        if(updated || prefs.contains("startup_location_requested_v3") || prefs.contains("startup_microphone_requested_v3")){
            boolean locationGranted=checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)==PackageManager.PERMISSION_GRANTED
                ||checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED;
            prefs.edit().putBoolean("first_setup_complete_v1",true)
                .putBoolean("first_setup_location",locationGranted)
                .putBoolean("first_setup_camera",true)
                .putBoolean("first_setup_notifications",true)
                .putBoolean("startup_location_requested_v3",true)
                .putBoolean("startup_microphone_requested_v3",true)
                .putBoolean("first_microphone_permission_requested",true).apply();
            startAvatarEntrance();return;
        }
        initialSetupLanguage=detectFirstSetupLanguage();
        showFirstInstallationPanel();
    }

    @Override public void onRequestPermissionsResult(int requestCode,String[] permissions,int[] grantResults) {
        super.onRequestPermissionsResult(requestCode,permissions,grantResults);
        if(requestCode==ONBOARDING_PERMISSIONS_REQUEST)startAvatarEntrance();
    }

    private void startAvatarEntrance(){
        if(introStarted || finishingLaunch)return;
        introStarted=true;
        avatarView.loadUrl(ORIGIN + "/assets/avatar-production.html?embedded=1&nativeLaunch=1");
        // Never trap the user on a stalled WebGL or speech engine.
        handler.postDelayed(this::openMain, 14000L);
    }

    private void beginGreeting() {
        if (finishingLaunch || !modelReady || startedSpeaking) return;
        if (!ttsReady) {
            if (++voiceInitAttempts < 18) {
                handler.postDelayed(this::beginGreeting, 110L);
            } else {
                handler.postDelayed(this::openMain, 700L);
            }
            return;
        }
        startedSpeaking = true;
        int result = speech.speak(GREETING, TextToSpeech.QUEUE_FLUSH, null, UTTERANCE_ID);
        if (result == TextToSpeech.ERROR) openMain();
    }

    private void sendToAvatar(String javascript) {
        if (avatarView != null && !finishingLaunch) avatarView.evaluateJavascript(javascript, null);
    }

    private void openMain() {
        if (finishingLaunch || isFinishing()) return;
        finishingLaunch = true;
        if (avatarView != null) {
            try { avatarView.evaluateJavascript("window.pocketLaunchFinish && window.pocketLaunchFinish();", null); }
            catch (Exception ignored) {}
        }
        handler.postDelayed(() -> {
            if (isFinishing()) return;
            Intent intent = new Intent(AvatarLaunchActivity.this, MainActivity.class);
            intent.putExtra("intro_already_played", true);
            if(firstSetupShownThisLaunch)intent.putExtra("first_setup_language",initialSetupLanguage);
            startActivity(intent);
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
            finish();
        }, 370L);
    }

    @Override public void onBackPressed() {
        openMain();
    }

    @Override protected void onDestroy() {
        handler.removeCallbacksAndMessages(null);
        if (speech != null) { speech.stop(); speech.shutdown(); speech = null; }
        if (avatarView != null) {
            avatarView.stopLoading();
            avatarView.destroy();
            avatarView = null;
        }
        super.onDestroy();
    }
}
