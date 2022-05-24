import type { IconDefinition } from "@fortawesome/fontawesome-common-types";

import * as Package from "./icon-source/package.js";
import * as Raw from "./icon-source/raw.js";

export interface IconSource {
  configuration: Configuration;
  icons: () => Promise<Iterable<IconDefinition>>;
}

export type Configuration = Raw.Configuration | Package.Configuration;

function unknown(iconSourceConfiguration: never): never {
  throw new Error(
    `Invalid icon source configuration provided: ${JSON.stringify(
      iconSourceConfiguration,
    )}`,
  );
}

export function fromConfiguration(configuration: Configuration): IconSource {
  if (Raw.isConfiguration(configuration)) {
    return Raw.iconSource(configuration);
  } else if (Package.isConfiguration(configuration)) {
    return Package.iconSource(configuration);
  } else {
    unknown(configuration);
  }
}
