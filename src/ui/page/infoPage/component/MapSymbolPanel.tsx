import React from "react"
import { Accordion } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import {
  LayerIcon,
  MaalinnoitusFeatureIcon,
  ViabundusFeatureIcon
} from "../../../component/feature/component/Icon"
import {
  AhvenanmaaLayer,
  HelsinkiLayer,
  MaisemanMuistiLayer,
  MuseovirastoLayer
} from "../../../../common/layers.types"
import {
  MaalinnoitusKohdetyyppi,
  MaalinnoitusRajaustyyppi
} from "../../../../common/maalinnoitusHelsinki.types"
import {
  ViabundusFeatureType,
  ViabundusRoadCertainty,
  ViabundusRoadType
} from "../../../../common/viabundus.types"

export const MapSymbolPanel: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Accordion.Item eventKey="info.symbols">
      <Accordion.Header as="div">{t(`info.symbols`)}</Accordion.Header>
      <Accordion.Body>
        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt`}
            components={{ a: <a /> }}
          />
        </h6>

        <div className="mb-3">
          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.RKY_piste} />
            <span>{t(`common.features.Kohde`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.RKY_viiva} />
            <span>{t(`common.features.Viiva`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.RKY_alue} />
            <span>{t(`common.features.Alue`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Maailmanperintökohteet`}
            components={{ a: <a /> }}
          />
        </h6>

        <div className="mb-3">
          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Maailmanperinto_piste} />
            <span>{t(`common.features.Kohde`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Maailmanperinto_alue} />
            <span>{t(`common.features.Alue`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Rakennusperintörekisteri`}
            components={{ a: <a /> }}
          />
        </h6>

        <div className="mb-3">
          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Suojellut_rakennukset_piste} />
            <span>{t(`common.features.Rakennus`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Suojellut_rakennukset_alue} />
            <span>{t(`common.features.Alue`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Muinaisjäännösrekisteri`}
            components={{ a: <a /> }}
          />
        </h6>

        <div className="mb-3">
          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Muinaisjaannokset_piste} />
            <span>{t(`data.featureType.Kiinteä muinaisjäännös`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Muinaisjaannokset_alue} />
            <span>{t(`data.featureType.Kiinteä muinaisjäännös (alue)`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon
              layer={MuseovirastoLayer.Muu_kulttuuriperintokohde_piste}
            />
            <span>{t(`data.featureType.Muu kulttuuriperintökohde`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon
              layer={MuseovirastoLayer.Muu_kulttuuriperintokohde_alue}
            />
            <span>
              {t(`data.featureType.Muu kulttuuriperintökohde (alue)`)}
            </span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Löytöpaikka_piste} />
            <span>{t(`data.featureType.löytöpaikkaPiste`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Löytöpaikka_alue} />
            <span>{t(`data.featureType.löytöpaikkaAlue`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Havaintokohde_piste} />
            <span>{t(`data.featureType.havaintokohdePiste`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Havaintokohde_alue} />
            <span>{t(`data.featureType.havaintokohdeAlue`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Luonnonmuodostuma_piste} />
            <span>{t(`data.featureType.luonnonmuodostumaPiste`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Luonnonmuodostuma_alue} />
            <span>{t(`data.featureType.luonnonmuodostumaAlue`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Muu_kohde_piste} />
            <span>{t(`data.featureType.muuKohdePiste`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Muu_kohde_alue} />
            <span>{t(`data.featureType.muuKohdeAlue`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon
              layer={MuseovirastoLayer.Mahdollinen_muinaisjäännös_piste}
            />
            <span>{t(`data.featureType.mahdollinenMuinaisjäännösPiste`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon
              layer={MuseovirastoLayer.Mahdollinen_muinaisjäännös_alue}
            />
            <span>{t(`data.featureType.mahdollinenMuinaisjäännösAlue`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon
              layer={MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösPiste}
            />
            <span>
              {t(`data.featureType.poistettuKiinteäMuijaisjäännösPiste`)}
            </span>
          </div>

          <div className="ms-3">
            <LayerIcon
              layer={MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösAlue}
            />
            <span>
              {t(`data.featureType.poistettuKiinteäMuijaisjäännösAlue`)}
            </span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.Alakohde_piste} />
            <span>{t(`data.featureType.alakohdePiste`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.vark`}
            components={{ a: <a /> }}
          />
        </h6>

        <div className="mb-3">
          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.VARK_pisteet} />
            <span>{t(`common.features.keskipisteet`)}</span>
          </div>

          <div className="ms-3">
            <LayerIcon layer={MuseovirastoLayer.VARK_alueet} />
            <span>{t(`common.features.aluerajaukset`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Ahvenanmaan muinaisjäännösrekisteri`}
            components={{ a: <a /> }}
          />
        </h6>
        <div className="mb-3">
          <div className="ms-3">
            <LayerIcon layer={AhvenanmaaLayer.Fornminnen} />
            <span>{t(`common.features.Kohde`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Ahvenanmaan merellinen kulttuuriperintörekisteri`}
            components={{ a: <a /> }}
          />
        </h6>
        <div className="mb-3">
          <div className="ms-3">
            <LayerIcon layer={AhvenanmaaLayer.MaritimaFornminnen} />
            <span>{t(`common.features.Kohde`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.maalinnoitus`}
            components={{ a: <a /> }}
          />
        </h6>
        <div className="mb-3">
          <div className="ms-3">
            <MaalinnoitusFeatureIcon
              layer={HelsinkiLayer.Maalinnoitus_kohteet}
              type={MaalinnoitusKohdetyyppi.Asema}
            />
            <span>{t(`data.helsinki.feature.asema`)}</span>
          </div>
          <div className="ms-3">
            <MaalinnoitusFeatureIcon
              layer={HelsinkiLayer.Maalinnoitus_kohteet}
              type={MaalinnoitusKohdetyyppi.Luola}
            />
            <span>{t(`data.helsinki.feature.luola`)}</span>
          </div>
          <div className="ms-3">
            <MaalinnoitusFeatureIcon
              layer={HelsinkiLayer.Maalinnoitus_kohteet}
              type={MaalinnoitusKohdetyyppi.Tykkitie}
            />
            <span>{t(`data.helsinki.feature.tykkitie`)}</span>
          </div>
          <div className="ms-3">
            <MaalinnoitusFeatureIcon
              layer={HelsinkiLayer.Maalinnoitus_kohteet}
              type={MaalinnoitusKohdetyyppi.Tykkipatteri}
            />
            <span>{t(`data.helsinki.feature.tykkipatteri`)}</span>
          </div>
          <div className="ms-3">
            <MaalinnoitusFeatureIcon
              layer={HelsinkiLayer.Maalinnoitus_rajaukset}
              type={MaalinnoitusRajaustyyppi.Tukikohta}
            />
            <span>{t(`data.helsinki.feature.puolustusasemanRaja`)}</span>
          </div>
          <div className="ms-3">
            <MaalinnoitusFeatureIcon
              layer={HelsinkiLayer.Maalinnoitus_rajaukset}
              type={MaalinnoitusRajaustyyppi.Puolustusasema}
            />
            <span>{t(`data.helsinki.feature.tukikohdanRaja`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.viabundus`}
            components={{ a: <a /> }}
          />
        </h6>
        <div className="mb-3">
          <div className="ms-3">
            <ViabundusFeatureIcon
              type={ViabundusFeatureType.place}
              Is_Town={true}
            />
            <span>{t(`data.viabundus.place.town`)}</span>
          </div>
          <div className="ms-3">
            <ViabundusFeatureIcon
              type={ViabundusFeatureType.place}
              Is_Settlement={true}
            />
            <span>{t(`data.viabundus.place.settlement`)}</span>
          </div>
          <div className="ms-3">
            <ViabundusFeatureIcon
              type={ViabundusFeatureType.place}
              Is_Bridge={true}
            />
            <span>{t(`data.viabundus.place.bridge`)}</span>
          </div>
          <div className="ms-3">
            <ViabundusFeatureIcon
              type={ViabundusFeatureType.place}
              Is_Harbour={true}
            />
            <span>{t(`data.viabundus.place.harbour`)}</span>
          </div>
          <div className="ms-3">
            <ViabundusFeatureIcon
              type={ViabundusFeatureType.place}
              Is_Ferry={true}
            />
            <span>{t(`data.viabundus.place.ferry`)}</span>
          </div>
          <div className="ms-3">
            <ViabundusFeatureIcon
              type={ViabundusFeatureType.place}
              Is_Toll={true}
            />
            <span>{t(`data.viabundus.place.toll`)}</span>
          </div>
          <div className="ms-3">
            <ViabundusFeatureIcon
              type={ViabundusFeatureType.road}
              roadType={ViabundusRoadType.land}
            />
            <span>{t(`data.viabundus.road.land`)}</span>
          </div>
          <div className="ms-3">
            <ViabundusFeatureIcon
              type={ViabundusFeatureType.road}
              roadType={ViabundusRoadType.land}
              certainty={ViabundusRoadCertainty.Uncertain}
            />
            <span>{t(`data.viabundus.road.landUncertain`)}</span>
          </div>
          <div className="ms-3">
            <ViabundusFeatureIcon
              type={ViabundusFeatureType.road}
              roadType={ViabundusRoadType.winter}
            />
            <span>{t(`data.viabundus.road.winter`)}</span>
          </div>
          <div className="ms-3">
            <ViabundusFeatureIcon
              type={ViabundusFeatureType.road}
              roadType={ViabundusRoadType.coast}
            />
            <span>{t(`data.viabundus.road.coast`)}</span>
          </div>
          <div className="ms-3">
            <ViabundusFeatureIcon
              type={ViabundusFeatureType.road}
              roadType={ViabundusRoadType.coast}
              certainty={ViabundusRoadCertainty.Uncertain}
            />
            <span>{t(`data.viabundus.road.coastUncertain`)}</span>
          </div>
          <div className="ms-3">
            <ViabundusFeatureIcon type={ViabundusFeatureType.townOutline} />
            <span>{t(`data.viabundus.townOutline`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey="data.register.nameWithLink.3Dmodels"
            components={{ a: <a /> }}
          />
        </h6>
        <div className="mb-3">
          <div className="ms-3">
            <img className="feature-icon" src="images/3d_malli_square.png" />
            <span>{t(`common.features.3D-malli`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey="data.register.nameWithLink.maisemanMuisti"
            components={{ a: <a /> }}
          />
        </h6>
        <div className="mb-3">
          <div className="ms-3">
            <LayerIcon layer={MaisemanMuistiLayer.MaisemanMuisti} />
            <span>
              {t(
                `common.features.Valtakunnallisesti merkittävä muinaisjäännös`
              )}
            </span>
          </div>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  )
}
