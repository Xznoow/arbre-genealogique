# arbre-genealogique

Site statique — HTML, CSS et JavaScript. Aucune compilation, aucune base.

## Developpement

Ouvrir le dossier dans VS Code, puis **Live Server** :
clic droit sur `index.html` -> « Open with Live Server ».

## Tester comme en production

Live Server ne reproduit pas Nginx (en-tetes de securite, page 404,
reecritures). Pour verifier le comportement reel :

```powershell
docker run --rm -p 8000:80 -v "${PWD}:/usr/share/nginx/html:ro" nginx:alpine
```

## Mise en production

Le depot **est** le site : il est clone directement dans `site/` sur le
serveur. La configuration Nginx vient du template `client-static`.

Deploiement d'une mise a jour :

```bash
cd /srv/docker/<portee>/arbre-genealogique/site && git pull
```

Voir la section 08 du manuel d'exploitation, parcours A.

## A verifier avant la mise en ligne

- Chemins relatifs partout
- Casse des noms de fichiers coherente
- `meta description` remplie sur chaque page
- `favicon.ico` present
- `404.html` adapte au site

## Fiche projet

- Client / usage :
- Domaine :
- Mise en ligne le :
