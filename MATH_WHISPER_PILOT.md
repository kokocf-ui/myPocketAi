# Mathematics dictation — opt-in Whisper pilot

This pilot is **not an automatic replacement** for verified dictation. It is intended for one-device testing of Romanian math expressions, especially spoken negative numbers and closing brackets.

## Activation (owner only)

1. Deploy `main` to Cloudflare and install the latest **signed release APK**, not the unupgradeable debug build.
2. Open Cloudflare > Workers & Pages > `lifewise-ai-api` > Settings > Variables and Secrets > Add. Create a **Secret**, not a public variable:
   - Name: `POCKET_MATH_PILOT_TOKEN`
   - Value: a newly generated cryptographically random secret, at least 32 characters; do not share it in chat or commit it to GitHub.
   - Deploy the secret.
3. In APK > Învățare > Matematică > Dictare, the owner must explicitly accept voice upload, then type that same secret in the masked field. It is held only in browser memory for this session.
4. Speak a short exercise, then press Dictare a second time to stop and send the recording for transcription. Maximum recording duration: 30 seconds. The raw transcript is shown for review; never assume it is error-free.

When the Worker secret is not present, the endpoint returns `503 math_transcription_not_configured`. A wrong token returns 401. The Worker validates 16 kHz mono PCM 16-bit WAV under approximately 1 MB, sends it to Cloudflare Workers AI `@cf/openai/whisper-large-v3-turbo`, and does not persist or log audio, tokens, or transcripts. The Android app transfers audio in 48 KB messages (not one oversized WebView message).

## Test phrases

- "Trei ori, deschide paranteza, doi ori minus unu, închide paranteza, plus cinci"
- "Trei ori paranteză, doi ori minus unu, paranteză, plus cinci"
- "Paranteză pătrată, doi plus trei, închide paranteza pătrată, ori cinci"
- Two consecutive opening parentheses, nested operations, pauses of 3–5 seconds
- Cases that contain both time expressions ("trei ore") and math multiplication ("trei ori")

Record separately whether Whisper preserved each operator and bracket; include elapsed time and whether the text needed correction. Tests written with mocks cannot prove live transcription accuracy.

## Reversal

If the pilot fails on real speech, remove the Math-only Dictare button or revert the pilot commits, leaving photo/text entry and all other voice modules unchanged. Remove `POCKET_MATH_PILOT_TOKEN` from the Cloudflare Worker settings to immediately disable the transcription endpoint, even before any APK change.

## Privacy / safety limitations

Cloudflare receives the voice clip only after opt-in and the user stops recording (or the 30-second cap is hit). There is no persistent audio storage in this application. Do not dictate identity documents or personal information during testing. The endpoint is a temporary pilot; a real multi-user service would require per-user identity, quotas, abuse controls and an independent security review.
