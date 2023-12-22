import React, { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Page } from "../Page"
import { FeatureList } from "../../component/feature/FeatureList"
import { FeatureTitleClickAction } from "../../component/feature/component/FeatureCollapsePanel"
import { useDispatch, useSelector } from "react-redux"
import { searchFeatures } from "../../../store/actionCreators"
import { PageId, Settings } from "../../../store/storeTypes"
import { MapFeature } from "../../../common/mapFeature.types"

interface ResultsProps {
  features?: Array<MapFeature>
}

const Results: React.FC<ResultsProps> = ({ features }) => {
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

export const SearchPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState("")
  const [showSearchTextError, setShowSearchTextError] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const searchResultFeatures = useSelector(
    (settings: Settings) => settings.search.features
  )
  const visiblePage = useSelector((settings: Settings) => settings.visiblePage)

  useEffect(() => {
    if (visiblePage === PageId.Search) {
      setTimeout(() => inputRef.current?.focus(), 500)
    }
  }, [visiblePage])

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
    <Page title={t(`search.title`)} pageId={PageId.Search}>
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
            placeholder={t(`search.placeholder`) ?? undefined}
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

      <Results features={searchResultFeatures} />
    </Page>
  )
}
