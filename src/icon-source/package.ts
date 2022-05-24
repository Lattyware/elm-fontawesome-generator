import type {
  IconDefinition,
  IconPack,
} from "@fortawesome/fontawesome-common-types";

import type * as IconSource from "../icon-source.js";

type IncludeFunction = (icon: IconDefinition) => boolean;

type IncludeConfiguration = "all" | string[] | IncludeFunction;

export interface Configuration {
  readonly name: string;
  readonly package: string;
  readonly include?: IncludeConfiguration;
}

const includeFunction = (
  configuration: IncludeConfiguration,
): IncludeFunction => {
  if (configuration === "all") {
    return () => true;
  } else if (Array.isArray(configuration)) {
    const includeSet = new Set(configuration);
    return (icon) => includeSet.has(icon.iconName);
  } else {
    return configuration;
  }
};

export const isConfiguration = (
  iconSourceConfiguration: IconSource.Configuration,
): iconSourceConfiguration is Configuration =>
  Object.hasOwn(iconSourceConfiguration, "package");

export const iconSource = (
  configuration: Configuration,
): IconSource.IconSource => ({
  configuration,
  icons: async (): Promise<Iterable<IconDefinition>> => {
    const include = includeFunction(configuration.include ?? "all");
    const pack = await import(configuration.package);
    const icons = Object.values(pack[pack.prefix as string] as IconPack);
    const seen = new Set();
    function* filterIcons() {
      for (const icon of icons) {
        if (!seen.has(icon.iconName) && include(icon)) {
          yield icon;
          seen.add(icon.iconName);
        }
      }
    }
    return filterIcons();
  },
});
