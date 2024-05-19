import { default as log } from "loglevel";
import * as Path from "path";
import * as Filesystem from "fs/promises";

import type { Config } from "./cli/config.js";
import { ExitCodes } from "./exit-codes.js";
import { generate, write } from "./generator.js";
import * as IconSource from "./icon-source.js";

interface ConfigFile {
  default: Config
}

const findConfig = async (paths: readonly string[]): Promise<ConfigFile> => {
  for (const path of paths) {
    const resolvedPath = Path.resolve(process.cwd(), path);
    if ((await Filesystem.stat(resolvedPath))?.isFile()) {
      return (await import(
        `file:${resolvedPath}`, 
        resolvedPath.endsWith(".json") ? { with: { type: "json" } } : {}
      )) as ConfigFile;
    }
  }
  throw new Error(
    `No config file found, searched for one of ${paths.join(", ")}, ` + 
    `you can provide a path as an argument or by setting ` + 
    `ELM_FONTAWESOME_CONFIG_PATH in your environment.`
  );
};

const main = async (): Promise<void> => {
  const [maybeConfigPath] = process.argv.slice(2);
  const configPath =
    maybeConfigPath ??
    process.env["ELM_FONTAWESOME_CONFIG_PATH"] ??
    undefined;

  const configPaths = configPath ? 
    configPath.split(";") : 
    ["./config.json", "./config.mjs", "./config.js"];
  const config = await findConfig(configPaths);

  const {
    version,
    iconSources,
    outputPath,
    verbosity,
    ignoreFailedIconSources,
  } = config.default;

  log.setLevel(verbosity ?? "error");

  const envVersion = process.env["ELM_FONTAWESOME_VERSION"];
  const resolvedVersion =
    envVersion !== undefined && envVersion !== "" ? envVersion : version;

  if (resolvedVersion === undefined) {
    throw new Error("Must provide version.");
  }

  write(
    resolvedVersion,
    generate(iconSources.map(IconSource.fromConfiguration)),
    outputPath,
    ignoreFailedIconSources,
  );
}

main().catch((error) => {
  log.error(`Unhandled error: “${error}”`);
  process.exit(ExitCodes.UnhandledError);
});
