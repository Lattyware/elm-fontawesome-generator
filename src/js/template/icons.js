import * as elm from "./elm";

export const icons = (path, pack) =>
  elm.module(
    path,
    `
{-| Icons from the "${pack.name}" pack. 

@docs ${pack.icons.map((icon) => icon.id).join(", ")}

-}

import FontAwesome.Icon exposing (..)

${pack.icons.map(iconDefinition).join("")}
`
  );

const iconDefinition = (icon) => `
{-| The [\`${icon.name}\`](https://fontawesome.com/icons/${icon.link}) icon. 
-}
${icon.id} : Icon
${icon.id} = 
  Icon 
    "${icon.prefix}" 
    "${icon.name}" 
    ${icon.width} 
    ${icon.height} 
    [${icon.paths.map(path).join(", ")}]
`;

const path = (d) => `"${d}"`;
