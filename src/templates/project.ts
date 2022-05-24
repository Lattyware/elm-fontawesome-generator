export const projectFile = (version: string, exposedModules: string[]) =>
  JSON.stringify(
    {
      type: "package",
      name: "lattyware/elm-fontawesome",
      summary: "FontAwesome as pure Elm and SVG.",
      license: "MIT",
      version,
      "exposed-modules": [
        "FontAwesome.Icon",
        "FontAwesome.Svg",
        "FontAwesome.Layering",
        "FontAwesome.Transforms",
        ...exposedModules,
      ],
      "elm-version": "0.19.0 <= v < 0.20.0",
      dependencies: {
        "elm/core": "1.0.2 <= v < 2.0.0",
        "elm/html": "1.0.0 <= v < 2.0.0",
        "elm/svg": "1.0.1 <= v < 2.0.0",
      },
      "test-dependencies": {},
    },
    undefined,
    2,
  );
