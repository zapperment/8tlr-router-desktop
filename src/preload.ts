// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  onUiUpdate: (callback: (value: UiUpdate) => void) => ipcRenderer.on("ui-update", (_event, value) => callback(value)),
});
