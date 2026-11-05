package ai.mypocket.mobile;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;

import androidx.activity.ComponentActivity;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.PickVisualMediaRequest;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.content.FileProvider;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import java.util.Collections;

import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;

import org.json.JSONObject;

import java.io.File;

public final class MainActivity extends ComponentActivity {
    private static final String APP_URL = "https://lifewise-ai-v2.kokocf.workers.dev/";
    private static final String APP_HOST = "lifewise-ai-v2.kokocf.workers.dev";
    private WebView web;
    private Uri cameraUri;
    private boolean waitingForPhoto = false;

    private final ActivityResultLauncher<PickVisualMediaRequest> gallery =
        registerForActivityResult(new ActivityResultContracts.PickVisualMedia(),
            uri -> { waitingForPhoto=false; if (uri != null) recognize(uri); else notifyWeb("cancelled", ""); });

    private final ActivityResultLauncher<Intent> camera =
        registerForActivityResult(new ActivityResultContracts.StartActivityForResult(),
            result -> {
                waitingForPhoto=false;
                if (result.getResultCode() == Activity.RESULT_OK && cameraUri != null) recognize(cameraUri);
                else notifyWeb("cancelled", "");
            });

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(6,20,32));
        getWindow().setNavigationBarColor(Color.rgb(6,20,32));
        web = new WebView(this);
        setContentView(web);
        WebSettings settings=web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient(){
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
        web.loadUrl(APP_URL);
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

    @Override public void onBackPressed(){
        if (web!=null && web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
}
