import sdk, { type VM } from '@stackblitz/sdk';
import { findCssPropValue } from '../utils/parseCss';

const files = {};

[
  "src/App.css",
  "src/App.jsx",
  "src/index.css",
  "src/main.jsx",
  "src/config.css",
  "index.html",
  "package.json",
  "package-lock.json",
  "vite.config.js",
].forEach(async (file) => {
  files[file] = (
    await import(
      /* @vite-ignore */ `../../content/minimal-vite/${file}?raw&import`
    )
  ).default;
});

const startBtn = document.getElementById('start') as HTMLButtonElement;
const themingBtn = document.getElementById('theming') as HTMLButtonElement;
const customBtn = document.getElementById('customization') as HTMLButtonElement;
const colorInput = document.getElementById('color') as HTMLInputElement;
const testBtn = document.getElementById('test') as HTMLInputElement;
const outputEl = document.getElementById('output') as HTMLOutputElement;
const iframe = document.getElementById('iframe') as HTMLIFrameElement;

let vm: VM;

startBtn.onclick = async () => {
  startBtn.disabled = true
  vm = await sdk.embedProject('embed', {
    title: 'Button Component',
    template: 'node',
    files,
    description: "This button componentn can be styled"
  }, {
    height: 'auto',
    hideExplorer: true,
    showSidebar: false
  })
  startBtn.disabled = false;
  globalThis.vm = vm;
};

colorInput.oninput = () => {
  vm.applyFsDiff({
    create: {
      "src/config.css": `/* Set your CSS custom properties here */
html {
--button-background: ${colorInput.value};
}`,
    },
    destroy: [],
  });
};

themingBtn.addEventListener("click", () => {
  vm.editor.openFile("src/config.css");

  setTimeout(async () => {
    vm.applyFsDiff({
      create: {
        "src/config.css": `/* Set your CSS custom properties here */
html {
  --button-background: #284a8b;
}`,
      },
      destroy: [],
    });
    vm.editor.openFile("src/config.css:L3");
  }, 2000);
});

testBtn.onclick = async () => {
  const files = await vm.getFsSnapshot();
  const cssFile = files["src/config.css"];

  outputEl.innerText =
    findCssPropValue(cssFile, "--button-background") === "#337733"
      ? "✅"
      : "🔴";
};

customBtn.onclick = async () => {
  vm.editor.setView("editor");
  iframe.src = await vm.preview.getUrl();
};
