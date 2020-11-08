import * as React from "react"

export const MaisemanMuistiField: React.FC = () => (
  <div className="form-group">
    <label>
      Maiseman muisti - Valtakunnallisesti merkittävät muinaisjäännökset (
      <a href="./maisemanmuisti/" target="_blank">
        lisätietoa
      </a>
      )
    </label>
    <p>
      <img className="feature-icon" src="images/maiseman-muisti.png" />
      <span>Kohde on valtakunnallisesti merkittävä muinaisjäännös</span>
    </p>
  </div>
)
