import * as React from "react";
import {MuinaisjaannosPisteArgisFeature} from "../../../data"

interface Props {
    isOpen: boolean
    onToggleOpen: () => void
    feature: MuinaisjaannosPisteArgisFeature
}

export const MuinaisjaannosPistePanel: React.FC<Props> = ({isOpen, onToggleOpen, feature}) => {
    return (
        <div className="panel panel-default">
            <div
                className="panel-heading"
                role="tab"
            >
                <h4 className="panel-title">
                    <a
                        role="button"
                        href="#muinaisjaannos-collapse"
                        aria-expanded="true"
                        aria-controls="muinaisjaannos-collapse"
                        onClick={() => onToggleOpen()}
                    >
                        <span id="muinaisjaannos-details-icon" />
                        <span id="muinaisjaannos-heading-name">
                            Kiinteä muinaisjäännös
                  </span>
                    </a>
                    <a
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
                className={`panel-collapse collapse ${isOpen ? "in" : ""}`}
                role="tabpanel"
                aria-labelledby="muinaisjaannos-heading"
            >
                <div className="panel-body">
                    <form>
                        <div className="form-group">
                            <label>Kohdenimi</label>
                            <p>{feature.attributes.kohdenimi}</p>
                        </div>
                        <div className="form-group">
                            <label>Kunta</label>
                            <p>{feature.attributes.kunta}</p>
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
                            <p>{feature.attributes.tyyppi}</p>
                        </div>
                        <div className="form-group">
                            <label>Alatyyppi</label>
                            <p>{feature.attributes.alatyyppi}</p>
                        </div>
                        <div className="form-group">
                            <label>Laji</label>
                            <p>{feature.attributes.laji}</p>
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
    )
}