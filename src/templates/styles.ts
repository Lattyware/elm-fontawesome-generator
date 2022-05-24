import { dom } from "@fortawesome/fontawesome-svg-core";

import * as Elm from "./elm.js";

export const styles = () => {
  const css = dom
    .css()
    .replace(/(\r\n\t|\n|\r\t)/gm, "")
    .replace(/"/g, '\\"');
  return Elm.module(
    "FontAwesome.Styles",
    `
{-| Helpers for adding the CSS required for FontAwesome to your page.

@docs css

-}

import Html exposing (Html)


{-| Generates the accompanying CSS that is necessary to correctly display icons.
-}
css : Html msg
css = Html.node "style" [] [ Html.text "${css}" ]
`,
    ["css"],
  );
};
