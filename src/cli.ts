import { default as log } from "loglevel";
import * as Path from "path";

import type { Config } from "./cli/config.js";
import { ExitCodes } from "./exit-codes.js";
import { generate, write } from "./generator.js";
import * as IconSource from "./icon-source.js";

async function main(): Promise<void> {
  const [maybeConfigPath] = process.argv.slice(2);
  const configPath =
    maybeConfigPath ??
    process.env["ELM_FONTAWESOME_CONFIG_PATH"] ??
    "./config.json";

  const config = (await import(
    `file:${Path.resolve(process.cwd(), configPath)}`,
    {
      assert: { type: "json" },
    }
  )) as { default: Config };

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
