# CSxAI — Symitar & nCino Integration Research

**Date:** 2026-03-13
**Purpose:** Understand how CSxAI can integrate with the two dominant backend systems used by US credit unions and banks.

---

## Symitar (Jack Henry) — Core Banking for Credit Unions

### What It Does
Core banking system used by **700+ US credit unions** (95% retention rate, #1 for CUs over $1B in assets). Handles:
- Member accounts, savings, checking, loans, certificates
- Transaction processing (deposits, withdrawals, transfers, payments)
- Loan origination and servicing
- Regulatory compliance and filings
- Digital banking enablement (backend for online/mobile banking)

### Integration Paths

| Path | Protocol | Ease | Notes |
|---|---|---|---|
| **Banno Open Banking APIs** | REST | Easy | Self-service at jackhenry.dev — get API keys without vendor approval. Only self-service API in banking industry |
| **SymXchange API** | SOAP/XML | Medium | Direct core access (accounts, transactions, members). Requires FIN membership |
| **jXchange** | SOAP + REST | Medium | Cross-platform API works across all Jack Henry cores. Requires FIN membership |
| **PowerOn Specfiles** | Proprietary | Hard | Custom scripting language running inside Episys core. Requires deep Symitar expertise |

### Developer Portal
All docs at [jackhenry.dev](https://jackhenry.dev/) — covers SymXchange, jXchange (SOAP & REST), Open Banking APIs, and Digital Toolkit.

### Fintech Integration Network (FIN)
- Replaced the old Vendor Integration Program (VIP) as of **July 1, 2025**
- Any vendor can join (not exclusive), but **membership required** for specs, test environments, and core software access
- Must complete a **Vendor Readiness Test (VRT)** before integration can be installed at mutual clients
- Contact: VendorQA@jackhenry.com
- Support: Mon-Fri, 8AM-5PM CST

### Cloud Marketplace Presence
- **AWS Marketplace:** No
- **Azure Marketplace:** No
- **GCP Marketplace:** Jack Henry **Data Hub** available as BigQuery shared listing (data/analytics only)
- **Cloud partnership:** Jack Henry's next-gen platform built with **Google Cloud** as primary partner; AWS and Azure supported as secondary options

### AI Companies Already Integrated

| Company | What They Do | Integration Method |
|---|---|---|
| Posh AI | Conversational/generative AI for voice & digital | VIP membership |
| Algebrik AI | AI-powered loan origination & underwriting | SymXchange |
| Vertice AI | Member analytics, cross-sell scoring | Core data integration |
| Cotribute | AI Growth Agents for account opening, loans, cross-sell | jXchange + SymXchange |

### Sources
- [Jack Henry Developer Portal](https://jackhenry.dev/)
- [SymXchange API Docs](https://jackhenry.dev/symxchange-api-docs/)
- [Banno Open Banking APIs](https://jackhenry.dev/open-api-docs/open-banking/)
- [Fintech Integration Network (FIN)](https://jackhenry.dev/developer-programs/fintech-integration-network/)
- [Banno Embedded Fintech](https://banno.com/embedded-fintech/)
- [Posh AI + Jack Henry](https://www.businesswire.com/news/home/20250430176998/en/Posh-AI-Joins-the-Jack-Henry-Vendor-Integration-Program)
- [Cotribute + Jack Henry](https://www.businesswire.com/news/home/20251022849437/en/Cotribute-Expands-Jack-Henry-Fintech-Integration-Network-Integrations)

---

## nCino — Cloud Banking Platform (Loan Origination + CRM)

### What It Does
Cloud platform built natively on **Salesforce**, used by **2,700+ financial institutions** (TD Bank, Truist, Santander). Core capabilities:
- **Loan Origination (LOS)** — Commercial, small business, consumer, and mortgage lending
- **Deposit Account Opening** — Digital account opening across any channel
- **Customer Onboarding** — KYC, identity verification, document upload, compliance
- **CRM** — Inherits Salesforce CRM + Financial Services Cloud
- **Portfolio Analytics** — Real-time dashboards, portfolio management
- **AI** — "Banking Advisor" (conversational AI), "Digital Partners" (agentic AI for execs, analysts, reps)

### Integration Paths

| Path | Protocol | Ease | Notes |
|---|---|---|---|
| **Salesforce REST/SOAP APIs** | REST, SOAP, Bulk, Streaming | Easy | Most open path — OAuth 2.0 auth, read/write nCino custom objects. Bank must grant access |
| **nCino Developer Portal** | REST | Medium | Purpose-built APIs at developer.ncino.com. Consumer APIs live, Business Banking "coming soon" |
| **nCino Integration Gateway** | iPaaS | Medium | 50+ pre-built connectors (Fiserv, Jack Henry, FIS). Requires commercial agreement |
| **Technology Partner Program** | Relationship | Hard | Fill inquiry form, nCino evaluates fit. No self-serve certification |

### Cloud Marketplace Presence
- **AWS Marketplace: YES**
  - [nCino Integration Gateway](https://aws.amazon.com/marketplace/pp/prodview-wfuv3wuv4w4yk)
  - [nCino Mortgage Suite](https://aws.amazon.com/marketplace/pp/prodview-cdhq4rbfnf5xa)
  - Pricing: custom/private offers (not self-serve)
- **Azure Marketplace:** No
- **GCP Marketplace:** No
- **Cloud partnership:** Dedicated [nCino + AWS partnership](https://www.ncino.com/en-US/aws)

### AI Companies Already Integrated

| Company | What They Do |
|---|---|
| Rich Data Co (RDC) | ML-based credit decisioning (VAR agreement with nCino) |
| ACCELQ | AI-powered test automation with nCino-specific capabilities |
| CData | Data connectors/drivers for nCino BI integration |

Note: nCino is investing heavily in **building its own AI** (Banking Advisor, Digital Partners) rather than creating an open AI partner ecosystem.

### Salesforce API Details
Since nCino runs on Salesforce, standard Salesforce dev tools work:
- REST API, SOAP API, Bulk API, Streaming API, Metadata API
- Apex triggers/controllers, Lightning Web Components, Salesforce Flow
- OAuth 2.0 connected apps for authentication
- Any Salesforce integration tool (MuleSoft, Zapier, Workato) can touch nCino data
- **Caveat:** Bank must grant API access; nCino's managed package may have protected objects/fields

### Sources
- [nCino Developer Portal](https://developer.ncino.com/)
- [nCino Platform Integrations](https://www.ncino.com/platform/integrations)
- [nCino on AWS Marketplace](https://aws.amazon.com/marketplace/seller-profile?id=seller-fvnmr2weko2m2)
- [nCino + AWS Partnership](https://www.ncino.com/en-US/aws)
- [nCino Technology Partners](https://www.ncino.com/about/technology-partners)
- [nCino on Salesforce AppExchange](https://appexchange.salesforce.com/appxListingDetail?listingId=a0N30000005v9okEAA)
- [nCino AI & Data Solutions](https://www.ncino.com/solutions/data-ai-analytics)

---

## CSxAI Integration Strategy

### Comparison

| | Symitar (Jack Henry) | nCino |
|---|---|---|
| **Easiest path** | Banno Open Banking APIs (self-service) | Salesforce REST APIs (bank grants access) |
| **Deeper access** | FIN membership + Vendor Readiness Test | Technology Partner Program |
| **On AWS Marketplace?** | No | Yes (Integration Gateway + Mortgage Suite) |
| **On GCP?** | Data Hub only (BigQuery) | No |
| **Seamless?** | Surface-level yes (Banno), core access requires approval | Yes via Salesforce APIs, productized path needs nCino partnership |
| **AI precedent?** | Posh AI, Algebrik AI, Vertice AI, Cotribute | Rich Data Co; nCino building own AI in-house |

### Recommended Phased Approach

**Phase 1 — Quick Wins (No partnerships needed)**
- Use **Banno APIs** (Symitar) to pull member data, account info, balances during live AI calls
- Use **Salesforce APIs** (nCino) to pull loan statuses, member profiles, CRM data
- Both paths are self-service / bank-granted access — no vendor approval required

**Phase 2 — Deeper Integration (Partnership track)**
- Apply to Jack Henry's **Fintech Integration Network (FIN)** for direct core access via SymXchange/jXchange
- Apply to **nCino Technology Partner Program** for official integration and go-to-market support
- Complete Vendor Readiness Test (Jack Henry) for production deployment at mutual clients

**Phase 3 — Marketplace & Scale**
- List CSxAI on **AWS Marketplace** to make procurement easy for banks already buying through AWS
- Explore **nCino Integration Gateway** for pre-built connectors to multiple core banking platforms
- Consider **GCP Marketplace** listing given Jack Henry's Google Cloud partnership

### What CSxAI Would Pull From These Systems

| Data Point | Source | Use in CSxAI |
|---|---|---|
| Member account balances | Symitar (SymXchange/Banno) | AI agent answers "What's my balance?" |
| Transaction history | Symitar (SymXchange) | AI agent answers "What's this charge?" |
| Loan application status | nCino (Salesforce API) | AI agent answers "Where's my loan application?" |
| Member profile / CRM data | nCino (Salesforce API) | Customer Profile Display during live calls |
| Loan payoff amounts | Symitar (SymXchange) | AI agent provides payoff quotes |
| Product eligibility | nCino + Symitar | AI agent recommends relevant products |
| Branch/ATM info | Symitar (Banno) | AI agent answers branch hours questions |
