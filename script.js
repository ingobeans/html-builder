let iframe = document.getElementById("iframe");

let textDiv = document.getElementById("text");
let code = document.getElementById("code");
code.value = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>booger</title>
  </head>
  <body>
    <p>hello!</p>
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
      console.log("blocked ctrl+s");

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
