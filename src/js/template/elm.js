export const packageDefinition = (version, modules) =>
  JSON.stringify(
    {
      type: "package",
      name: "lattyware/elm-fontawesome",
      summary: "FontAwesome 5 SVG icons.",
      license: "MIT",
      version: version,
      "exposed-modules": modules.map(moduleName),
      "elm-version": "0.19.0 <= v < 0.20.0",
      dependencies: {
        "elm/core": "1.0.2 <= v < 2.0.0",
        "elm/html": "1.0.0 <= v < 2.0.0",
        "elm/svg": "1.0.1 <= v < 2.0.0",
      },
      "test-dependencies": {},
    },
    null,
    2
  );

export const module = (path, body, exposing = null) => `
module ${moduleName(path)}${
  exposing == null ? "" : ' exposing (${exposing.join(", ")})'
}

${body}
`;

export function identifier(str) {
  const capWords = str
    .split(/[^\p{Lu}\p{Ll}\p{Lt}\p{Lm}\p{Lo}\p{Nd}\p{Nl}_]/u)
    .map((n) => n[0].toUpperCase() + n.slice(1))
    .join("");
  const camelCase = capWords[0].toLowerCase() + capWords.slice(1);
  return /^\p{Ll}.*$/u.test(camelCase) ? camelCase : "fa" + camelCase;
}

export const moduleName = (path) => path.join(".");

export const moduleFileName = (path) => `${path.join("/")}.elm`;
