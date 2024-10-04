let iframe = document.getElementById("iframe");
let textDiv = document.getElementById("text");
let navigationDiv = document.getElementById("navigation");
let editorTabs = [];

class EditorTab {
  constructor(defaultCode, language, filename) {
    this.defaultCode = defaultCode;
    this.language = language;
    this.filename = filename;

    this.buttonPressed = true;
    this.button = document.createElement("button");
    this.button.innerText = filename;

    this.button.onclick = function () {
      this.buttonPressed = !this.buttonPressed;
      if (this.buttonPressed) {
        this.button.style.backgroundColor = "#ff79c6";
        this.editor.display.wrapper.style.display = "";
      } else {
        this.button.style.backgroundColor = "inherit";
        this.editor.display.wrapper.style.display = "none";
      }
    }.bind(this);
    navigationDiv.appendChild(this.button);

    let value = this.defaultCode;

    let storedValue = localStorage.getItem(filename);
    if (storedValue === null) {
      localStorage.setItem(this.filename, this.defaultCode);
    } else {
      value = storedValue;
    }
    this.editor = CodeMirror(textDiv, {
      value: value,
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
let jsEditor = new EditorTab(``, "javascript", "script.js");
let cssEditor = new EditorTab(
  `p {
  margin: 0;
  font-size: 26px;
}`,
  "css",
  "style.css"
);

function toggleButton(button, state, editor) {
  if (state) {
    button.style.backgroundColor = "#ff79c6";
    editor.editor.display.wrapper.style.display = "";
  } else {
    button.style.backgroundColor = "inherit";
    editor.editor.display.wrapper.style.display = "none";
  }
}

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
      textDiv.style.display = textDiv.style.display == "none" ? "flex" : "none";
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
