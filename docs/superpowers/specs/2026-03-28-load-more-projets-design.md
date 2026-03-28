# Design — Charger plus de projets (`/projets`)

**Date :** 2026-03-28
**Fichier principal :** `src/pages/projets/index.astro`

---

## Objectif

Afficher les 4 premiers projets au chargement, puis révéler les suivants par batch de 4 via un bouton "Charger plus de projets". Conçu pour tenir jusqu'à une vingtaine de projets sans dégradation de performance au chargement initial.

---

## Constantes configurables

Déclarées en haut du frontmatter Astro, faciles à ajuster :

```ts
const INITIAL_COUNT = 4;  // cartes visibles au chargement de la page
const BATCH_SIZE = 4;     // cartes révélées par clic sur le bouton
```

---

## Architecture

### Rendu HTML (SSG)

Toutes les `ProjectCard` sont rendues dans le HTML généré à la compilation. Aucune requête réseau au clic.

Les cartes à l'index ≥ `INITIAL_COUNT` reçoivent un attribut `data-hidden-project` dans le markup Astro, pour que le script puisse les identifier.

### Masquage initial (JS)

Le masquage n'est **pas** fait en CSS statique. C'est le script inline qui :
1. S'exécute au `DOMContentLoaded`
2. Sélectionne toutes les cartes `[data-hidden-project]`
3. Leur applique `display: none` via une classe CSS `project-hidden`

**Conséquence :** sans JS, toutes les cartes sont visibles dès le départ (graceful degradation).

### Images

Les `ProjectCard` utilisent déjà `loading="lazy"`. Les images des cartes masquées (`display: none`) ne sont pas chargées par le navigateur — aucun impact sur les performances initiales.

---

## Comportement du bouton

- Rendu dans le HTML uniquement si `projects.length > INITIAL_COUNT`
- Masqué en CSS via `.project-load-more--hidden` (le script le cache au `DOMContentLoaded` si toutes les cartes sont déjà visibles, par sécurité)
- Affiche le compteur : "Charger plus de projets (X restants)"
- Désactivé (`disabled`) pendant la révélation pour éviter les double-clics
- Supprimé du DOM (`remove()`) quand toutes les cartes sont affichées

---

## Révélation des cartes (logique script)

Au clic :
1. Récupérer le prochain batch de cartes masquées (les `BATCH_SIZE` premières parmi `[data-hidden-project]` encore cachées)
2. Retirer `project-hidden` (affiche les cartes)
3. Réassigner les classes `stagger-N` (1 à min(N, 6)) relatives à la position dans le batch, pour recréer l'effet cascade
4. Ajouter chaque carte révélée à l'`IntersectionObserver` existant (celui qui gère `.is-visible` pour les animations `animate-slide`)
5. Mettre à jour le compteur du bouton
6. Si plus aucune carte masquée : supprimer le bouton

---

## Animations

Les cartes révélées utilisent le même système d'animation que les premières :
- Classe `animate-slide` (déjà présente sur toutes les cartes via `ProjectCard`)
- Classe `stagger-N` recalculée au moment de la révélation
- `.is-visible` ajoutée par l'`IntersectionObserver` quand la carte entre dans le viewport

L'effet visuel est identique à l'apparition initiale des premières cartes : fondu + slide-up en cascade.

---

## Accessibilité

- Le bouton est un `<button type="button">` standard, navigable au clavier
- Attribut `aria-live="polite"` sur la liste pour annoncer les nouvelles cartes aux lecteurs d'écran (optionnel mais recommandé)

---

## Fichiers modifiés

| Fichier | Changement |
|--------|------------|
| `src/pages/projets/index.astro` | Ajout des constantes, attribut `data-hidden-project`, bouton, `<script>` inline |

Aucun nouveau fichier, aucune dépendance ajoutée.
