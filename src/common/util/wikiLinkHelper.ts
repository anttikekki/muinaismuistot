import { MuinaisjaannosTyyppi } from "../museovirasto.types"

export const getArkeologisenKulttuuriperinnonOpasLinkForType = (
  type: MuinaisjaannosTyyppi
): string | undefined => {
  switch (type) {
    case MuinaisjaannosTyyppi.alustenHylyt:
    case MuinaisjaannosTyyppi.kulkuväylät:
      return "http://akp.nba.fi/wiki;luokka;liikenne_ja_tiedonkulku"
    case MuinaisjaannosTyyppi.asuinpaikat:
      return "http://akp.nba.fi/wiki;luokka;asuminen_ja_oleskelu"
    case MuinaisjaannosTyyppi.hautapaikat:
      return "http://akp.nba.fi/wiki;luokka;hautaaminen"
    case MuinaisjaannosTyyppi.kirkkorakenteet:
    case MuinaisjaannosTyyppi.kulttiJaTarinapaikat:
      return "http://akp.nba.fi/wiki;luokka;uskonnon_harjoittaminen"
    case MuinaisjaannosTyyppi.puolustusvarustukset:
      return "http://akp.nba.fi/wiki;luokka;puolustus_ja_sodank%C3%A4ynti"
    case MuinaisjaannosTyyppi.raakaAineenHankintapaikat:
    case MuinaisjaannosTyyppi.työJaValmistuspaikat:
      return "http://akp.nba.fi/wiki;luokka;elinkeinot"
    case MuinaisjaannosTyyppi.tapahtumapaikat:
    case MuinaisjaannosTyyppi.taideMuistomerkit:
      return "http://akp.nba.fi/muut"
    case MuinaisjaannosTyyppi.teollisuuskohteet:
      return "http://akp.nba.fi/wiki;luokka;teollisuus"
    case MuinaisjaannosTyyppi.kivirakenteet:
    case MuinaisjaannosTyyppi.luonnonmuodostumat:
    case MuinaisjaannosTyyppi.löytöpaikat:
    case MuinaisjaannosTyyppi.puurakenteet:
    case MuinaisjaannosTyyppi.maarakenteet:
    case MuinaisjaannosTyyppi.muinaisjäännösryhmät:
    case MuinaisjaannosTyyppi.eiMääritelty:
    default:
      return undefined
  }
}

export const getArkeologisenKulttuuriperinnonOpasLinkForAhvenanmaaType = (
  type?: string
): string | undefined => {
  switch (type) {
    case "Uppgifter saknas":
    case "Tiedot puuttuvat":
      return undefined
    case "Agrara lämningar":
    case "Maanviljelyjäännökset":
      return "http://akp.nba.fi/wiki;luokka;elinkeinot"
    case "Bebyggelselämningar":
    case "Asutusjäännökset":
      return "http://akp.nba.fi/wiki;luokka;asuminen_ja_oleskelu"
    case "Befästningsanläggningar":
    case "Puolustusvarustukset":
      return "http://akp.nba.fi/wiki;luokka;puolustus_ja_sodank%C3%A4ynti"
    case "Boplatser":
    case "Asuinpaikat":
      return "http://akp.nba.fi/wiki;luokka;asuminen_ja_oleskelu"
    case "Gravar":
    case "Hautapaikat":
      return "http://akp.nba.fi/wiki;luokka;hautaaminen"
    case "Industriell-/produktionsplatser":
    case "Teollisuus- ja valmistuspaikat":
      return "http://akp.nba.fi/wiki;luokka;teollisuus"
    case "Jakt och fångst":
    case "Metsästys- ja pyyntijäännökset":
      return "http://akp.nba.fi/wiki;luokka;elinkeinot"
    case "Kommunikations-/maritima lämningar":
    case "Liikenne ja merellinen kulttuuriperintö":
      return "http://akp.nba.fi/wiki;luokka;liikenne_ja_tiedonkulku"
    case "Kult, offer och folktro":
    case "Kultti-, uhri- ja tarinapaikat":
      return "http://akp.nba.fi/wiki;luokka;uskonnon_harjoittaminen"
    case "Ristningar och minnesmärken":
    case "Hakkaukset ja muistomerkit":
      return "http://akp.nba.fi/muut"
    case "Övriga lämningar":
    case "Muut jäännökset":
    default:
      return undefined
  }
}

