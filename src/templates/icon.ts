import type {
  IconDetails,
  PackDetails,
  SynonymDetails,
} from "../generator/details.js";
import * as Elm from "./elm.js";

function iconDef({ prefix, name, id, width, height, pathData }: IconDetails) {
  const [pathA, pathB] = pathData;
  return `
{-| The “${name}” icon. 
-}
${id} : IconDef
${id} = 
  IconDef
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
import FontAwesome exposing (IconDef)
${icons.map(iconDef).join("")}
    `,
    exports,
  );
};

function synonym(icon: IconDetails, { id }: SynonymDetails) {
  return `
{-| Synonym for \`${icon.id}\`.
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
import FontAwesome as Icon exposing (Icon)
import FontAwesome.${name}.Definitions as Definitions
${icons.map(icon).join("")}
    `,
    allExports,
  );
};
