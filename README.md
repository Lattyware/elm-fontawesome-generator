# FontAwesome for Elm Generator.

[![Generator Build Status](https://img.shields.io/github/actions/workflow/status/lattyware/elm-fontawesome-generator/build.yml?logo=github&label=generator%20build)](https://github.com/Lattyware/elm-fontawesome-generator/actions/workflows/build.yml)
[![Package Publish Status](https://img.shields.io/github/actions/workflow/status/lattyware/elm-fontawesome/publish.yml?logo=github&label=package%20publish)](https://github.com/Lattyware/elm-fontawesome/actions/workflows/publish.yml)
[![Elm package](https://img.shields.io/elm-package/v/lattyware/elm-fontawesome?logo=elm)](https://package.elm-lang.org/packages/lattyware/elm-fontawesome/latest/)
[![FontAwesome version](https://img.shields.io/github/package-json/dependency-version/lattyware/elm-fontawesome-generator/@fortawesome/fontawesome-svg-core?label=FontAwesome&logo=fontawesome)](https://github.com/Lattyware/elm-fontawesome-generator/blob/main/package.json)

This is a package that generates Elm code for [FontAwesome][fa].
Most people will be more interested in [the generated library
itself][elm-fontawesome].

[elm-fontawesome]: https://github.com/Lattyware/elm-fontawesome
[fa]: https://fontawesome.com/

## How it works.

This package works by generating Elm source code using [the FontAwesome SVG
JavaScript Core library][fa-core].

We load icon packs, then generate Elm functions for each icon. When run, these
generate the desired SVG icons. This means no need to rely on any external
resources - all the data for the icons and supporting styles is encoded into
the Elm package.

This does mean that this is a big package, the compiled Elm code weighs in at
over 1MB. This would naturally not be ideal in most situations. The good news
is that it is easy to minify out any unused icons thanks to Elm's pure nature.
If you are already minifying your compiled Elm (which is good practice
anyway), then you don't need to do anything more. If you are not, then [it is
simple to do][minification].

If you need to manually subset the library (most commonly to dynamically
include icons at runtime, e.g: from user input where tree shaking can't be
used) you will need to build the library for ourself.

[fa-core]: https://fontawesome.com/docs/web/dig-deeper/svg-core
[minification]: https://guide.elm-lang.org/optimization/asset_size.html

## Using the Elm library.

Please see the repository for [the generated library][elm-fontawesome] for
more information on using the library.

For most people, just using that will be the best option, if you wish to
manually subset, see below on building the library.

[elm-fontawesome]: https://github.com/Lattyware/elm-fontawesome

## Building the Elm library.

It is recommended to build in a [Docker][get-docker] environment for security
and consistency.
Note our build process requires [Buildx/BuildKit][buildx] enabled Docker.

You can then run `npm run docker:generate` to generate the Elm library into
the `build` directory.

If you would like to build without Docker, you will need Node 22 installed.
You can install dependencies with `npm install`.

You can then run `npm run generate` to generate the Elm library into the
build` directory.

You can modify `config.json` to further customise the build. You can also write a 
`config.js` file instead to do something more fancy (export the generated config 
as default).

- `version`: (Required) The version number to output in the generated elm.json
  file.
- `iconSources`: (Required) An array of icon sources to include, allowing manual
  subsetting.
- `outputPath`: (Default `"dist/lib"`) Where to output the generated files (if
  running through docker, you will want to edit `docker-bake.hcl` instead.)
- `verbosity`: (Default `"error"`) One of `"trace"`, `"debug"`, `"info"`,
  `"warn"`, `"error"`, `"silent"`, determining how much output the generator
  will produce.

An icon source is either:

- `name`: (Required) The name of the elm module to put the icons from this
  source in.
- `icons`: (Required) A list of [FontAwesome `IconDefinition`s][icondef]
  of the icons.

or:

- `name`: (Required) The name of the elm module to put the icons from this
  source in.
- `package`: (Required) The name of the NPM package of icons to load. This must
  expose a `prefix` value which contains the name of the FontAwesome `IconPack`
  to load.
- `include`: (Default `"all"`) either `"all"` for all, or an array of the names
  of the icons to include. If you want to do something more complex, you can
  run the generator from code and pass a predicate function that takes the
  IconDef instead. See `cli.ts`.

[get-docker]: https://docs.docker.com/get-docker/
[buildx]: https://docs.docker.com/buildx/working-with-buildx/
[font-awesome-bug]: https://github.com/FortAwesome/Font-Awesome/pull/19041
[icondef]: https://github.com/FortAwesome/Font-Awesome/blob/6.x/js-packages/%40fortawesome/fontawesome-common-types/index.d.ts#L10=
