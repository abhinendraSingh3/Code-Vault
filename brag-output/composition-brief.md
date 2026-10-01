# Hyperframes Composition Brief: Code Vault ⚡ (AI Integration Included)

## Objective
Create a short launch-style brag video for Code Vault ⚡ featuring its core snippet management, versioning, and verified Groq AI Assistant (`openai/gpt-oss-120b`).

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 21 seconds

## Verified AI Specs & Architecture
- **AI Provider**: Groq Cloud SDK (`groq-sdk`)
- **LLM Model**: `openai/gpt-oss-120b`
- **Backend Flow**: `AiService` -> `groq.chat.completions.create` -> TypeORM `AiMessages` entity
- **UI Feature**: Integrated "Ask AI" tab rendering Markdown code analysis

## Scene Summary (21s Total)
1. **Hook: Stop Rewriting Code** — 3.5s — "Stop Rewriting The Same Logic" + NestJS Auth Guard code entry
2. **Monaco Code Editor** — 4.5s — Multi-language tabs (TypeScript, Python, Go)
3. **Groq AI Assistant Segment** — 5.5s — "Ask AI" tab click, user question, Groq `openai/gpt-oss-120b` pipeline badge, markdown explanation stream
4. **Versioning & Token Sharing** — 4.5s — `SnippetVersions v1.0.0 → v2.1.0` diff + `ShareToken` link copy
5. **Outro** — 3.0s — Logo, tagline, and stack badges (NestJS 11, React 19, Monaco, Groq AI)
