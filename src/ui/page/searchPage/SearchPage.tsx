import React, { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { ArgisFeature } from "../../../common/types"
import { Page, PageVisibility } from "../Page"
import { FeatureList } from "../../component/feature/FeatureList"
import { FeatureTitleClickAction } from "../../component/feature/component/FeatureCollapsePanel"
import { useDispatch, useSelector } from "react-redux"
import { searchFeatures } from "../../../store/actionCreators"
import { Settings } from "../../../store/storeTypes"

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
}

export const SearchPage: React.FC<Props> = ({ visibility, hidePage }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState("")
  const [showSearchTextError, setShowSearchTextError] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const searchResultFeatures = useSelector(
    (settings: Settings) => settings.search.searchResults
  )

  useEffect(() => {
    if (visibility === PageVisibility.Visible) {
      setTimeout(() => inputRef.current?.focus(), 500)
    }
  }, [visibility])

  const onSearchClick = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.stopPropagation()
      event.preventDefault()

      if (searchText.trim().length < 3) {
        setShowSearchTextError(true)
        return
      }
      setShowSearchTextError(false)
      dispatch(searchFeatures(searchText))
    },
    [dispatch, searchText]
  )

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
