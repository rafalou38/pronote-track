export interface CleanNote {
  id: string;

  classe: string;
  grade: number;
  max: number;
  commentaire: string;

  fait: string;
  rendu?: string;

  color: string;
}

export interface Notes {
  avecDetailDevoir: boolean;
  avecDetailService: boolean;
  listeServices: ListeServices;
  listeDevoirs: ListeDevoirs;
}

interface ListeDevoirs {
  _T: number;
  V: Note[];
}

export interface Note {
  N: string;
  G: number;
  note: Bareme;
  bareme: Bareme;
  baremeParDefaut: Bareme;
  date: Bareme;
  service: Service;
  periode: Periode;
  ListeThemes: ListeThemes;
  moyenne: Bareme;
  estEnGroupe: boolean;
  noteMax: Bareme;
  noteMin: Bareme;
  commentaire: string;
  coefficient: number;
  estFacultatif: boolean;
  estBonus: boolean;
  estRamenerSur20: boolean;
}

interface ListeThemes {
  _T: number;
  V: ListeThemesV[];
}

interface ListeThemesV {
  L: string;
  N: string;
}

interface Bareme {
  _T: number;
  V: string;
}

interface Periode {
  _T: number;
  V: ListeThemesV;
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

interface ListeServices {
  _T: number;
  V: ListeServicesV[];
}

interface ListeServicesV {
  L: string;
  N: string;
  G: number;
  ordre: number;
  estServiceEnGroupe: boolean;
  moyEleve: Bareme;
  baremeMoyEleve: Bareme;
  baremeMoyEleveParDefaut: Bareme;
  moyClasse: Bareme;
  moyMin: Bareme;
  moyMax: Bareme;
  couleur: string;
}
