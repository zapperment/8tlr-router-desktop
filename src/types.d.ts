declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

interface ConfigPortName {
  input: string;
  output: [string, string, string, string];
}

interface Config {
  portName: ConfigPortName;
}
