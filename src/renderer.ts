/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";

window.electronAPI.onUiUpdate((uiUpdate: UiUpdate) => {
  const { type, track, sketch } = uiUpdate;
  console.log("type:", type);
  console.log("track:", track);
  console.log("sketch:", sketch);
  if (type === "sketch") {
    for (let currSketch = 1; currSketch <= 8; currSketch++) {
      const elements = [];
      elements.push(document.getElementById(`slot-${track}-reason-${currSketch}`));
      elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-note`));
      elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-cc`));
      elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-at`));
      elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-pb`));
      elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-sketch`));
      for (const element of elements) {
        if (currSketch === sketch) {
          element.classList.remove("inactive");
        } else {
          element.classList.add("inactive");
        }
      }
    }
  }
});
