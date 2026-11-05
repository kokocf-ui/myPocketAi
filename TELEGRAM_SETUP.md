# Telegram — canale cu acordul editorilor

Acest conector este pentru canale publice aprobate explicit, nu pentru căutarea în toate canalele Telegram.

Conform regulilor Telegram, colectarea de conținut pentru produse AI nu este permisă în lipsa consimțământului explicit necesar. Pocket AI nu extrage automat mesaje din canale necunoscute, nu citește chat-uri private sau grupuri și nu trimite automat conținutul Telegram către modelul AI.

Documentație oficială: https://telegram.org/tos/content-licensing ; https://telegram.org/tos/bot-developers ; https://core.telegram.org/bots/api

## Configurare de către administrator

1. Obține permisiunea expresă, documentată și revocabilă a editorilor canalului public pentru afișarea postărilor atribuite în Pocket AI. Un canal public nu înseamnă automat permisiune de reutilizare.
2. Creează un bot în Telegram folosind @BotFather și adaugă botul la canalul public aprobat, cu drepturile necesare pentru actualizări. Această cale necesită token Bot API, nu api_id sau api_hash de pe my.telegram.org.
3. Păstrează următoarele valori exclusiv în Cloudflare Worker Secrets. Nu le include în cod sau în conversații:

    npx wrangler secret put TELEGRAM_BOT_TOKEN --config wrangler-backend.toml
    npx wrangler secret put TELEGRAM_APPROVED_CHANNELS --config wrangler-backend.toml
    npx wrangler secret put TELEGRAM_PUBLISHER_CONSENT --config wrangler-backend.toml

Pentru lista de canale folosește nume publice autorizate, separate prin virgulă, precum @PublisherOne,@PublisherTwo (nume demonstrative). Setează valoarea consimțământului la confirmed numai după obținerea acordurilor.

4. Verifică dacă acest bot utilizează deja un webhook sau un alt serviciu care citește mesajele. Implementarea actuală folosește getUpdates la cerere, nu șterge webhookuri și nu confirmă sau consumă update-urile folosind offseturi.
5. După publicare, interoghează aplicația cu «Arată-mi știrile de pe Telegram» ori folosește GET /api/public-intel?kind=telegram&lang=ro.

## Limitări și confidențialitate

- Bot API nu oferă acces la toate canalele; sunt afișate numai postările din canalele publice autorizate și accesibile botului.
- Actualizările Bot API sunt păstrate cel mult 24 de ore; conectorul nu oferă arhiva completă și nu stochează un istoric.
- Sunt returnate doar numele canalului, o porțiune scurtă din postare, linkul original și data; nu sunt incluse profiluri personale, mesaje private sau de grup.
- Postările sunt marcate ca neverificate independent și nu sunt ingerate automat de modelul AI.
- Dacă lipsește tokenul, lista de canale ori confirmarea consimțământului, conectorul răspunde not_configured fără să contacteze Telegram.
- Un sistem permanent bazat pe webhook necesită aprobare separată pentru stocare, perioadă de retenție și reguli de utilizare.