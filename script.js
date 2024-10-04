let textDiv = document.getElementById("text");
let iframeContainer = document.getElementById("iframeContainer");
let iframe = iframeContainer.children[0];
let navigationDiv = document.getElementById("navigation");
let editorTabs = [];

class EditorTab {
  constructor(defaultCode, language, filename) {
    this.defaultCode = defaultCode;
    this.language = language;
    this.filename = filename;

    // get default/saved code
    let value = this.defaultCode;

    let storedCode = localStorage.getItem(filename);
    if (storedCode === null) {
      localStorage.setItem(this.filename, this.defaultCode);
    } else {
      value = storedCode;
    }

    // create text box
    this.editor = CodeMirror(textDiv, {
      value: value,
      mode: language,
      lineNumbers: true,
      theme: "dracula",
    });

    // create button
    this.button = document.createElement("button");
    this.button.innerText = filename;

    // update button color and state
    function toggleButton() {
      this.buttonPressed = !this.buttonPressed;
      localStorage.setItem(filename + "button", this.buttonPressed);
      if (this.buttonPressed) {
        this.button.style.backgroundColor = "";
        this.editor.display.wrapper.style.display = "";
      } else {
        this.button.style.backgroundColor = "inherit";
        this.editor.display.wrapper.style.display = "none";
      }
    }

    // load saved button state
    this.buttonPressed = true;
    let storedButtonValue = localStorage.getItem(filename + "button");
    if (storedButtonValue === null) {
      localStorage.setItem(filename + "button", true);
    } else {
      this.buttonPressed = storedButtonValue != "true";
      toggleButton.bind(this)();
    }

    this.button.onclick = toggleButton.bind(this);
    navigationDiv.appendChild(this.button);

    // add this to editor tabs register
    editorTabs.push(this);
  }
  save() {
    localStorage.setItem(this.filename, this.editor.getValue());
  }
}

function replaceImports(html) {
  // finds css imports
  const linkRegex =
    /<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["']\s*\/?>/gi;
  // finds js imports
  const scriptRegex = /<script\s+src=["']([^"']+)["']\s*><\/script>/gi;

  let modifiedHtml = html.replace(linkRegex, (match, fileName) => {
    const file = fileName.split("/").pop();
    let localFile = localStorage.getItem(file);
    if (localFile !== null) {
      return "<style>" + localFile + "</style>";
    }
    return match;
  });

  modifiedHtml = modifiedHtml.replace(scriptRegex, (match, fileName) => {
    const file = fileName.split("/").pop();
    let localFile = localStorage.getItem(file);
    if (localFile !== null) {
      return "<script>" + localFile + "</script>";
    }
    return match;
  });

  return modifiedHtml;
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

function updateIframe() {
  let value = htmlEditor.editor.getValue();
  value = replaceImports(value);
  iframeContainer.innerHTML = "";
  iframe = document.createElement("iframe");
  iframeContainer.appendChild(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write(value);
  iframe.contentDocument.close();
  iframe.contentDocument.documentElement.addEventListener("keydown", keydown);

  let titleElement =
    iframe.contentDocument.documentElement.querySelector("title");

  if (titleElement) {
    document.title = "html builder - " + titleElement.innerText;

    // listen to changes to the title
    new MutationObserver(function (mutations) {
      document.title = "html builder - " + mutations[0].target.innerText;
      console.log(mutations[0].target.innerText);
    }).observe(titleElement, {
      subtree: true,
      characterData: true,
      childList: true,
    });
  } else {
    document.title = "html builder";
  }
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
