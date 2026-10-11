# Objectives

## Purpose

A static website that converts HTML to Markdown. It runs entirely in the browser, so there is no server and nothing to host beyond GitHub Pages.

## Input methods

1. **Paste HTML.** A raw dump box. Paste HTML, press Convert, get Markdown.
2. **From URL.** Enter an address and the page fetches it with JavaScript. This can fail because of CORS (many sites refuse requests from other origins). It is included as a feature, and failures show a message pointing to the other two methods.
3. **Upload a file.** Choose or drag in an `.html` file. This covers pages that cannot be fetched and files too large to copy and paste.

## Output

- A read-only Markdown text box.
- A Copy button.
- A Download `.md` button.

The user never has to edit the output to use it.

## Conversion

Uses [Turndown](https://github.com/mixmark-io/turndown) with the GFM plugin (tables, strikethrough, task lists). Both are vendored in `js/vendor/`, so the site has no CDN dependency and works offline once loaded.

Defaults: ATX headings (`#`), `-` bullets, fenced code blocks, `---` rules. `script`, `style`, `noscript` and `template` elements are dropped. When a URL is fetched, relative links and images are made absolute.

## Hosting

GitHub Pages, served from the repository root on the default branch.

- Live URL: <https://realmarkcrowe.github.io/html-to-md-js/>
- Repository: <https://github.com/realmarkcrowe/html-to-md-js>

Pages can only publish from the repository root or from `/docs`. `/docs` is used here for documentation, so the site is published from the root. A bare `https://realmarkcrowe.github.io/` would need a repository named `realmarkcrowe.github.io`. This repository is a project site, so its address includes the repository name.

## Layout

```
index.html          Entry point (GitHub Pages serves this)
css/style.css       Styles
js/app.js           Page wiring: tabs, fetch, file upload, copy, download
js/converter.js     htmlToMarkdown(): wraps Turndown
js/vendor/          Third-party libraries (Turndown, GFM plugin)
docs/               Project documentation (this file)
```

All asset paths are relative, so the site works at the project URL and when opened locally.

## Out of scope for now

- Markdown to HTML.
- Server-side or proxy fetching to get around CORS.
- Live preview rendering of the Markdown.
