import { exec as exec_internal } from "child_process";
import * as Fs from "fs/promises";
import { default as log } from "loglevel";
import * as Path from "path";
import { promisify } from "util";

import { ExitCodes } from "./exit-codes.js";
import { details } from "./generator/details.js";
import type * as IconSource from "./icon-source.js";
import * as AttributesTemplates from "./templates/attributes.js";
import * as IconTemplates from "./templates/icon.js";
import * as ProjectTemplates from "./templates/project.js";
import * as StylesTemplates from "./templates/styles.js";

const exec = promisify(exec_internal);

export interface SourceFile {
  type: "file";
  source?: IconSource.Configuration;
  path: [string, ...string[]];
  exposeAs?: string;
  contents: string;
}

export interface SourceFailure {
  type: "failure";
  source: IconSource.Configuration;
  error: unknown;
}

export function unknownSourceResult(sourceResult: never): never {
  throw new Error(`Invalid source result: ${JSON.stringify(sourceResult)}`);
}

export async function* generate(
  iconSources: Iterable<IconSource.IconSource>,
): AsyncIterable<SourceFile | SourceFailure> {
  yield {
    type: "file",
    contents: StylesTemplates.styles(),
    exposeAs: "FontAwesome.Styles",
    path: ["src", "FontAwesome", `Styles.elm`],
  };
  yield {
    type: "file",
    contents: AttributesTemplates.attributes(),
    exposeAs: "FontAwesome.Attributes",
    path: ["src", "FontAwesome", `Attributes.elm`],
  };
  for await (const iconSource of iconSources) {
    let pack;
    try {
      pack = details(iconSource.configuration.name, await iconSource.icons());
    } catch (error) {
      yield {
        type: "failure",
        source: iconSource.configuration,
        error,
      };
      continue;
    }
    const packName = `FontAwesome.${pack.name}`;
    yield {
      type: "file",
      source: iconSource.configuration,
      contents: IconTemplates.pack(pack),
      exposeAs: packName,
      path: ["src", "FontAwesome", `${pack.name}.elm`],
    };
    yield {
      type: "file",
      source: iconSource.configuration,
      contents: IconTemplates.packDefinitions(pack),
      exposeAs: `${packName}.Definitions`,
      path: [
        "src",
        "FontAwesome",
        iconSource.configuration.name,
        "Definitions.elm",
      ],
    };
  }
}

/**
 * Write the generated results to the filesystem.
 * @param log A function to log a message.
 * @param sourceResults The results of generation.
 * @param outputPath The root path to write to.
 * @param ignoreFailedIconSources If true, will ignore exceptions and continue.
 */
export async function write(
  version: string,
  sourceResults: AsyncIterable<SourceFile | SourceFailure>,
  outputPath: string = Path.join(".", "dist"),
  ignoreFailedIconSources = false,
) {
  const toExpose: string[] = [];
  for await (const sourceResult of sourceResults) {
    if (sourceResult.type === "file") {
      const path = [...sourceResult.path];
      const filename = path.pop() as string;
      const directory = Path.join(outputPath, ...path);
      await Fs.mkdir(directory, { recursive: true });
      const fullPath = Path.join(directory, filename);
      await Fs.writeFile(fullPath, sourceResult.contents);
      if (sourceResult.exposeAs !== undefined) {
        toExpose.push(sourceResult.exposeAs);
      }
      log.debug(`Generated “${fullPath}”.`);
    } else if (sourceResult.type === "failure") {
      log.error(sourceResult.error);
      if (!ignoreFailedIconSources) {
        process.exit(ExitCodes.SourceError);
      }
    } else {
      unknownSourceResult(sourceResult);
    }
  }

  await Fs.writeFile(
    Path.join(outputPath, "elm.json"),
    ProjectTemplates.projectFile(version, toExpose),
  );

  await Fs.cp("./base", outputPath, { recursive: true });

  try {
    await exec(`npx elm-format ./src --yes`, { cwd: outputPath });
  } catch (error) {
    log.error(error);
  }

  log.info(`Elm module generated in “${outputPath}” successfully.`);
}
