!function(e){function t(t){for(var a,r,s=t[0],u=t[1],o=t[2],c=0,k=[];c<s.length;c++)r=s[c],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&k.push(i[r][0]),i[r]=0;for(a in u)Object.prototype.hasOwnProperty.call(u,a)&&(e[a]=u[a]);for(m&&m(t);k.length;)k.shift()();return l.push.apply(l,o||[]),n()}function n(){for(var e,t=0;t<l.length;t++){for(var n=l[t],a=!0,s=1;s<n.length;s++){var u=n[s];0!==i[u]&&(a=!1)}a&&(l.splice(t--,1),e=r(r.s=n[0]))}return e}var a={},i={2:0},l=[];function r(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=e,r.c=a,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="";var s=window.webpackJsonp=window.webpackJsonp||[],u=s.push.bind(s);s.push=t,s=s.slice();for(var o=0;o<s.length;o++)t(s[o]);var m=u;l.push([517,0]),n()}({1:function(e,t,n){"use strict";var a,i,l,r;n.d(t,"b",(function(){return i})),n.d(t,"f",(function(){return l})),n.d(t,"a",(function(){return r})),n.d(t,"g",(function(){return o})),n.d(t,"e",(function(){return s})),n.d(t,"c",(function(){return u})),n.d(t,"d",(function(){return m})),function(e){e.Maastokartta="maastokartta",e.Taustakartta="taustakartta",e.Ortokuva="ortokuva"}(i||(i={})),function(e){e["Muinaisjäännökset_piste"]="Muinaisjäännökset_piste",e["Muinaisjäännökset_alue"]="Muinaisjäännökset_alue",e.Suojellut_rakennukset_piste="Suojellut_rakennukset_piste",e.Suojellut_rakennukset_alue="Suojellut_rakennukset_alue",e.RKY_alue="RKY_alue",e.RKY_piste="RKY_piste",e.RKY_viiva="RKY_viiva",e["Maailmanperintö_piste"]="Maailmanperintö_piste",e["Maailmanperintö_alue"]="Maailmanperintö_alue"}(l||(l={})),function(e){e.Fornminnen="Fornminnen"}(r||(r={}));var s,u,o=((a={})[l.Muinaisjäännökset_piste]=0,a[l.Muinaisjäännökset_alue]=1,a[l.Suojellut_rakennukset_piste]=2,a[l.Suojellut_rakennukset_alue]=3,a[l.RKY_alue]=4,a[l.RKY_piste]=5,a[l.RKY_viiva]=6,a[l.Maailmanperintö_piste]=7,a[l.Maailmanperintö_alue]=8,a);!function(e){e["eiMääritelty"]="ei määritelty",e.alustenHylyt="alusten hylyt",e.asuinpaikat="asuinpaikat",e.hautapaikat="hautapaikat",e.kirkkorakenteet="kirkkorakenteet",e.kivirakenteet="kivirakenteet",e["kulkuväylät"]="kulkuväylät",e.kulttiJaTarinapaikat="kultti- ja tarinapaikat",e.luonnonmuodostumat="luonnonmuodostumat",e["löytöpaikat"]="löytöpaikat",e.maarakenteet="maarakenteet",e["muinaisjäännösryhmät"]="muinaisjäännösryhmät",e.puolustusvarustukset="puolustusvarustukset",e.puurakenteet="puurakenteet",e.raakaAineenHankintapaikat="raaka-aineen hankintapaikat",e.taideMuistomerkit="taide, muistomerkit",e.tapahtumapaikat="tapahtumapaikat",e.teollisuuskohteet="teollisuuskohteet",e["työJaValmistuspaikat"]="työ- ja valmistuspaikat"}(s||(s={})),function(e){e.moniperiodinen="moniperiodinen",e.esihistoriallinen="esihistoriallinen",e.kivikautinen="kivikautinen",e.varhaismetallikautinen="varhaismetallikautinen",e.pronssikautinen="pronssikautinen",e.rautakautinen="rautakautinen",e.keskiaikainen="keskiaikainen",e.historiallinen="historiallinen",e.moderni="moderni",e.ajoittamaton="ajoittamaton",e["eiMääritelty"]="ei määritelty"}(u||(u={}));var m={moniperiodinen:"",esihistoriallinen:"8600 eaa. - 1200 jaa.",kivikautinen:"8600 – 1500 eaa.",varhaismetallikautinen:"1500 eaa. - 200 jaa.",pronssikautinen:"1700 – 500 eaa.",rautakautinen:"500 eaa. - 1200 jaa.",keskiaikainen:"1200 - 1570 jaa.",historiallinen:"1200 jaa. -",moderni:"1800 jaa -",ajoittamaton:"","ei määritelty":""}},26:function(e,t,n){"use strict";n.d(t,"c",(function(){return r})),n.d(t,"g",(function(){return s})),n.d(t,"f",(function(){return u})),n.d(t,"h",(function(){return o})),n.d(t,"a",(function(){return m})),n.d(t,"j",(function(){return c})),n.d(t,"e",(function(){return k})),n.d(t,"d",(function(){return p})),n.d(t,"i",(function(){return f})),n.d(t,"b",(function(){return d})),n.d(t,"k",(function(){return h})),n.d(t,"l",(function(){return E}));var a=n(1),i=function(e){return"kiinteä muinaisjäännös"===E(e.attributes.laji)},l=function(e){return"muu kulttuuriperintökohde"===E(e.attributes.laji)},r=function(e){switch(e.layerName){case a.f.Muinaisjäännökset_piste:case a.f.Muinaisjäännökset_alue:case a.f.RKY_alue:case a.f.RKY_piste:case a.f.RKY_viiva:case a.f.Suojellut_rakennukset_piste:case a.f.Suojellut_rakennukset_alue:return E(e.attributes.kohdenimi);case a.f.Maailmanperintö_piste:case a.f.Maailmanperintö_alue:return E(e.attributes.Nimi);case a.a.Fornminnen:return E(e.attributes.Namn)||E(e.attributes["Fornlämnings ID"])}},s=function(e){switch(e.layerName){case a.f.Muinaisjäännökset_piste:if(i(e))return"Kiinteä muinaisjäännös";if(l(e))return"Muu kulttuuriperintökohde";break;case a.f.Muinaisjäännökset_alue:if(i(e))return"Kiinteä muinaisjäännös (alue)";if(l(e))return"Muu kulttuuriperintökohde (alue)";break;case a.f.RKY_alue:case a.f.RKY_piste:case a.f.RKY_viiva:return"Rakennettu kulttuuriympäristö";case a.f.Maailmanperintö_piste:case a.f.Maailmanperintö_alue:return"Maailmanperintökohde";case a.f.Suojellut_rakennukset_piste:case a.f.Suojellut_rakennukset_alue:return"Rakennusperintökohde";case a.a.Fornminnen:return"Ahvenanmaan muinaisjäännösrekisterin kohde";default:return}},u=function(e,t){void 0===t&&(t=!1);var n=t?"_3d":"";switch(e.layerName){case a.f.Muinaisjäännökset_piste:if(i(e))return"images/muinaisjaannos_kohde"+n+".png";if(l(e))return"images/muu_kulttuuriperintokohde_kohde"+n+".png";break;case a.f.Muinaisjäännökset_alue:if(i(e))return"images/muinaisjaannos_alue.png";if(l(e))return"images/muu-kulttuuriperintokohde-alue.png";break;case a.f.RKY_alue:return"images/rky_alue.png";case a.f.RKY_viiva:return"images/rky_viiva.png";case a.f.RKY_piste:return"images/rky_piste.png";case a.f.Maailmanperintö_alue:return"images/maailmanperinto_alue.png";case a.f.Maailmanperintö_piste:return"images/maailmanperinto_piste.png";case a.f.Suojellut_rakennukset_alue:return"images/rakennusperintorekisteri_alue.png";case a.f.Suojellut_rakennukset_piste:return"images/rakennusperintorekisteri_rakennus.png";case a.a.Fornminnen:return"images/ahvenanmaa_muinaisjaannos.png";default:return}},o=function(e){switch(e){case a.f.Muinaisjäännökset_piste:return["images/muinaisjaannos_kohde.png","images/muu_kulttuuriperintokohde_kohde.png"];case a.f.Muinaisjäännökset_alue:return["images/muinaisjaannos_alue.png","images/muu-kulttuuriperintokohde-alue.png"];case a.f.RKY_alue:return["images/rky_alue.png"];case a.f.RKY_viiva:return["images/rky_viiva.png"];case a.f.RKY_piste:return["images/rky_piste.png"];case a.f.Maailmanperintö_alue:return["images/maailmanperinto_alue.png"];case a.f.Maailmanperintö_piste:return["images/maailmanperinto_piste.png"];case a.f.Suojellut_rakennukset_alue:return["images/rakennusperintorekisteri_alue.png"];case a.f.Suojellut_rakennukset_piste:return["images/rakennusperintorekisteri_rakennus.png"];case a.a.Fornminnen:return["images/ahvenanmaa_muinaisjaannos.png"]}},m=function(e){switch(e.layerName){case a.f.Muinaisjäännökset_piste:case a.f.Muinaisjäännökset_alue:case a.f.RKY_alue:case a.f.RKY_viiva:case a.f.RKY_piste:case a.f.Maailmanperintö_alue:case a.f.Maailmanperintö_piste:case a.f.Suojellut_rakennukset_alue:case a.f.Suojellut_rakennukset_piste:case a.a.Fornminnen:return e.attributes.OBJECTID}},c=function(e,t){var n;switch(e.layerName){case a.f.Muinaisjäännökset_piste:case a.f.Muinaisjäännökset_alue:n=e.attributes.mjtunnus}return t?t.filter((function(t){return t.registryItem.type===e.layerName})).filter((function(e){return e.registryItem.id.toString()===n})):[]},k=function(e){switch(e.layerName){case a.f.Muinaisjäännökset_piste:case a.f.Muinaisjäännökset_alue:case a.f.Suojellut_rakennukset_alue:case a.f.Suojellut_rakennukset_piste:return"https://"+e.attributes.url;case a.f.RKY_alue:case a.f.RKY_viiva:case a.f.RKY_piste:return e.attributes.url;case a.f.Maailmanperintö_alue:case a.f.Maailmanperintö_piste:return function(e){var t=e.attributes.URL;if(t.startsWith("http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa")){var n=t.indexOf("#"),a="";-1!==n&&(a=t.substring(n)),t="https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa"+a}return t}(e);case a.a.Fornminnen:return function(e){switch(e.attributes["Fornlämnings ID"].substring(0,2)){case"Br":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/BR%c3%84ND%c3%96.pdf";case"Ec":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/ECKER%c3%96.pdf";case"Fö":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/F%c3%96GL%c3%96.pdf";case"Fi":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/FINSTR%c3%96M.pdf";case"Ge":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/GETA.pdf";case"Ha":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/HAMMARLAND.pdf";case"Jo":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/JOMALA.pdf";case"Kö":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/K%c3%96KAR.pdf";case"Ku":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/KUMLINGE.pdf";case"Le":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/LEMLAND.pdf";case"Lu":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/LUMPARLAND.pdf";case"Ma":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/MARIEHAMN.pdf";case"Sa":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/SALTVIK.pdf";case"So":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/SOTTUNGA.pdf";case"Su":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/SUND.pdf";case"Vå":return"http://www.kulturarv.ax/wp-content/uploads/2014/11/V%c3%85RD%c3%96.pdf"}}(e)}},p=function(e){switch(e.layerName){case a.f.Muinaisjäännökset_piste:case a.f.Muinaisjäännökset_alue:return"Muinaisjäännösrekisteristä";case a.f.RKY_alue:case a.f.RKY_viiva:case a.f.RKY_piste:return"rky.fi rekisteristä";case a.f.Maailmanperintö_alue:case a.f.Maailmanperintö_piste:return"Museoviraston sivuilta";case a.f.Suojellut_rakennukset_alue:case a.f.Suojellut_rakennukset_piste:return"rakennusperintörekisteristä";case a.a.Fornminnen:return"Ahvenamaan muinaisjäännösrekisteri"}},f=function(e){switch(e){case a.f.Muinaisjäännökset_piste:case a.f.Muinaisjäännökset_alue:return"Muinaisjäännösrekisteri";case a.f.RKY_alue:case a.f.RKY_viiva:case a.f.RKY_piste:return"Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt";case a.f.Maailmanperintö_alue:case a.f.Maailmanperintö_piste:return"Maailmanperintökohteet";case a.f.Suojellut_rakennukset_alue:case a.f.Suojellut_rakennukset_piste:return"Rakennusperintörekisteri";case a.a.Fornminnen:return"Ahvenamaan muinaisjäännösrekisteri"}},d=function(e){switch(e.geometryType){case"esriGeometryPolygon":return e.geometry.rings[0][0];case"esriGeometryPoint":return[e.geometry.x,e.geometry.y];case"esriGeometryPolyline":return e.geometry.paths[0][0]}},h=function(e){return a.d[e]},E=function(e){if(null==e)return"";if("null"===(e=e.trim()).toLowerCase())return"";for(;","===e.substr(e.length-1,1);)e=e.substring(0,e.length-1).trim();return e}},517:function(e,t,n){"use strict";n.r(t);n(211),n(253),n(254);var a=n(0),i=n(174),l=n(26);i.render(a.createElement(a.Fragment,null,a.createElement("div",{className:"jumbotron"},a.createElement("div",{className:"container"},a.createElement("h1",null,"Kulttuuriperinnön 3D-mallien tietokanta"),a.createElement("p",null,"Tämä tietokanta yrittää kerätä Suomen arkeologisesta kulttuuriperinnöstä ja rakennetuista kulttuuriympäristöistä tehtyjä 3D-malleja yhteen paikkaan helposti käytettävänä paikkatietoaineistona."))),a.createElement("div",{className:"container"},a.createElement("h2",null,"Sisällys"),a.createElement("ol",null,a.createElement("li",null,a.createElement("a",{href:"#tarkoitus"},"Tietokannan tarkoitus")),a.createElement("li",null,a.createElement("a",{href:"#rekisterit"},"Rekisterit joiden kohteisiin 3D-malleja on linkitetty")),a.createElement("li",null,a.createElement("a",{href:"#rakenne"},"Aineiston rakenne")),a.createElement("li",null,a.createElement("a",{href:"#lataus"},"Aineiston lataus")),a.createElement("li",null,a.createElement("a",{href:"#lisenssit"},"3D-mallien lisenssit")),a.createElement("li",null,a.createElement("a",{href:"#yllapito"},"Ylläpito")),a.createElement("li",null,a.createElement("a",{href:"#listaus"},"Aineston listaus"))),a.createElement("h2",{id:"Tietokannan-tarkoitus"},"Tietokannan tarkoitus"),a.createElement("p",null,"Museot, Museovirasto, Ahvenanmaan paikallishallinto ja harrastajat ovat julkaisseet 3D-malleja arkeologisista- ja rakennusperintökohteista"," ",a.createElement("a",{href:"https://sketchfab.com"},"Sketchfab"),"-sivustolla mutta niitä on vaikea löytää ja listata. Lisäksi ne eivät linkity helposti Museoviraston ja Ahvenanmaan paikallishallinnon rekistereihin tai niistä koostettuihin avoimiin paikkatietoaineistoihin joten malleja ei saa mitenkään helposti kartalle. Tämä tietokanta yrittää korjata tämän ongelman."),a.createElement("p",null,"Tässä tietokannassa Sketchfab-palvelussa oleva 3D-malli linkitetään Museoviraston ja Ahvenanmaan paikallishallinnon rekisterien kohteisiin ja sijaintiin kartalla. Tällöin tämän linkityksen avulla pystyy vastaamaan seuraaviin kysymyksiin:"),a.createElement("ol",null,a.createElement("li",null,"Onko rekisterin kohteella julkisesti saatavilla olevia 3D-malleja?"),a.createElement("li",null,"Mitä rekisterin kohdetta Sketchfabissa oleva 3D-malli esittää?"),a.createElement("li",null,"Missä sijainnissa kartalla 3D-mallin esittämä kohde on?")),a.createElement("h2",{id:"rekisterit"},"Rekisterit joiden kohteisiin 3D-malleja on linkitetty"),a.createElement("b",null,"Museovirasto"),a.createElement("ul",null,a.createElement("li",null,a.createElement("a",{href:"https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx",target:"_blank"},"Muinaisjäännösrekisteri")),a.createElement("li",null,a.createElement("a",{href:"https://www.kyppi.fi/palveluikkuna/rapea/read/asp/r_default.aspx",target:"_blank"},"Rakennusperintörekisteri")),a.createElement("li",null,a.createElement("a",{href:"https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa",target:"_blank"},"Maailmanperintökohteet")),a.createElement("li",null,a.createElement("a",{href:"http://www.rky.fi/",target:"_blank"},"Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt"))),a.createElement("b",null,"Ahvenamaan paikallishallinto"),a.createElement("ul",null,a.createElement("li",null,a.createElement("a",{href:"http://www.regeringen.ax/kulturarv/arkeologi-fornlamningar/fornlamningsregistret",target:"_blank"},"Muinaisjäännösrekisteri"))),a.createElement("h2",{id:"rakenne"},"Aineiston rakenne"),a.createElement("p",null,"Tietokanta sisältää seuraavat tiedot"," ",a.createElement("a",{href:"https://en.wikipedia.org/wiki/GeoJSON",target:"_blank"},"GeoJSON")," ","muodossa:"),a.createElement("table",{className:"table table-striped"},a.createElement("thead",null,a.createElement("tr",null,a.createElement("th",null,"Kentän nimi"),a.createElement("th",null,"Tieto"),a.createElement("th",null,"Esimerkki arvosta/arvolista"),a.createElement("th",null,"Tyyppi"))),a.createElement("tbody",null,a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.geometry.type")),a.createElement("td",null,"Kohteen"," ",a.createElement("a",{href:"https://en.wikipedia.org/wiki/GeoJSON",target:"_blank"},"GeoJSON")," ","geometrian tyyppi"),a.createElement("td",null,"Tällä hetkellä aina ",a.createElement("code",null,"Point")),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.geometry.coordinates")),a.createElement("td",null,"Kohteen koordinaatit"," ",a.createElement("a",{href:"https://epsg.io/3067",target:"_blank"},"EPSG:3067")," ","projektiossa muodossa ",a.createElement("code",null,"[x, y]")," eli"," ",a.createElement("code",null,"[longitude, latitude]"),". Tämä on aina sama kuin kohteen koordinaatit Museoviraston tai Ahvenanmaan paikallishallinnon rekisterissä.",a.createElement("br",null),a.createElement("br",null),"Tämä EPSG:3067 projektio on dokumentoitu myös GeoJSON tiedostoston"," ",a.createElement("code",null,"crs"),"-kentässä:",a.createElement("br",null),a.createElement("code",null,'"crs": {\n    "type": "EPSG",\n    "properties": {\n      "code": 3067\n    }\n  },')),a.createElement("td",null,a.createElement("code",null,"[393155.45770000014, 6680517.1086]")),a.createElement("td",null,"Taulukko numeroita")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.registryItem.name")),a.createElement("td",null,"Kohteen nimi Museoviraston tai Ahvenanmaan paikallishallinnon rekisterissä"),a.createElement("td",null,"Tukikohta IV:10 (Kivikko)"),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.registryItem.type")),a.createElement("td",null,"Kohteen tyyppi Museoviraston tai Ahvenanmaan paikallishallinnon rekisterissä"),a.createElement("td",null,"Tyypin nimi tulee rekisterin avoimen paikkatietoaineiston kartttatasosta. ",a.createElement("br",null),a.createElement("br",null),"Museoviraston aineistot:",a.createElement("ul",null,a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/0"},"Muinaisjäännökset_piste")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/1"},"Muinaisjäännökset_alue")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/2"},"Suojellut_rakennukset_piste")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/3"},"Suojellut_rakennukset_alue")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/4"},"RKY_alue")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/5"},"RKY_piste")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/6"},"RKY_viiva")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/7"},"Maailmanperintö_piste")),a.createElement("li",null,a.createElement("a",{href:"http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/8"},"Maailmanperintö_alue"))),a.createElement("br",null),"Ahvenanmaan paikallishallinnon aineisto:",a.createElement("ul",null,a.createElement("li",null,a.createElement("a",{href:"https://www.kartor.ax/datasets/fornminnen"},"Fornminnen")))),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.registryItem.id")),a.createElement("td",null,"Kohteen id Museoviraston tai Ahvenanmaan paikallishallinnon rekisterissä"),a.createElement("td",null,"1000011245"),a.createElement("td",null,"Numero")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.registryItem.url")),a.createElement("td",null,"Linkki kohteen tietoihin Museoviraston tai Ahvenanmaan paikallishallinnon rekisterissä"),a.createElement("td",null,a.createElement("a",{href:"https://www.kyppi.fi/to.aspx?id=112.100001124",target:"_blank"},"https://www.kyppi.fi/to.aspx?id=112.100001124")),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.registryItem.municipality")),a.createElement("td",null,"Kohteen kunta"),a.createElement("td",null,"Helsinki"),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.model.name")),a.createElement("td",null,"3D-mallin nimi. Tämä tulisi olla tässä suomeksi vaikka mallin nimi olisi Sketchfabissa englanniksi."),a.createElement("td",null,"Syvä juoksuhauta"),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.model.url")),a.createElement("td",null,"3D-mallin osoite Sketchfab-palvelussa."),a.createElement("td",null,a.createElement("a",{href:"https://sketchfab.com/models/bd9110f1a2174eef9c4b1ee02111b4bd",target:"_blank"},"https://sketchfab.com/models/bd9110f1a2174eef9c4b1ee02111b4bd")),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.author")),a.createElement("td",null,"3D-mallin tekijän nimi."),a.createElement("td",null),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.licence")),a.createElement("td",null,"3D-mallin lisenssin nimi."),a.createElement("td",null,"CC BY 4.0"),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.licenceUrl")),a.createElement("td",null,"Osoite 3D-mallin lisenssiin."),a.createElement("td",null,a.createElement("a",{href:"https://creativecommons.org/licenses/by/4.0/deed.fi",target:"_blank"},"https://creativecommons.org/licenses/by/4.0/deed.fi")),a.createElement("td",null,"Merkkijono")),a.createElement("tr",null,a.createElement("td",null,a.createElement("code",null,"properties.createdDate")),a.createElement("td",null,"Päivämäärä jolloin 3D-malli on lisätty tähän tietokantaan. Tämän perusteella voi etsiä uusimman päivämäärän eli päivän jolloin tietokantaa on viiemksi päivitetty."),a.createElement("td",null,"2020-03-11"),a.createElement("td",null,a.createElement("a",{href:"https://en.wikipedia.org/wiki/ISO_8601",target:"_blank"},"ISO 8601"))))),a.createElement("p",null,"Esimerkki GeoJSON-featuresta:"),a.createElement("pre",null,a.createElement("code",null,'    {\n      "type": "Feature",\n      "geometry": {\n        "type": "Point",\n        "coordinates": [393155.45770000014, 6680517.1086]\n      },\n      "properties": {\n        "registryItem": {\n          "name": "Tukikohta IV:10 (Kivikko)",\n          "id": 1000011245,\n          "type": "Muinaisjäännökset_piste",\n          "url": "https://www.kyppi.fi/to.aspx?id=112.1000011245",\n          "municipality": "Helsinki"\n        },\n        "model": {\n          "name": "Syvä juoksuhauta",\n          "url": "https://sketchfab.com/models/bd9110f1a2174eef9c4b1ee02111b4bd"\n        },\n        "author": "Antti Kekki",\n        "licence": "CC BY 4.0",\n        "licenceUrl": "https://creativecommons.org/licenses/by/4.0/deed.fi",\n        "createdDate": "2020-03-11"\n      }\n    }')),a.createElement("h2",{id:"lataus"},"Aineiston lataus"),a.createElement("p",null,"Tietokanta on koostettu"," ",a.createElement("a",{href:"https://en.wikipedia.org/wiki/GeoJSON",target:"_blank"},"GeoJSON")," ","muodossa, jolloin sitä helppo käyttää eri paikkatietotyökaluilla ja karttasovelluskehyksillä (kuten"," ",a.createElement("a",{href:"https://openlayers.org/en/latest/examples/geojson.html",target:"_blank"},"OpenLayers")," ","ja"," ",a.createElement("a",{href:"https://leafletjs.com/examples/geojson/",target:"_blank"},"Leaflet"),")."),a.createElement("div",{className:"well"},"Lataa aineisto:"," ",a.createElement("a",{href:"https://muinaismuistot.info/3d/3d.json"},"https://muinaismuistot.info/3d/3d.json")),a.createElement("p",null,"Aineistoa voi myös käyttää suoraan yllä olevasta osoitteesta (eli esim. että selaimessa avautuva karttasovellus lataa aineiston suoraan tältä sivulta). Palvelin palauttaa ladattaessa aineiston"," ",a.createElement("a",{href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag",target:"_blank"},"Etag"),"-otsakkeen joten ainakin selaimet osaavat ladata aineistosta aina uusimman version. Lisäksi palvelin palauttaa"," ",a.createElement("code",null,"access-control-allow-origin: *")," ",a.createElement("a",{href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS",target:"_blank"},"CORS"),"-otsakkeen joten selain pystyy käyttämään aineistoa toisesta domain-osoitteesta."),a.createElement("h2",{id:"lisenssit"},"3D-mallien lisenssit"),a.createElement("p",null,"Tekijä on määritellyt Sketchfab-palvelussa mallille käyttölisenssin. Tämä tieto on mukana tietokannassa."),a.createElement("h2",{id:"yllapito"},"Ylläpito"),a.createElement("p",null,"Tätä tietokantaa ylläpitää Antti Kekki. Voit ilmoittaa uuden mallin tietokantaan lähettämällä sähköpostia osoitteeseen"," ",a.createElement("a",{href:"mailto:antti.kekki@gmail.com"},"antti.kekki@gmail.com"),". Myös yhteydeotot ja kyselyt samaan osoitteeseen."),a.createElement("h2",{id:"listaus"},"Aineston listaus"),a.createElement("p",null,"Tässä listattu koko tietokannan sisältö. Kaikki tämän taulukon tiedot löytyvät suoraan tietokannasta. Kohteen nimi on linkki suoraan Museoviraston ja Ahvenanmaan paikallishallinnon rekisteriin. Mallin nimi on linkki 3D-malliin"," ",a.createElement("a",{href:"https://sketchfab.com",target:"_blank"},"Sketchfab"),"-sivustolla."),a.createElement("p",null,"Tämän aineston näkee kartalla"," ",a.createElement("a",{href:"https://muinaismuistot.info",target:"_blank"},"muinaismuistot.info")," ","-sivustolta."),a.createElement((function(){var e=a.useState([]),t=e[0],n=e[1];return a.useEffect((function(){fetch("3d.json").then((function(e){return e.json()})).then((function(e){return e})).then((function(e){return n(e.features)}))}),[]),a.createElement("table",{className:"table table-striped"},a.createElement("thead",null,a.createElement("tr",null,a.createElement("th",null,"#"),a.createElement("th",null,"Kohde"),a.createElement("th",null,"Kunta"),a.createElement("th",null,"Rekisteri"),a.createElement("th",null,"Mallin nimi"),a.createElement("th",null,"Lisätty"),a.createElement("th",null,"Tekijä/Jukaisija"),a.createElement("th",null,"Lisenssi"))),a.createElement("tbody",null,t.map((function(e,t){var n=e.properties;return a.createElement("tr",{key:t},a.createElement("td",null,t+1),a.createElement("td",null,a.createElement("a",{href:n.registryItem.url,target:"_blank"},n.registryItem.name)),a.createElement("td",null,n.registryItem.municipality),a.createElement("td",null,Object(l.i)(n.registryItem.type)),a.createElement("td",null,a.createElement("a",{href:n.model.url,target:"_blank"},n.model.name)),a.createElement("td",null,new Date(n.createdDate).toLocaleDateString("fi")),a.createElement("td",null,n.author),a.createElement("td",null,n.licenceUrl?a.createElement("a",{href:n.licenceUrl,target:"_blank"},n.licence):n.licence))}))))}),null))),document.getElementById("root"))}});