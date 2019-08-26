import * as React from "react";

interface Props {
  visible: boolean;
  hidePage: () => void;
}

export const FeatureDetailsPage: React.FC<Props> = ({ visible, hidePage }) => {
  return (
    <div
      id="detailsPage"
      className={`container page ${
        visible ? "page-right-visible" : "page-right-hidden"
      }`}
    >
      <div className="pageHeader">
        <button
          className="btn btn-primary btn-sm"
          id="hide-detailsPage-button"
          onClick={hidePage}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />{" "}
          Sulje
        </button>
      </div>

      <div className="pageContent">
        <div
          className="panel-group"
          id="accordion"
          role="tablist"
          aria-multiselectable="true"
        >
          <div
            className="panel panel-default"
            id="muinaisjaannos-collapse-container"
          >
            <div
              className="panel-heading"
              role="tab"
              id="muinaisjaannos-heading"
            >
              <h4 className="panel-title">
                <a
                  role="button"
                  data-toggle="collapse"
                  data-section="muinaisjaannos"
                  data-parent="#accordion"
                  href="#muinaisjaannos-collapse"
                  aria-expanded="true"
                  aria-controls="muinaisjaannos-collapse"
                >
                  <span id="muinaisjaannos-details-icon" />
                  <span id="muinaisjaannos-heading-name">
                    Kiinteä muinaisjäännös
                  </span>
                </a>
                <a
                  id="muinaisjaannos-permanent-link"
                  className="pull-right"
                  href=""
                >
                  <span
                    className="glyphicon glyphicon-link"
                    aria-hidden="true"
                  />
                </a>
              </h4>
            </div>
            <div
              id="muinaisjaannos-collapse"
              className="panel-collapse collapse"
              role="tabpanel"
              aria-labelledby="muinaisjaannos-heading"
            >
              <div className="panel-body">
                <form>
                  <div className="form-group">
                    <label>Kohdenimi</label>
                    <p id="muinaisjaannos-Kohdenimi" />
                  </div>
                  <div className="form-group">
                    <label>Kunta</label>
                    <p id="muinaisjaannos-Kunta" />
                  </div>
                  <div className="form-group">
                    <label>Ajoitus</label>
                    <p>
                      <span id="muinaisjaannos-Ajoitus" />
                      <span
                        className="label label-default"
                        id="muinaisjaannos-Ajoitus-aikajanne"
                      />
                    </p>
                  </div>
                  <div className="form-group">
                    <label>Tyyppi</label>
                    <p id="muinaisjaannos-Tyyppi" />
                  </div>
                  <div className="form-group">
                    <label>Alatyyppi</label>
                    <p id="muinaisjaannos-Alatyyppi" />
                  </div>
                  <div className="form-group">
                    <label>Laji</label>
                    <p id="muinaisjaannos-Laji" />
                  </div>

                  <p>
                    Lisää tietoa kohteesta Museoviraston{" "}
                    <a
                      href=""
                      target="_blank"
                      id="muinaisjaannos-muinaisjaannosarekisteri-link"
                    >
                      Muinaisjäännösrekisteristä
                    </a>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
          <div
            className="panel panel-default"
            id="muinaisjaannosalue-collapse-container"
          >
            <div
              className="panel-heading"
              role="tab"
              id="muinaisjaannosalue-heading"
            >
              <h4 className="panel-title">
                <a
                  className="collapsed"
                  role="button"
                  data-toggle="collapse"
                  data-section="muinaisjaannosalue"
                  data-parent="#accordion"
                  href="#muinaisjaannosalue-collapse"
                  aria-expanded="false"
                  aria-controls="muinaisjaannosalue-collapse"
                >
                  <span id="muinaisjaannosalue-details-icon" />
                  <span id="muinaisjaannosalue-heading-name">
                    Muinaisjäännösalue
                  </span>
                </a>
                <a
                  id="muinaisjaannosalue-permanent-link"
                  className="pull-right"
                  href=""
                >
                  <span
                    className="glyphicon glyphicon-link"
                    aria-hidden="true"
                  />
                </a>
              </h4>
            </div>
            <div
              id="muinaisjaannosalue-collapse"
              className="panel-collapse collapse"
              role="tabpanel"
              aria-labelledby="muinaisjaannosalue-heading"
            >
              <div className="panel-body">
                <form>
                  <div className="form-group">
                    <label>Kohdenimi</label>
                    <p id="muinaisjaannosalue-Kohdenimi" />
                  </div>
                  <div className="form-group">
                    <label>Kunta</label>
                    <p id="muinaisjaannosalue-Kunta" />
                  </div>
                  <div className="form-group">
                    <label>Laji</label>
                    <p id="muinaisjaannosalue-Laji" />
                  </div>

                  <p>
                    Lisää tietoa kohteesta Museoviraston{" "}
                    <a
                      href=""
                      target="_blank"
                      id="muinaisjaannosalue-muinaisjaannosarekisteri-link"
                    >
                      Muinaisjäännösrekisteristä
                    </a>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
          <div className="panel panel-default" id="rky-collapse-container">
            <div className="panel-heading" role="tab" id="rky-heading">
              <h4 className="panel-title">
                <a
                  className="collapsed"
                  role="button"
                  data-toggle="collapse"
                  data-section="rky"
                  data-parent="#accordion"
                  href="#rky-collapse"
                  aria-expanded="false"
                  aria-controls="rky-collapse"
                >
                  <span id="rky-details-icon" />
                  <span>
                    Valtakunnallisesti merkittävät rakennetut
                    kulttuuriympäristöt
                  </span>
                </a>
                <a id="rky-permanent-link" className="pull-right" href="">
                  <span
                    className="glyphicon glyphicon-link"
                    aria-hidden="true"
                  />
                </a>
              </h4>
            </div>
            <div
              id="rky-collapse"
              className="panel-collapse collapse"
              role="tabpanel"
              aria-labelledby="rky-heading"
            >
              <div className="panel-body">
                <form>
                  <div className="form-group">
                    <label>Kohdenimi</label>
                    <p id="rky-Kohdenimi" />
                  </div>
                  <div className="form-group" id="rky-Nimi-container">
                    <label>Nimi</label>
                    <p id="rky-Nimi" />
                  </div>

                  <p>
                    Lisää tietoa kohteesta{" "}
                    <a href="" target="_blank" id="rky-link">
                      rky.fi rekisteristä
                    </a>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
          <div
            className="panel panel-default"
            id="maailmanperinto-collapse-container"
          >
            <div
              className="panel-heading"
              role="tab"
              id="maailmanperinto-heading"
            >
              <h4 className="panel-title">
                <a
                  className="collapsed"
                  role="button"
                  data-toggle="collapse"
                  data-section="maailmanperinto"
                  data-parent="#accordion"
                  href="#maailmanperinto-collapse"
                  aria-expanded="false"
                  aria-controls="maailmanperinto-collapse"
                >
                  <span id="maailmanperinto-details-icon" />
                  <span>Maailmanperintökohde</span>
                </a>
                <a
                  id="maailmanperinto-permanent-link"
                  className="pull-right"
                  href=""
                >
                  <span
                    className="glyphicon glyphicon-link"
                    aria-hidden="true"
                  />
                </a>
              </h4>
            </div>
            <div
              id="maailmanperinto-collapse"
              className="panel-collapse collapse"
              role="tabpanel"
              aria-labelledby="maailmanperinto-heading"
            >
              <div className="panel-body">
                <form>
                  <div className="form-group">
                    <label>Kohdenimi</label>
                    <p id="maailmanperinto-Kohdenimi" />
                  </div>

                  <p>
                    Lisää tietoa kohteesta{" "}
                    <a href="" target="_blank" id="maailmanperinto-link">
                      Museoviraston sivuilta
                    </a>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
          <div
            className="panel panel-default"
            id="rakennusperintorekisteriAlue-collapse-container"
          >
            <div
              className="panel-heading"
              role="tab"
              id="rakennusperintorekisteriAlue-heading"
            >
              <h4 className="panel-title">
                <a
                  className="collapsed"
                  role="button"
                  data-toggle="collapse"
                  data-section="rakennusperintorekisteriAlue"
                  data-parent="#accordion"
                  href="#rakennusperintorekisteriAlue-collapse"
                  aria-expanded="false"
                  aria-controls="rakennusperintorekisteriAlue-collapse"
                >
                  <img src="images/rakennusperintorekisteri_alue.png" />
                  <span>Rakennusperintörekisterin alue</span>
                </a>
                <a
                  id="rakennusperintorekisteriAlue-permanent-link"
                  className="pull-right"
                  href=""
                >
                  <span
                    className="glyphicon glyphicon-link"
                    aria-hidden="true"
                  />
                </a>
              </h4>
            </div>
            <div
              id="rakennusperintorekisteriAlue-collapse"
              className="panel-collapse collapse"
              role="tabpanel"
              aria-labelledby="rakennusperintorekisteriAlue-heading"
            >
              <div className="panel-body">
                <form>
                  <div className="form-group">
                    <label>Kohdenimi</label>
                    <p id="rakennusperintorekisteriAlue-Kohdenimi" />
                  </div>
                  <div className="form-group">
                    <label>Kunta</label>
                    <p id="rakennusperintorekisteriAlue-Kunta" />
                  </div>
                  <div className="form-group">
                    <label>Suojeluryhmä</label>
                    <p id="rakennusperintorekisteriAlue-Suojeluryhmä" />
                  </div>

                  <p>
                    Lisää tietoa kohteesta Museoviraston{" "}
                    <a
                      href=""
                      target="_blank"
                      id="rakennusperintorekisteriAlue-link"
                    >
                      rakennusperintörekisteristä
                    </a>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
          <div
            className="panel panel-default"
            id="rakennusperintorekisteriRakennus-collapse-container"
          >
            <div
              className="panel-heading"
              role="tab"
              id="rakennusperintorekisteriRakennus-heading"
            >
              <h4 className="panel-title">
                <a
                  className="collapsed"
                  role="button"
                  data-toggle="collapse"
                  data-section="rakennusperintorekisteriRakennus"
                  data-parent="#accordion"
                  href="#rakennusperintorekisteriRakennus-collapse"
                  aria-expanded="false"
                  aria-controls="rakennusperintorekisteriRakennus-collapse"
                >
                  <img src="images/rakennusperintorekisteri_rakennus.png" />
                  <span>Rakennusperintörekisterin rakennus</span>
                </a>
                <a
                  id="rakennusperintorekisteriRakennus-permanent-link"
                  className="pull-right"
                  href=""
                >
                  <span
                    className="glyphicon glyphicon-link"
                    aria-hidden="true"
                  />
                </a>
              </h4>
            </div>
            <div
              id="rakennusperintorekisteriRakennus-collapse"
              className="panel-collapse collapse"
              role="tabpanel"
              aria-labelledby="rakennusperintorekisteriRakennus-heading"
            >
              <div className="panel-body">
                <form>
                  <div className="form-group">
                    <label>Kohdenimi</label>
                    <p id="rakennusperintorekisteriRakennus-Kohdenimi" />
                  </div>
                  <div className="form-group">
                    <label>Rakennusnimi</label>
                    <p id="rakennusperintorekisteriRakennus-Rakennusnimi" />
                  </div>
                  <div className="form-group">
                    <label>Kunta</label>
                    <p id="rakennusperintorekisteriRakennus-Kunta" />
                  </div>
                  <div className="form-group">
                    <label>Suojeluryhmä</label>
                    <p id="rakennusperintorekisteriRakennus-Suojeluryhmä" />
                  </div>

                  <p>
                    Lisää tietoa kohteesta Museoviraston{" "}
                    <a
                      href=""
                      target="_blank"
                      id="rakennusperintorekisteriRakennus-link"
                    >
                      rakennusperintörekisteristä
                    </a>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
          <div
            className="panel panel-default"
            id="ahvenamaaMuinaismuisto-collapse-container"
          >
            <div
              className="panel-heading"
              role="tab"
              id="ahvenamaaMuinaismuisto-heading"
            >
              <h4 className="panel-title">
                <a
                  className="collapsed"
                  role="button"
                  data-toggle="collapse"
                  data-section="ahvenamaaMuinaismuisto"
                  data-parent="#accordion"
                  href="#ahvenamaaMuinaismuisto-collapse"
                  aria-expanded="false"
                  aria-controls="ahvenamaaMuinaismuisto-collapse"
                >
                  <img src="images/ahvenanmaa_muinaisjaannos.png" />
                  <span>Ahvenanmaan muinaisjäännös</span>
                </a>
                <a
                  id="ahvenamaaMuinaismuisto-permanent-link"
                  className="pull-right"
                  href=""
                >
                  <span
                    className="glyphicon glyphicon-link"
                    aria-hidden="true"
                  />
                </a>
              </h4>
            </div>
            <div
              id="ahvenamaaMuinaismuisto-collapse"
              className="panel-collapse collapse"
              role="tabpanel"
              aria-labelledby="ahvenamaaMuinaismuisto-heading"
            >
              <div className="panel-body">
                <form>
                  <div
                    className="form-group"
                    id="ahvenamaaMuinaismuisto-Nimi-container"
                  >
                    <label>Nimi</label>
                    <p id="ahvenamaaMuinaismuisto-Nimi" />
                  </div>
                  <div className="form-group">
                    <label>Kunta</label>
                    <p id="ahvenamaaMuinaismuisto-Kunta" />
                  </div>
                  <div className="form-group">
                    <label>Kylä</label>
                    <p id="ahvenamaaMuinaismuisto-Kyla" />
                  </div>
                  <div
                    className="form-group"
                    id="ahvenamaaMuinaismuisto-Kuvaus-container"
                  >
                    <label>Kuvaus</label>
                    <p id="ahvenamaaMuinaismuisto-Kuvaus" />
                  </div>
                  <div
                    className="form-group"
                    id="ahvenamaaMuinaismuisto-Sijainti-container"
                  >
                    <label>Sijainti</label>
                    <p id="ahvenamaaMuinaismuisto-Sijainti" />
                  </div>
                  <div className="form-group">
                    <label>Tunniste</label>
                    <p id="ahvenamaaMuinaismuisto-Tunniste" />
                  </div>

                  <p>
                    Lisää tietoa kohteesta löytyy{" "}
                    <a
                      href=""
                      target="_blank"
                      id="ahvenamaaMuinaismuisto-pdf-link"
                    >
                      kuntakohtaisesta Pdf-tiedostosta
                    </a>
                    , josta voit etsiä kohteen tunnisteella{" "}
                    <span
                      className="label label-default"
                      id="ahvenamaaMuinaismuisto-pdf-link-Tunniste"
                    />
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
