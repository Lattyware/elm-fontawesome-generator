module FontAwesome.Icon.Internal exposing
    ( Icon(..)
    , IconDefinition
    , WithId
    , WithoutId
    , topLevelDimensions
    )

{-| Internal module to avoid a dependency cycle.
-}

import FontAwesome.Transforms exposing (Transform)
import Svg


{-| This must remain the same as the definition for `Icon.IconDefinition`.
-}
type alias IconDefinition =
    { prefix : String
    , name : String
    , size : ( Int, Int )
    , paths : ( String, Maybe String )
    }


type WithId
    = WithId


type WithoutId
    = WithoutId


{-| Exposes the constructor here, but shouldn't publicly.
-}
type Icon hasId
    = Icon
        { icon : IconDefinition
        , transforms : List Transform
        , role : String
        , id : Maybe String
        , title : Maybe String
        , outer : Maybe (Icon WithId)
        , attributes : List (Svg.Attribute Never)
        }


topLevelDimensions : Icon hasId -> ( Int, Int )
topLevelDimensions (Icon { icon, outer }) =
    outer
        |> Maybe.map topLevelDimensionsInternal
        |> Maybe.withDefault icon.size


topLevelDimensionsInternal : Icon hasId -> ( Int, Int )
topLevelDimensionsInternal (Icon { icon, outer }) =
    outer
        |> Maybe.map topLevelDimensions
        |> Maybe.withDefault icon.size
