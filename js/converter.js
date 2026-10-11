/*
 * converter.js
 * Wraps Turndown (vendored in js/vendor) behind one function: htmlToMarkdown().
 * No DOM elements from the page are touched here, so it can be reused or tested alone.
 */
(function (global) {
  "use strict";

  function createService() {
    var service = new global.TurndownService({
      headingStyle: "atx",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
      emDelimiter: "*",
      hr: "---"
    });
    if (global.turndownPluginGfm) {
      service.use(global.turndownPluginGfm.gfm);
    }
    service.remove(["script", "style", "noscript", "template"]);
    return service;
  }

  var service = null;

  // Rewrites relative href/src values to absolute ones, using baseUrl.
  function absolutise(doc, baseUrl) {
    var attrs = [["a", "href"], ["img", "src"]];
    attrs.forEach(function (pair) {
      doc.querySelectorAll(pair[0] + "[" + pair[1] + "]").forEach(function (el) {
        try {
          el.setAttribute(pair[1], new URL(el.getAttribute(pair[1]), baseUrl).href);
        } catch (e) {
          /* leave unparseable values as they are */
        }
      });
    });
  }

  /**
   * @param {string} html     Raw HTML (a fragment or a full document).
   * @param {object} [opts]
   * @param {string} [opts.baseUrl]  If given, relative links and images become absolute.
   * @returns {string} Markdown
   */
  function htmlToMarkdown(html, opts) {
    opts = opts || {};
    if (!service) service = createService();
    var doc = new DOMParser().parseFromString(html, "text/html");
    if (opts.baseUrl) absolutise(doc, opts.baseUrl);
    return service.turndown(doc.body).trim() + "\n";
  }

  global.htmlToMarkdown = htmlToMarkdown;
})(window);
