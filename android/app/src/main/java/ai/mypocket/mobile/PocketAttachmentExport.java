package ai.mypocket.mobile;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;
import android.webkit.WebView;
import androidx.activity.ComponentActivity;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.Collections;
import org.json.JSONObject;

/** Explicit SAF export; no storage permission, remote upload or automatic APK installation. */
final class PocketAttachmentExport {
    private final ComponentActivity activity;
    private final WebView web;
    private final ActivityResultLauncher<Intent> picker;
    private File pending;
    private String pendingId;
    private boolean busy=false;
    private static final int MAX_BYTES=11*1024*1024;
    PocketAttachmentExport(ComponentActivity activity,WebView web,String host){
        this.activity=activity;this.web=web;
        // Only files from an interrupted explicit export; never unrelated app data.
        File[] stale=activity.getCacheDir().listFiles((dir,name)->name.startsWith("chat-export-")&&name.endsWith(".tmp"));
        if(stale!=null)for(File file:stale)if(System.currentTimeMillis()-file.lastModified()>3600000)file.delete();
        picker=activity.registerForActivityResult(new ActivityResultContracts.StartActivityForResult(),result->{
            final File file=pending;final String id=pendingId;
            final Uri destination=result.getData()==null?null:result.getData().getData();
            if(result.getResultCode()!=Activity.RESULT_OK||destination==null){finish(id,"cancelled");return;}
            new Thread(()->{
                String status="error";
                try(FileInputStream input=new FileInputStream(file);OutputStream output=activity.getContentResolver().openOutputStream(destination,"w")){
                    if(output==null)throw new java.io.IOException("destination_unavailable");
                    byte[] chunk=new byte[65536];int n;
                    while((n=input.read(chunk))!=-1)output.write(chunk,0,n);
                    output.flush();status="saved";
                }catch(Exception ignored){status="error";}
                final String outcome=status;activity.runOnUiThread(()->finish(id,outcome));
            },"PocketAttachmentSave").start();
        });
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){
            WebViewCompat.addWebMessageListener(web,"PocketAndroidAttachmentExport",Collections.singleton("https://"+host),
                (view,message,origin,isMainFrame,reply)->{
                    if(!isMainFrame||!"https".equals(origin.getScheme())||!host.equals(origin.getHost()))return;
                    final String data=message.getData();
                    if(data==null||data.length()>16000000)return;
                    receive(data);
                });
        }
    }
    private void receive(String payload){
        String id="";
        try{
            JSONObject request=new JSONObject(payload);id=request.optString("id");
            if(!id.matches("[a-zA-Z0-9_-]{1,100}"))return;
            if(busy){notifyResult(id,"error");return;}
            String name=request.optString("name","mypocketai-file").replaceAll("[^a-zA-Z0-9._-]","_");
            if(name.isEmpty()||name.length()>160)name="mypocketai-file";
            String mime=request.optString("mime","application/octet-stream");
            if(!mime.matches("[a-zA-Z0-9.+-]+/[a-zA-Z0-9.+-]+"))mime="application/octet-stream";
            final String encoded=request.optString("base64");
            if(encoded.length()>15379116){notifyResult(id,"error");return;}
            busy=true;pendingId=id;
            final String filename=name,contentType=mime,jobId=id;
            new Thread(()->{
                File file=null;
                try{
                    byte[] bytes=Base64.decode(encoded,Base64.DEFAULT);
                    if(bytes.length>MAX_BYTES)throw new java.io.IOException("too_large");
                    file=File.createTempFile("chat-export-",".tmp",activity.getCacheDir());
                    try(FileOutputStream output=new FileOutputStream(file)){output.write(bytes);}
                    final File ready=file;
                    activity.runOnUiThread(()->{
                        pending=ready;
                        try{
                            Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE)
                                .setType(contentType).putExtra(Intent.EXTRA_TITLE,filename);
                            picker.launch(intent);
                        }catch(Exception error){finish(jobId,"error");}
                    });
                }catch(Exception error){if(file!=null)file.delete();activity.runOnUiThread(()->finish(jobId,"error"));}
            },"PocketAttachmentPrepare").start();
        }catch(Exception error){if(!id.isEmpty())notifyResult(id,"error");}
    }
    private void finish(String id,String status){
        if(pending!=null)pending.delete();pending=null;pendingId=null;busy=false;notifyResult(id,status);
    }
    private void notifyResult(String id,String status){
        if(id==null)return;
        web.evaluateJavascript("window.dispatchEvent(new CustomEvent('pocket-attachment-export',{detail:{id:"+JSONObject.quote(id)+",status:"+JSONObject.quote(status)+"}}));",null);
    }
}
