# Copilot Instructions

## What this repo is

A **Reveal.js presentation** (in French) about .NET platform evolution (.NET Framework 4.8 → modern .NET). The slides are authored in Markdown (`docs/slides.md`), rendered via Reveal.js in `docs/index.html`, hosted on GitHub Pages, and auto-exported to PDF via GitHub Actions + Playwright.

## Commands

```bash
pnpm install                 # install dependencies
pnpm run prepare-reveal      # copy reveal.js from node_modules → docs/reveal/ (required before serving)
pnpm run start               # serve presentation locally at http://localhost:3000
pnpm run export:pdf          # generate PDF via Playwright (requires prepare-reveal first)
pnpm run generate-qr         # regenerate docs/qr-code-presentation.png
```

> There are no test commands. The package manager is **pnpm** (not npm or yarn).

## Architecture

```
docs/
  index.html        # Reveal.js shell — loads slides.md via data-markdown attribute
  slides.md         # All slide content lives here (single source of truth)
  reveal/           # Generated — copied from node_modules/reveal.js by prepare-reveal script
  exports/          # PDF committed here by the GitHub Actions bot

scripts/
  copy-reveal.js    # Copies reveal.js assets from node_modules → docs/reveal/
  export-pdf.js     # Spins up a local HTTP server on port 4173, opens ?print-pdf in Playwright, captures PDF
  generate-qr.js    # Generates QR code PNG for the GitHub Pages URL

.ai-skills/         # Prompt templates and content guidelines for AI-assisted content creation
  prompt-engineering/
  technical-writing/
  developer-productivity/

.github/workflows/export-pdf.yml  # Triggers on push to main (docs/**, scripts/**); commits PDF back to repo
```

**Key data flow:** edit `docs/slides.md` → push to `main` → CI runs `prepare-reveal` then `export:pdf` → bot commits updated PDF to `docs/exports/`.

## Slide authoring conventions

- **Horizontal slide separator:** `---` (on its own line)
- **Vertical slide separator:** `--` (on its own line)
- **Speaker notes:** lines after `Note:` within a slide
- Reveal.js is configured with `hash: true`, `slideNumber: true`, plugins: Markdown, Notes, Highlight (Monokai theme), theme: Beige

### Content conventions (from `.ai-skills/`)

- Target audience: intermediate .NET developers familiar with .NET Framework 4.8
- Tone: technical, pragmatic, no marketing language
- Specify versions precisely: `.NET Framework 4.8`, `.NET 8`, `C# 12`, `ASP.NET Core 8.0`
  - Avoid: `.NET Core` (ambiguous), `Modern .NET` (imprecise), `Latest` (stale)
- Slide density: 3–5 bullet points per slide (max 7)
- Code blocks: 5–15 lines, always include language identifier (e.g. ` ```csharp `)
- Speaker notes (`Note:`) are required on technical slides
- Comparison slides follow the pattern: `.NET Framework 4.8` section → `**Limitations:**` → `--` → `.NET 8` section → `**Améliorations:**`

### docs/reveal/ is generated

Never edit files under `docs/reveal/` manually — they are overwritten by `pnpm run prepare-reveal`.

## PDF export details

`scripts/export-pdf.js` serves `docs/` on port 4173, navigates to `/?print-pdf`, waits for `.reveal.ready` and for specific text content to be rendered, then calls Playwright's `page.pdf()`. The CI bot commits the result back; the workflow guards against bot-loop with `if: github.actor != 'github-actions[bot]'`.
