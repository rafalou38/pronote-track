export interface Notes {
  avecDetailDevoir: boolean;
  avecDetailService: boolean;
  listeDevoirs: ValueList;
  page: Page;
}
interface ValueList {
  _T: number;
  V: Note[];
}

interface Note {
  N: string;
  G: number;
  note: ValueString;
  bareme: ValueString;
  baremeParDefaut: ValueString;
  date: ValueString;
  service: Service;
  periode: Periode;
  //   ListeThemes: ValueList;
}

interface ValueString {
  _T: number;
  V: string;
}

interface Periode {
  _T: number;
  V: PeriodeV;
}

interface PeriodeV {
  L: "Semestre 1" | "Semestre 2";
  N: string;
}

interface Service {
  _T: number;
  V: ServiceV;
}

interface ServiceV {
  L: string;
  N: string;
  G: number;
  couleur: string;
}

interface Page {
  periode: Periode;
}
