# WebLoot Security Posture

This document outlines the security controls, specifically around Server-Side Request Forgery (SSRF) and resource exhaustion, implemented in WebLoot. It also details the remaining known limitations.

## SSRF Protections

WebLoot takes user-provided URLs and fetches them from the server. To prevent SSRF attacks, the following protections are strictly enforced:

- **Protocol Validation**: Only `http:` and `https:` protocols are permitted. Dangerous protocols like `file:`, `ftp:`, `javascript:`, or `data:` are blocked at the URL parsing stage.
- **Localhost and Loopback Blocking**: Any URL pointing to `localhost` or resolving to `127.x.x.x` or `::1` is strictly blocked.
- **Private IP Range Blocking**: The application validates both the hostname and the resolved IP addresses against known private/internal ranges (RFC 1918):
  - `10.0.0.0/8`
  - `172.16.0.0/12`
  - `192.168.0.0/16`
  - `169.254.0.0/16` (Link-local)
  - `0.0.0.0/8` (Current network)
  - `fc00::/7` and `fe80::/10` (IPv6 local and link-local)
- **DNS Resolution Safety**: When a domain name is provided (e.g., `example.com`), WebLoot performs a DNS lookup *before* initiating the request to ensure the resolved IP address does not point to an internal network.
- **Redirect Protection**: The application limits the number of redirects (max 5). Critically, it validates the URL safety of *each* redirect destination.

## Resource and Concurrency Protections

To protect the server from Denial of Service (DoS) attacks and resource exhaustion:

- **Controlled Concurrency**: Deep Scans (which require launching a Chromium browser) are strictly limited using an in-memory semaphore. The server will reject Deep Scan requests with a generic error message when it is at maximum capacity (e.g., `MAX_CONCURRENT_SCANS`).
- **Timeouts**: 
  - Quick Scans (Axios) enforce a strict timeout (`10,000ms`).
  - Deep Scans enforce timeouts for page navigation (`20,000ms`), network idle (`10,000ms`), and a global kill-switch timeout (`45,000ms`).
- **Maximum Response Size**: 
  - During Quick Scans and Deep Scans, the server restricts the maximum HTML size that will be parsed (e.g., `10MB`).
  - The download proxy enforces a strict maximum download size of `50MB`. Any stream exceeding this limit is destroyed immediately.
- **Browser Lifecycle Management**: Every browser instance is launched in a controlled context, with limits on memory (`--disable-dev-shm-usage`) and sandboxing enabled. Instances are guaranteed to be closed in a `finally` block to prevent zombie processes.
- **Network Request Limiting**: During Deep Scans, we limit the number of collected network assets to `500` to prevent memory blowouts.

## Known Limitations

Do not assume the application is impenetrable. The following limitations remain:

1. **DNS Rebinding Attacks**: While we resolve the IP address before fetching, an attacker could potentially use a very short TTL on a DNS record to point to a safe IP during validation and an internal IP during the actual fetch (Time-of-Check to Time-of-Use).
2. **Proxy Evasion**: Advanced proxy setups, transparent proxies, or complex IPv6 mapping attacks could theoretically bypass the IP validation if not carefully configured at the network level.
3. **Command Injection / Path Traversal**: WebLoot relies on parameterized APIs (`playwright`, `axios`) and does not directly execute shell commands based on user input. Filenames during downloads are aggressively sanitized, minimizing path traversal risks, but extreme edge cases in OS-level filename handling could exist.
4. **Rate Limiting**: Currently, concurrency is limited globally, but there is no per-IP or per-user rate limiting implemented at the application layer. An attacker can still spam the service, causing legitimate users to receive "Server busy" errors.
5. **Headless Browser Zero-Days**: The application relies on Chromium. Any zero-day remote code execution (RCE) vulnerability in Chromium could potentially be exploited by a malicious website during a Deep Scan.

*Note: WebLoot does not attempt to bypass DRMs, authentication, paywalls, or signed access controls. It only extracts publicly accessible assets.*
