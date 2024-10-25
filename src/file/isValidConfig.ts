import createDebug from "debug";

const debug = createDebug("8tlr-router:file:isValidConfig");

export function isValidConfig(config: unknown): config is Config {
  if (typeof config !== "object") {
    debug("Invalid config: Config is not an object");
    return false;
  }
  if (config === null) {
    debug("Invalid config: Config is null");
    return false;
  }

  const portName = (config as { [key: string]: unknown }).portName;
  if (typeof portName !== "object") {
    debug("Invalid config: Config.portName is not an object");
    return false;
  }
  if (portName === null) {
    debug("Invalid config: Config.portName is null");
    return false;
  }

  if (typeof (portName as { [key: string]: unknown }).input !== "string") {
    debug("Invalid config: Config.portName.input is not a string");
    return false;
  }

  const output = (portName as { [key: string]: unknown }).output;
  if (!Array.isArray(output)) {
    debug("Invalid config: Config.portName.output is not an array");
    return false;
  }
  if (!output.every((item) => typeof item === "string")) {
    debug(
      "Invalid config: Not every item in config.portName.output is a string",
    );
    return false;
  }
  if (output.length !== 4) {
    debug(
      "Invalid config: Config.portName.output needs to contain exactly 4 items",
    );
    return false;
  }

  return true;
}
