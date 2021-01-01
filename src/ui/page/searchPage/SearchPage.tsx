import * as React from "react"
import { useTranslation } from "react-i18next"
import { ArgisFeature } from "../../../common/types"
import { Page, PageVisibility } from "../Page"
import { FeatureList } from "../../component/feature/FeatureList"
import { FeatureTitleClickAction } from "../../component/feature/component/FeatureCollapsePanel"

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

      <FeatureList
        hidePage={hidePage}
        titleClickAction={FeatureTitleClickAction.ClosePageAndPinOnMap}
        features={features}
        models={[]}
        maisemanMuistiFeatures={[]}
      />
    </>
  )
}

const ValidationError: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div className="alert alert-danger" role="alert">
      {t(`search.error`)}
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
  const { t } = useTranslation()
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
    <Page title={t(`search.title`)} visibility={visibility} hidePage={hidePage}>
      <form
        className={showSearchTextError ? "has-error" : undefined}
        onSubmit={onSearchClick}
      >
        {showSearchTextError && <ValidationError />}
        <span id="helpBlock" className="help-block">
          {t(`search.info`)}
        </span>
        <div className="input-group">
          <input
            type="text"
            ref={inputRef}
            className="form-control"
            placeholder={t(`search.placeholder`)}
            value={searchText}
            aria-describedby="helpBlock"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit">
              {t(`search.searchButton`)}
            </button>
          </span>
        </div>
      </form>

      <Results features={searchResultFeatures} hidePage={hidePage} />
    </Page>
  )
}
