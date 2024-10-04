let iframe = document.getElementById("iframe");
let textDiv = document.getElementById("text");
let editorTabs = [];

class EditorTab {
  constructor(elementId, defaultCode, language, filename) {
    this.element = document.getElementById(elementId);
    this.defaultCode = defaultCode;
    this.language = language;
    this.filename = filename;
    let storedValue = localStorage.getItem(filename);
    if (storedValue === null) {
      this.element.value = this.defaultCode;
      localStorage.setItem(this.filename, this.defaultCode);
    } else {
      this.element.value = storedValue;
    }
    this.editor = CodeMirror.fromTextArea(this.element, {
      value: this.element.value,
      mode: language,
      lineNumbers: true,
      theme: "dracula",
    });
    editorTabs.push(this);
  }
  save() {
    localStorage.setItem(this.filename, this.editor.getValue());
  }
}

let htmlEditor = new EditorTab(
  "htmlCode",
  `<!DOCTYPE html>
<html>
  <head>
    <title>booger</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <p>hello!</p>
    <p>press ctrl+s to save code and update preview window's html</p>
    <p>press ctrl+b to toggle code visibility</p>
    <p>press ctrl+q to reset/clear code</p>
    <script src="script.js"></script>
  </body>
</html>`,
  "htmlmixed",
  "index.html"
);
let jsEditor = new EditorTab("jsCode", ``, "javascript", "script.js");
let cssEditor = new EditorTab(
  "cssCode",
  `p {
  margin: 0;
  font-size: 26px;
}`,
  "css",
  "style.css"
);

function updateIframe() {
  let value = htmlEditor.editor.getValue();
  value = value.replaceAll(
    `<script src="script.js"></script>`,
    `<script>${localStorage.getItem("script.js")}</script>`
  );
  value = value.replaceAll(
    `<link rel="stylesheet" href="style.css" />`,
    `<style>${localStorage.getItem("style.css")}</style>`
  );
  iframe.contentDocument.open();
  iframe.contentDocument.write(value);
  iframe.contentDocument.close();
}

updateIframe();

function keydown(event) {
  if (event.ctrlKey || event.metaKey) {
    if (event.key == "s") {
      event.preventDefault();
      editorTabs.forEach((tab) => {
        tab.save();
      });
      updateIframe();
      if (
        iframe.contentDocument.children[0] !== undefined &&
        iframe.contentDocument.children[0].tagName == "HTML"
      ) {
        iframe.contentDocument.children[0].addEventListener("keydown", keydown);
      }
    } else if (event.key == "b") {
      event.preventDefault();
      textDiv.hidden = !textDiv.hidden;
    } else if (event.key == "q") {
      event.preventDefault();
      editorTabs.forEach((tab) => {
        tab.editor.setValue(tab.defaultCode);
      });
    }
  }
}

document.addEventListener("keydown", keydown);
iframe.addEventListener("keydown", keydown);
