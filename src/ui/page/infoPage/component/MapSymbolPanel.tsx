import * as React from "react";
import { Panel } from "../../../component/Panel";

export const MapSymbolPanel: React.FC = () => {
  return (
    <Panel title="Karttasymbolit">
      <div>
        <h5>Museoviraston muinaisjäännösrekisteri</h5>

        <p>
          <img className="feature-icon" src="images/muinaisjaannos_kohde.png" />
          <span>Kiinteä muinaisjäännös</span>
        </p>

        <p>
          <img className="feature-icon" src="images/muinaisjaannos_alue.png" />
          <span>Kiinteä muinaisjäännös (alue)</span>
        </p>

        <p>
          <img
            className="feature-icon"
            src="images/muu_kulttuuriperintokohde_kohde.png"
          />
          <span>Muu kulttuuriperintökohde</span>
        </p>

        <p>
          <img
            className="feature-icon"
            src="images/muu-kulttuuriperintokohde-alue.png"
          />
          <span>Muu kulttuuriperintökohde (alue)</span>
        </p>
      </div>

      <br />

      <div>
        <h5>Ahvenanmaan muinaisjäännösrekisteri</h5>

        <p>
          <img
            className="feature-icon"
            src="images/ahvenanmaa_muinaisjaannos.png"
          />
          <span>Kohde</span>
        </p>
      </div>

      <br />
      <div>
        <h5>Ahvenanmaan merellisen kulttuuriperinnön rekisteri</h5>

        <p>
          <img className="feature-icon" src="images/ahvenanmaa_hylky.png" />
          <span>Kohde</span>
        </p>
      </div>

      <br />

      <div>
        <h5>Rakennusperintörekisteri</h5>

        <p>
          <img
            className="feature-icon"
            src="images/rakennusperintorekisteri_rakennus.png"
          />
          <span>Rakennus</span>
        </p>

        <p>
          <img
            className="feature-icon"
            src="images/rakennusperintorekisteri_alue.png"
          />
          <span>Alue</span>
        </p>
      </div>

      <br />

      <div>
        <h5>Maailmanperintökohteet</h5>

        <p>
          <img
            className="feature-icon"
            src="images/maailmanperinto_piste.png"
          />
          <span>Kohde</span>
        </p>

        <p>
          <img className="feature-icon" src="images/maailmanperinto_alue.png" />
          <span>Alue</span>
        </p>
      </div>

      <br />

      <div>
        <h5>Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt</h5>

        <p>
          <img className="feature-icon" src="images/rky_piste.png" />
          <span>Kohde</span>
        </p>

        <p>
          <img className="feature-icon" src="images/rky_viiva.png" />
          <span>Viiva (esim. tie)</span>
        </p>

        <p>
          <img className="feature-icon" src="images/rky_alue.png" />
          <span>Alue</span>
        </p>
      </div>

      <br />

      <div>
        <h5>
          3D-mallit (
          <a href="./3d/" target="_blank">
            lisätietoa
          </a>
          )
        </h5>

        <p>
          <img className="feature-icon" src="images/3d_malli_circle.png" />
          <img className="feature-icon" src="images/3d_malli_square.png" />
          <span>Kohde sisältää 3D-malleja</span>
        </p>
      </div>

      <br />

      <div>
        <h5>
          Maiseman muisti - Valtakunnallisesti merkittävät muinaisjäännökset (
          <a href="./maisemanmuisti/" target="_blank">
            lisätietoa
          </a>
          )
        </h5>

        <p>
          <img className="feature-icon" src="images/maiseman-muisti.png" />
          <span>Valtakunnallisesti merkittävä muinaisjäännös</span>
        </p>
      </div>
    </Panel>
  );
};
