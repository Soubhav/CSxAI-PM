# Agent Personalization — Setup Guide

Everything you can configure when creating a Master Agent or Sub Agent. Make your AI agent sound, feel, and behave like a natural extension of your brand.

---

## Onboarding Wizard

New agents are created through a guided 3-step wizard. Each step focuses on one layer of configuration and includes a **live voice preview** so admins hear the impact of every change before saving.

### Step 1 — Identity

> _"Who is your agent?"_

Set the agent's name, role, organization, and voice. This step covers everything a caller perceives in the first five seconds of a call — the voice they hear and the name that introduces itself.

| Configured here | Section reference |
|---|---|
| Agent name, role, org name, tagline, avatar | [1. Agent Identity](#1-agent-identity) |
| Voice profile, accent, speed, pitch | [2. Voice & Speech](#2-voice--speech) |
| Primary language, bilingual toggle | [4. Language & Localization](#4-language--localization) |

**Preview:** A sample greeting plays using the selected voice, accent, and speed — e.g. _"Hi, thanks for calling Lakeside Credit Union. My name is Alex. How can I help you today?"_

### Step 2 — Personality

> _"How should your agent sound?"_

Dial in the agent's tone using slider controls. Each slider updates the preview in real time so admins can hear the difference between formal and conversational, concise and warm.

| Configured here | Section reference |
|---|---|
| Formality, warmth, vocabulary, humor | [3. Tone & Personality](#3-tone--personality) |
| Filler words, pause behavior, pronunciation | [2. Voice & Speech](#2-voice--speech) |
| Personality keywords | [3. Tone & Personality](#3-tone--personality) |

**Preview:** Two side-by-side sample responses — one at the current slider positions, one at the opposite extreme — so the admin hears the contrast.

### Step 3 — Rules & Guardrails

> _"What are the boundaries?"_

Define conversation scripts, escalation thresholds, compliance requirements, and anything the agent must or must not do. This is the safety layer.

| Configured here | Section reference |
|---|---|
| Greeting & closing scripts, hold behavior | [5. Conversation Behavior](#5-conversation-behavior) |
| Silence timeout, interruption handling, max turns | [5. Conversation Behavior](#5-conversation-behavior) |
| Disclosures, prohibited topics, auth, data rules | [6. Compliance & Guardrails](#6-compliance--guardrails) |

**Preview:** A full simulated call snippet — the agent greets, handles a sample question, and closes — using all configured settings end to end.

### After Setup

Once the wizard completes:

1. **Agent is created in Draft status** — not live, not taking calls.
2. **Admin lands in the Sandbox** — a full test conversation using the new agent's configuration.
3. **"Open in Canvas"** button takes them to the Agent Canvas to add scenarios, knowledge, and tools.
4. **"Go Live"** deploys the agent and moves it to Active status.

---

## 1. Agent Identity

| Setting | Description | Example Values |
|---|---|---|
| **Agent Name** | The name your agent uses when introducing itself to callers. | "Alex", "Jordan", "Lakeside Assistant" |
| **Agent Role** | A short title that defines what the agent does. | "Member Services Agent", "Loan Advisor", "Property Specialist" |
| **Organization Name** | Your company name — used in greetings and disclosures. | "Lakeside Credit Union", "Summit Bank", "Realty Partners" |
| **Brand Tagline** | Optional line the agent can weave into greetings or closings. | "Here to help you bank smarter." |
| **Avatar / Icon** | Visual identity shown in chat interfaces and dashboards. | Upload a logo or choose from preset icons |

---

## 2. Voice & Speech

| Setting | Description | Example Values |
|---|---|---|
| **Voice Profile** | Select from a library of natural-sounding AI voices. Preview each before choosing. | "Aria (Female, Warm)", "Marcus (Male, Professional)", "Riley (Neutral, Friendly)" |
| **Accent / Region** | Match the voice to your customer base or brand identity. | American (Standard), American (Southern), British, Australian, Neutral |
| **Speaking Speed** | How fast the agent speaks — adjustable on a scale. | Slow / Normal / Slightly Fast (0.8x – 1.3x) |
| **Pitch** | Fine-tune the voice pitch to match your brand personality. | Low / Medium / High |
| **Pause Behavior** | How long the agent waits after a caller finishes speaking before responding. | Short (0.3s), Normal (0.6s), Patient (1.0s) |
| **Filler Words** | Whether the agent uses natural fillers like "let me check on that" while processing. | Enabled / Disabled |
| **Pronunciation Overrides** | Custom pronunciations for company-specific terms, product names, or acronyms. | "HELOC" → "hee-lock", "Roth" → "rawth" |

---

## 3. Tone & Personality

| Setting | Description | Example Values |
|---|---|---|
| **Formality Level** | Sets how formal or casual the agent sounds across all interactions. | Formal ("I'd be happy to assist you with that.") / Conversational ("Sure thing, let me pull that up!") / Balanced |
| **Warmth** | Controls how empathetic and personable the agent feels. | Professional / Warm / Highly Empathetic |
| **Vocabulary Style** | Whether the agent uses industry jargon or keeps language simple. | Plain Language (recommended for consumers) / Technical (internal-facing agents) |
| **Humor** | Whether the agent uses light, appropriate humor in low-stakes moments. | Off / Subtle / Light |
| **Empathy Responses** | How the agent reacts to frustration, confusion, or distress. | "I completely understand how frustrating that must be. Let me help sort this out." |
| **Personality Keywords** | Free-text tags that shape the agent's overall character. | "helpful", "patient", "direct", "reassuring" |

---

## 4. Language & Localization

| Setting | Description | Example Values |
|---|---|---|
| **Primary Language** | The default language the agent speaks and understands. | English (US), English (UK), Spanish (US) |
| **Bilingual Support** | Enable the agent to detect and switch languages mid-call. | English + Spanish, English + French |
| **Date & Currency Format** | How the agent reads back dates, times, and dollar amounts. | "March twenty-third" vs. "3/23", "$1,500" vs. "fifteen hundred dollars" |
| **Regional Terminology** | Swap terms to match local conventions. | "Checking account" vs. "Current account", "ATM" vs. "Cash machine" |

---

## 5. Conversation Behavior

| Setting | Description | Example Values |
|---|---|---|
| **Greeting Script** | What the agent says when it answers a call. Supports dynamic variables. | "Hi, thanks for calling {org_name}. My name is {agent_name}. How can I help you today?" |
| **Closing Script** | How the agent wraps up a resolved call. | "Is there anything else I can help with? Thanks for calling — have a great day." |
| **Hold Behavior** | What the agent says and does when it needs processing time. | Play hold music / Say "One moment please" / Narrate what it's doing |
| **Repeat Handling** | How the agent responds when asked to repeat something. | Rephrase in simpler terms / Repeat verbatim / Offer to send via SMS |
| **Max Turns Before Escalation** | How many back-and-forth exchanges before the agent offers a human. | 3 / 5 / 7 turns |
| **Silence Timeout** | What happens if the caller goes silent. | Prompt after 5s → Prompt again after 10s → Offer callback after 20s |
| **Interruption Handling** | Whether callers can interrupt the agent mid-sentence. | Allow (agent stops and listens) / Finish current sentence first |

---

## 6. Compliance & Guardrails

| Setting | Description | Example Values |
|---|---|---|
| **Required Disclosures** | Statements the agent must say at specific points (e.g., call recording notice). | "This call may be recorded for quality assurance purposes." |
| **Prohibited Topics** | Subjects the agent must never discuss or offer advice on. | Tax advice, legal counsel, specific investment recommendations |
| **Authentication Requirements** | What the agent must verify before sharing account details. | Last 4 SSN + DOB, Member number + PIN, Knowledge-based questions |
| **Data Handling Rules** | What the agent can and cannot store or repeat back. | Never read full SSN aloud, mask card numbers in transcripts |
| **Fallback Behavior** | What happens when the agent doesn't know the answer. | "I want to make sure I get this right — let me connect you with a specialist." |
| **Regulatory Compliance** | Industry-specific compliance frameworks the agent must follow. | NCUA (credit unions), FDIC (banks), RESPA (real estate), TCPA (telephony) |

---

## 7. Master Agent vs. Sub Agent

| Concept | Description |
|---|---|
| **Master Agent** | The top-level agent that owns global settings — voice, tone, compliance, and branding. All Sub Agents inherit from the Master unless overridden. |
| **Sub Agent (Scenario Agent)** | A specialized agent tied to a specific scenario (e.g., "Loan Status", "Property Inquiry"). Inherits Master settings but can override tone, greeting, escalation, and tools. |
| **Inheritance** | Sub Agents automatically use the Master Agent's voice, personality, and compliance settings. Only configure what's different. |
| **Per-Scenario Overrides** | Any Sub Agent can override: greeting script, formality level, max turns, escalation path, and enabled tools. |
| **Independent Testing** | Each Sub Agent can be tested independently in the Sandbox before deployment. |
| **Version Control** | Master and Sub Agents are versioned separately — update a Sub Agent without redeploying the entire system. |
