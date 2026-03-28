# Load More Projets — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Afficher 4 projets au chargement de `/projets` et révéler les suivants par batch de 4 via un bouton, avec animations identiques aux premières cartes.

**Architecture:** Toutes les `ProjectCard` sont générées en HTML statique à la compilation. Un script inline masque les cartes au-delà de `INITIAL_COUNT` au `DOMContentLoaded`, puis les révèle par batch au clic. Les constantes `INITIAL_COUNT` et `BATCH_SIZE` sont en tête du frontmatter Astro. Un `IntersectionObserver` dédié dans le script de page déclenche les animations `.is-visible` sur les cartes révélées (le script de `BaseLayout` est un module ES — son observer n'est pas garanti d'être actif avant notre script inline).

**Tech Stack:** Astro (SSG), CSS custom properties, IntersectionObserver API, `<script define:vars>` Astro

---

## Fichiers modifiés

| Fichier | Changement |
|--------|-----------|
| `src/pages/projets/index.astro` | Constantes, `data-hidden-project`, `aria-live`, bouton, `<style>`, `<script>` |

Aucun nouveau fichier. Aucune dépendance ajoutée.

---

### Tâche 1 : Constantes et attributs HTML

**Fichiers :**
- Modifier : `src/pages/projets/index.astro`

- [ ] **Étape 1 : Ajouter les constantes dans le frontmatter**

Dans le frontmatter (entre les `---`), après le tri des projets, ajouter :

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '../../layouts/PageLayout.astro';
import SectionTitle from '../../components/ui/SectionTitle.astro';
import ProjectCard from '../../components/realisations/ProjectCard.astro';
import ClientLogos from '../../components/home/ClientLogos.astro';
import CtaSection from '../../components/home/CtaSection.astro';

const allProjects = await getCollection('projets', ({ data }) =>
  import.meta.env.DEV ? true : !data.draft
);

const projects = allProjects.sort(
  (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);

const INITIAL_COUNT = 4; // cartes visibles au chargement
const BATCH_SIZE = 4;    // cartes révélées par clic
---
```

- [ ] **Étape 2 : Ajouter `aria-live` et `data-hidden-project` dans le template**

Remplacer le bloc `projects.length > 0` par :

```astro
{projects.length > 0 ? (
  <div class="projects-list" aria-live="polite">
    {projects.map((p, i) => (
      <ProjectCard
        title={p.data.title}
        description={p.data.description}
        secteur={p.data.secteur}
        type={p.data.type}
        stack={p.data.stack}
        url={p.data.url}
        image={p.data.image}
        logo={p.data.logo}
        slug={p.data.slug}
        stagger={Math.min(i + 1, 6)}
        reverse={i % 2 === 1}
        index={i}
        {...(i >= INITIAL_COUNT ? { 'data-hidden-project': '' } : {})}
      />
    ))}
  </div>
) : (
  <p class="empty-state">Nos études de cas arrivent bientôt.</p>
)}
```

> Note : `{...(i >= INITIAL_COUNT ? { 'data-hidden-project': '' } : {})}` passe l'attribut à `ProjectCard`. Il faut vérifier que `ProjectCard` accepte les attributs HTML supplémentaires via `Astro.props` rest — voir Étape 3.

- [ ] **Étape 3 : Vérifier que `ProjectCard` propage les attributs HTML supplémentaires**

Ouvrir `src/components/realisations/ProjectCard.astro`. La balise `<article>` est l'élément racine. Astro ne propage pas automatiquement les props inconnues sur l'élément racine — il faut utiliser `Astro.props` rest.

Modifier `ProjectCard.astro` — déstructuration des props :

```astro
const {
  title,
  description,
  secteur,
  type,
  stack,
  url,
  image,
  logo,
  stagger = 0,
  reverse = false,
  index = 0,
  ...rest
} = Astro.props;
```

Et sur la balise `<article>` :

```astro
<article
  class:list={[
    'project-strip',
    'animate-slide',
    stagger > 0 && `stagger-${stagger}`,
    reverse && 'project-strip--reverse',
  ]}
  aria-label={`Projet : ${title}`}
  {...rest}
>
```

- [ ] **Étape 4 : Vérification manuelle — build sans erreurs**

```bash
cd /Users/luclagasquie/Repos/studio-we-are
npm run build
```

Résultat attendu : build réussi, aucune erreur TypeScript ni Astro.

- [ ] **Étape 5 : Commit**

```bash
git add src/pages/projets/index.astro src/components/realisations/ProjectCard.astro
git commit -m "feat(projets): add INITIAL_COUNT/BATCH_SIZE constants and data-hidden-project attribute"
```

---

### Tâche 2 : Bouton "Charger plus" et styles CSS

**Fichiers :**
- Modifier : `src/pages/projets/index.astro`

- [ ] **Étape 1 : Ajouter le bouton dans le template**

Juste après le bloc `projects.length > 0`, avant `</div>` de `.container`, ajouter :

```astro
{projects.length > INITIAL_COUNT && (
  <div class="load-more-wrap">
    <button type="button" class="load-more-btn" data-load-more>
      Charger plus de projets
      <span class="load-more-btn__count" data-count>
        ({projects.length - INITIAL_COUNT} restant{projects.length - INITIAL_COUNT > 1 ? 's' : ''})
      </span>
    </button>
  </div>
)}
```

- [ ] **Étape 2 : Ajouter les styles CSS dans la balise `<style>`**

Dans la balise `<style>` existante de `index.astro`, ajouter après les règles existantes :

```css
/* Cartes masquées par le script — display: none appliqué via JS */
:global(.project-hidden) {
  display: none !important;
}

/* Wrapper du bouton */
.load-more-wrap {
  display: flex;
  justify-content: center;
  padding-top: 3rem;
  border-top: 1px solid var(--border);
}

/* Bouton */
.load-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 0.875rem 2rem;
  border: 1px solid var(--border);
  transition: color var(--transition), border-color var(--transition);
}

