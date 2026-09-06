import React, { Suspense, use, useMemo } from "react"
import { Trans } from "react-i18next"
import { Alert, Col, Row } from "react-bootstrap"
import { fetchFinnaImageCount } from "../../../../common/util/finnaImageCount"

interface FinnaImagesLinkProps {
  finnaFetchPromise: Promise<number | null>
  mjtunnus: number
}

const FinnaImagesLink: React.FC<FinnaImagesLinkProps> = ({
  finnaFetchPromise,
  mjtunnus
}) => {
  const resultCount = use(finnaFetchPromise)
  const finnaUIUrl = `https://finna.fi/Search/Results?lookfor=geographic_id_str_mv:"(mjr)${mjtunnus}"&filter[]=online_boolean:"1"&filter[]=format:"0/Image/"`

  if (resultCount === null || resultCount === 0) {
    return null
  }

  return (
    <Row>
      <Col>
        <Alert variant="light" className="external-service-alert">
          <img
            className="external-service-logo"
            src="images/brands/finna.svg"
            alt=""
            aria-hidden="true"
          />
          <div>
            <Trans
              i18nKey="details.field.finnaText"
              values={{ resultCount, finnaUIUrl }}
              components={{ a: <Alert.Link /> }}
            />
          </div>
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
