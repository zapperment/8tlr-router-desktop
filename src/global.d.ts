/// <reference path="@julusian/midi"/>

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

interface MidiMessageRouterResult {
  inputChannel: number;
  outputPortIndex: number;
  outputChannel: number;
  outputMidiMessage: MidiMessage;
}

type MidiMessageRouter = (midiMessage: MidiMessage) => MidiMessageRouterResult | null;

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
    onMidiMessage: (callback: (value: string) => void) => void;
  };
}
