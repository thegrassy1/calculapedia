# Calculapedia Control Plane

This Cloudflare Worker is the private monitoring backend for Calculapedia. It provides:

- A token-protected `/admin` dashboard
- A token-protected `/api/metrics` endpoint
- A token-protected manual `/api/collect` endpoint
- A daily scheduled site-health collection
- D1 storage for metric history

The first collector checks availability and key SEO URLs. The data-source adapters for Search Console, Google Analytics, AdSense, affiliate reports, and Cloudflare Analytics are intentionally separate follow-up connections because each requires its own credentials and API scopes.

## Deploy prerequisites

Install Wrangler and authenticate to the correct Cloudflare account:

```bash
npm install --global wrangler
wrangler login
```

Create the D1 database:

```bash
wrangler d1 create calculapedia-metrics
```

Copy the returned `database_id` into `wrangler.toml`, uncomment the `[[d1_databases]]` block, then initialize it:

```bash
wrangler d1 execute calculapedia-metrics --remote --file=./schema.sql
```

Set the dashboard token as a Worker secret. Do not commit it or put it in the repository:

```bash
wrangler secret put ADMIN_TOKEN
```

Deploy:

```bash
wrangler deploy
```

The Worker cron trigger runs at 06:15 UTC daily. The dashboard is at `/admin`. Send the token as `Authorization: Bearer TOKEN`; for a browser-only dashboard session, append `?token=TOKEN` to the URL.

## Security

- Keep `ADMIN_TOKEN` private and rotate it if exposed.
- Put the Worker behind Cloudflare Access before using it with sensitive revenue data.
- Add Google and affiliate credentials as Worker secrets or encrypted OAuth tokens, never as repository files.
- The dashboard should remain private; it is not intended to be indexed.
