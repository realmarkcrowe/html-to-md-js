# HTML to Markdown Javascript

A small website that converts HTML to Markdown, in the browser, with no server.

Live site: <https://realmarkcrowe.github.io/html-to-md-js/>

## What it does

- **Paste HTML** into a box and get Markdown.
- **Enter a URL** and have the page fetched and converted (many sites block this with CORS; use the other two options if so).
- **Upload an HTML file** for pages that cannot be fetched or are too large to paste.

Output appears in a text box with Copy and Download buttons.

## Run locally

Open `index.html` in a browser. There is no build step.

## Documentation

See [docs/objectives.md](docs/objectives.md) for goals, design decisions, hosting and file layout.

## Credits

Conversion by [Turndown](https://github.com/mixmark-io/turndown) (MIT), vendored in `js/vendor/`.
