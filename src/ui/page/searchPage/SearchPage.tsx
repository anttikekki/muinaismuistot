import * as React from "react"
import { ArgisFeature } from "../../../common/types"
import {
  getFeatureID,
  getFeatureName,
  getFeatureTypeName,
  getFeatureTypeIconURL,
  getFeatureLocation,
  getFeatureMunicipality
} from "../../../common/util/featureParser"
import { Page, PageVisibility } from "../Page"
import { createLocationHash } from "../../../common/util/URLHashHelper"

interface ResultRowProps {
  hidePage: () => void
  feature: ArgisFeature
}

const ResultRow: React.FC<ResultRowProps> = ({ hidePage, feature }) => {
  const nimi = getFeatureName(feature)
  const municipality = getFeatureMunicipality(feature)
  const tyypinNimi = getFeatureTypeName(feature)
  const iconURL = getFeatureTypeIconURL(feature)
  const coordinates = getFeatureLocation(feature)
  const locationHash = coordinates && createLocationHash(coordinates)

  return (
    <a
      href={locationHash}
      className="list-group-item search-result-row"
      onClick={hidePage}
    >
      <h4 className="list-group-item-heading">{nimi}</h4>
      <p className="list-group-item-text">
        <img className="feature-icon" src={iconURL} />
        <span>
          {tyypinNimi}
          {municipality && `, ${municipality}`}
        </span>
      </p>
    </a>
  )
}

interface ResultsProps {
  hidePage: () => void
  features?: Array<ArgisFeature>
}

const Results: React.FC<ResultsProps> = ({ hidePage, features }) => {
  if (!features) {
    return null
  }
  return (
    <>
      <h5 id="search-result-header">
        <span>Hakutulokset</span>
        <small> ({features.length} kpl)</small>
      </h5>

      <div className="list-group">
        {features.map((f) => (
          <ResultRow
            key={`${f.layerName}-${getFeatureID(f)}`}
            feature={f}
            hidePage={hidePage}
          />
        ))}
      </div>
    </>
  )
}

const ValidationError: React.FC = () => {
  return (
    <div className="alert alert-danger" role="alert">
      Hakusanan pitää olla vähintään kolme merkkiä
    </div>
  )
}

interface Props {
  visibility: PageVisibility
  hidePage: () => void
  searchFeatures: (searchText: string) => void
  searchResultFeatures?: Array<ArgisFeature>
}

export const SearchPage: React.FC<Props> = ({
  visibility,
  hidePage,
  searchFeatures,
  searchResultFeatures
}) => {
  const [searchText, setSearchText] = React.useState("")
  const [showSearchTextError, setShowSearchTextError] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    if (visibility === PageVisibility.Visible) {
      setTimeout(() => inputRef.current?.focus(), 500)
    }
  }, [visibility])

  const onSearchClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (searchText.trim().length < 3) {
      setShowSearchTextError(true)
      return
    }
    setShowSearchTextError(false)
    searchFeatures(searchText)
  }

  return (
    <Page title="Hae kohteita" visibility={visibility} hidePage={hidePage}>
      <form
        className={showSearchTextError ? "has-error" : undefined}
        onSubmit={onSearchClick}
      >
        {showSearchTextError && <ValidationError />}
        <span id="helpBlock" className="help-block">
          Voit hakea kohteen nimellä (esim. Turun linna) tai rekisterin
          tunnuksella (esim. 200284 tai Sa 14.1)
        </span>
        <div className="input-group">
          <input
            type="text"
            ref={inputRef}
            className="form-control"
            placeholder="Kirjoita kohteen nimi tai sen osa"
            value={searchText}
            aria-describedby="helpBlock"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit">
              Hae
            </button>
          </span>
        </div>
      </form>

      <Results features={searchResultFeatures} hidePage={hidePage} />
    </Page>
  )
}
