# CSxIQ — Open Questions & Deferred Items

Things decided in principle but not yet built, plus things to revisit.

---

## Auth & tenancy (decided in principle — D-17, D-18)

- **Per-CSR credentials + RBAC** (CSR / Senior CSR / Team Lead / Admin) — required for compliance and for presence/claim-lock/handled-by/personal stats. **To build.**
- **Single-tenant per CU** deployments now, with a **tenant-aware (`org_id`) schema** so pooled multi-tenancy is possible later without a rewrite.
- **Revisit pooled multi-tenancy** when deployment ops cost per new CU outweighs the isolation/sales benefit — roughly **15–20 tenants** or weekly onboarding.

## Deferred from this session

| Item | Status | Note |
|---|---|---|
| Context-aware deep-linking (CSxAI → exact CSxIQ ticket) | Deferred | Simple sidebar link shipped first (D-11) |
| Real telephony (WebRTC/PSTN, LiveKit SIP / Twilio) | Mocked | "Demo · simulate outcome" stands in; real dialing is a build task |
| Real LLM Copilot / resolution scoring | Mocked | Threshold and suggestions are illustrative |
| Design-system maturity | Open | Tokens, component library, motion, empty/error/loading states, a11y/contrast audit |
| Responsive / mobile | Open | Screens are desktop-first |

## Questions to resolve with Vince & Tim (product direction)

- Exact **resolution-score threshold** for the `Unresolved` tag (currently 70).
- Max **callback attempts** and cooldown policy (currently 3).
- Which **dispositions** require supervisor review.
- Whether History is **CSR-personal** by default or team-wide for leads.

## Phase mapping

- **Now:** high-fidelity screens (mock) — Home, Callbacks, Live Escalations, History.
- **Next (build):** per-CSR auth + RBAC, real ticket/interactions data model (tenant-aware), real WebRTC outbound + escalation rooms.
- **Later:** real Copilot/RAG, agent-assist features ([features-agent-assist.md](features-agent-assist.md)), pooled multi-tenancy (if triggered).
