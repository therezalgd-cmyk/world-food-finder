## Security & Secrets

- DO NOT commit `.env` or `serviceAccountKey.json`.
- Set all secrets via hosting provider environment variables.
- Tokens are stored encrypted in DB using `TOKEN_ENCRYPTION_KEY`.
- All OAuth flows handled server-side; client never stores client_secret.
