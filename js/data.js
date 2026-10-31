const CLE = 'arbre-genealogique:v1';

export const ARBRE_PAR_DEFAUT = [
  {
    id: 'moi',
    data: { gender: 'M', prenom: 'Moi', nom: '', naissance: '', deces: '' },
    rels: { parents: [], spouses: [], children: [] },
  },
];

export function charger() {
  try {
    const texte = localStorage.getItem(CLE);
    if (!texte) return structuredClone(ARBRE_PAR_DEFAUT);
    const donnees = JSON.parse(texte);
    return estArbreValide(donnees) ? normaliser(donnees) : structuredClone(ARBRE_PAR_DEFAUT);
  } catch (erreur) {
    console.error('Lecture du localStorage impossible :', erreur);
    return structuredClone(ARBRE_PAR_DEFAUT);
  }
}

export function sauvegarder(donnees) {
  try {
    localStorage.setItem(CLE, JSON.stringify(donnees));
    return true;
  } catch (erreur) {
    console.error('Sauvegarde impossible :', erreur);
    return false;
  }
}

export function effacer() {
  localStorage.removeItem(CLE);
}

const TYPES_DE_LIENS = ['parents', 'spouses', 'children'];

export function estArbreValide(donnees) {
  if (!Array.isArray(donnees) || donnees.length === 0) return false;

  const ids = new Set(donnees.map((p) => p?.id));
  if (ids.size !== donnees.length) return false;

  return donnees.every((p) => {
    if (typeof p.id !== 'string' || typeof p.data !== 'object' || p.data === null) return false;
    if (p.data.gender !== 'M' && p.data.gender !== 'F') return false;
    if (typeof p.rels !== 'object' || p.rels === null) return false;
    return TYPES_DE_LIENS.every((type) => {
      const liste = p.rels[type];
      if (liste === undefined) return true;
      return Array.isArray(liste) && liste.every((id) => ids.has(id));
    });
  });
}

export function normaliser(donnees) {
  return donnees.map((p) => ({
    ...p,
    rels: Object.fromEntries(TYPES_DE_LIENS.map((type) => [type, p.rels[type] ?? []])),
  }));
}
