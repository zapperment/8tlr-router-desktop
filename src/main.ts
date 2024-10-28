import { app, dialog, BrowserWindow } from "electron";
import path from "path";
import { readConfig } from "./file";
import { configFileName } from "./constants";
import createDebug from "debug";
import process from "node:process";
import { initPort, createMidiMessageRouter, createMidiMessageHandler, createExitHandler } from "./midi";
import type { Input, Output } from "@julusian/midi";
import { createUiUpdater } from "./ui";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const debug = createDebug("8tlr-router:main");
let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: "Eight Track LR Router",
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    await mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  startRouter();
};

// This method will be called when Electron has finished
// initialisation and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS, it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file, you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const config = readConfig();

if (config === null) {
  const message = `File ${configFileName} cannot be found or read, did you forget to create one?`;
  console.error(message);
  dialog.showErrorBox("Configuration file missing", message);
  process.exit(1);
}

debug(JSON.stringify(config, null, 2));

const { portName } = config;

let outputs:Output[];
let input :Input;
try {
  outputs = portName.output.map((outputPortName) => {
    debug(`Initialise output port ${outputPortName}`);
    return initPort<Output>(outputPortName, "output");
  });

  debug(`Initialise input port ${portName.input}`);
  input = initPort<Input>(portName.input, "input");
} catch (error){
  console.error(error.message);
  dialog.showErrorBox("MIDI port not found", error.message);
  process.exit(1);
}

function startRouter() {
  const { handleExit, observeMessage } = createExitHandler({ input, outputs });
  const midiMessageRouter = createMidiMessageRouter({ outputs });
  const uiUpdater = createUiUpdater(mainWindow);
  const midiMessageHandler = createMidiMessageHandler({
    midiMessageRouter,
    observeMessage,
    uiUpdater,
  });

  input.on("message", midiMessageHandler);
  process.on("exit", handleExit);
}
