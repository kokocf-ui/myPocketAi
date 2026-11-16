package ai.mypocket.mobile;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

/** Dedicated destination for the navigation notification, NOT the home screen. */
public final class PocketNavigationActivity extends Activity {
    private static final int BACKGROUND=Color.rgb(7,23,32);
    private static final int WINE=Color.rgb(117,35,71);
    private TextView title,steps;

    private TextView paragraph(String message,int size,int color){
        TextView text=new TextView(this);
        text.setText(message);text.setTextSize(size);text.setTextColor(color);
        text.setPadding(16,16,16,16);
        return text;
    }
    private Button action(String caption){
        Button button=new Button(this);
        button.setText(caption);button.setAllCaps(false);
        button.setTextColor(Color.WHITE);
        button.setBackgroundTintList(android.content.res.ColorStateList.valueOf(WINE));
        return button;
    }
    @Override public void onCreate(Bundle state){
        super.onCreate(state);
        getWindow().setStatusBarColor(BACKGROUND);
        getWindow().setNavigationBarColor(BACKGROUND);
        LinearLayout root=new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(BACKGROUND);
        root.setPadding(18,24,18,14);
        title=paragraph("Navigare activă",22,Color.WHITE);
        title.setGravity(Gravity.CENTER);
        root.addView(title);
        ScrollView scroll=new ScrollView(this);
        steps=paragraph("",16,Color.rgb(225,233,238));
        steps.setLineSpacing(8,1f);
        scroll.addView(steps);
        root.addView(scroll,new LinearLayout.LayoutParams(-1,0,1f));
        Button map=action("Reia harta traseului");
        map.setOnClickListener(view->{
            String session=PocketNavigationService.activeSession();
            if(session==null)return;
            Intent open=new Intent(this,MainActivity.class)
                .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP|Intent.FLAG_ACTIVITY_SINGLE_TOP)
                .putExtra(PocketNavigationService.EXTRA_RESUME,true)
                .putExtra(PocketNavigationService.EXTRA_SESSION,session);
            startActivity(open);
        });
        root.addView(map,new LinearLayout.LayoutParams(-1,-2));
        Button stop=action("Oprește navigația");
        stop.setOnClickListener(view->{
            startService(PocketNavigationService.stopIntent(this));
            finish();
        });
        root.addView(stop,new LinearLayout.LayoutParams(-1,-2));
        setContentView(root);
    }
    @Override protected void onResume(){
        super.onResume();
        String session=PocketNavigationService.activeSession();
        if(session==null){finish();return;}
        title.setText("Navigare · "+PocketNavigationService.activeDestination());
        String lines=PocketNavigationService.activeSteps();
        steps.setText(lines==null||lines.isBlank()?
            "Navigația este activă în notificări. Pentru hartă, apasă „Reia harta traseului”.":
            lines);
    }
}
