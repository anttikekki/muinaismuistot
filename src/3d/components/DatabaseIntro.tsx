import * as React from "react";

export const DatabaseIntro: React.FC = () => {
  return (
    <>
      <h2 id="Tietokannan-tarkoitus">Tietokannan tarkoitus</h2>
      <p>
        Museot, Museovirasto, Ahvenanmaan paikallishallinto ja harrastajat ovat
        julkaisseet 3D-malleja arkeologisista- ja rakennusperintökohteista{" "}
        <a href="https://sketchfab.com">Sketchfab</a>
        -sivustolla mutta niitä on vaikea löytää ja listata. Lisäksi ne eivät
        linkity helposti Museoviraston ja Ahvenanmaan paikallishallinnon
        rekistereihin tai niistä koostettuihin avoimiin paikkatietoaineistoihin
        joten malleja ei saa mitenkään helposti kartalle. Tämä tietokanta
        yrittää korjata tämän ongelman.
      </p>

      <p>
        Tässä tietokannassa Sketchfab-palvelussa oleva 3D-malli linkitetään
        Museoviraston ja Ahvenanmaan paikallishallinnon rekisterien kohteisiin
        ja sijaintiin kartalla. Tällöin tämän linkityksen avulla pystyy
        vastaamaan seuraaviin kysymyksiin:
      </p>
      <ol>
        <li>
          Onko rekisterin kohteella julkisesti saatavilla olevia 3D-malleja?
        </li>
        <li>Mitä rekisterin kohdetta Sketchfabissa oleva 3D-malli esittää?</li>
        <li>Missä sijainnissa kartalla 3D-mallin esittämä kohde on?</li>
      </ol>
    </>
  );
};
