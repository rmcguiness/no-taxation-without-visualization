# Security policy

## Reporting a vulnerability

Please **do not open a public issue** for security problems. Report them privately through
GitHub's [private vulnerability reporting](https://github.com/rmcguiness/no-taxation-without-visualization/security/advisories/new)
(Security tab → "Report a vulnerability").

Include what you found, how to reproduce it, and the expected impact. This is a personal
open-source project maintained by one person: there is no bug bounty and no guaranteed
response time, but reports are read and fixes are prioritised.

## Scope

In scope:

- The Next.js web app (`app/`, `components/`, `lib/`) and its deployed site.
- The Python ingest pipeline (`ingest/`), including how it handles downloaded files and
  database credentials.
- CI and repository configuration.

Out of scope:

- Accuracy disputes about the underlying government data (open a normal issue instead).
- The local `docker-compose.yml` dev database, which uses a documented default password and
  is bound to localhost only. Do not run it on a shared or public host.
- Denial-of-service against the hosted site through raw request volume.
- Vulnerabilities in third-party dependencies without demonstrated impact here (report
  upstream; Dependabot tracks updates).
