import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import * as Elm from "../templates/elm.js";

export interface SynonymDetails {
  name: string;
  id: string;
}

export interface IconDetails {
  prefix: string;
  name: string;
  id: string;
  width: number;
  height: number;
  synonyms: SynonymDetails[];
  pathData: [string, string | undefined];
}

export interface PackDetails {
  name: string;
  exports: string[];
  synonymExports: string[];
  icons: IconDetails[];
}

export function details(
  name: string,
  icons: Iterable<IconDefinition>,
): PackDetails {
  const exports: string[] = [];
  const synonymExports: string[] = [];
  const iconDetails: IconDetails[] = [];
  for (const { prefix, iconName, icon } of icons) {
    const [width, height, ligatures, _unicode, svgPathData] = icon;
    const id = Elm.identifier(iconName);
    const [pathA, pathB] = Array.isArray(svgPathData)
      ? svgPathData
      : [svgPathData, undefined];
    const synonyms = ligatures
      .filter((l) => typeof l === "string")
      .map((name) => ({ name, id: Elm.identifier(name) }));
    iconDetails.push({
      prefix,
      name: iconName,
      id,
      width,
      height,
      synonyms,
      pathData: [pathA, pathB],
    });
    exports.push(id);
    for (const synonym of synonyms) {
      synonymExports.push(synonym.id);
    }
  }
  return {
    name,
    exports,
    synonymExports,
    icons: iconDetails,
  };
}
