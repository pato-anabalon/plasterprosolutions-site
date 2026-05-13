# TODO

## Production Hardening

- Move `/api/quote` rate limiting from in-memory storage to a distributed store such as Vercel KV or Upstash before handling higher production traffic.

## Launch QA

- Run one final end-to-end quote request test from the production domain after DNS is connected, including file upload, Zapier delivery, and Quotient lead creation.
