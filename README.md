# Cloudflare Workers Tech Talk

Editable Slidev conversion of the Keynote deck “Laravel × Durable Objectsで実現するイベント向けライブ翻訳”.

## Run locally

```bash
npm install
npm run dev
```

Use the arrow keys or space to advance. Press `o` for the slide overview, `p` for presenter mode, and `c` to show or hide live captions.

## Edit

- Slide content and speaker notes: `slides.md`
- Theme, typography, and responsive layout: `styles/index.css`
- Reusable diagrams: `components/`
- Photos and source artwork: `public/assets/`

The deck uses a 1920×1080 logical canvas and scales to the browser while preserving its 16:9 composition.

## Build and export

```bash
npm run build
npm run export
```

The export command creates `slides-export.pdf`.
