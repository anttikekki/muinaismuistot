import React from "react"
import { Badge } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import {
  MuinaisjaannosAjoitus,
  VarkAjoitus
} from "../../../../common/museovirasto.types"

interface MuinaisjäännösTimespanLabelProps {
  dating: MuinaisjaannosAjoitus
}

export const MuinaisjäännösTimespanLabel: React.FC<
  MuinaisjäännösTimespanLabelProps
> = ({ dating }) => {
  const { t, i18n } = useTranslation()
  // Aikajakson vuodet: https://akp.nba.fi/artikkelit;kronologia
  const key = `data.museovirasto.muinaisjäännösAjoitusTimespan.${dating}`

  if (!i18n.exists(key)) {
    return null
  }
  return <Badge bg="secondary ms-1">{key}</Badge>
}

interface VarkTimespanLabelProps {
  dating: VarkAjoitus
}

export const VarkTimespanLabel: React.FC<VarkTimespanLabelProps> = ({
  dating
}) => {
  const { t, i18n } = useTranslation()
  // Aikajakson vuodet: https://akp.nba.fi/artikkelit;kronologia
  const key = `data.museovirasto.varkAjoitusTimespan.${dating}`

  if (!i18n.exists(key)) {
    return null
  }
  return <Badge bg="secondary ms-1">{t(key)}</Badge>
}
