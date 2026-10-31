// Crée un dictionnaire id -> personne, pour retrouver une personne rapidement.
function indexer(donnees) {
  return new Map(donnees.map((personne) => [personne.id, personne]));
}

// Les listes de liens peuvent être absentes (family-chart supprime les listes vides).
function liens(personne, type) {
  return personne?.rels?.[type] ?? [];
}

// Renvoie tous les ancêtres d'une personne, avec leur génération
export function trouverAncetres(donnees, idDepart) {
  const index = indexer(donnees);
  const ancetres = new Map();
  const visites = new Set([idDepart]);
  let generationActuelle = [idDepart];
  let numero = 0;

  while (generationActuelle.length > 0) {
    numero++;
    const generationSuivante = [];
    for (const id of generationActuelle) {
      for (const idParent of liens(index.get(id), 'parents')) {
        // Un même ancêtre peut être atteint par deux chemins (cousins qui se marient) :
        // on ne le compte qu'une fois, à sa génération la plus proche.
        if (visites.has(idParent) || !index.has(idParent)) continue;
        visites.add(idParent);
        ancetres.set(idParent, numero);
        generationSuivante.push(idParent);
      }
    }
    generationActuelle = generationSuivante;
  }

  return ancetres;
}

export function compterDescendants(donnees, idDepart) {
  const index = indexer(donnees);
  const visites = new Set([idDepart]);
  const aTraiter = [idDepart];

  while (aTraiter.length > 0) {
    const id = aTraiter.pop();
    for (const idEnfant of liens(index.get(id), 'children')) {
      if (visites.has(idEnfant) || !index.has(idEnfant)) continue;
      visites.add(idEnfant);
      aTraiter.push(idEnfant);
    }
  }

  return visites.size - 1;
}

// on prend donc l'ancêtre qui a le plus de descendants
// En cas d'égalité, génération la plus haute
export function trouverAncetrePrincipal(donnees, idDepart) {
  const ancetres = trouverAncetres(donnees, idDepart);

  let meilleur = { id: idDepart, descendants: compterDescendants(donnees, idDepart), generation: 0 };

  for (const [id, generation] of ancetres) {
    const descendants = compterDescendants(donnees, id);
    const estMieux =
      descendants > meilleur.descendants ||
      (descendants === meilleur.descendants && generation > meilleur.generation);
    if (estMieux) meilleur = { id, descendants, generation };
  }

  return meilleur.id;
}
