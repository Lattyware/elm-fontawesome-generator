- 7.1.2

  - Changed:
    - Explicitly specify FontAwesome 6.5.2.
    - Another attempt at fixing example build again.

- 7.1.1

  - Changed:
    - Hopefully fixed example build, shouldn't actually change the library.

- 7.1.0
  
  - Changed:
    - **Breaking** Tighten required version of core to try and fix issues. 
    - Modernise build process.

- 7.0.0
  
  - Changed:
    - Upgraded FontAwesome version.

- 6.0.0

  - Changed:

    - **Breaking** Requires Node 18.
    - Targets FontAwesome 6.x.
    - **Breaking** Generated API changes:
      - `FontAwesome.Icon` has moved to `FontAwesome`.
      - `Icon` has become `IconDef` and `Presentation` has become `Icon`.
      - Icons are now exposed as presentations primarily. Definitions can be
        found one level deeper, as they are rarely needed.
      - Old convenience methods for working with definitions are gone.
      - `Icon` (formerly `Presentation`) no longer has a `msg` type. This means
        `styled` can no longer accept attributes that can produce messages,
        these can be added with `viewWithAttributes` instead, where needed.
      - All transforms now apply to the current state of the icon, e.g:
        flipping twice now gives you the original state.
      - `Svg.view` has replaced `Svg.viewIcon` with support for a much wider
        range of the functionality of `Icon.view`.
      - Matching the API of FontAwesome, `Styles.pulse` has been renamed to
        `Styles.spinPulse`.
      - `Icon.masked` now use the id of the background element rather than the
        mask, swapping which element needs an id. If now also takes a whole
        `Icon` (formerly `Presentation`), allowing the background element being
        masked to have other operations performed on it.

  - Known Issues:

    - FontAwesome has continued to use custom properties to control style
      aspects. As [Elm's support for these is broken][elm-custom-properties],
      these are not exposed. We recommend using the Transforms API instead for
      now, where possible.
      One work-around is to use style attributes directly:
      `Html.attribute "style" "--fa-bounce-start-scale-x: 1;"`
      Because this breaks when combined, we don't provide functions for this.

  - Added:

    - Manual subsetting support.
      You can now manually pick a subset of icons to build. This is useful if
      you are, for example, dynamically accessing icons in a way that would
      break tree-shaking.

  - Removed:
    - **Breaking** Support for FontAwesome Pro has been removed.
      FontAwesome do not provide a license for open source development to
      develop and test against, so this feature can no longer be supported.

[elm-custom-properties]: https://github.com/elm/virtual-dom/pull/127

- 4.0.0:

  - Changed:
    - Targets FontAwesome 5.11.1
  - Added:
    - Rendering to path nodes.
      This allows you to use icons in existing SVG nodes.
  - Fixed:
    - Resolved issue with new versions of elm-format not working as required.

- 3.1.0:
  - Fixed:
    - Removed erroneus `}` from Elm documentation.
