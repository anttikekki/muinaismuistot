# Contract

Tämä moduuli sisältää karttaratkaisun jaetun, versionhallittavan sopimuksen:

- `layer-mapping.json`: 12 fyysisen lähdetason ja 26 loogisen UI-tason mäppäys
- `filter-vocabulary.json`: kompaktien MVT-suodatinkoodien merkitykset
- `migrations/`: Museoviraston D1-tietokannan skeema

Selain, pää-Worker ja prosessointi lukevat näitä samoja tiedostoja. Moduuli ei
riipu muista karttadatamoduuleista eikä sisällä ympäristökohtaisia asetuksia.
