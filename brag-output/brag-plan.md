# Brag Plan: Code Vault ⚡ (With Groq AI Assistant Segment)

## What is this app?
Code Vault is a modern full-stack developer snippet platform built with NestJS, React 19, PostgreSQL, Monaco Editor, and Groq SDK AI (`openai/gpt-oss-120b`) to store, version, analyze, search, and share code snippets effortlessly.

## The angle
Developers waste countless hours re-implementing boilerplate logic and analyzing obscure functions. Code Vault combines a centralized Monaco-powered snippet vault with versioning and an integrated Groq AI coding assistant that analyzes code context in real-time.

## Verified AI Architecture & Tech Stack
- **AI Provider**: Groq Cloud SDK (`groq-sdk`)
- **Model**: `openai/gpt-oss-120b` (2048 max completion tokens)
- **Backend Service**: NestJS `AiService` (`/ai/askAi`), fetching code from `Snippet` or `SnippetVersions` TypeORM entities
- **Context Injection**: Code context + system prompt injected automatically into the LLM request
- **Database Persistence**: Stores all Q&A conversations in PostgreSQL `AiMessages` entity
- **UI Feature**: Integrated "Ask AI" assistant drawer rendering formatted Markdown responses (`MarkdownRenderer`)

## Hook (first 2-3 seconds)
A bold dark/indigo card pops: "Stop Rewriting The Same Auth Guard." JetBrains Mono code streams in with a glowing cursor, slamming into "Centralize & Analyze Your Code Vault ⚡".

## Key moments
1. **Monaco Editor Integration**: Interactive multi-language snippet cards (TypeScript NestJS Guard, Python FastAPI DB Session, Go Worker Pool) with live syntax highlighting.
2. **Dedicated Groq AI Coding Assistant Segment**: Integrated "Ask AI" drawer powered by Groq's `openai/gpt-oss-120b`. User prompts the AI to explain the `JwtAuthGuard` code context; LLM streams back a concise markdown analysis.
3. **Snippet Version Control**: Automatic revision history (`SnippetVersions v1.0.0` → `v2.1.0`), preserving historic edits and diffs.
4. **Tokenized Sharing & Instant Search**: Share tokens (`ShareToken`) and multi-tag/language instant filtering.

## Outro / punchline
The glowing Code Vault logo lands with the headline: "Store, Version & AI-Analyze Code Effortlessly."

## Tone
- Preset: `polished`
- Creative direction: Clean, high-tech developer product film with dedicated AI showcase
- Format: landscape — 1920x1080
- Duration: 21 seconds

## Visual identity (from the project)
- Background: `#0f172a` (slate dark) with `#1e293b` editor surface and `#f8fafc` text accents
- Primary text: `#0f172a` and `#f8fafc`
- Accent: `#6366f1` (Indigo Primary), `#818cf8` (Glow/Border focus), `#f43f5e` (AI Pink accent)
- Display font: `Plus Jakarta Sans`
- Body font: `JetBrains Mono`

## Share copy (draft)
Never lose a reusable code snippet again. Introducing Code Vault ⚡ — centralize, version & AI-analyze your code with Groq (`openai/gpt-oss-120b`), NestJS & Monaco Editor!

## Storyboard

### Scene 1 — Hook: Stop Rewriting Boilerplate — 3.5s
Sleek dark hero window with pulse dot badge: "Developer Code Vault". Headline: "Stop Rewriting The Same Logic." Code snippet types out in JetBrains Mono (`JwtAuthGuard`).

### Scene 2 — Monaco Code Editor Vault — 4.5s
Monaco Editor window with language tab bar (TypeScript, Python, Go). Active tab switches smoothly showcasing multi-language syntax highlighting.

### Scene 3 — Dedicated AI Coding Assistant (Groq SDK) — 5.5s
The "Ask AI" tab highlights and opens. User prompts: *"Explain how this JwtAuthGuard validates tokens."* Animated backend pipeline badge: `⚡ Groq Cloud • model: openai/gpt-oss-120b`. AI streams back structured Markdown analysis explaining token extraction & exception handling.

### Scene 4 — Version Control & Tokenized Sharing — 4.5s
Close-up on `SnippetVersions v1.0.0 → v2.1.0` revision diffs followed by instant tag search (`tag: auth`) and tokenized share link copy (`share_tk_98231`).

### Scene 5 — Outro: Code Vault ⚡ — 3.0s
Hero logo card lands: "Code Vault ⚡". Subtitle: "Centralize, Version & AI-Analyze Code Effortlessly." Tech badges: **NestJS 11** • **React 19** • **Monaco Editor** • **Groq AI**.
