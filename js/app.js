/*
 * app.js
 * Page wiring: three input modes (paste, URL, file) feed one output box.
 */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };

  var output = $("output");
  var status = $("status");

  function setStatus(message, isError) {
    status.textContent = message;
    status.className = isError ? "status error" : "status";
  }

  function show(markdown, note) {
    output.value = markdown;
    setStatus(note || "Converted " + markdown.length.toLocaleString() + " characters of Markdown.");
  }

  // Tabs
  var tabs = document.querySelectorAll("[data-tab]");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        var active = t === tab;
        t.setAttribute("aria-selected", active ? "true" : "false");
        $("panel-" + t.dataset.tab).hidden = !active;
      });
    });
  });

  // 1. Paste
  $("convert-paste").addEventListener("click", function () {
    var html = $("html-input").value;
    if (!html.trim()) return setStatus("Paste some HTML first.", true);
    show(window.htmlToMarkdown(html));
  });

  // 2. URL
  $("convert-url").addEventListener("click", function () {
    var raw = $("url-input").value.trim();
    var url;
    try {
      url = new URL(raw);
      if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("protocol");
    } catch (e) {
      return setStatus("Enter a full URL starting with http:// or https://", true);
    }
    setStatus("Fetching " + url.href + " ...");
    fetch(url.href)
      .then(function (res) {
        if (!res.ok) throw new Error("The server replied " + res.status + " " + res.statusText);
        return res.text();
      })
      .then(function (html) {
        show(window.htmlToMarkdown(html, { baseUrl: url.href }));
      })
      .catch(function (err) {
        var corsLikely = err instanceof TypeError;
        setStatus(
          corsLikely
            ? "Could not fetch that URL. Most sites block requests from other websites (CORS). " +
              "Save the page as an HTML file and use the Upload tab, or view source and use the Paste tab."
            : "Fetch failed: " + err.message,
          true
        );
      });
  });

  // 3. File upload
  function convertFile(file) {
    if (!file) return;
    setStatus("Reading " + file.name + " ...");
    var reader = new FileReader();
    reader.onload = function () {
      show(window.htmlToMarkdown(String(reader.result)), "Converted " + file.name + ".");
    };
    reader.onerror = function () { setStatus("Could not read that file.", true); };
    reader.readAsText(file);
  }

  $("file-input").addEventListener("change", function (e) { convertFile(e.target.files[0]); });

  var drop = $("dropzone");
  ["dragenter", "dragover"].forEach(function (name) {
    drop.addEventListener(name, function (e) { e.preventDefault(); drop.classList.add("over"); });
  });
  ["dragleave", "drop"].forEach(function (name) {
    drop.addEventListener(name, function (e) { e.preventDefault(); drop.classList.remove("over"); });
  });
  drop.addEventListener("drop", function (e) { convertFile(e.dataTransfer.files[0]); });

  // Output actions
  $("copy").addEventListener("click", function () {
    if (!output.value) return setStatus("Nothing to copy yet.", true);
    var done = function () { setStatus("Copied to clipboard."); };
    var fallback = function () { output.select(); document.execCommand("copy"); done(); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(output.value).then(done, fallback);
    } else {
      fallback();
    }
  });

  $("download").addEventListener("click", function () {
    if (!output.value) return setStatus("Nothing to download yet.", true);
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output.value], { type: "text/markdown" }));
    a.download = "converted.md";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $("clear").addEventListener("click", function () {
    output.value = "";
    $("html-input").value = "";
    $("url-input").value = "";
    $("file-input").value = "";
    setStatus("");
  });
})();
