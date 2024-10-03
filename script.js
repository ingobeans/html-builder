let iframe = document.getElementById("iframe");

let textDiv = document.getElementById("text");
let code = document.getElementById("code");
code.value = `<!DOCTYPE html>
<html>
  <head>
    <title>booger</title>
  </head>
  <style>
    p {
      margin: 0;
      font-size: 26px
    }
  </style>
  <body>
    <p>hello!</p>
    <p>press ctrl+s to update preview window's html</p>
    <p>press ctrl+b to toggle code visibility</p>
  </body>
</html>`;

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

      iframe.contentDocument.open();
      iframe.contentDocument.write(editor.getValue());
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
    }
  }
}

document.addEventListener("keydown", keydown);
iframe.addEventListener("keydown", keydown);
