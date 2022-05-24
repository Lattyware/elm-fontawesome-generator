import * as Elm from "./elm.js";

interface SectionFunc {
  name: string;
  id: string;
}

interface Section {
  title: string;
  link: string;
  functions: SectionFunc[];
}

const categories = [
  {
    title: "Sizing Icons",
    link: "size",
    functions: [
      "2xs",
      "xs",
      "sm",
      "lg",
      "x1",
      "2x1",
      "1x",
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
    link: "fixed-width",
    functions: ["fw"],
  },
  {
    title: "Icons in a List",
    link: "lists",
    functions: ["ul", "li"],
  },
  {
    title: "Rotating Icons",
    link: "rotate",
    functions: [
      "rotate-90",
      "rotate-180",
      "rotate-270",
      "flip-horizontal",
      "flip-vertical",
      "flip-both",
      "flip-rotate-by",
    ],
  },
  {
    title: "Animating Icons",
    link: "animate",
    functions: [
      "beat",
      "fade",
      "beat-fade",
      "bounce",
      "flip",
      "shake",
      "spin",
      "spin-pulse",
      "spin-reverse",
    ],
  },
  {
    title: "Bordered + Pulled Icons",
    link: "pull",
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

const sections: Section[] = categories.map((section) => ({
  title: section.title,
  link: section.link,
  functions: section.functions.map((f) => ({
    id: Elm.identifier(f),
    name: "fa-" + f,
  })),
}));

const functions: SectionFunc[] = sections.flatMap(
  (section) => section.functions,
);

export const attributes = () => {
  return Elm.module(
    "FontAwesome.Attributes",
    `
{-| Styling attributes for icons.

${sections.map(docSection).join("")}
-}

import Svg
import Svg.Attributes as SvgA

${functions.map(attribute).join("")}
`,
    functions.map((a) => a.id),
  );
};

const docSection = ({ title, link, functions }: Section) => `
# ${title}

[See the FontAwesome docs for details.](https://fontawesome.com/docs/web/style/${link})

@docs ${functions.map((f) => f.id).join(", ")}
`;

const attribute = ({ name, id }: SectionFunc) => `
{-| Apply the ${name} class to the element. 
-}
${id} : Svg.Attribute msg
${id} = SvgA.class "${name}"
`;
