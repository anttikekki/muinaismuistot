!function(e){function t(t){for(var a,i,u=t[0],s=t[1],o=t[2],c=0,k=[];c<u.length;c++)i=u[c],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&k.push(r[i][0]),r[i]=0;for(a in s)Object.prototype.hasOwnProperty.call(s,a)&&(e[a]=s[a]);for(m&&m(t);k.length;)k.shift()();return l.push.apply(l,o||[]),n()}function n(){for(var e,t=0;t<l.length;t++){for(var n=l[t],a=!0,u=1;u<n.length;u++){var s=n[u];0!==r[s]&&(a=!1)}a&&(l.splice(t--,1),e=i(i.s=n[0]))}return e}var a={},r={2:0},l=[];function i(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=a,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)i.d(n,a,function(t){return e[t]}.bind(null,a));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var u=window.webpackJsonp=window.webpackJsonp||[],s=u.push.bind(u);u.push=t,u=u.slice();for(var o=0;o<u.length;o++)t(u[o]);var m=s;l.push([519,0]),n()}({1:function(e,t,n){"use strict";var a,r,l,i,u,s;n.d(t,"b",(function(){return r})),n.d(t,"c",(function(){return l})),n.d(t,"h",(function(){return i})),n.d(t,"a",(function(){return u})),n.d(t,"d",(function(){return s})),n.d(t,"j",(function(){return c})),n.d(t,"i",(function(){return k})),n.d(t,"g",(function(){return o})),n.d(t,"e",(function(){return m})),n.d(t,"f",(function(){return p})),function(e){e.Maanmittauslaitos="Maanmittauslaitos",e.Museovirasto="Museovirasto",e.Ahvenanmaa="Ahvenanmaa",e.Models="Models"}(r||(r={})),function(e){e.Maastokartta="maastokartta",e.Taustakartta="taustakartta",e.Ortokuva="ortokuva"}(l||(l={})),function(e){e["Muinaisjäännökset_piste"]="Muinaisjäännökset_piste",e["Muinaisjäännökset_alue"]="Muinaisjäännökset_alue",e.Suojellut_rakennukset_piste="Suojellut_rakennukset_piste",e.Suojellut_rakennukset_alue="Suojellut_rakennukset_alue",e.RKY_alue="RKY_alue",e.RKY_piste="RKY_piste",e.RKY_viiva="RKY_viiva",e["Maailmanperintö_piste"]="Maailmanperintö_piste",e["Maailmanperintö_alue"]="Maailmanperintö_alue"}(i||(i={})),function(e){e.Fornminnen="Fornminnen",e.MaritimtKulturarv="Maritimt kulturarv; Vrak"}(u||(u={})),function(e){e.ModelLayer="ModelLayer"}(s||(s={}));var o,m,c=((a={})[i.Muinaisjäännökset_piste]=0,a[i.Muinaisjäännökset_alue]=1,a[i.Suojellut_rakennukset_piste]=2,a[i.Suojellut_rakennukset_alue]=3,a[i.RKY_alue]=4,a[i.RKY_piste]=5,a[i.RKY_viiva]=6,a[i.Maailmanperintö_piste]=7,a[i.Maailmanperintö_alue]=8,a),k=function(e){switch(e){case u.Fornminnen:return 1;case u.MaritimtKulturarv:return 5}};!function(e){e["eiMääritelty"]="ei määritelty",e.alustenHylyt="alusten hylyt",e.asuinpaikat="asuinpaikat",e.hautapaikat="hautapaikat",e.kirkkorakenteet="kirkkorakenteet",e.kivirakenteet="kivirakenteet",e["kulkuväylät"]="kulkuväylät",e.kulttiJaTarinapaikat="kultti- ja tarinapaikat",e.luonnonmuodostumat="luonnonmuodostumat",e["löytöpaikat"]="löytöpaikat",e.maarakenteet="maarakenteet",e["muinaisjäännösryhmät"]="muinaisjäännösryhmät",e.puolustusvarustukset="puolustusvarustukset",e.puurakenteet="puurakenteet",e.raakaAineenHankintapaikat="raaka-aineen hankintapaikat",e.taideMuistomerkit="taide, muistomerkit",e.tapahtumapaikat="tapahtumapaikat",e.teollisuuskohteet="teollisuuskohteet",e["työJaValmistuspaikat"]="työ- ja valmistuspaikat"}(o||(o={})),function(e){e.moniperiodinen="moniperiodinen",e.esihistoriallinen="esihistoriallinen",e.kivikautinen="kivikautinen",e.varhaismetallikautinen="varhaismetallikautinen",e.pronssikautinen="pronssikautinen",e.rautakautinen="rautakautinen",e.keskiaikainen="keskiaikainen",e.historiallinen="historiallinen",e.moderni="moderni",e.ajoittamaton="ajoittamaton",e["eiMääritelty"]="ei määritelty"}(m||(m={}));var p={moniperiodinen:"",esihistoriallinen:"8600 eaa. - 1200 jaa.",kivikautinen:"8600 – 1500 eaa.",varhaismetallikautinen:"1500 eaa. - 200 jaa.",pronssikautinen:"1700 – 500 eaa.",rautakautinen:"500 eaa. - 1200 jaa.",keskiaikainen:"1200 - 1570 jaa.",historiallinen:"1200 jaa. -",moderni:"1800 jaa -",ajoittamaton:"","ei määritelty":""}},21:function(e,t,n){"use strict";n.d(t,"c",(function(){return i})),n.d(t,"g",(function(){return u})),n.d(t,"f",(function(){return s})),n.d(t,"j",(function(){return o})),n.d(t,"a",(function(){return m})),n.d(t,"l",(function(){return c})),n.d(t,"e",(function(){return k})),n.d(t,"d",(function(){return p})),n.d(t,"k",(function(){return h})),n.d(t,"b",(function(){return d})),n.d(t,"i",(function(){return E})),n.d(t,"m",(function(){return f})),n.d(t,"n",(function(){return v})),n.d(t,"h",(function(){return _}));var a=n(1),r=function(e){return"kiinteä muinaisjäännös"===v(e.attributes.laji)},l=function(e){return"muu kulttuuriperintökohde"===v(e.attributes.laji)},i=function(e){switch(e.layerName){case a.h.Muinaisjäännökset_piste:case a.h.Muinaisjäännökset_alue:case a.h.RKY_alue:case a.h.RKY_piste:case a.h.RKY_viiva:case a.h.Suojellut_rakennukset_piste:case a.h.Suojellut_rakennukset_alue:return v(e.attributes.kohdenimi);case a.h.Maailmanperintö_piste:case a.h.Maailmanperintö_alue:return v(e.attributes.Nimi);case a.a.Fornminnen:return v(e.attributes.Namn)||v(e.attributes["Fornlämnings ID"]);case a.a.MaritimtKulturarv:return v(e.attributes.Namn)||v(e.attributes.FornID)}},u=function(e){switch(e.layerName){case a.h.Muinaisjäännökset_piste:if(r(e))return"Kiinteä muinaisjäännös";if(l(e))return"Muu kulttuuriperintökohde";break;case a.h.Muinaisjäännökset_alue:if(r(e))return"Kiinteä muinaisjäännös (alue)";if(l(e))return"Muu kulttuuriperintökohde (alue)";break;case a.h.RKY_alue:case a.h.RKY_piste:case a.h.RKY_viiva:return"Rakennettu kulttuuriympäristö";case a.h.Maailmanperintö_piste:case a.h.Maailmanperintö_alue:return"Maailmanperintökohde";case a.h.Suojellut_rakennukset_piste:case a.h.Suojellut_rakennukset_alue:return"Rakennusperintökohde";case a.a.Fornminnen:return"Ahvenanmaan muinaisjäännösrekisterin kohde";case a.a.MaritimtKulturarv:return"Ahvenamaan merellisen kulttuuriperintörekisterin kohde";default:return}},s=function(e,t){void 0===t&&(t=!1);var n=t?"_3d":"";switch(e.layerName){case a.h.Muinaisjäännökset_piste:if(r(e))return"images/muinaisjaannos_kohde"+n+".png";if(l(e))return"images/muu_kulttuuriperintokohde_kohde"+n+".png";break;case a.h.Muinaisjäännökset_alue:if(r(e))return"images/muinaisjaannos_alue"+n+".png";if(l(e))return"images/muu-kulttuuriperintokohde-alue"+n+".png";break;case a.h.RKY_alue:return"images/rky_alue"+n+".png";case a.h.RKY_viiva:return"images/rky_viiva"+n+".png";case a.h.RKY_piste:return"images/rky_piste"+n+".png";case a.h.Maailmanperintö_alue:return"images/maailmanperinto_alue"+n+".png";case a.h.Maailmanperintö_piste:return"images/maailmanperinto_piste"+n+".png";case a.h.Suojellut_rakennukset_alue:return"images/rakennusperintorekisteri_alue"+n+".png";case a.h.Suojellut_rakennukset_piste:return"images/rakennusperintorekisteri_rakennus"+n+".png";case a.a.Fornminnen:return"images/ahvenanmaa_muinaisjaannos"+n+".png";case a.a.MaritimtKulturarv:return"images/ahvenanmaa_hylky"+n+".png";default:return}},o=function(e){switch(e){case a.h.Muinaisjäännökset_piste:return["images/muinaisjaannos_kohde.png","images/muu_kulttuuriperintokohde_kohde.png"];case a.h.Muinaisjäännökset_alue:return["images/muinaisjaannos_alue.png","images/muu-kulttuuriperintokohde-alue.png"];case a.h.RKY_alue:return["images/rky_alue.png"];case a.h.RKY_viiva:return["images/rky_viiva.png"];case a.h.RKY_piste:return["images/rky_piste.png"];case a.h.Maailmanperintö_alue:return["images/maailmanperinto_alue.png"];case a.h.Maailmanperintö_piste:return["images/maailmanperinto_piste.png"];case a.h.Suojellut_rakennukset_alue:return["images/rakennusperintorekisteri_alue.png"];case a.h.Suojellut_rakennukset_piste:return["images/rakennusperintorekisteri_rakennus.png"];case a.a.Fornminnen:return["images/ahvenanmaa_muinaisjaannos.png"];case a.a.MaritimtKulturarv:return["images/ahvenanmaa_hylky.png"];case a.d.ModelLayer:return["images/3d_malli_circle.png","images/3d_malli_square.png"]}},m=function(e){switch(e.layerName){case a.h.Muinaisjäännökset_piste:case a.h.Muinaisjäännökset_alue:case a.h.RKY_alue:case a.h.RKY_viiva:case a.h.RKY_piste:case a.h.Maailmanperintö_alue:case a.h.Maailmanperintö_piste:case a.h.Suojellut_rakennukset_alue:case a.h.Suojellut_rakennukset_piste:case a.a.Fornminnen:case a.a.MaritimtKulturarv:return e.attributes.OBJECTID}},c=function(e,t){var n;switch(e.layerName){case a.h.Muinaisjäännökset_piste:n=e.attributes.mjtunnus;break;case a.h.Suojellut_rakennukset_piste:n=e.attributes.kohdeID;break;case a.h.RKY_alue:n=e.attributes.ID;break;case a.a.Fornminnen:case a.a.MaritimtKulturarv:n=e.attributes.OBJECTID}return t?t.filter((function(t){return t.registryItem.type===e.layerName})).filter((function(e){return e.registryItem.id.toString()===n})):[]},k=function(e){switch(e.layerName){case a.h.Muinaisjäännökset_piste:case a.h.Muinaisjäännökset_alue:case a.h.Suojellut_rakennukset_alue:case a.h.Suojellut_rakennukset_piste:return"https://"+e.attributes.url;case a.h.RKY_alue:case a.h.RKY_viiva:case a.h.RKY_piste:return e.attributes.url;case a.h.Maailmanperintö_alue:case a.h.Maailmanperintö_piste:return function(e){var t=e.attributes.URL;if(t.startsWith("http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa")){var n=t.indexOf("#"),a="";-1!==n&&(a=t.substring(n)),t="https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa"+a}return t}(e);case a.a.Fornminnen:return function(e){switch(e.attributes["Fornlämnings ID"].substring(0,2)){case"Br":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/BR%c3%84ND%c3%96.pdf";case"Ec":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/ECKER%c3%96.pdf";case"Fö":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/F%c3%96GL%c3%96.pdf";case"Fi":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/FINSTR%c3%96M.pdf";case"Ge":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/GETA.pdf";case"Ha":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/HAMMARLAND.pdf";case"Jo":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/JOMALA.pdf";case"Kö":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/K%c3%96KAR.pdf";case"Ku":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/KUMLINGE.pdf";case"Le":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/LEMLAND.pdf";case"Lu":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/LUMPARLAND.pdf";case"Ma":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/MARIEHAMN.pdf";case"Sa":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/SALTVIK.pdf";case"So":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/SOTTUNGA.pdf";case"Su":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/SUND.pdf";case"Vå":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/V%c3%85RD%c3%96.pdf"}}(e)}},p=function(e){switch(e.layerName){case a.h.Muinaisjäännökset_piste:case a.h.Muinaisjäännökset_alue:return"Muinaisjäännösrekisteristä";case a.h.RKY_alue:case a.h.RKY_viiva:case a.h.RKY_piste:return"rky.fi rekisteristä";case a.h.Maailmanperintö_alue:case a.h.Maailmanperintö_piste:return"Museoviraston sivuilta";case a.h.Suojellut_rakennukset_alue:case a.h.Suojellut_rakennukset_piste:return"rakennusperintörekisteristä";case a.a.Fornminnen:return"Ahvenamaan muinaisjäännösrekisteri";case a.a.MaritimtKulturarv:return"Ahvenamaan merellinen kulttuuriperintörekisteri"}},h=function(e){switch(e){case a.h.Muinaisjäännökset_piste:case a.h.Muinaisjäännökset_alue:return"Muinaisjäännösrekisteri";case a.h.RKY_alue:case a.h.RKY_viiva:case a.h.RKY_piste:return"Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt";case a.h.Maailmanperintö_alue:case a.h.Maailmanperintö_piste:return"Maailmanperintökohteet";case a.h.Suojellut_rakennukset_alue:case a.h.Suojellut_rakennukset_piste:return"Rakennusperintörekisteri";case a.a.Fornminnen:return"Ahvenamaan muinaisjäännösrekisteri";case a.a.MaritimtKulturarv:return"Ahvenamaan merellinen kulttuuriperintörekisteri"}},d=function(e){switch(e.geometryType){case"esriGeometryPolygon":return e.geometry.rings[0][0];case"esriGeometryPoint":return[e.geometry.x,e.geometry.y];case"esriGeometryPolyline":return e.geometry.paths[0][0]}},E=function(e){switch(e.geometry.type){case"Point":return e.geometry.coordinates;case"Polygon":return e.geometry.coordinates[0][0]}},f=function(e){return a.f[e]},v=function(e){if(null==e)return"";if("null"===(e=e.trim()).toLowerCase())return"";for(;","===e.substr(e.length-1,1);)e=e.substring(0,e.length-1).trim();return e},_=function(e){var t=e.map((function(e){return new Date(e.properties.createdDate).getTime()}));return t=Array.from(new Set(t)),new Date(Math.max.apply(null,t))}},519:function(e,t,n){"use strict";n.r(t);n(213),n(255),n(256);var a=n(0),r=n(176),l=function(){return a.createElement(a.Fragment,null,a.createElement("h2",null,"Sisällys"),a.createElement("ol",null,a.createElement("li",null,a.createElement("a",{href:"#tarkoitus"},"Tietokannan tarkoitus")),a.createElement("li",null,a.createElement("a",{href:"#rekisterit"},"Rekisterit joiden kohteisiin 3D-malleja on linkitetty")),a.createElement("li",null,a.createElement("a",{href:"#rakenne"},"Aineiston rakenne")),a.createElement("li",null,a.createElement("a",{href:"#lataus"},"Aineiston lataus")),a.createElement("li",null,a.createElement("a",{href:"#lisenssit"},"3D-mallien lisenssit")),a.createElement("li",null,a.createElement("a",{href:"#yllapito"},"Ylläpito")),a.createElement("li",null,a.createElement("a",{href:"#listaus"},"Aineston listaus"))))},i=function(){return a.createElement(a.Fragment,null,a.createElement("h2",{id:"rakenne"},"Aineiston rakenne"),a.createElement("p",null,"Tietokanta sisältää seuraavat tiedot"," ",a.createElement("a",{href:"https://en.wikipedia.org/wiki/GeoJSON",target:"_blank"},"GeoJSON")," ","muodossa:"),a.createElement("table",{className:"table table-striped"},a.createElement("thead",null,a.createElement("tr",null,a.createElement("th",null,"Kentän nimi"),a.createElement("th",null,"Tieto"),a.createElement("th",null,"Esimerkki arvosta/arvolista"),a.createElement("th",null,"Tyyppi"))),a.createElement("tbody",null,a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.geometry.type")),a.createElement("td",null,"Kohteen"," ",a.createElement("a",{href:"https://en.wikipedia.org/wiki/GeoJSON",target:"_blank"},"GeoJSON")," ","geometrian tyyppi"),a.createElement("td",null,a.createElement("code",null,"Point")," tai ",a.createElement("code",null,"Polygon")),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.geometry.coordinates")),a.createElement("td",null,"Kohteen koordinaatit"," ",a.createElement("a",{href:"https://epsg.io/3067",target:"_blank"},"EPSG:3067")," ","projektiossa muodossa ",a.createElement("code",null,"[x, y]")," eli"," ",a.createElement("code",null,"[longitude, latitude]"),". Tämä on aina sama kuin kohteen koordinaatit Museoviraston tai Ahvenanmaan paikallishallinnon rekisterissä.",a.createElement("br",null),a.createElement("br",null),"Tämä EPSG:3067 projektio on dokumentoitu myös GeoJSON tiedostoston"," ",a.createElement("code",null,"crs"),"-kentässä:",a.createElement("br",null),a.createElement("code",null,'"crs": {\n  "type": "EPSG",\n  "properties": {\n    "code": 3067\n  }\n},')),a.createElement("td",null,a.createElement("b",null,"Point"),a.createElement("br",null),"esim. ",a.createElement("code",null,"[393155.45770000014, 6680517.1086]"),a.createElement("br",null),a.createElement("br",null),a.createElement("b",null,"Polygon"),a.createElement("br",null),"esim."," ",a.createElement("code",null,"[\n        [\n          [116179.91060000006, 6702449.6776],\n          [116186.79839999974, 6702421.8038],\n          [116179.91060000006, 6702449.6776]\n        ]\n      ]")),a.createElement("td",null,"Taulukko numeroita")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.registryItem.name")),a.createElement("td",null,"Kohteen nimi Museoviraston tai Ahvenanmaan paikallishallinnon rekisterissä"),a.createElement("td",null,"esim. ",a.createElement("code",null,"Tukikohta IV:10 (Kivikko)")),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.registryItem.type")),a.createElement("td",null,"Kohteen tyyppi Museoviraston tai Ahvenanmaan paikallishallinnon rekisterissä"),a.createElement("td",null,"Tyypin nimi tulee rekisterin avoimen paikkatietoaineiston kartttatasosta. ",a.createElement("br",null),a.createElement("br",null),"Museoviraston aineistot:",a.createElement("ul",null,a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/0",target:"_blank"},"Muinaisjäännökset_piste")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/1",target:"_blank"},"Muinaisjäännökset_alue")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/2",target:"_blank"},"Suojellut_rakennukset_piste")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/3",target:"_blank"},"Suojellut_rakennukset_alue")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/4",target:"_blank"},"RKY_alue")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/5",target:"_blank"},"RKY_piste")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/6",target:"_blank"},"RKY_viiva")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/7",target:"_blank"},"Maailmanperintö_piste")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/8",target:"_blank"},"Maailmanperintö_alue"))),a.createElement("br",null),"Ahvenanmaan paikallishallinnon aineisto:",a.createElement("ul",null,a.createElement("li",null,a.createElement("a",{href:"https://www.kartor.ax/datasets/fornminnen",target:"_blank"},"Fornminnen")),a.createElement("li",null,a.createElement("a",{href:"https://www.kartor.ax/datasets/maritimt-kulturarv-vrak",target:"_blank"},"Maritimt kulturarv; Vrak")))),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.registryItem.id")),a.createElement("td",null,"Kohteen id Museoviraston tai Ahvenanmaan paikallishallinnon rekisterissä"),a.createElement("td",null,"esim. ",a.createElement("code",null,"1000011245")),a.createElement("td",null,"Numero")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.registryItem.url")),a.createElement("td",null,"Linkki kohteen tietoihin Museoviraston tai Ahvenanmaan paikallishallinnon rekisterissä"),a.createElement("td",null,"esim."," ",a.createElement("a",{href:"https://www.kyppi.fi/to.aspx?id=112.100001124",target:"_blank"},"https://www.kyppi.fi/to.aspx?id=112.100001124")),a.createElement("td",null,a.createElement("a",{href:"https://en.wikipedia.org/wiki/URL",target:"_blank"},"URL"))),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.registryItem.municipality")),a.createElement("td",null,"Kohteen kunta"),a.createElement("td",null,"esim. ",a.createElement("code",null,"Helsinki")),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.model.name")),a.createElement("td",null,"3D-mallin nimi. Tämä tulisi olla tässä suomeksi vaikka mallin nimi olisi Sketchfabissa englanniksi."),a.createElement("td",null,"esim. ",a.createElement("code",null,"Syvä juoksuhauta")),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.model.url")),a.createElement("td",null,"3D-mallin osoite Sketchfab-palvelussa."),a.createElement("td",null,"esim."," ",a.createElement("a",{href:"https://sketchfab.com/models/bd9110f1a2174eef9c4b1ee02111b4bd",target:"_blank"},"https://sketchfab.com/models/bd9110f1a2174eef9c4b1ee02111b4bd")),a.createElement("td",null,a.createElement("a",{href:"https://en.wikipedia.org/wiki/URL",target:"_blank"},"URL"))),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.author")),a.createElement("td",null,"3D-mallin tekijän nimi."),a.createElement("td",null,"esim. ",a.createElement("code",null,"Museovirasto")),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.authorUrl")),a.createElement("td",null,"3D-mallin tekijän profiili Sketchfab-palvelussa."),a.createElement("td",null,"esim."," ",a.createElement("a",{href:"https://sketchfab.com/MuseovirastoMeriarkeologia"},"https://sketchfab.com/MuseovirastoMeriarkeologia")),a.createElement("td",null,a.createElement("a",{href:"https://en.wikipedia.org/wiki/URL",target:"_blank"},"URL"))),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.licence")),a.createElement("td",null,"3D-mallin lisenssin nimi."),a.createElement("td",null,"esim. ",a.createElement("code",null,"CC BY 4.0")),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.licenceUrl")),a.createElement("td",null,"Osoite 3D-mallin lisenssiin."),a.createElement("td",null,"esim."," ",a.createElement("a",{href:"https://creativecommons.org/licenses/by/4.0/deed.fi",target:"_blank"},"https://creativecommons.org/licenses/by/4.0/deed.fi")),a.createElement("td",null,a.createElement("a",{href:"https://en.wikipedia.org/wiki/URL",target:"_blank"},"URL"))),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.createdDate")),a.createElement("td",null,"Päivämäärä jolloin 3D-malli on lisätty tähän tietokantaan. Tämän perusteella voi etsiä uusimman päivämäärän eli päivän jolloin tietokantaa on viiemksi päivitetty."),a.createElement("td",null,"esim. ",a.createElement("code",null,"2020-03-11")),a.createElement("td",null,a.createElement("a",{href:"https://en.wikipedia.org/wiki/ISO_8601",target:"_blank"},"ISO 8601"))))),a.createElement("p",null,"Esimerkki GeoJSON-featuresta:"),a.createElement("pre",null,a.createElement("code",null,'    {\n    "type": "Feature",\n    "geometry": {\n      "type": "Point",\n      "coordinates": [393155.45770000014, 6680517.1086]\n    },\n    "properties": {\n      "registryItem": {\n        "name": "Tukikohta IV:10 (Kivikko)",\n        "id": 1000011245,\n        "type": "Muinaisjäännökset_piste",\n        "url": "https://www.kyppi.fi/to.aspx?id=112.1000011245",\n        "municipality": "Helsinki"\n      },\n      "model": {\n        "name": "Syvä juoksuhauta",\n        "url": "https://sketchfab.com/models/bd9110f1a2174eef9c4b1ee02111b4bd"\n      },\n      "author": "Antti Kekki",\n      "authorUrl": "https://sketchfab.com/antti.kekki",\n      "licence": "CC BY 4.0",\n      "licenceUrl": "https://creativecommons.org/licenses/by/4.0/deed.fi",\n      "createdDate": "2020-03-11"\n    }\n  }')))},u=function(){return a.createElement(a.Fragment,null,a.createElement("h2",{id:"rekisterit"},"Rekisterit joiden kohteisiin 3D-malleja on linkitetty"),a.createElement("b",null,"Museovirasto"),a.createElement("ul",null,a.createElement("li",null,a.createElement("a",{href:"https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx",target:"_blank"},"Muinaisjäännösrekisteri")),a.createElement("li",null,a.createElement("a",{href:"https://www.kyppi.fi/palveluikkuna/rapea/read/asp/r_default.aspx",target:"_blank"},"Rakennusperintörekisteri")),a.createElement("li",null,a.createElement("a",{href:"https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa",target:"_blank"},"Maailmanperintökohteet")),a.createElement("li",null,a.createElement("a",{href:"http://www.rky.fi/",target:"_blank"},"Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt"))),a.createElement("b",null,"Ahvenamaan paikallishallinto"),a.createElement("ul",null,a.createElement("li",null,a.createElement("a",{href:"http://www.regeringen.ax/kulturarv/arkeologi-fornlamningar/fornlamningsregistret",target:"_blank"},"Muinaisjäännösrekisteri")),a.createElement("li",null,a.createElement("a",{href:"https://www.regeringen.ax/kulturarv/arkeologi-fornlamningar/marinarkeologi",target:"_blank"},"Merellisen kulttuuriperinnön rekisteri"))))},s=function(){return a.createElement(a.Fragment,null,a.createElement("h2",{id:"lataus"},"Aineiston lataus"),a.createElement("p",null,"Tietokanta on koostettu"," ",a.createElement("a",{href:"https://en.wikipedia.org/wiki/GeoJSON",target:"_blank"},"GeoJSON")," ","muodossa, jolloin sitä helppo käyttää eri paikkatietotyökaluilla ja karttasovelluskehyksillä (kuten"," ",a.createElement("a",{href:"https://openlayers.org/en/latest/examples/geojson.html",target:"_blank"},"OpenLayers")," ","ja"," ",a.createElement("a",{href:"https://leafletjs.com/examples/geojson/",target:"_blank"},"Leaflet"),")."),a.createElement("div",{className:"well"},"Lataa aineisto:"," ",a.createElement("a",{href:"https://muinaismuistot.info/3d/3d.json"},"https://muinaismuistot.info/3d/3d.json")),a.createElement("p",null,"Aineistoa voi myös käyttää suoraan yllä olevasta osoitteesta (eli esim. että selaimessa avautuva karttasovellus lataa aineiston suoraan tältä sivulta). Palvelin palauttaa ladattaessa aineiston"," ",a.createElement("a",{href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag",target:"_blank"},"Etag"),"-otsakkeen joten ainakin selaimet osaavat ladata aineistosta aina uusimman version. Lisäksi palvelin palauttaa"," ",a.createElement("code",null,"access-control-allow-origin: *")," ",a.createElement("a",{href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS",target:"_blank"},"CORS"),"-otsakkeen joten selain pystyy käyttämään aineistoa toisesta domain-osoitteesta."))},o=n(18),m=n(21),c=n(84),k=function(e){var t=e.models,n=a.useState([]),r=n[0],l=n[1],i=a.useState("Lisätty"),u=i[0],s=i[1],k=a.useState("desc"),p=k[0],h=k[1];a.useEffect((function(){return l(t)}),[t]);var d=function(e){var t=e.name,n=e.valueFn;return a.createElement("th",null,a.createElement("a",{href:"#"+t,onClick:function(e){return function(e,t,n){e.preventDefault();var a=p;t===u?a="asc"===p?"desc":"asc":(s(t),a="asc"),h(a);var i=Object(o.d)(r).sort(n);i="desc"===a?i.reverse():i,l(i)}(e,t,(function(e,t){return n(e).localeCompare(n(t))}))},style:{whiteSpace:"nowrap"}},a.createElement("span",null,t," "),t===u&&a.createElement("img",{src:"../images/"+p+".png"})))};return a.createElement(a.Fragment,null,a.createElement("h2",{id:"listaus"},"Aineston listaus"),a.createElement("p",null,"Tässä listattu koko tietokannan sisältö. Kaikki tämän taulukon tiedot löytyvät suoraan tietokannasta. Rivejä voi järjestää klikkaamalla sarakkeen otsikkoa."),a.createElement("ul",null,a.createElement("li",null,"Kohteen nimi on linkki suoraan Museoviraston tai Ahvenanmaan paikallishallinnon ",a.createElement("a",{href:"#rekisterit"},"rekisteriin"),"."),a.createElement("li",null,"Kohteen nimem perässä on linkki kohteeseen"," ",a.createElement("a",{href:"https://muinaismuistot.info",target:"_blank"},"muinaismuistot.info")," ","-sivuston kartalla."),a.createElement("li",null,"Mallin nimi on linkki 3D-malliin"," ",a.createElement("a",{href:"https://sketchfab.com",target:"_blank"},"Sketchfab"),"-sivustolla.")),a.createElement("p",null,"Tämän aineston näkee kokonaisuudessaan kartalla"," ",a.createElement("a",{href:"https://muinaismuistot.info",target:"_blank"},"muinaismuistot.info")," ","-sivustolta. Kohteet joissa on 3D-malleja on merkitty tummalla kehyksellä."),a.createElement("table",{className:"table table-striped"},a.createElement("thead",null,a.createElement("tr",null,a.createElement("th",null,"#"),a.createElement(d,{name:"Kohde",valueFn:function(e){return e.properties.registryItem.name}}),a.createElement("tr",null),a.createElement(d,{name:"Kunta",valueFn:function(e){return e.properties.registryItem.municipality}}),a.createElement(d,{name:"Rekisteri",valueFn:function(e){return e.properties.registryItem.type}}),a.createElement(d,{name:"Mallin nimi",valueFn:function(e){return e.properties.model.name}}),a.createElement(d,{name:"Lisätty",valueFn:function(e){return e.properties.createdDate}}),a.createElement(d,{name:"Tekijä/Jukaisija",valueFn:function(e){return e.properties.author}}),a.createElement(d,{name:"Lisenssi",valueFn:function(e){return e.properties.licence}}))),a.createElement("tbody",null,r.map((function(e,t){var n=e.properties;return a.createElement("tr",{key:n.model.url},a.createElement("td",null,t+1),a.createElement("td",null,a.createElement("a",{href:n.registryItem.url,target:"_blank"},n.registryItem.name)),a.createElement("td",null,"[",a.createElement("a",{href:"../"+Object(c.a)(Object(m.i)(e)),target:"_blank"},"kartta"),"]"),a.createElement("td",null,n.registryItem.municipality),a.createElement("td",null,Object(m.k)(n.registryItem.type)),a.createElement("td",null,a.createElement("a",{href:n.model.url,target:"_blank"},n.model.name)),a.createElement("td",null,new Date(n.createdDate).toLocaleDateString("fi")),a.createElement("td",null,a.createElement("a",{href:n.authorUrl,target:"_blank"},n.author)),a.createElement("td",null,n.licenceUrl?a.createElement("a",{href:n.licenceUrl,target:"_blank"},n.licence):n.licence))})))))},p=function(){return a.createElement(a.Fragment,null,a.createElement("h2",{id:"Tietokannan-tarkoitus"},"Tietokannan tarkoitus"),a.createElement("p",null,"Museot, Museovirasto, Ahvenanmaan paikallishallinto ja harrastajat ovat julkaisseet 3D-malleja arkeologisista- ja rakennusperintökohteista"," ",a.createElement("a",{href:"https://sketchfab.com"},"Sketchfab"),"-sivustolla mutta niitä on vaikea löytää ja listata. Lisäksi ne eivät linkity helposti Museoviraston ja Ahvenanmaan paikallishallinnon rekistereihin tai niistä koostettuihin avoimiin paikkatietoaineistoihin joten malleja ei saa mitenkään helposti kartalle. Tämä tietokanta yrittää korjata tämän ongelman."),a.createElement("p",null,"Tässä tietokannassa Sketchfab-palvelussa oleva 3D-malli linkitetään Museoviraston ja Ahvenanmaan paikallishallinnon rekisterien kohteisiin ja sijaintiin kartalla. Tällöin tämän linkityksen avulla pystyy vastaamaan seuraaviin kysymyksiin:"),a.createElement("ol",null,a.createElement("li",null,"Onko rekisterin kohteella julkisesti saatavilla olevia 3D-malleja?"),a.createElement("li",null,"Mitä rekisterin kohdetta Sketchfabissa oleva 3D-malli esittää?"),a.createElement("li",null,"Missä sijainnissa kartalla 3D-mallin esittämä kohde on?")))};r.render(a.createElement((function(){var e=a.useState([]),t=e[0],n=e[1],r=a.useState(),o=r[0],c=r[1];return a.useEffect((function(){fetch("3d.json").then((function(e){return e.json()})).then((function(e){return e})).then((function(e){return n(e.features)}))}),[]),a.useEffect((function(){c(Object(m.h)(t))}),[t]),a.createElement(a.Fragment,null,a.createElement("div",{className:"jumbotron"},a.createElement("div",{className:"container"},a.createElement("h1",null,"Kulttuuriperinnön 3D-mallien tietokanta"),a.createElement("p",null,"Tämä tietokanta yrittää kerätä Suomen arkeologisesta kulttuuriperinnöstä ja rakennetuista kulttuuriympäristöistä tehtyjä 3D-malleja yhteen paikkaan helposti käytettävänä paikkatietoaineistona."),a.createElement("p",null,a.createElement("b",null,"Uusin lisäys tietokantaan:")," ",a.createElement("span",null,null==o?void 0:o.toLocaleDateString("fi")),a.createElement("br",null),a.createElement("b",null,"3D-malleja tietokannassa:")," ",a.createElement("span",null,t.length," kpl"),a.createElement("br",null)))),a.createElement("div",{className:"container"},a.createElement(l,null),a.createElement(p,null),a.createElement(u,null),a.createElement(i,null),a.createElement(s,null),a.createElement("h2",{id:"lisenssit"},"3D-mallien lisenssit"),a.createElement("p",null,"Tekijä on määritellyt Sketchfab-palvelussa mallille käyttölisenssin. Tämä tieto on mukana tietokannassa."),a.createElement("h2",{id:"yllapito"},"Ylläpito"),a.createElement("p",null,"Tätä tietokantaa ylläpitää Antti Kekki. Voit ilmoittaa uuden mallin tietokantaan lähettämällä sähköpostia osoitteeseen"," ",a.createElement("a",{href:"mailto:antti.kekki@gmail.com"},"antti.kekki@gmail.com"),". Myös yhteydeotot ja kyselyt samaan osoitteeseen."),a.createElement(k,{models:t})))}),null),document.getElementById("root"))},84:function(e,t,n){"use strict";n.d(t,"a",(function(){return a})),n.d(t,"b",(function(){return r}));var a=function(e){return"#x="+e[0]+";y="+e[1]},r=function(){var e=window.location.hash.replace("#","").replace("x=","").replace("y=","").split(";");if(2!==e.length)return null;var t=parseFloat(e[0]),n=parseFloat(e[1]);return isNaN(t)||isNaN(n)?null:[t,n]}}});