/// <reference path="@julusian/midi"/>

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

type TrackName = "fhyd" | "tang" | "duri" | "poml" | "tiff" | "coco" | "plum" | "flam";
type MidiMessageType = "note-on" | "note-off" | "cc" | "at" | "pb" | "sketch";
type Sketch = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface UiUpdate {
  type: MidiMessageType;
  track: TrackName;
  sketch: Sketch;
  value: number;
}

interface MidiMessageRouterResult {
  outputPortIndex: number;
  outputMidiMessage: MidiMessage;
}

type MidiMessageRouter = (deltaTime: number, midiMessage: MidiMessage) => MidiMessageRouterResult | null;

interface ProgramOptions {
  version?: boolean;
  off?: boolean;
}

interface ConfigPortName {
  input: string;
  output: [string, string, string, string];
}

interface Config {
  portName: ConfigPortName;
}

interface Window {
  electronAPI: {
    onUiUpdate: (callback: (value: UiUpdate) => void) => void;
  };
}
