let iframe = document.getElementById("iframe");

let textDiv = document.getElementById("text");
let code = document.getElementById("code");

let defaultCode = `<!DOCTYPE html>
<html>
  <head>
    <title>booger</title>
  </head>
  <style>
    p {
      margin: 0;
      font-size: 26px;
    }
  </style>
  <body>
    <p>hello!</p>
    <p>press ctrl+s to save code and update preview window's html</p>
    <p>press ctrl+b to toggle code visibility</p>
    <p>press ctrl+q to reset/clear code</p>
  </body>
</html>`;
let savedCode = localStorage.getItem("code");

if (savedCode === null) {
  code.value = defaultCode;
  localStorage.setItem("code", code.value);
} else {
  code.value = savedCode;
}

var editor = CodeMirror.fromTextArea(code, {
  value: code.value,
  mode: "htmlmixed",
  lineNumbers: true,
  theme: "dracula",
});

iframe.contentDocument.open();
iframe.contentDocument.write(editor.getValue());
iframe.contentDocument.close();

function keydown(event) {
  if (event.ctrlKey || event.metaKey) {
    if (event.key == "s") {
      event.preventDefault();
      let value = editor.getValue();
      localStorage.setItem("code", value);
      iframe.contentDocument.open();
      iframe.contentDocument.write(value);
      iframe.contentDocument.close();
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
      editor.setValue(defaultCode);
    }
  }
}

document.addEventListener("keydown", keydown);
iframe.addEventListener("keydown", keydown);
