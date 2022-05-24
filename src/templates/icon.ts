import type {
  IconDetails,
  PackDetails,
  SynonymDetails,
} from "../generator/details.js";
import * as Elm from "./elm.js";

function iconDefinition({
  prefix,
  name,
  id,
  width,
  height,
  pathData,
}: IconDetails) {
  const [pathA, pathB] = pathData;
  return `
{-| The [\`${name}\`](https://fontawesome.com/icons/${name}) icon. 
-}
${id} : IconDefinition
${id} = 
  IconDefinition
    "${prefix}" 
    "${name}" 
    (${width}, ${height})
    ("${pathA}", ${pathB !== undefined ? `Just "${pathB}"` : "Nothing"})
`;
}

export const packDefinitions = ({
  name,
  exports,
  icons,
}: PackDetails): string => {
  return Elm.module(
    `FontAwesome.${name}.Definitions`,
    `
{-| Icons from the "${name}" pack. 
@docs ${exports.join(", ")}
-}
import FontAwesome.Icon exposing (IconDefinition)
${icons.map(iconDefinition).join("")}
    `,
    exports,
  );
};

function synonym(icon: IconDetails, { name, id }: SynonymDetails) {
  return `
{-| The [“${name}”](https://fontawesome.com/icons/${name}) icon. 
This is a synonym for “${icon.name}” (\`${icon.id}\`).
-}
${id} : Icon Icon.WithoutId
${id} = ${icon.id}
    `;
}

function icon(iconDetails: IconDetails) {
  const { name, id, synonyms } = iconDetails;
  return `
{-| The [“${name}”](https://fontawesome.com/icons/${name}) icon. 
-}
${id} : Icon Icon.WithoutId
${id} = Icon.present Definitions.${id}
${synonyms.map((s) => synonym(iconDetails, s)).join("")}
  `;
}

export const pack = ({
  name,
  exports,
  synonymExports,
  icons,
}: PackDetails): string => {
  const allExports = [...exports, ...synonymExports];
  return Elm.module(
    `FontAwesome.${name}`,
    `
{-| Icons from the “${name}” pack. 
@docs ${allExports.join(", ")}
-}
import FontAwesome.Icon as Icon exposing (Icon)
import FontAwesome.${name}.Definitions as Definitions
${icons.map(icon).join("")}
    `,
    allExports,
  );
};
