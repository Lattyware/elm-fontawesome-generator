import type { LogLevelDesc } from "loglevel";

import type * as IconSource from "../icon-source.js";

export type Verbosity = LogLevelDesc;

export interface Config {
  version?: string;
  iconSources: IconSource.Configuration[];
  outputPath?: string;
  verbosity?: Verbosity;
  ignoreFailedIconSources?: boolean;
}
