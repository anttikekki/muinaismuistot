import React, { Suspense, use, useMemo } from "react"
import { Trans } from "react-i18next"
import { Alert, Col, Row } from "react-bootstrap"

interface FinnaResult { resultCount: number }

const fetchFinnaImageCount = async (mjtunnus: number): Promise<FinnaResult> => {
  const response = await fetch(
    `https://api.finna.fi/api/v1/search?field[]=resultCount&filter[]=geographic_id_str_mv:"(mjr)${mjtunnus}"&filter[]=online_boolean:"1"&filter[]=format:"0/Image/"`
  )
  return response.json() as Promise<FinnaResult>
}

interface FinnaImagesLinkProps {
  finnaFetchPromise: Promise<FinnaResult>
  mjtunnus: number
}

const FinnaImagesLink: React.FC<FinnaImagesLinkProps> = ({
  finnaFetchPromise,
  mjtunnus
}) => {
  const { resultCount } = use(finnaFetchPromise)
  const finnaUIUrl = `https://finna.fi/Search/Results?lookfor=geographic_id_str_mv:"(mjr)${mjtunnus}"&filter[]=online_boolean:"1"&filter[]=format:"0/Image/"`

  if (resultCount === 0) {
    return null
  }

  return (
    <Row>
      <Col>
        <Alert variant="light">
          <Trans
            i18nKey="details.field.finnaText"
            values={{ resultCount, finnaUIUrl }}
            components={{ a: <Alert.Link /> }}
          />
        </Alert>
      </Col>
    </Row>
  )
}

interface Props {
  mjtunnus: number
}

export const FinnaImagesField: React.FC<Props> = ({ mjtunnus }) => {
  const finnaFetchPromise = useMemo(
    () => fetchFinnaImageCount(mjtunnus),
    [mjtunnus]
  )

  return (
    <Suspense>
      <FinnaImagesLink
        finnaFetchPromise={finnaFetchPromise}
        mjtunnus={mjtunnus}
      />
    </Suspense>
  )
}
