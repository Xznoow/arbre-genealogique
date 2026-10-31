import { charger, sauvegarder, effacer, estArbreValide } from './data.js';
import { telechargerJson, lireJson } from './fichiers.js';
import { trouverAncetrePrincipal } from './genealogie.js';

const f3 = window.f3;

const CHAMPS = [
  { type: 'text', label: 'Prénom', id: 'prenom' },
  { type: 'text', label: 'Nom', id: 'nom' },
  { type: 'text', label: 'Naissance', id: 'naissance' },
  { type: 'text', label: 'Décès', id: 'deces' },
  { type: 'textarea', label: 'Notes', id: 'notes' },
];

// ---------- 1. Création de l'arbre ----------

const donnees = charger();

const arbre = f3
  .createChart('#arbre', donnees)
  .setTransitionTime(800)
  .setCardXSpacing(250)
  .setCardYSpacing(150)
  .setSingleParentEmptyCard(true, { label: 'Inconnu' })
  .setShowSiblingsOfMain(true);

const carte = arbre
  .setCardHtml()
  .setCardDisplay([['prenom', 'nom'], ['naissance']])
  .setMiniTree(true);

// ---------- 2. Édition ----------

const edition = arbre
  .editTree()
  .fixed()
  .setFields(CHAMPS)
  .setEditFirst(true)
  .setCardClickOpen(carte)
  .setOnFormCreation(({ cont }) => traduireFormulaire(cont))
  .setOnChange(() => {
    sauvegarder(edition.exportData());
  });

edition.setAddRelLabels({
  father: 'Ajouter le père',
  mother: 'Ajouter la mère',
  spouse: 'Ajouter un conjoint',
  son: 'Ajouter un fils',
  daughter: 'Ajouter une fille',
});

arbre.updateTree({ initial: true });

function traduireFormulaire(cont) {
  const traductions = {
    Male: 'Homme',
    Female: 'Femme',
    Cancel: 'Annuler',
    Submit: 'Enregistrer',
    Delete: 'Supprimer',
    'Remove Relation': 'Retirer un lien',
    'Cancel Remove Relation': 'Annuler le retrait',
  };
  const parcours = document.createTreeWalker(cont, NodeFilter.SHOW_TEXT);
  while (parcours.nextNode()) {
    const noeud = parcours.currentNode;
    const texte = noeud.textContent.trim();
    if (traductions[texte]) {
      noeud.textContent = noeud.textContent.replace(texte, traductions[texte]);
    }
  }
}

// ---------- 3. Boutons de la barre ----------

document.querySelector('#btn-toute-famille').addEventListener('click', () => {
  const idCentral = arbre.getMainDatum().id;
  const idAncetre = trouverAncetrePrincipal(edition.exportData(), idCentral);

  if (idAncetre === idCentral) return; // déjà au bon endroit

  edition.closeForm();
  arbre.updateMainId(idAncetre);
  arbre.updateTree();
});

document.querySelector('#btn-exporter').addEventListener('click', () => {
  telechargerJson(edition.exportData());
});

document.querySelector('#input-importer').addEventListener('change', async (event) => {
  const fichier = event.target.files[0];
  if (!fichier) return;

  try {
    const importees = await lireJson(fichier);
    if (!estArbreValide(importees)) {
      alert("Ce fichier ne contient pas un arbre valide.");
      return;
    }
    if (!confirm("Remplacer l'arbre actuel par celui du fichier ?")) return;

    sauvegarder(importees);
    location.reload();
  } catch (erreur) {
    alert(erreur.message);
  } finally {
    event.target.value = '';
  }
});

document.querySelector('#btn-reinitialiser').addEventListener('click', () => {
  if (!confirm("Effacer tout l'arbre ? Exportez-le d'abord si vous voulez le garder.")) return;
  effacer();
  location.reload();
});
