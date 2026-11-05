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

    private void requestStartupPermissions() {
        SharedPreferences prefs=getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        ArrayList<String> missing=new ArrayList<>();
        SharedPreferences.Editor editor=prefs.edit();
        if(checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)!=PackageManager.PERMISSION_GRANTED
            && checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)!=PackageManager.PERMISSION_GRANTED
            && !prefs.getBoolean("startup_location_requested_v3",false)){
            missing.add(Manifest.permission.ACCESS_COARSE_LOCATION);
            missing.add(Manifest.permission.ACCESS_FINE_LOCATION);
            editor.putBoolean("startup_location_requested_v3",true);
        }
        if(checkSelfPermission(Manifest.permission.RECORD_AUDIO)!=PackageManager.PERMISSION_GRANTED
            && !prefs.getBoolean("startup_microphone_requested_v3",false)){
            missing.add(Manifest.permission.RECORD_AUDIO);
            editor.putBoolean("startup_microphone_requested_v3",true);
            editor.putBoolean("first_microphone_permission_requested",true);
        }
        editor.apply();
        if(missing.isEmpty()){startAvatarEntrance();return;}
        requestPermissions(missing.toArray(new String[0]),ONBOARDING_PERMISSIONS_REQUEST);
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
