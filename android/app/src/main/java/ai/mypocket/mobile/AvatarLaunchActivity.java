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
    private String currentGreeting = "Hello! How can I help you?";
    private String spokenGreeting = currentGreeting;
    private String launchLanguage = "en";
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
    private static final int ONBOARDING_NOTIFICATIONS_REQUEST=4833;
    private static final int ONBOARDING_MICROPHONE_REQUEST=4834;
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
                // The greeting voice is chosen below using the app locale.
                speech.setSpeechRate(0.98f);
            }
        });
        speech.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override public void onStart(String utteranceId) {
                if (UTTERANCE_ID.equals(utteranceId))
                    runOnUiThread(() -> sendToAvatar("window.pocketLaunchSpeak && window.pocketLaunchSpeak(true," + org.json.JSONObject.quote(spokenGreeting) + ");"));
            }
            @Override public void onRangeStart(String utteranceId, int start, int end, int frame) {
                if (UTTERANCE_ID.equals(utteranceId))
                    runOnUiThread(() -> sendToAvatar("window.pocketLaunchBoundary && window.pocketLaunchBoundary(" + start + ");"));
            }
            @Override public void onDone(String utteranceId) {
                if (UTTERANCE_ID.equals(utteranceId))
                    runOnUiThread(AvatarLaunchActivity.this::finishGreeting);
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

    // A single explanatory first-launch screen precedes the system dialogs.
    // Android grants location, notifications and microphone permissions; camera capture
    // uses ACTION_IMAGE_CAPTURE and needs no duplicate custom consent panel.
    private String initialSetupLanguage="en";
    private String onboardingString(String ro,String en,String fr,String de,String it,String es,String pt,String nl,String ru,String pl) {
        switch(initialSetupLanguage){
            case "ro":return ro;case "fr":return fr;case "de":return de;
            case "it":return it;case "es":return es;case "pt":return pt;
            case "nl":return nl;case "ru":return ru;case "pl":return pl;
            default:return europeanSetupLabel(en);
        }
    }
    // New European country languages use localized first-run information, too.
    // All other native languages have a readable English fallback until verified.
    private String europeanSetupLabel(String english){
        String[] keys={
         "Welcome!","For the app to work properly, Android may ask for these permissions:",
         "Location","Routes, transport and nearby places.","Camera",
         "Scan documents and exercises; the camera opens only when you choose it.",
         "Notifications","Reminders, Agenda and event alerts.",
         "Tap “Next”. Only Android grants permissions; you can decline or change them later in Settings.",
         "Next"
        };
        String[] translated;
        switch(initialSetupLanguage){
         case "hr":translated=new String[]{"Dobro došli!","Za pravilan rad Android može zatražiti ove dozvole:",
          "Lokacija","Rute, prijevoz i mjesta u blizini.","Kamera",
          "Skeniranje dokumenata i zadataka; kamera se otvara samo na vaš zahtjev.",
          "Obavijesti","Podsjetnici, kalendar i obavijesti o događajima.",
          "Dodirnite „Dalje”. Dozvole odobrava Android; možete ih odbiti ili naknadno promijeniti u postavkama.","Dalje"};break;
         case "sr":translated=new String[]{"Добро дошли!","За правилан рад Android може тражити ове дозволе:",
          "Локација","Руте, превоз и оближња места.","Камера",
          "Скенирање докумената и задатака; камера се отвара само на ваш захтев.",
          "Обавештења","Подсетници, календар и обавештења о догађајима.",
          "Додирните „Даље”. Дозволе одобрава Android; можете их одбити или касније променити у подешавањима.","Даље"};break;
         case "hu":translated=new String[]{"Üdvözöljük!","A megfelelő működéshez az Android az alábbi engedélyeket kérheti:",
          "Helyadatok","Útvonalak, közlekedés és közeli helyek.","Kamera",
          "Dokumentumok és feladatok beolvasása; a kamera csak kérésre nyílik meg.",
          "Értesítések","Emlékeztetők, naptár és eseményjelzések.",
          "Koppints a „Tovább” gombra. Az engedélyeket az Android kezeli, később módosíthatod őket.","Tovább"};break;
         case "tr":translated=new String[]{"Hoş geldiniz!","Uygulamanın düzgün çalışması için Android şu izinleri isteyebilir:",
          "Konum","Rotalar, ulaşım ve yakındaki yerler.","Kamera",
          "Belge ve soruları taramak için; kamera yalnızca siz seçtiğinizde açılır.",
          "Bildirimler","Hatırlatıcılar, takvim ve etkinlik uyarıları.",
          "“İleri”ye dokunun. İzinleri Android verir; daha sonra ayarlardan değiştirebilirsiniz.","İleri"};break;
         default:return english;
        }
        for(int i=0;i<keys.length;i++)if(keys[i].equals(english))return translated[i];
        return english;
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
            case "RU":return "ru";
            case "PL":return "pl";
            case "HR":return "hr";case "RS":case "ME":return "sr";case "HU":return "hu";case "TR":return "tr";
            case "CZ":return "cs";case "SK":return "sk";case "SI":return "sl";case "BG":return "bg";
            case "GR":case "CY":return "el";case "FI":return "fi";case "SE":return "sv";case "NO":return "no";
            case "DK":return "da";case "IS":return "is";case "EE":return "et";case "LV":return "lv";
            case "LT":return "lt";case "UA":return "uk";case "BA":return "bs";case "MK":return "mk";
            case "AL":case "XK":return "sq";case "BY":return "be";case "AD":return "ca";case "MT":return "mt";
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
        // A Romanian SIM in Britain should not force a Romanian first screen.
        // Time zone is a permission-free hint until GPS is authorized.
        if("Europe/London".equals(java.util.TimeZone.getDefault().getID())
            && (region==null||region.isEmpty()||region.equalsIgnoreCase(device.getCountry())))region="GB";
        return firstSetupLanguageForCountry(region,device.getLanguage());
    }
    private String currentLaunchLanguage(SharedPreferences prefs){
        String saved=prefs.getString("ui_language_native","");
        if(saved!=null&&saved.matches("ro|en|fr|de|it|es|pt|nl|ru|pl|hr|sr|hu|tr|cs|sk|sl|bg|el|fi|sv|no|da|is|et|lv|lt|uk|bs|mk|sq|be|ca|ga|cy|mt|eu|gl|lb|fo|rm"))return saved;
        return detectFirstSetupLanguage();
    }
    private static String greetingForLanguage(String language){
        switch(language){
            case "ro":return "Bună! Eu sunt Eva, asistenta ta personală din myPocket AI. Cu ce te pot ajuta astăzi?";
            case "fr":return "Bonjour ! Je suis Eva, ton assistante personnelle myPocket AI. Comment puis-je t'aider aujourd'hui ?";
            case "de":return "Hallo! Ich bin Eva, deine persönliche Assistentin von myPocket AI. Wie kann ich dir heute helfen?";
            case "it":return "Ciao! Sono Eva, la tua assistente personale di myPocket AI. Come posso aiutarti oggi?";
            case "es":return "¡Hola! Soy Eva, tu asistente personal de myPocket AI. ¿En qué puedo ayudarte hoy?";
            case "pt":return "Olá! Sou a Eva, a tua assistente pessoal do myPocket AI. Como posso ajudar-te hoje?";
            case "nl":return "Hallo! Ik ben Eva, je persoonlijke assistente van myPocket AI. Waarmee kan ik je vandaag helpen?";
            case "ru":return "Привет! Я Ева, твоя персональная помощница в myPocket AI. Чем могу помочь сегодня?";
            case "pl":return "Cześć! Jestem Eva, twoja osobista asystentka w myPocket AI. W czym mogę dziś pomóc?";
            case "hr":return "Bok! Ja sam Eva, tvoja osobna asistentica u myPocket AI. Kako ti mogu danas pomoći?";
            case "sr":return "Здраво! Ја сам Ева, твоја лична асистенткиња у myPocket AI. Како могу да ти помогнем?";
            case "hu":return "Szia! Eva vagyok, a személyes asszisztensed a myPocket AI-ban. Miben segíthetek ma?";
            case "tr":return "Merhaba! Ben Eva, myPocket AI'daki kişisel asistanınım. Bugün sana nasıl yardımcı olabilirim?";
            case "cs":return "Ahoj! Jsem Eva, tvoje osobní asistentka v myPocket AI. Jak ti dnes mohu pomoci?";
            case "sk":return "Ahoj! Som Eva, tvoja osobná asistentka v myPocket AI. Ako ti dnes môžem pomôcť?";
            case "sl":return "Živjo! Sem Eva, tvoja osebna pomočnica v myPocket AI. Kako ti lahko danes pomagam?";
            case "bg":return "Здравей! Аз съм Ева, твоят личен асистент в myPocket AI. Как мога да помогна днес?";
            case "el":return "Γεια σου! Είμαι η Εύα, η προσωπική σου βοηθός στο myPocket AI. Πώς μπορώ να βοηθήσω σήμερα?";
            case "fi":return "Hei! Olen Eva, henkilökohtainen avustajasi myPocket AI:ssa. Miten voin auttaa tänään?";
            case "sv":return "Hej! Jag är Eva, din personliga assistent i myPocket AI. Hur kan jag hjälpa dig idag?";
            case "no":return "Hei! Jeg er Eva, din personlige assistent i myPocket AI. Hvordan kan jeg hjelpe deg i dag?";
            case "da":return "Hej! Jeg er Eva, din personlige assistent i myPocket AI. Hvordan kan jeg hjælpe dig i dag?";
            case "is":return "Halló! Ég er Eva, persónulegi aðstoðarmaðurinn þinn í myPocket AI. Hvernig get ég hjálpað í dag?";
            case "et":return "Tere! Mina olen Eva, sinu isiklik assistent myPocket AI-s. Kuidas saan täna aidata?";
            case "lv":return "Sveiki! Es esmu Eva, tavs personīgais asistents myPocket AI. Kā varu šodien palīdzēt?";
            case "lt":return "Sveiki! Aš esu Eva, tavo asmeninė asistentė „myPocket AI“. Kaip šiandien galiu padėti?";
            case "uk":return "Привіт! Я Єва, твоя персональна помічниця в myPocket AI. Чим можу допомогти сьогодні?";
            case "bs":return "Zdravo! Ja sam Eva, tvoja lična asistentica u myPocket AI. Kako ti danas mogu pomoći?";
            case "mk":return "Здраво! Јас сум Ева, твојата лична асистентка во myPocket AI. Како можам да помогнам денес?";
            case "sq":return "Përshëndetje! Jam Eva, asistentja jote personale në myPocket AI. Si mund të të ndihmoj sot?";
            case "be":return "Вітаю! Я Ева, твая асабістая памочніца ў myPocket AI. Чым магу дапамагчы сёння?";
            case "ca":return "Hola! Sóc l'Eva, la teva assistent personal de myPocket AI. En què et puc ajudar avui?";
            case "ga":return "Dia duit! Is mise Eva, do chúntóir pearsanta in myPocket AI. Conas is féidir liom cabhrú leat inniu?";
            case "cy":return "Helo! Eva ydw i, dy gynorthwyydd personol yn myPocket AI. Sut alla i helpu heddiw?";
            case "mt":return "Bonġu! Jiena Eva, l-assistenta personali tiegħek f'myPocket AI. Kif nista' ngħinek illum?";
            case "eu":return "Kaixo! Eva naiz, myPocket AI-ko zure laguntzaile pertsonala. Zertan lagun zaitzaket gaur?";
            case "gl":return "Ola! Son Eva, a túa asistente persoal de myPocket AI. En que che podo axudar hoxe?";
            case "lb":return "Moien! Ech sinn d'Eva, däi perséinlechen Assistent bei myPocket AI. Wéi kann ech dir haut hëllefen?";
            case "fo":return "Hey! Eg eri Eva, tín persónligi hjálpari í myPocket AI. Hvussu kann eg hjálpa tær í dag?";
            case "rm":return "Allegra! Jau sun Eva, tia assistenta persunala en myPocket AI. Co poss jau gidar tai oz?";
            default:return "Hello! I'm Eva, your personal assistant from myPocket AI. How can I help you today?";
        }
    }
    private static String firstGreetingForLanguage(String language){
        switch(language){
            case "ro":return "Bună! Eu sunt Eva, asistenta ta personală din myPocket AI. Îmi pare bine să te cunosc! Cu ce începem?";
            case "fr":return "Bonjour ! Je suis Eva. Ravie de faire ta connaissance !";
            case "de":return "Hallo! Ich bin Eva. Schön, dich kennenzulernen!";
            case "it":return "Ciao! Sono Eva. Piacere di conoscerti!";
            case "es":return "¡Hola! Soy Eva. ¡Encantada de conocerte!";
            case "pt":return "Olá! Sou a Eva. Prazer em conhecer-te!";
            case "nl":return "Hallo! Ik ben Eva. Leuk je te ontmoeten!";
            case "ru":return "Привет! Меня зовут Ева. Рада знакомству!";
            case "pl":return "Cześć! Jestem Eva. Miło cię poznać!";
            default:return greetingForLanguage(language);
        }
    }
    private static String speechTagForLanguage(String language){
        switch(language){
            case "ro":return "ro-RO";case "fr":return "fr-FR";case "de":return "de-DE";
            case "it":return "it-IT";case "es":return "es-ES";case "pt":return "pt-PT";
            case "nl":return "nl-NL";case "ru":return "ru-RU";case "pl":return "pl-PL";
            case "hr":return "hr-HR";case "sr":return "sr-RS";case "hu":return "hu-HU";
            case "tr":return "tr-TR";case "no":return "nb-NO";case "be":return "be-BY";
            default:return language;
        }
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
    private void addSetupInfo(android.widget.LinearLayout parent,String title,String detail,int headingColor,int bodyColor){
        // Compact, readable explanations at the bottom of the profile screen.
        android.widget.TextView item=setupLabel("• "+title+": "+detail,12,bodyColor,false);
        item.setLineSpacing(setupDp(2),1f);
        android.widget.LinearLayout.LayoutParams lp=new android.widget.LinearLayout.LayoutParams(-1,-2);
        lp.topMargin=setupDp(4);parent.addView(item,lp);
    }

    private android.widget.EditText setupTextField(String hint,int inputType,int maxLength){
        android.widget.EditText input=new android.widget.EditText(this);
        input.setSingleLine(true);
        input.setTextSize(15);
        input.setTextColor(Color.rgb(239,250,255));
        input.setHintTextColor(Color.rgb(155,192,207));
        input.setHint(hint);
        input.setInputType(inputType);
        input.setFilters(new android.text.InputFilter[]{new android.text.InputFilter.LengthFilter(maxLength)});
        input.setPadding(setupDp(12),setupDp(7),setupDp(12),setupDp(7));
        input.setBackground(setupBackground(Color.rgb(15,55,76),Color.rgb(73,137,160),11));
        input.setMinHeight(setupDp(45));
        input.setImeOptions(android.view.inputmethod.EditorInfo.IME_ACTION_NEXT);
        return input;
    }
    private void addProfileInput(android.widget.LinearLayout parent,String label,android.widget.EditText input,int color){
        android.widget.TextView caption=setupLabel(label,13,color,true);
        android.widget.LinearLayout.LayoutParams labelLp=new android.widget.LinearLayout.LayoutParams(-1,-2);
        labelLp.topMargin=setupDp(8);
        parent.addView(caption,labelLp);
        android.widget.LinearLayout.LayoutParams inputLp=new android.widget.LinearLayout.LayoutParams(-1,setupDp(46));
        inputLp.topMargin=setupDp(4);
        parent.addView(input,inputLp);
    }

    private void showFirstInstallationPanel(){
        firstSetupShownThisLaunch=true;
        final int foreground=Color.rgb(239,250,255),soft=Color.rgb(175,210,226),cyan=Color.rgb(87,218,232);
        android.app.Dialog panel=new android.app.Dialog(this);
        panel.setCancelable(false);
        android.widget.LinearLayout column=new android.widget.LinearLayout(this);
        column.setOrientation(android.widget.LinearLayout.VERTICAL);
        boolean landscape=getResources().getDisplayMetrics().widthPixels>
            getResources().getDisplayMetrics().heightPixels;
        column.setPadding(setupDp(landscape?12:20),setupDp(landscape?8:18),
            setupDp(landscape?12:20),setupDp(landscape?8:18));
        column.setBackground(setupBackground(Color.rgb(10,39,57),Color.rgb(72,137,167),22));
        column.addView(setupLabel("myPocket AI",15,cyan,true));
        android.widget.TextView title=setupLabel(onboardingString(
            "Bun venit!","Welcome!","Bienvenue !","Willkommen!","Benvenuto!","¡Bienvenido!",
            "Bem-vindo!","Welkom!","Добро пожаловать!","Witamy!"),22,foreground,true);
        android.widget.LinearLayout.LayoutParams titleLp=new android.widget.LinearLayout.LayoutParams(-1,-2);
        titleLp.topMargin=setupDp(8);column.addView(title,titleLp);
        android.widget.TextView desc=setupLabel(onboardingString(
            "Configurează-ți profilul pentru o conversație personalizată.",
            "Set up your profile for a more personal conversation.",
            "Configurez votre profil pour des conversations personnalisées.",
            "Richte dein Profil für persönliche Gespräche ein.",
            "Configura il tuo profilo per conversazioni personali.",
            "Configura tu perfil para conversar de forma personal.",
            "Configura o teu perfil para conversas personalizadas.",
            "Stel je profiel in voor persoonlijkere gesprekken.",
            "Настройте профиль для личного общения.",
            "Ustaw profil, aby prowadzić bardziej osobiste rozmowy."),13,soft,false);
        android.widget.LinearLayout.LayoutParams descLp=new android.widget.LinearLayout.LayoutParams(-1,-2);
        descLp.topMargin=setupDp(8);column.addView(desc,descLp);
        column.setFocusableInTouchMode(true);column.requestFocus();
        android.widget.EditText emailField=setupTextField(
            onboardingString("exemplu@email.com","example@email.com","exemple@email.com","beispiel@email.com","esempio@email.com","ejemplo@email.com","exemplo@email.com","voorbeeld@email.com","пример@email.com","przyklad@email.com"),
            android.text.InputType.TYPE_CLASS_TEXT|android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS,254);
        addProfileInput(column,onboardingString("Adresă de e-mail","Email address","Adresse e-mail","E-Mail-Adresse","Indirizzo e-mail","Correo electrónico","Endereço de e-mail","E-mailadres","Электронная почта","Adres e-mail"),emailField,foreground);
        android.widget.EditText nameField=setupTextField(
            onboardingString("Cum să îți spunem?","How should we address you?","Comment vous appeler ?","Wie sollen wir dich nennen?","Come possiamo chiamarti?","¿Cómo te llamamos?","Como devemos tratar-te?","Hoe spreken we je aan?","Как к вам обращаться?","Jak mamy się do Ciebie zwracać?"),
            android.text.InputType.TYPE_CLASS_TEXT|android.text.InputType.TYPE_TEXT_FLAG_CAP_WORDS,50);
        addProfileInput(column,onboardingString("Nume preferat","Preferred name","Prénom préféré","Bevorzugter Name","Nome preferito","Nombre preferido","Nome preferido","Voorkeursnaam","Предпочитаемое имя","Preferowane imię"),nameField,foreground);
        // A birth date makes age advance automatically each year; an age
        // number alone would become stale after the first installation.
        android.widget.EditText birthField=setupTextField("YYYY-MM-DD",
            android.text.InputType.TYPE_CLASS_DATETIME|android.text.InputType.TYPE_DATETIME_VARIATION_DATE,10);
        birthField.setFocusable(false);
        birthField.setOnClickListener(view->{
            java.util.Calendar now=java.util.Calendar.getInstance();
            int initialYear=now.get(java.util.Calendar.YEAR)-25;
            android.app.DatePickerDialog picker=new android.app.DatePickerDialog(this,
                (datePicker,year,month,day)->birthField.setText(
                    String.format(Locale.ROOT,"%04d-%02d-%02d",year,month+1,day)),
                initialYear,now.get(java.util.Calendar.MONTH),now.get(java.util.Calendar.DAY_OF_MONTH));
            picker.getDatePicker().setMaxDate(System.currentTimeMillis());
            java.util.Calendar earliest=java.util.Calendar.getInstance();
            earliest.add(java.util.Calendar.YEAR,-120);
            picker.getDatePicker().setMinDate(earliest.getTimeInMillis());
            picker.show();
        });
        addProfileInput(column,onboardingString("Data nașterii (vârsta se actualizează automat)",
            "Date of birth (age updates automatically)","Date de naissance","Geburtsdatum",
            "Data di nascita","Fecha de nacimiento","Data de nascimento",
            "Geboortedatum","Дата рождения","Data urodzenia"),birthField,foreground);
        android.widget.TextView genderLabel=setupLabel(onboardingString("Sex (pentru acordul gramatical)","Sex (for grammatical agreement)",
            "Sexe (accord grammatical)","Geschlecht (grammatikalische Anrede)","Sesso (accordo grammaticale)",
            "Sexo (concordancia gramatical)","Sexo (concordância gramatical)","Geslacht (grammaticale aanspreekvorm)",
            "Пол (для грамматического согласования)","Płeć (do poprawnych form gramatycznych)"),13,foreground,true);
        android.widget.LinearLayout.LayoutParams genderLp=new android.widget.LinearLayout.LayoutParams(-1,-2);
        genderLp.topMargin=setupDp(10);column.addView(genderLabel,genderLp);
        android.widget.RadioGroup genderChoices=new android.widget.RadioGroup(this);
        genderChoices.setOrientation(android.widget.RadioGroup.HORIZONTAL);
        final String[] sexCodes={"male","female","undisclosed"};
        String[] sexLabels={
            onboardingString("Bărbat","Man","Homme","Mann","Uomo","Hombre","Homem","Man","Мужчина","Mężczyzna"),
            onboardingString("Femeie","Woman","Femme","Frau","Donna","Mujer","Mulher","Vrouw","Женщина","Kobieta"),
            onboardingString("Nu declar","Prefer not to say","Non déclaré","Keine Angabe","Non dichiarato","No declarar","Não declarar","Niet opgeven","Не указывать","Nie podaję")
        };
        final android.widget.RadioButton[] sexButtons=new android.widget.RadioButton[3];
        for(int i=0;i<3;i++){
            android.widget.RadioButton choice=new android.widget.RadioButton(this);
            choice.setId(10070+i);
            choice.setText(sexLabels[i]);choice.setTextSize(12);choice.setTextColor(foreground);
            choice.setButtonDrawable(null);choice.setGravity(android.view.Gravity.CENTER);
            choice.setPadding(setupDp(4),0,setupDp(4),0);
            choice.setBackground(setupBackground(i==2?Color.rgb(100,42,62):Color.rgb(20,55,74),
                i==2?Color.rgb(219,148,164):Color.rgb(67,103,120),9));
            android.widget.RadioGroup.LayoutParams optionLp=new android.widget.RadioGroup.LayoutParams(0,setupDp(43),1f);
            if(i>0)optionLp.leftMargin=setupDp(5);
            genderChoices.addView(choice,optionLp);sexButtons[i]=choice;
        }
        genderChoices.check(sexButtons[2].getId());
        genderChoices.setOnCheckedChangeListener((group,checked)->{
            for(android.widget.RadioButton option:sexButtons){
                boolean selected=option.getId()==checked;
                option.setBackground(setupBackground(selected?Color.rgb(100,42,62):Color.rgb(20,55,74),
                    selected?Color.rgb(219,148,164):Color.rgb(67,103,120),9));
            }
        });
        genderChoices.check(sexButtons[2].getId());
        android.widget.LinearLayout.LayoutParams choicesLp=new android.widget.LinearLayout.LayoutParams(-1,-2);
        choicesLp.topMargin=setupDp(5);column.addView(genderChoices,choicesLp);
        android.widget.TextView purpose=setupLabel(onboardingString(
            "De ce avem nevoie de permisiuni?","Why do we request permissions?",
            "Pourquoi ces autorisations ?","Warum diese Berechtigungen?",
            "Perché servono queste autorizzazioni?","¿Por qué estos permisos?",
            "Porquê estas permissões?","Waarom deze toestemmingen?",
            "Зачем нужны разрешения?","Dlaczego potrzebujemy uprawnień?"),12,soft,true);
        android.widget.LinearLayout.LayoutParams purposeLp=new android.widget.LinearLayout.LayoutParams(-1,-2);
        purposeLp.topMargin=setupDp(14);column.addView(purpose,purposeLp);
        android.widget.LinearLayout infoItems=new android.widget.LinearLayout(this);
        infoItems.setOrientation(android.widget.LinearLayout.VERTICAL);
        column.addView(infoItems,new android.widget.LinearLayout.LayoutParams(-1,-2));
        addSetupInfo(infoItems,onboardingString("Localizare","Location","Localisation","Standort","Posizione","Ubicación","Localização","Locatie","Геолокация","Lokalizacja"),
            onboardingString("Trasee, transport și locuri din apropiere.","Routes, transport and nearby places.",
                "Itinéraires, transports et lieux proches.","Routen, Verkehr und Orte in der Nähe.",
                "Percorsi, trasporti e luoghi vicini.","Rutas, transporte y lugares cercanos.",
                "Rotas, transportes e locais próximos.","Routes, vervoer en plekken dichtbij.",
                "Маршруты, транспорт и места рядом.","Trasy, transport i pobliskie miejsca."),foreground,soft);
        addSetupInfo(infoItems,onboardingString("Microfon","Microphone","Microphone","Mikrofon","Microfono","Micrófono","Microfone","Microfoon","Микрофон","Mikrofon"),
            onboardingString("Dictare și conversații vocale, doar când le pornești.",
                "Dictation and voice conversations, only when you start them.",
                "Dictée et conversations vocales, uniquement à votre demande.",
                "Diktat und Sprachgespräche nur bei Bedarf.",
                "Dettatura e conversazioni vocali solo quando le avvii.",
                "Dictado y conversaciones por voz, solo cuando los inicies.",
                "Ditado e conversas por voz, apenas quando os iniciares.",
                "Dicteren en spraakgesprekken alleen als je ze start.",
                "Диктовка и голосовые беседы только при вашем запуске.",
                "Dyktowanie i rozmowy głosowe tylko po uruchomieniu."),foreground,soft);
        addSetupInfo(infoItems,onboardingString("Fotografiere","Camera","Appareil photo","Kamera","Fotocamera","Cámara","Câmara","Camera","Камера","Aparat"),
            onboardingString("Scanarea documentelor și a exercițiilor; camera se deschide doar când o alegi.",
                "Scan documents and exercises; the camera opens only when you choose it.",
                "Numériser des documents et exercices, uniquement à votre demande.",
                "Dokumente und Aufgaben nur bei Bedarf fotografieren.",
                "Fotografa documenti ed esercizi solo quando lo richiedi.",
                "Escanear documentos y ejercicios solo cuando lo solicites.",
                "Digitalizar documentos e exercícios apenas quando necessário.",
                "Documenten en oefeningen scannen alleen als je dat kiest.",
                "Сканирование документов и заданий только по вашему выбору.",
                "Skanowanie dokumentów i zadań tylko na żądanie."),foreground,soft);
        addSetupInfo(infoItems,onboardingString("Notificări","Notifications","Notifications","Benachrichtigungen","Notifiche","Notificaciones","Notificações","Meldingen","Уведомления","Powiadomienia"),
            onboardingString("Mementouri, Agendă și alerte pentru evenimente.",
                "Reminders, Agenda and event alerts.",
                "Rappels, agenda et alertes d’événements.",
                "Erinnerungen, Kalender und Terminbenachrichtigungen.",
                "Promemoria, agenda e avvisi sugli eventi.",
                "Recordatorios, agenda y avisos de eventos.",
                "Lembretes, agenda e avisos de eventos.",
                "Herinneringen, agenda en meldingen voor afspraken.",
                "Напоминания, календарь и оповещения о событиях.",
                "Przypomnienia, kalendarz i powiadomienia o wydarzeniach."),foreground,soft);
        android.widget.TextView foot=setupLabel(onboardingString(
            "Apasă „Mai departe”. Permisiunile sunt acordate exclusiv în ferestrele Android; poți refuza sau modifica ulterior din setările telefonului.",
            "Tap “Next”. Only Android grants permissions; you can decline or change them later in Settings.",
            "Appuyez sur « Suivant ». Vous pouvez refuser ou modifier les autorisations dans Android.",
            "Tippe auf „Weiter“. Berechtigungen bestätigst du nur in Android und kannst sie später ändern.",
            "Tocca « Avanti ». I permessi sono gestiti da Android e puoi modificarli in seguito.",
            "Pulsa « Siguiente ». Android gestiona los permisos y puedes cambiarlos después.",
            "Toque em « Seguinte ». O Android gere as permissões e pode alterá-las depois.",
            "Tik op 'Verder'. Android beheert de toestemming; je kunt die later wijzigen.",
            "Нажмите «Далее». Разрешения выдаёт Android, позже их можно изменить.",
            "Naciśnij „Dalej”. Uprawnienia nadaje Android, a później można je zmienić."),12,soft,false);
        android.widget.LinearLayout.LayoutParams footLp=new android.widget.LinearLayout.LayoutParams(-1,-2);
        footLp.topMargin=setupDp(10);column.addView(foot,footLp);
        android.widget.Button continueButton=new android.widget.Button(this);
        continueButton.setAllCaps(false);
        continueButton.setText(onboardingString("Mai departe","Next","Suivant","Weiter","Avanti","Siguiente","Seguinte","Verder","Далее","Dalej"));
        continueButton.setTextColor(foreground);continueButton.setTextSize(17);
        continueButton.setBackground(setupBackground(Color.rgb(19,105,145),cyan,13));
        android.widget.LinearLayout outer=new android.widget.LinearLayout(this);
        outer.setOrientation(android.widget.LinearLayout.VERTICAL);
        outer.setPadding(setupDp(10),setupDp(8),setupDp(10),setupDp(10));
        outer.setBackground(setupBackground(Color.rgb(10,39,57),Color.rgb(72,137,167),22));
        android.widget.ScrollView scroll=new android.widget.ScrollView(this);
        scroll.setFillViewport(false);scroll.addView(column);
        outer.addView(scroll,new android.widget.LinearLayout.LayoutParams(-1,0,1f));
        android.widget.LinearLayout.LayoutParams continueLp=new android.widget.LinearLayout.LayoutParams(-1,setupDp(50));
        continueLp.topMargin=setupDp(8);outer.addView(continueButton,continueLp);
        panel.setContentView(outer);
        continueButton.setOnClickListener(v->{
            String email=emailField.getText().toString().trim();
            String preferredName=nameField.getText().toString().trim().replaceAll("\\s+"," ");
            String birthDate=birthField.getText().toString().trim();
            if(!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()||email.length()>254){
                emailField.setError(onboardingString("Introdu o adresă e-mail validă.","Enter a valid email address.",
                    "Saisissez une adresse e-mail valide.","Bitte gültige E-Mail eingeben.","Inserisci un'e-mail valida.",
                    "Introduce un correo válido.","Introduza um e-mail válido.","Vul een geldig e-mailadres in.",
                    "Укажите корректный адрес.","Podaj poprawny e-mail."));emailField.requestFocus();return;
            }
            if(preferredName.length()<2||preferredName.length()>50){
                nameField.setError(onboardingString("Introdu numele dorit (2–50 caractere).",
                    "Enter your preferred name (2–50 characters).","Indiquez votre nom préféré.",
                    "Bitte bevorzugten Namen eingeben.","Inserisci il nome preferito.","Introduce tu nombre preferido.",
                    "Introduza o nome preferido.","Vul je voorkeursnaam in.","Укажите имя.","Podaj preferowane imię."));
                nameField.requestFocus();return;
            }
            int age=UserProfileDates.ageFromBirthDate(birthDate);
            if(age==0){
                birthField.setError(onboardingString("Selectează o dată a nașterii validă.",
                    "Choose a valid date of birth.","Choisissez une date de naissance valide.",
                    "Gültiges Geburtsdatum wählen.","Scegli una data di nascita valida.",
                    "Selecciona una fecha de nacimiento válida.","Escolhe uma data de nascimento válida.",
                    "Kies een geldige geboortedatum.","Укажите дату рождения.",
                    "Wybierz poprawną datę urodzenia."));
                return;
            }
            int selected=genderChoices.getCheckedRadioButtonId()-10070;
            String sex=sexCodes[Math.max(0,Math.min(2,selected))];
            // Private application storage. No automatic mail or profile upload.
            getSharedPreferences("pocket_user_profile",Context.MODE_PRIVATE).edit()
                .putString("email",email).putString("preferred_name",preferredName)
                .putInt("age",age).putString("birth_date",birthDate).putString("sex",sex).apply();
            continueButton.setEnabled(false);
            panel.dismiss();
            SharedPreferences prefs=getSharedPreferences(PREFS_NAME,Context.MODE_PRIVATE);
            prefs.edit().putBoolean("first_setup_complete_v1",true)
                .putString("ui_language_native",initialSetupLanguage)
                .putBoolean("startup_location_requested_v3",true)
                .putBoolean("startup_microphone_requested_v3",true)
                .putBoolean("first_microphone_permission_requested",true)
                .apply();
            beginSystemPermissions();
        });
        panel.show();
        if(panel.getWindow()!=null){
            android.view.Window window=panel.getWindow();
            window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            window.addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND);
            WindowManager.LayoutParams params=window.getAttributes();
            params.dimAmount=.82f;window.setAttributes(params);
            window.setLayout(getResources().getDisplayMetrics().widthPixels-setupDp(28),
                Math.min(getResources().getDisplayMetrics().heightPixels-setupDp(26),setupDp(710)));
        }
    }

    private void beginSystemPermissions(){
        if(checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)!=PackageManager.PERMISSION_GRANTED
            && checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)!=PackageManager.PERMISSION_GRANTED){
            requestPermissions(new String[]{Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION},ONBOARDING_PERMISSIONS_REQUEST);
        }else requestNotificationPermission();
    }

    private void requestNotificationPermission(){
        if(android.os.Build.VERSION.SDK_INT>=33
            && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED){
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS},
                ONBOARDING_NOTIFICATIONS_REQUEST);
        }else requestMicrophonePermission();
    }

    private void requestMicrophonePermission(){
        if(checkSelfPermission(Manifest.permission.RECORD_AUDIO)!=PackageManager.PERMISSION_GRANTED){
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO},
                ONBOARDING_MICROPHONE_REQUEST);
        }else startAvatarEntrance();
    }

    private void requestStartupPermissions() {
        SharedPreferences prefs=getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        launchLanguage=currentLaunchLanguage(prefs);
        initialSetupLanguage=launchLanguage;
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
        showFirstInstallationPanel();
    }

    @Override public void onRequestPermissionsResult(int requestCode,String[] permissions,int[] grantResults) {
        super.onRequestPermissionsResult(requestCode,permissions,grantResults);
        if(requestCode==ONBOARDING_PERMISSIONS_REQUEST)requestNotificationPermission();
        else if(requestCode==ONBOARDING_NOTIFICATIONS_REQUEST)requestMicrophonePermission();
        else if(requestCode==ONBOARDING_MICROPHONE_REQUEST)startAvatarEntrance();
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
        int support=speech.setLanguage(Locale.forLanguageTag(speechTagForLanguage(launchLanguage)));
        if(support==TextToSpeech.LANG_MISSING_DATA || support==TextToSpeech.LANG_NOT_SUPPORTED){
            launchLanguage="en";
            support=speech.setLanguage(Locale.forLanguageTag("en-GB"));
            if(support==TextToSpeech.LANG_MISSING_DATA || support==TextToSpeech.LANG_NOT_SUPPORTED){
                openMain();return;
            }
        }
        currentGreeting=firstSetupShownThisLaunch?firstGreetingForLanguage(launchLanguage):greetingForLanguage(launchLanguage);
        // Keep one continuous native-language utterance: changing TTS locale
        // between sentences caused lengthy pauses and an audible voice swap.
        // For Romanian only, spell the trademark phonetically for the voice;
        // currentGreeting remains unchanged for the avatar and UI.
        spokenGreeting = "ro".equals(launchLanguage)
            ? currentGreeting.replace("myPocket AI", "mai pocăt ei ai")
            : currentGreeting;
        int result = speech.speak(spokenGreeting, TextToSpeech.QUEUE_FLUSH, null, UTTERANCE_ID);
        if (result == TextToSpeech.ERROR) openMain();
    }

    private void finishGreeting(){
        if(finishingLaunch)return;
        sendToAvatar("window.pocketLaunchSpeak && window.pocketLaunchSpeak(false);");
        handler.postDelayed(AvatarLaunchActivity.this::openMain, 480L);
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
            Uri source=getIntent()!=null?getIntent().getData():null;
            if(source!=null && "mypocketai".equalsIgnoreCase(source.getScheme())
                    && "invite".equalsIgnoreCase(source.getHost()) && source.getPathSegments().size()==1){
                String invite=source.getPathSegments().get(0);
                if(invite.matches("[A-Za-z0-9_-]{32,150}"))
                    intent.putExtra("communication_invite",invite);
            }
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
