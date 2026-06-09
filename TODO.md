# TODO

## Production Hardening

- Move `/api/quote` rate limiting from in-memory storage to a distributed store such as Vercel KV or Upstash before handling higher production traffic.
- Split database environments before launch: keep `develop`/local testing on a development Neon branch or database, then create `master` for production and point the production Vercel project at an isolated production Neon database URL.

## Launch QA

- Run one final end-to-end quote request test from the production domain after DNS is connected, including embedded Quotient lead creation.
- If the direct Quotient POST backup is revisited, test `/contact/direct-quotient-backup` against a disposable lead before trusting it.
- If Zapier is reactivated later, test `/contact/zapier-backup` separately before exposing it to the client.
