# Security Policy

## Supported Scope

Cobalt Shield is an actively maintained public project. Security issues affecting the current production website, core frontend code, forms, and deployment-related configurations are within scope for review.

At this time, the following are considered supported:

| Area | Supported |
|------|-----------|
| Live production website | Yes |
| Main branch latest code | Yes |
| Contact / form functionality | Yes |
| Frontend HTML / CSS / JavaScript | Yes |
| Historical / deprecated code | No |
| Third-party services outside project control | No |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly and privately.

- **Do not** open a public GitHub issue for sensitive vulnerabilities.
- Please report findings by email to: **delphin@cobalt-shield.com**
- If needed, include the subject line: **[Security Report] Cobalt Shield**

To help review the issue quickly, include:

- A clear description of the vulnerability
- Steps to reproduce
- Affected page, file, or feature
- Proof of concept, screenshots, or payloads if relevant
- Impact assessment
- Suggested remediation, if available

## Response Process

Cobalt Shield aims to handle reports responsibly and in good faith.

Target response timeline:

- **Acknowledgement:** within 3 to 7 business days
- **Initial triage:** within 7 to 14 business days
- **Fix timeline:** depends on severity, complexity, and operational constraints

Not every report will result in an immediate fix, but each valid report will be reviewed.

## Safe Harbor

If you act in good faith and avoid privacy violations, service disruption, or data destruction, Cobalt Shield will treat your research as authorized for the limited purpose of responsible disclosure.

Please:

- Avoid accessing, modifying, or deleting user data
- Avoid denial-of-service, spam, or service disruption
- Avoid social engineering, phishing, or physical attacks
- Avoid exploiting vulnerabilities beyond what is necessary to prove impact
- Stop testing immediately after confirming the issue and report it

## Out of Scope

The following are generally out of scope unless they create a clear and meaningful security impact:

- Missing security headers without demonstrated exploitability
- Best-practice suggestions without an actual vulnerability
- Rate limiting issues without abuse scenario
- Vulnerabilities affecting only outdated browsers
- Issues in third-party platforms or providers not controlled by this repository
- Self-XSS that requires a user to paste code into their own browser
- Content, spelling, SEO, or UI-only issues without security impact

## Disclosure Policy

Please allow reasonable time for investigation and remediation before any public disclosure.

Public disclosure of a vulnerability before a fix is available may put users, systems, or project integrity at risk.

## Security Principles

Cobalt Shield follows a practical security mindset centered on:

- Responsible disclosure
- Minimal data exposure
- Secure-by-default thinking
- Clear user communication
- Continuous improvement

## Contact

For all security-related communication, use:

**Email:** delphin@cobalt-shield.com

If no reply is received within a reasonable timeframe, you may resend the report with the subject line:

**[Follow-Up] Security Report**
