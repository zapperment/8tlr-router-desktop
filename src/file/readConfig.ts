import { configFileName } from "../constants";
import { findFile } from "./findFile";
import createDebug from "debug";
import { parse } from "yaml";
import { readFileSync } from "node:fs";
import { isValidConfig } from "./isValidConfig";

const debug = createDebug("8tlr-router:file:readConfig");

export function readConfig(): Config | null {
  const startDir = process.cwd();
  debug(`Start dir: ${startDir}`)
  const configFilePath = findFile(startDir, configFileName);
  if (configFilePath === null) {
    debug(
      `Failed to find config file ${configFileName} starting at path ${startDir}`,
    );
    return null;
  }
  let rawConfig: string;
  try {
    rawConfig = readFileSync(configFilePath, "utf8");
  } catch (error) {
    debug(`Error reading config file ${configFilePath}`, error);
    return null;
  }
  let config: unknown;
  try {
    config = parse(rawConfig);
  } catch (error) {
    debug(`Error parsing config file ${configFilePath}`, error);
    return null;
  }
  if (!isValidConfig(config)) {
    debug(`Configuration in file ${configFileName} is not valid`, config);
    return null;
  }
  return config;
}
