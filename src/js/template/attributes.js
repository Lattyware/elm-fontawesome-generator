import * as elm from "./elm";

const categories = [
  {
    title: "Sizing Icons",
    link: "sizing-icons",
    functions: [
      "xs",
      "sm",
      "lg",
      "2x",
      "3x",
      "4x",
      "5x",
      "6x",
      "7x",
      "8x",
      "9x",
      "10x",
    ],
  },
  {
    title: "Fixed Width Icons",
    link: "fixed-width-icons",
    functions: ["fw"],
  },
  {
    title: "Icons in a List",
    link: "icons-in-a-list",
    functions: ["ul", "li"],
  },
  {
    title: "Rotating Icons",
    link: "rotating-icons",
    functions: [
      "rotate-90",
      "rotate-180",
      "rotate-270",
      "flip-horizontal",
      "flip-vertical",
    ],
  },
  {
    title: "Animating Icons",
    link: "animating-icons",
    functions: ["spin", "pulse"],
  },
  {
    title: "Bordered + Pulled Icons",
    link: "bordered-pulled-icons",
    functions: ["pull-left", "pull-right", "border"],
  },
  {
    title: "Stacked Icons",
    link: "stacking-icons",
    functions: ["stack", "stack-1x", "stack-2x", "inverse"],
  },
  {
    title: "Duotone Icons",
    link: "duotone-icons",
    functions: ["swap-opacity"],
  },
];

const sections = categories.map((section) => ({
  title: section.title,
  link: section.link,
  functions: section.functions.map((f) => ({
    id: elm.identifier(f),
    name: "fa-" + f,
  })),
}));

const functions = sections.flatMap((section) => section.functions);

export const attributes = (path) =>
  elm.module(
    path,
    `
{-| Styling attributes for icons.

${sections.map(docSection).join("")}
-}

import Svg
import Svg.Attributes as SvgA

${functions.map(attribute).join("")}
`
  );

const docSection = (section) => `
# ${section.title}

[See the FontAwesome docs for details.](https://fontawesome.com/how-to-use/on-the-web/styling/${
  section.link
})

@docs ${section.functions.map((f) => f.id).join(", ")}
`;

const attribute = (attribute) => `
{-| Apply the ${attribute.name} class to the element. 
-}
${attribute.id} : Svg.Attribute msg
${attribute.id} = SvgA.class "${attribute.name}"
`;
