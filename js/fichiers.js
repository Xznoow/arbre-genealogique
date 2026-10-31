export function telechargerJson(donnees) {
  const texte = JSON.stringify(donnees, null, 2);
  const blob = new Blob([texte], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().slice(0, 10);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = `arbre-${date}.json`;
  lien.click();

  URL.revokeObjectURL(url);
}

export function lireJson(fichier) {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader();
    lecteur.onload = () => {
      try {
        resolve(JSON.parse(lecteur.result));
      } catch {
        reject(new Error("Ce fichier n'est pas un JSON valide."));
      }
    };
    lecteur.onerror = () => reject(new Error('Lecture du fichier impossible.'));
    lecteur.readAsText(fichier);
  });
}