export const getArkeologisenKulttuuriperinnonOpasLinkForSubType = (
  subtype: string
): string | undefined => {
  switch (subtype) {
    case "aallonmurtajat":
      return "http://akp.nba.fi/wiki;satama"
    case "aidat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000033039
      return undefined
    case "ammusvarastot":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000030744
      return undefined
    case "asumuspainanteet":
      return "http://akp.nba.fi/wiki;asumuspainanne"
    case "ei määritelty":
      return undefined
    case "eräsijat":
      return "http://akp.nba.fi/wiki;er%C3%A4sija"
    case "haaksirikkopaikat":
      return "http://akp.nba.fi/wiki;hylky"
    case "hakkaukset":
      return "http://akp.nba.fi/wiki;kalliohakkaus"
    case "hangakset":
      return "http://akp.nba.fi/wiki;pyyntikuoppa"
    case "hautakammiot":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000021280
      return undefined
    case "hautakummut":
      return "http://akp.nba.fi/wiki;hautakumpu"
    case "hautaröykkiöt":
      return "http://akp.nba.fi/wiki;hautar%C3%B6ykki%C3%B6"
    case "hautasaaret":
      return "http://akp.nba.fi/wiki;hautasaari"
    case "hautausmaat":
      return "http://akp.nba.fi/wiki;hautausmaa"
    case "hiekanottokuopat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000015379
      return undefined
    case "hiilimiilut":
      return "http://akp.nba.fi/wiki;hiilimiilu"
    case "hirsivarustukset":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=2172
      return undefined
    case "hospitaalit ja sairaalat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000003668
      return undefined
    case "hylyt (metalli)":
    case "hylyt (puu)":
      return "http://akp.nba.fi/wiki;hylky"
    case "höyrysahat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000038079
      return "http://akp.nba.fi/wiki;h%C3%B6yrysaha"
    case "irtolöytöpaikat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000010181
      return undefined
    case "jatulintarhat":
      return "http://akp.nba.fi/wiki;jatulintarha"
    case "joukkohaudat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=10500008
      return undefined
    case "jätinkirkot":
      return "http://akp.nba.fi/wiki;j%C3%A4tinkirkko"
    case "kaivannot":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000039049
      return undefined
    case "kaiverrukset":
      return "http://akp.nba.fi/wiki;kalliohakkaus"
    case "kaivokset":
      return "http://akp.nba.fi/wiki;kaivos"
    case "kaivot":
      return "http://akp.nba.fi/wiki;kaivo"
    case "kalastuspaikat":
      return "http://akp.nba.fi/wiki;kalastuspaikka"
    case "kalkkiuunit":
      return "http://akp.nba.fi/wiki;kalkkiuuni"
    case "kalliomaalaukset":
      return "http://akp.nba.fi/wiki;kalliomaalaus"
    case "kalliopiirrokset":
      return "http://akp.nba.fi/wiki;kalliohakkaus"
    case "kanavat":
      return "http://akp.nba.fi/wiki;kanava"
    case "kapulatiet":
      return "http://akp.nba.fi/wiki;tie"
    case "karsikkopaikat":
      return "http://akp.nba.fi/wiki;karsikko"
    case "kartanot":
      return "http://akp.nba.fi/wiki;kartano"
    case "kaskiröykkiöt":
      return "http://akp.nba.fi/wiki;viljelyr%C3%B6ykki%C3%B6"
    case "kaupungit":
      return "http://akp.nba.fi/wiki;kaupunki"
    case "keittokuopat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000030703
      return undefined
    case "kellarit":
      return "http://akp.nba.fi/wiki;kellari"
    case "kellotapulinpaikat":
      return "http://akp.nba.fi/wiki;kirkko"
    case "kentät (gieddi)":
      return "http://akp.nba.fi/wiki;kentt%C3%A4"
    case "keramiikkatehtaat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000018168
      return undefined
    case "kestikievarit":
      return "http://akp.nba.fi/wiki;tie"
    case "kesähaudat":
      return "http://akp.nba.fi/wiki;hautasaari"
    case "kiinnitysrenkaat":
      return "http://akp.nba.fi/wiki;satama"
    case "kirkkohaudat":
      return "http://akp.nba.fi/wiki;kirkkohauta"
    case "kirkkomaat":
      return "http://akp.nba.fi/wiki;kirkkomaa"
    case "kirkonpaikat":
      return "http://akp.nba.fi/wiki;kirkko"
    case "kirkonrauniot":
      return "http://akp.nba.fi/wiki;kirkko"
    case "kiukaat":
      return "http://akp.nba.fi/wiki;kiuas"
    case "kiviaidat":
      return "http://akp.nba.fi/wiki;kiviaita"
    case "kivilatomukset":
      return "http://akp.nba.fi/wiki;hautalatomus"
    case "kivilinnat":
      return "http://akp.nba.fi/wiki;keskiaikainen-linna"
    case "kivimuurit":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000000482
      return undefined
    case "kivipöydät":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=90010019
      return undefined
    case "kivivallit":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000034725
      return undefined
    case "kivivarustukset":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=310010017
      return undefined
    case "kodanpohjat":
      return "http://akp.nba.fi/wiki;kotasija"
    case "kompassiruusut":
      return "http://akp.nba.fi/wiki;kivikompassi"
    case "kullanhuuhdonnan jäännökset":
      return "http://akp.nba.fi/wiki;kullanhuuhdontapaikka"
    case "kummelit":
      return "http://akp.nba.fi/wiki;merimerkki"
    case "kummut":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000007186
      return undefined
    case "kuninkaankartanot":
      return "http://akp.nba.fi/wiki;kuninkaankartano"
    case "kuopat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000040039
      return undefined
    case "kuparinsulattamot":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000015816
      return undefined
    case "kuppikivet":
      return "http://akp.nba.fi/wiki;kuppikivi"
    case "kylänpaikat":
      return "http://akp.nba.fi/wiki;kyl%C3%A4npaikka"
    case "käräjäpaikat":
      return "http://akp.nba.fi/wiki;k%C3%A4r%C3%A4j%C3%A4ympyr%C3%A4"
    case "käsittelypaikat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000026842
      return undefined
    case "kätköt":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=10010005
      return undefined
    case "laiturit":
      return "http://akp.nba.fi/wiki;satama"
    case "laivalatomukset":
      return "http://akp.nba.fi/wiki;laivalatomus"
    case "laivanrakennuspaikat":
      return "http://akp.nba.fi/wiki;laivanrakennuspaikka"
    case "lapinpadot":
      return "http://akp.nba.fi/wiki;kalastusrakenne"
    case "lapinrauniot":
      return "http://akp.nba.fi/wiki;lapinraunio"
    case "lasitehtaat":
      return "http://akp.nba.fi/wiki;lasitehdas"
    case "latomukset":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000037853
      return undefined
    case "liesikiveykset":
      return "http://akp.nba.fi/wiki;tulisija"
    case "liesilatomukset (árran)":
      return "http://akp.nba.fi/wiki;liesilatomus"
    case "linnakkeet":
      return "http://akp.nba.fi/wiki;linnake-1500-ja-1600-luku"
    case "linnamalmit":
      return "http://akp.nba.fi/wiki;keskiaikainen-linna"
    case "linnat":
      return "http://akp.nba.fi/wiki;keskiaikainen-linna"
    case "linnavuoret":
      return "http://akp.nba.fi/wiki;muinaislinna"
    case "linnoitukset":
      return "http://akp.nba.fi/wiki;bastionilinnoitus"
    case "linnustuspaikat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000026229
      return undefined
    case "louhokset":
      return "http://akp.nba.fi/wiki;louhos"
    case "luolat": {
      // Type: puolustusvarustukset
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000007754
      return "http://akp.nba.fi/wiki;louhittu-luola"

      // TODO different subtype link based on type
      // Type: luonnonmuodostumat
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000008403
      // return "http://akp.nba.fi/wiki;luola"
    }
    case "luostarinpaikat":
      return "http://akp.nba.fi/wiki;luostari"
    case "luotsi- ja tulliasemat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000037475
      return undefined
    case "lähteet":
      return "http://akp.nba.fi/wiki;uhril%C3%A4hde"
    case "maanmittauspisteet":
      return "http://akp.nba.fi/wiki;kalliohakkaus"
    case "maavallit":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000037044
      return undefined
    case "majakat":
      return "http://akp.nba.fi/wiki;merimerkki"
    case "manufaktuurit":
      return "http://akp.nba.fi/wiki;rautaruukki"
    case "markkinapaikat":
      return "http://akp.nba.fi/wiki;markkinapaikka"
    case "masuunit":
      return "http://akp.nba.fi/wiki;masuuni"
    case "merimerkit":
      return "http://akp.nba.fi/wiki;merimerkki"
    case "merkkikivet":
      return "http://akp.nba.fi/wiki;karsikko"
    case "merkkipuut":
      return "http://akp.nba.fi/wiki;karsikko"
    case "miekanhiontakivet":
      return "http://akp.nba.fi/wiki;miekanhiontakivi"
    case "muinaislinnat":
      return "http://akp.nba.fi/wiki;muinaislinna"
    case "muinaispellot":
      return "http://akp.nba.fi/wiki;muinaispelto"
    case "muistomerkit":
      return "http://akp.nba.fi/wiki;muistomerkki"
    case "muistopaikat":
      return "http://akp.nba.fi/wiki;karsikko"
    case "mäkituvat":
      return "http://akp.nba.fi/wiki;m%C3%A4kitupa"
    case "nauriskuopat":
      return "http://akp.nba.fi/wiki;nauriskuoppa"
    case "optiset lennätinasemat":
      return "http://akp.nba.fi/wiki;optinen-lenn%C3%A4tinasema"
    case "ortodoksikalmistot":
      return "http://akp.nba.fi/wiki;kyl%C3%A4kalmisto"
    case "painanteet":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=414010007
      return undefined
    case "painolastipaikat":
      return "http://akp.nba.fi/wiki;satama"
    case "pajat":
      return "http://akp.nba.fi/wiki;paja"
    case "palokuoppahaudat":
      return "http://akp.nba.fi/wiki;palokuoppahauta"
    case "panssariesteet":
      return "http://akp.nba.fi/wiki;panssarieste"
    case "paperitehtaat":
      return "http://akp.nba.fi/wiki;paperitehdas"
    case "pappilat":
      return "http://akp.nba.fi/wiki;pappila"
    case "piilopirtit":
      return "http://akp.nba.fi/wiki;piilopirtti"
    case "piiskauspetäjät":
      return "http://akp.nba.fi/wiki;rangaistuspaikka"
    case "pikiruukit":
      return "http://akp.nba.fi/wiki;pikiruukki"
    case "pirunpellot":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=152010017
      return undefined
    case "pitkospuut":
      return "http://akp.nba.fi/wiki;tie"
    case "polttokenttäkalmistot":
      return "http://akp.nba.fi/wiki;polttokentt%C3%A4kalmisto"
    case "polut":
      return "http://akp.nba.fi/wiki;polku"
    case "poroaidat":
      return "http://akp.nba.fi/wiki;poroerotuspaikka"
    case "portaat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000008024
      return undefined
    case "potaskauunit":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=165010045
      return undefined
    case "puistot":
      return "http://akp.nba.fi/wiki;puutarha"
    case "purnut":
      return "http://akp.nba.fi/wiki;purnu"
    case "puutarhat":
      return "http://akp.nba.fi/wiki;puutarha"
    case "pyyntikuopat":
      return "http://akp.nba.fi/wiki;pyyntikuoppa"
    case "pyyntitukikohdat":
      return "http://akp.nba.fi/wiki;tomtning"
    case "rajamerkit":
      return "http://akp.nba.fi/wiki;rajamerkki"
    case "rajamerkit, puu":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000020206
      return undefined
    case "rakkakuopat":
      return "http://akp.nba.fi/wiki;rakkakuoppa"
    case "rangaistuspaikat":
      return "http://akp.nba.fi/wiki;rangaistuspaikka"
    case "rantakivikot":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000008143
      return undefined
    case "ratapohjat":
      return "http://akp.nba.fi/wiki;rautatie"
    case "raudanvalmistuspaikat":
      return "http://akp.nba.fi/wiki;paja"
    case "rautaruukit":
      return "http://akp.nba.fi/wiki;rautaruukki"
    case "ristikivet":
      return "http://akp.nba.fi/wiki;karsikko"
    case "ruuhet":
      return "http://akp.nba.fi/wiki;hylky"
    case "ruumiskalmistot":
      return "http://akp.nba.fi/wiki;ruumishauta"
    case "ruttohautausmaat":
      return "http://akp.nba.fi/wiki;ruumishauta"
    case "ryssänuunit":
      return "http://akp.nba.fi/wiki;kiviuuni"
    case "röykkiöt":
      return "http://akp.nba.fi/wiki;hautar%C3%B6ykki%C3%B6"
    case "salpietarikeittimöt":
      return "http://akp.nba.fi/wiki;salpietarikeittim%C3%B6"
    case "satamat":
      return "http://akp.nba.fi/wiki;satama"
    case "savenottokuopat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000031564
      return undefined
    case "savupiiput":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000026640
      return undefined
    case "seidat":
      return "http://akp.nba.fi/wiki;seita"
    case "sillanpaikat":
      return "http://akp.nba.fi/wiki;silta"
    case "sillat":
      return "http://akp.nba.fi/wiki;silta"
    case "sirpalekivikasat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000024580
      return undefined
    case "sotilasleirit":
      return "http://akp.nba.fi/wiki;sotilasleiri"
    case "sudenkuopat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000035285
      return undefined
    case "suojahuoneet":
      return "http://akp.nba.fi/wiki;suojahuone"
    case "taistelukaivannot":
      return "http://akp.nba.fi/wiki;taisteluhauta"
    case "taistelupaikat":
      return "http://akp.nba.fi/wiki;taistelupaikka"
    case "talonpohjat":
      return "http://akp.nba.fi/wiki;talonpohja"
    case "tarhakalmistot":
      return "http://akp.nba.fi/wiki;tarha"
    case "tarinapaikat":
      return "http://akp.nba.fi/wiki;tarinapaikka"
    case "telakat":
      return "http://akp.nba.fi/wiki;laivanrakennuspaikka"
    case "terva- ja tärpättitehtaat":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000006190
      return undefined
    case "tervahaudat":
      return "http://akp.nba.fi/wiki;tervahauta"
    case "terveyslähteet":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=49500001
      return undefined
    case "tienpohjat":
      return "http://akp.nba.fi/wiki;tie"
    case "tiilenpolttouunit":
      return "http://akp.nba.fi/wiki;tiilenpolttouuni"
    case "tiilitehtaat":
      return "http://akp.nba.fi/wiki;tiilitehdas"
    case "tomtning-jäännökset":
      return "http://akp.nba.fi/wiki;tomtning"
    case "tornit":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000030383
      return undefined
    case "torpat":
      return "http://akp.nba.fi/wiki;torppa"
    case "tsasounanpaikat":
      return "http://akp.nba.fi/wiki;kirkko"
    case "tulipesäkkeet":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000023596
      return undefined
    case "tulisijat":
      return "http://akp.nba.fi/wiki;tulisija"
    case "tupasijat":
      return "http://akp.nba.fi/wiki;tupasija"
    case "tuulimyllyt":
      return "http://akp.nba.fi/wiki;tuulimylly"
    case "tykkiasemat":
      return "http://akp.nba.fi/wiki;tykkiasema"
    case "tykkitiet":
      return "http://akp.nba.fi/wiki;tie"
    case "tähystysasemat":
      return "http://akp.nba.fi/wiki;t%C3%A4hystysasema"
    case "uhrikivet":
      return "http://akp.nba.fi/wiki;uhrikivi"
    case "uhrilehdot":
      return "http://akp.nba.fi/wiki;tarinapaikka"
    case "uhripuut":
      return "http://akp.nba.fi/wiki;uhripuu"
    case "uittolaitteet":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000007844
      return undefined
    case "uunit":
      return "http://akp.nba.fi/wiki;uuni"
    case "valkamat":
      return "http://akp.nba.fi/wiki;satama"
    case "vallihaudat":
      return "http://akp.nba.fi/wiki;vallihauta"
    case "vallit":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000003529
      return undefined
    case "valonheitinasemat":
      return "http://akp.nba.fi/wiki;valonheitinasema"
    case "veneenvetopaikat":
      return "http://akp.nba.fi/wiki;kanava"
    case "vesimyllyt":
      return "http://akp.nba.fi/wiki;vesimylly"
    case "vesisahat":
      return "http://akp.nba.fi/wiki;vesisaha"
    case "viljelmät":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000007843
      return undefined
    case "viljelyröykkiöt":
      return "http://akp.nba.fi/wiki;viljelyr%C3%B6ykki%C3%B6"
    case "virkatalot":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000039153
      return undefined
    case "virstanpylväät":
      return "http://akp.nba.fi/wiki;tie"
    case "yhdyshaudat":
      return "http://akp.nba.fi/wiki;yhdyshauta"
    case "yksinäistalot":
      // https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=1000037140
      return undefined
    default:
      return undefined
  }
}