.load-more-btn:hover:not(:disabled) {
  color: var(--accent);
  border-color: var(--accent);
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.load-more-btn__count {
  font-weight: 300;
  opacity: 0.7;
}
```

- [ ] **Étape 3 : Vérification manuelle — rendu visuel**

```bash
npm run dev
```

Ouvrir `http://localhost:4321/projets` dans le navigateur.

Vérifier (sans JS pour l'instant) :
- Toutes les cartes projets sont visibles (pas de masquage côté serveur)
- Le bouton est visible si `projects.length > INITIAL_COUNT`
- Le style du bouton est cohérent avec le reste de la page

- [ ] **Étape 4 : Commit**

```bash
git add src/pages/projets/index.astro
git commit -m "feat(projets): add load-more button and CSS (project-hidden, button styles)"
```

---

### Tâche 3 : Script inline — masquage initial et révélation par batch

**Fichiers :**
- Modifier : `src/pages/projets/index.astro`

- [ ] **Étape 1 : Ajouter le script inline avec `define:vars`**

À la fin de `index.astro`, après la balise `</PageLayout>` et `</style>`, ajouter :

```astro
<script define:vars={{ BATCH_SIZE }}>
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('[data-load-more]');
    if (!btn) return; // moins de INITIAL_COUNT projets : rien à faire

    // --- Masquage initial ---
    const allHiddenCards = Array.from(
      document.querySelectorAll('[data-hidden-project]')
    );
    allHiddenCards.forEach((card) => card.classList.add('project-hidden'));

    // --- Observer pour les animations des cartes révélées ---
    // On crée un observer dédié (le BaseLayout observer est un module ES,
    // son initialisation n'est pas garantie avant ce script inline)
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    // --- Mise à jour du compteur ---
    function updateCount() {
      const remaining = document.querySelectorAll(
        '[data-hidden-project].project-hidden'
      ).length;
      const countEl = btn.querySelector('[data-count]');
      if (countEl) {
        countEl.textContent = `(${remaining} restant${remaining > 1 ? 's' : ''})`;
      }
    }

    // --- Clic : révéler le prochain batch ---
    btn.addEventListener('click', () => {
      btn.disabled = true;

      const hidden = Array.from(
        document.querySelectorAll('[data-hidden-project].project-hidden')
      );
      const batch = hidden.slice(0, BATCH_SIZE);

      batch.forEach((card, i) => {
        // Réinitialiser les classes stagger (valeurs du build, relatives au projet global)
        for (let n = 1; n <= 9; n++) card.classList.remove(`stagger-${n}`);
        // Réassigner le stagger relatif à la position dans le batch
        card.classList.add(`stagger-${Math.min(i + 1, 9)}`);

        // Afficher la carte
        card.classList.remove('project-hidden');

        // Enregistrer dans l'observer pour déclencher l'animation
        revealObserver.observe(card);
      });

      // Vérifier s'il reste des cartes masquées
      const stillHidden = document.querySelectorAll(
        '[data-hidden-project].project-hidden'
      ).length;

      if (stillHidden === 0) {
        btn.closest('.load-more-wrap')?.remove();
      } else {
        btn.disabled = false;
        updateCount();
      }
    });
  });
</script>
```

- [ ] **Étape 2 : Vérification manuelle — comportement JS**

```bash
npm run dev
```

Ouvrir `http://localhost:4321/projets`.

Vérifier :
1. Au chargement : seules les 4 premières cartes sont visibles. Le bouton affiche le bon compteur (ex. "(3 restants)" si 7 projets au total).
2. Au clic : les 4 cartes suivantes apparaissent avec l'animation slide-up en cascade.
3. Au dernier clic : le bouton disparaît.
4. En désactivant JS (DevTools → Settings → Disable JavaScript) et en rechargeant : toutes les cartes sont visibles, le bouton est visible mais inactif.

- [ ] **Étape 3 : Vérification `prefers-reduced-motion`**

Dans DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`.

Vérifier : les cartes révélées apparaissent sans animation (le CSS de `animations.css` désactive déjà toutes les animations via `animation: none !important`).

- [ ] **Étape 4 : Vérification thème sombre**

Activer le thème sombre via le toggle du site.

Vérifier : le bouton et les cartes révélées ont un rendu correct (couleurs, bordures) en mode sombre.

- [ ] **Étape 5 : Build final**

```bash
npm run build
```

Résultat attendu : build réussi, aucune erreur.

- [ ] **Étape 6 : Commit**

```bash
git add src/pages/projets/index.astro
git commit -m "feat(projets): load-more script — hide initial cards, reveal by batch with slide-up animation"
```
