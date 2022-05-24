import type { IconDefinition } from "@fortawesome/fontawesome-common-types";

import type * as IconSource from "../icon-source.js";

export interface Configuration {
  readonly name: string;
  readonly icons: IconDefinition[];
}

export const isConfiguration = (
  iconSourceConfiguration: IconSource.Configuration,
): iconSourceConfiguration is Configuration =>
  Object.hasOwn(iconSourceConfiguration, "icons");

export const iconSource = (
  configuration: Configuration,
): IconSource.IconSource => ({
  configuration,
  icons: async () => configuration.icons,
});
