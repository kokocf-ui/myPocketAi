# Impact Partner API — pregătire backend Eva

2026-11-16: utilizatorul a creat token Impact cu permisiuni GET pentru Programs și Reports și a introdus două secrete în Cloudflare Worker lifewise-ai-api:
- IMPACT_ACCOUNT_SID — username / Account SID
- IMPACT_API_TOKEN — password / Auth Token

Nu stocăm valorile în GitHub. Prezența lor efectivă în Worker nu a fost verificată prin acest cod.
Documentația oficială: https://integrations.impact.com/rest-apis/api-quick-start.md

Modulul impact_partner_api.mjs exportă verifyImpactPartnerPrograms(env) și apelează exclusiv GET https://api.impact.com/Mediapartners/{AccountSID}/Campaigns cu Basic auth. Returnează un rezultat minimal, fără credențiale sau date sensibile; nu oferă endpoint public.

Etapa actuală: adaptor și teste mock pregătite. Fără apel live, fără deployment, fără modificarea navigației, fără activarea Omio Android. Pentru confirmarea reală este necesară invocarea controlată a adaptorului în Cloudflare și un status HTTP 200. Nu expuneți un endpoint public pentru contul Impact.
API-ul Impact NU oferă orarele sau prețurile Meta Search API Omio.
