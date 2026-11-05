package ai.mypocket.mobile;

import android.app.Activity;
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
                            modelReady = true;
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

        avatarView.loadUrl(ORIGIN + "/assets/avatar-launch.html");
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