export const getArkeologisenKulttuuriperinnonOpasLinkForAhvenanmaaSubType = (
  subtype?: string | null
): string | undefined => {
  switch (subtype) {
    case "Uppgifter saknas": //tiedot puuttuvat
      return undefined
    case "artilleriställning": //tykkiasema
      return "http://akp.nba.fi/wiki;tykkiasema"
    case "avrättningsplats": //teloituspaikka
      return "http://akp.nba.fi/wiki;rangaistuspaikka"
    case "befästning": //linnoitus
      return "http://akp.nba.fi/wiki;kestolinnoite"
    case "begravningsplats": //hautausmaa
      return "http://akp.nba.fi/wiki;hautausmaa"
    case "bevakning/signalering": //tähystys/viestintä
      return "http://akp.nba.fi/wiki;t%C3%A4hystysasema"
    case "boplats": //asuinpaikka
      return "http://akp.nba.fi/wiki;kivikautinen-asuinpaikka"
    case "brokista": //kiviarkku
      return "http://akp.nba.fi/wiki;hirsiarkku"
    case "brott/täkt": //louhos/kaivanto
      return "http://akp.nba.fi/wiki;louhos"
    case "brunn/kallkälla": //kaivo/lähde
      return "http://akp.nba.fi/wiki;kaivo"
    case "bytomt/gårdstomt": //kylänpaikka/tilanpaikka
      return "http://akp.nba.fi/wiki;kyl%C3%A4npaikka"
    case "depofynd": //kätkö
      return undefined
    case "domarring": //käräjäkivet
      return "http://akp.nba.fi/wiki;k%C3%A4r%C3%A4j%C3%A4ympyr%C3%A4"
    case "flygstation": //lentoasema
      return "http://akp.nba.fi/wiki;lentokentt%C3%A4"
    case "fornborg": //muinaislinna
      return "http://akp.nba.fi/wiki;muinaislinna"
    case "fossil åker": //muinaispelto
      return "http://akp.nba.fi/wiki;muinaispelto"
    case "fältbefästning": //kenttälinnoitus
      return "http://akp.nba.fi/wiki;kentt%C3%A4linnoitteet"
    case "fångstgrop": //pyyntikuoppa
      return "http://akp.nba.fi/wiki;pyyntikuoppa"
    case "förtöjningsanordning": //kiinnityslaite
      return "http://akp.nba.fi/wiki;satama"
    case "förvaringsanläggning": //säilytyskuoppa
      return "http://akp.nba.fi/wiki;rakkakuoppa"
    case "grav": //hautapaikka
      return "http://akp.nba.fi/wiki;ruumishauta"
    case "gravhög": //hautakumpu
      return "http://akp.nba.fi/wiki;hautakumpu"
    case "gravröse": //hautaröykkiö
      return "http://akp.nba.fi/wiki;hautar%C3%B6ykki%C3%B6"
    case "gruvlämning": //kaivos
      return "http://akp.nba.fi/wiki;kaivos"
    case "gränsmärke": //rajamerkki
      return "http://akp.nba.fi/wiki;rajamerkki"
    case "hamnanläggning": //satamat
      return "http://akp.nba.fi/wiki;satama"
    case "husgrund": //rakennusjäännös
      return "http://akp.nba.fi/wiki;talonpohja"
    case "hägnad": //aita
      return "http://akp.nba.fi/wiki;kiviaita"
    case "höggravfält": //kumpukalmisto
      return "http://akp.nba.fi/wiki;hautakumpu"
    case "industrilämning": //teollisuuskohde
      return "http://akp.nba.fi/wiki;luokka;teollisuus"
    case "kastalgrund": //kastelli
      return "http://akp.nba.fi/wiki;keskiaikainen-linna"
    case "kyrka/kapell": //kirkko/kappeli
      return "http://akp.nba.fi/wiki;kirkko"
    case "labyrint": //jatulintarha
      return "http://akp.nba.fi/wiki;jatulintarha"
    case "minnesmärke": //muistomerkki
      return "http://akp.nba.fi/wiki;muistomerkki"
    case "offerplats": //uhripaikka
      return "http://akp.nba.fi/wiki;uhrikivi"
    case "ristning": //kalliohakkaus
      return "http://akp.nba.fi/wiki;kalliohakkaus"
    case "röjningsröse": //peltoröykkiö
      return "http://akp.nba.fi/wiki;viljelyr%C3%B6ykki%C3%B6"
    case "rösegravfält": //röykkiökalmisto
      return "http://akp.nba.fi/wiki;hautar%C3%B6ykki%C3%B6"
    case "sjömärke": //merimerkki
      return "http://akp.nba.fi/wiki;merimerkki"
    case "skeppssättning": //laivalatomus
      return "http://akp.nba.fi/wiki;laivalatomus"
    case "skärvstenshög": //palokiviröykkiö
      return "http://akp.nba.fi/wiki;pronssikautinen-asuinpaikka"
    case "slott": //linna
      return "http://akp.nba.fi/wiki;keskiaikainen-linna"
    case "stenkompass": //kompassiruusu
      return "http://akp.nba.fi/wiki;kivikompassi"
    case "stenugn": //kiviuuni
      return "http://akp.nba.fi/wiki;kiviuuni"
    case "tomtning": //tomtning-jäännös
      return "http://akp.nba.fi/wiki;tomtning"
    case "traditionsplats": //tarinapaikka
      return "http://akp.nba.fi/wiki;tarinapaikka"
    case "transport/förråd": //kuljetus/säilytys
      return "http://akp.nba.fi/wiki;kestolinnoite"
    case "treudd": //treudd
      return undefined // ??
    case "varv": //laivanrakennuspaikka
      return "http://akp.nba.fi/wiki;laivanrakennuspaikka"
    case "väglämning": //tiejäännös"
      return "http://akp.nba.fi/wiki;tie"
    default:
      return undefined
  }
}
