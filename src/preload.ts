// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  onMidiMessage: (callback: (value: string) => void) =>
    ipcRenderer.on("midi-message", (_event, value) => callback(value)),
});
