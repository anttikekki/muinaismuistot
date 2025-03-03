import React from "react"

export const DatabaseIntro: React.FC = () => {
  return (
    <>
      <h2 id="Tietokannan-tarkoitus">Tietokannan tarkoitus</h2>
      <p>Kirja sisältää 205 kpl merkittävää muinaisjäännöstä Suomesta:</p>

      <figure>
        <blockquote className="blockquote">
          <p>
            Luetteloon on pyritty valitsemaan tällä hetkellä tiedossa olevista
            muinaisjäännöksistä ne, jotka kussakin maakunnassa edustavat seudun
            arvokkainta ja omaleimaisinta arkeologista kulttuuriperintoä.
          </p>
        </blockquote>
        <figcaption className="blockquote-footer">
          Johdanto, <cite title="Maiseman muisti">Maiseman muisti</cite>
        </figcaption>
      </figure>
      <p>
        Tämä aineisto on valtava apu harrastelijalle, jonka on vaikea löytää
        Museoviraston paikkatietoaineiston tuhansista kohteista näitä
        alueellisesti merkittäviä ja vaikuttavia kohteita. Tämä kirja on
        kuitenkin nykyisin jo aika vaikeasti saatavilla eikä aineistoa löydy
        digitaalisesti mistään.
      </p>
      <p>
        Tämän sivun tarkoituksena onkin saada tämän aineiston paikkatiedot
        helposti kaikkien saataville.
      </p>
    </>
  )
}
