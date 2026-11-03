# Pocket AI static assets

Place `avatar-v16.html` in this directory. It is served automatically at `/avatar-v16.html` by Cloudflare Workers static assets when deployed with `wrangler-frontend.toml`.

The frontend uses the iframe bridge (`pocket-avatar-v16`) and falls back to the image until the frame reports ready.
