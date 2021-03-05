import {
  MaalinnoitusKohdetyyppi,
  MaalinnoitusYksikko,
  MaalinnoitusYksikkoLaji,
  MaalinnoitusRajaustyyppi
} from "../types"

export const getNovisionLinkForMaalinnoitusRajaustyyppi = (
  rajaus: MaalinnoitusRajaustyyppi | null
): string | undefined => {
  switch (rajaus) {
    case MaalinnoitusRajaustyyppi.Puolustusasema:
    case MaalinnoitusRajaustyyppi.Tukikohta:
      return "http://www.novision.fi/viapori/system.htm"
    default:
      return undefined
  }
}

export const getNovisionLinkForMaalinnoitusKohdetyyppi = (
  kohde: MaalinnoitusKohdetyyppi | null
): string | undefined => {
  switch (kohde) {
    case MaalinnoitusKohdetyyppi.Asema:
      return "http://www.novision.fi/viapori/maarintama.htm"
    case MaalinnoitusKohdetyyppi.Tykkipatteri:
      return "http://www.novision.fi/viapori/tykkipatterit.htm"
    case MaalinnoitusKohdetyyppi.Tykkitie:
      return "http://www.novision.fi/viapori/liikenne.htm"
    case MaalinnoitusKohdetyyppi.Luola:
      return "http://www.novision.fi/viapori/luolat.htm"
    default:
      return undefined
  }
}

export const getNovisionLinkForMaalinnoitusYksikkoLaji = (
  laji: MaalinnoitusYksikkoLaji | null
): string | undefined => {
  switch (laji) {
    case MaalinnoitusYksikkoLaji.Asema:
      return "http://www.novision.fi/viapori/maarintama.htm"
    case MaalinnoitusYksikkoLaji.Tykkipatteri:
      return "http://www.novision.fi/viapori/tykkipatterit.htm"
    case MaalinnoitusYksikkoLaji.Tykkitie:
      return "http://www.novision.fi/viapori/liikenne.htm"
    case MaalinnoitusYksikkoLaji.Muu:
    default:
      return undefined
  }
}

export const getNovisionLinkForMaalinnoitusYksikko = (
  yksikko: MaalinnoitusYksikko | null
): string | undefined => {
  switch (yksikko) {
    case MaalinnoitusYksikko.Juoksuhauta:
      return "http://www.novision.fi/viapori/haudat.htm"
    case MaalinnoitusYksikko.Luola:
      return "http://www.novision.fi/viapori/luolat.htm"
    case MaalinnoitusYksikko.Suojahuone:
      return "http://www.novision.fi/viapori/suojahuoneet.htm"
    case MaalinnoitusYksikko.Tulipesäke:
      return "http://www.novision.fi/viapori/asemat.htm"
    case MaalinnoitusYksikko.Tykkiasema:
      return "http://www.novision.fi/viapori/tykkipatterit.htm"
    case MaalinnoitusYksikko.Suojavalli:
      return "http://www.novision.fi/viapori/esteet.htm"
    case MaalinnoitusYksikko.Jalusta:
    case MaalinnoitusYksikko.Kuoppa:
    case MaalinnoitusYksikko.Rakenne:
    default:
      return undefined
  }
}
