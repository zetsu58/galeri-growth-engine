# WhatsApp
The mock normalizes and deduplicates inbound events per tenant. Production must use Meta WhatsApp Cloud API only: verify challenge and `X-Hub-Signature-256` over raw bytes with constant-time comparison, atomically persist external IDs, normalize messages, enforce rate limits/window/template rules, and redact tokens. Browser automation is prohibited.
