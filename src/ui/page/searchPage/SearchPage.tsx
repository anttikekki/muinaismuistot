import React, { useCallback, useEffect, useRef, useState } from "react"
import { Alert, Button, Col, Form, InputGroup, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { MapFeature } from "../../../common/mapFeature.types"
import { ActionTypeEnum } from "../../../store/actionTypes"
import { AppDispatch, PageId, Settings } from "../../../store/storeTypes"
import { FeatureList } from "../../component/feature/FeatureList"
import { FeatureTitleClickAction } from "../../component/feature/component/FeatureCollapsePanel"
import { Page } from "../Page"

interface ResultsProps {
  features?: MapFeature[]
}

const Results: React.FC<ResultsProps> = ({ features }) => {
  if (!features) {
    return null
  }
  return (
    <>
      <Row>
        <Col className="gy-3">
          <h6>
            <span>Hakutulokset</span>
            <small> ({features.length} kpl)</small>
          </h6>
        </Col>
      </Row>

      <FeatureList
        titleClickAction={FeatureTitleClickAction.ClosePageAndPinOnMap}
        features={features}
        models={[]}
      />
    </>
  )
}

export const SearchPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
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
      dispatch({
        type: ActionTypeEnum.SEARCH_FEATURES,
        searchText
      })
    },
    [dispatch, searchText]
  )

  return (
    <Page title={t(`search.title`)} pageId={PageId.Search}>
      <Row>
        <Col>
          <Form onSubmit={onSearchClick}>
            {showSearchTextError && (
              <Alert variant="danger">{t(`search.error`)}</Alert>
            )}

            <Form.Label>{t(`search.info`)}</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                ref={inputRef}
                placeholder={t(`search.placeholder`) ?? undefined}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button type="submit" variant="outline-secondary">
                {t(`search.searchButton`)}
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      <Results features={searchResultFeatures} />
    </Page>
  )
}
