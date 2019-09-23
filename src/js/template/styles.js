import * as elm from "./elm";
import { dom } from "@fortawesome/fontawesome-svg-core";

const css = dom
  .css()
  .replace(/(\r\n\t|\n|\r\t)/gm, "")
  .replace(/"/g, '\\"');

export const styles = path =>
  elm.module(
    path,
    `
{-| Helpers for adding the CSS required for FontAwesome to your page.

@docs css

-}

import Html exposing (Html)


{-| Generates the accompanying CSS that is necessary to correctly display icons.
-}
css : Html msg
css = Html.node "style" [] [ Html.text "${css}" ]
`
  );
