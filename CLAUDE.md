# CLAUDE.md — Studio We Are · Site d'agence Astro

> Fichier de contexte projet pour Claude Code. À placer à la racine du dépôt.

---

## Vue d'ensemble du projet

**Nom du site :** Studio We Are  
**Type :** Site vitrine d'agence web — conversion-first, clair pour un public non technique  
**Framework :** Astro (SSG — génération statique)  
**Déploiement cible :** Cloudflare Pages  
**Formulaire de contact :** Cloudflare Pages Functions  
**Langues :** Français (principal) — prévoir les bases pour l'internationalisation (fr/en)

---

## Activité & positionnement

**Studio We Are** est une activité indépendante de création de sites web fondée en 2009 (plus de 15 ans d'expérience). L'activité couvre :

- **Développement web** : WordPress (classique et Headless), Astro, Shopify, WooCommerce
- **Conseil & stratégie digitale** : accompagnement des chefs d'entreprise, diagnostic, choix technologique
- **Maintenance & support technique** : interventions pour agences de communication et clients directs
- **Partenariat agences** : prestataire technique référent pour Euré-k ! et d'autres agences
- **Photographie** : reportage, paysages, portraits — production de contenu visuel pour les projets clients

**Territoire :** Lot (ancrage principal), France entière, international (références Canada, Suisse)  
**Clientèle :** PME, particuliers, artistes, secteur public et privé

**Valeur différenciante :** Travail artisanal, veille technologique continue, passion pour la tech, usage des derniers outils (IA incluse). Collaboration avec **Céline Andrieux**, graphiste indépendante, pour les projets nécessitant une identité visuelle sur-mesure.

---

## Informations légales

**Raison sociale / Éditeur :** Studio We Are  
**Fondateur & responsable de publication :** Luc Lagasquie  
**SIRET :** 512 352 485 00050  
**Adresse :** 220 chemin du Bartassou, 46700 Sérignac, France  
**Hébergeur :** Cloudflare, Inc. — 101 Townsend St, San Francisco, CA 94107, USA

---

## Architecture des pages

```
/                          → Accueil
/services                  → Services (détail)
/realisations              → Réalisations & études de cas
/realisations/[slug]       → Étude de cas individuelle
/a-propos                  → À propos — parcours & collaborateurs
/photographie              → Photographie — reportage, paysages, portraits
/contact                   → Contact
/mentions-legales          → Mentions légales
/politique-confidentialite → Politique de confidentialité
```

---

## Page : Accueil (`/`)

### Hero
- Accroche principale courte et percutante (ex. : "Des sites qui travaillent pour vous.")
- Sous-titre explicitant l'activité en une phrase
- 2 CTA : **"Découvrir nos services"** (ancre vers la grille) + **"Prendre contact"** (lien `/contact`)
- **Fond : photographie plein écran** (paysage ou ambiance — issue du catalogue personnel de Luc Lagasquie)
  - Image en `object-fit: cover`, positionnement centré
  - Overlay sombre semi-transparent pour garantir la lisibilité du texte
  - Prévoir un attribut `fetchpriority="high"` et `loading="eager"` sur l'image hero
  - Format WebP optimisé, variantes responsive via `srcset`
- Entrée animée du texte : fade-in + légère translation verticale (CSS uniquement)

### Introduction
- Paragraphe court présentant l'humain derrière We Are
- Mise en avant de l'expérience (15+ ans, fondée en 2009)
- Ton : direct, chaleureux, sans jargon inutile
- Lien ou scroll vers la grille de services

### Grille de services (aperçu)
Afficher 4 à 6 cartes de services. Chaque carte : icône ou illustration, titre, phrase d'accroche, lien "En savoir plus".  
Animation d'entrée : apparition en cascade (stagger) au scroll — fade-in + slide-up CSS.

Services à représenter :
1. Site vitrine / plaquette en ligne
2. Site e-commerce (WooCommerce / Shopify)
3. Site WordPress sur-mesure (Bricks / Etch)
4. Site Astro / Headless (statique, ultra-rapide)
5. Maintenance & support technique
6. Conseil & accompagnement
7. Photographie & contenu visuel

### Section logos clients
- Frise de logos (clients directs + agences partenaires dont Euré-k !)
- Titre discret : "Ils nous font confiance"
- Données depuis `src/data/clients.json`
- Animation : fade-in groupé au scroll

### Section CTA finale
- Titre : "Parlons de votre projet"
- Texte court incitant à la prise de contact
- Bouton → `/contact`

---

## Page : Services (`/services`)

### Structure générale
Deux grandes familles de sites à distinguer visuellement et clairement :

---

#### ① Sites rapides à mettre en place
> Pour les besoins urgents, les budgets maîtrisés ou les projets simples.

- Basés sur des thèmes ou starters éprouvés
- Délai de livraison court
- Option d'hébergement gratuit pour les sites simples (Cloudflare Pages, etc.)
- Idéal pour : auto-entrepreneurs, artisans, associations, artistes

---

#### ② Sites réalisés de A à Z
> Pour les projets ambitieux, durables, entièrement personnalisés.

- Développement sur-mesure (WordPress + Bricks, Astro, Headless WordPress)
- Choix laissé au client : avec ou sans interface d'édition de contenu
- Maintenance continue et support inclus ou en option
- Liberté totale du choix d'hébergeur
- Idéal pour : PME, e-commerce, secteur public, projets à fort trafic

---

### Détail des offres techniques

| Offre | Stack | Idéal pour |
|-------|-------|-----------|
| WordPress classique | WordPress + Bricks ou Etch | Clients souhaitant gérer leur contenu |
| WordPress Headless | WordPress CMS + Astro front | Performance maximale + gestion contenu |
| Astro statique | Astro + Markdown/CMS headless | Sites rapides sans back-office |
| WooCommerce | WordPress + WooCommerce | E-commerce avec besoins spécifiques |
| Shopify | Shopify | E-commerce clé en main |

### Encart : Photographie & contenu visuel
Luc Lagasquie est photographe de paysages et de voyage. Cette compétence est proposée en complément du développement web :
- Reportage d'entreprise, portraits, photos de locaux ou de produits
- Paysages et ambiances pour illustrer l'identité d'une marque ou d'un territoire
- Contenu prêt à l'emploi pour le site, les réseaux sociaux, la communication imprimée
- Cohérence garantie entre l'image produite et le site développé

### Encart : Collaboration avec Céline Andrieux
Section ou encart valorisant le binôme développeur × graphiste :
- Identité visuelle, maquettes, direction artistique
- Intégration précise dans Bricks ou en code
- Mettre en avant la qualité artisanale du résultat final

### Encart : Veille technologique
Texte court : veille active, usage des derniers outils (IA, automatisations, nouveaux frameworks), passion pour la tech. Rester accessible pour le lecteur non technique — éviter les listes d'outils exhaustives.

---

## Page : Photographie (`/photographie`)

### Objectif
Présenter la pratique photographique de Luc Lagasquie comme une compétence complémentaire au développement — et proposer ce service aux clients qui ont besoin de contenu visuel pour leur site ou leur communication.

### Contenu
- Introduction courte sur la pratique : paysages, voyage, reportage
- Galerie organisée par thématique ou chronologie (paysages / portraits / reportage entreprise)
- Mention du service : production de contenu photographique sur commande
- CTA → `/contact` avec objet pré-sélectionné "Photographie"

### Composants
- `PhotoGallery.astro` : grille masonry ou grille uniforme, images optimisées
- Lightbox optionnelle (CSS-only ou bibliothèque légère sans dépendance lourde)
- Les photos sont stockées dans `src/assets/sections/` et `src/assets/about/`

---



### Parcours du fondateur — Luc Lagasquie
- Création de l'activité en 2009 (au lycée)
- Plus de 15 ans d'expérience
- Travail avec des agences, des graphistes et des clients en direct
- Ancrage dans le Lot, rayonnement national et international
- Passion pour la technologie et engagement dans une veille constante

### Collaborateurs

#### Céline Andrieux — Graphiste
- Présentation de la collaboration : identité visuelle, direction artistique, maquettes
- Ce qu'apporte ce partenariat au client : cohérence visuelle + technique

#### Euré-k ! — Agence de communication
- Présentation de la relation partenaire
- Nature de la collaboration : prestations techniques pour l'agence
- Lien vers leur site (si accord)

### Illustration / photographie
La page À propos doit être visuellement soignée : portrait, photo d'ambiance ou illustration. Éviter un rendu purement textuel. Prévoir un emplacement `src/assets/about/` pour les visuels.

---

## Page : Réalisations (`/realisations`)

### Grille de projets
- Composant `<ProjectCard>` : visuel/capture, nom du client, secteur, stack utilisée, lien vers l'étude de cas
- Filtres optionnels : par type (vitrine, e-commerce, Astro, WordPress…)
- Données depuis les Content Collections Astro (`src/content/projets/`)
- Animation : apparition en cascade au scroll

### Contenu initial (demi-contenu)
Pour le lancement, chaque projet aura :
- Un titre et une courte description (1 à 3 phrases)
- Une capture d'écran ou visuel représentatif
- La stack technique utilisée (badges)
- Un lien vers le site si public
- Un emplacement réservé pour l'étude de cas complète (champ `draft: true`)

Les textes détaillés seront complétés ultérieurement. Le frontmatter MDX doit prévoir tous les champs dès le départ.

### Études de cas (`/realisations/[slug]`)
Structure type pour chaque cas :
1. **Contexte** : qui est le client, quel était le besoin
2. **Solution apportée** : choix techniques, parti pris
3. **Résultat** : captures d'écran, métriques si disponibles
4. **Technologies** : stack utilisée (icônes / badges)
5. **Témoignage client** (si disponible)
6. CTA : "Vous avez un projet similaire ?" → `/contact`

### Frontmatter MDX type pour un projet

```yaml
---
title: "Nom du client"
slug: "nom-client"
description: "Description courte du projet (1-2 phrases)."
secteur: "Commerce / Artisanat / Culture / Collectivité / ..."
type: "vitrine | e-commerce | wordpress | astro | headless"
stack: ["WordPress", "Bricks", "WooCommerce"]
url: "https://..."   # optionnel
image: "./captures/nom-client.jpg"
draft: false         # true = visible en développement uniquement
date: 2024-06
---
```

---

## Page : Contact (`/contact`)

### Formulaire
Champs :
- Nom / Prénom
- Email
- Téléphone (optionnel)
- Objet : `<select>` avec options (Nouveau site, Refonte, Maintenance, Conseil, Autre)
- Message
- Honeypot anti-spam (champ caché, non visible)
- Bouton d'envoi

**Backend :** Cloudflare Pages Functions + envoi email via Mailchannels (intégré Cloudflare) ou Resend.

Le formulaire doit fonctionner en **progressive enhancement** : soumission HTML native en premier lieu, amélioration JS optionnelle (feedback visuel, validation côté client).

### Informations complémentaires
- Email direct (lien `mailto:`)
- Localisation : Lot, France (mention textuelle)
- Mention : "Nous travaillons à distance sans contrainte géographique" (références Canada, Suisse)
- Délai de réponse habituel : sous 48h en semaine

---

## Pages légales

### Mentions légales (`/mentions-legales`)

```
Éditeur : Studio We Are
Responsable de publication : Luc Lagasquie
SIRET : 512 352 485 00050
Adresse : 220 chemin du Bartassou, 46700 Sérignac, France
Hébergeur : Cloudflare, Inc. — 101 Townsend St, San Francisco, CA 94107, USA
```

Compléter avec : responsable de publication, contact email, propriété intellectuelle, limitation de responsabilité.

### Politique de confidentialité (`/politique-confidentialite`)
- Données collectées : formulaire de contact (nom, email, message), analytics éventuels
- Base légale : intérêt légitime / consentement
- Durée de conservation
- Droits des utilisateurs : accès, rectification, suppression — contact par email
- Absence de cookies tiers si pas d'analytics (à confirmer selon les choix retenus)

> Ces deux pages sont générées depuis des fichiers Markdown avec un layout dédié `LegalLayout.astro`.

---

## Thème visuel & design system

### Mode par défaut : clair (blanc cassé / beige)
- **Fond principal** : blanc cassé légèrement beige — ex. `#f5f2ee` ou `#f7f4f0` (à affiner selon les inspirations)
- Typographie sombre sur fond clair
- Accents couleur : à définir selon direction de marque — éviter le bleu générique
- Le mode sombre reste disponible via toggle + respect de `prefers-color-scheme`
- Variables CSS définies dans `src/styles/global.css` pour les deux modes :

```css
:root {
  --bg: #f5f2ee;
  --bg-alt: #edeae5;
  --text: #1a1a18;
  --text-muted: #6b6760;
  /* accents à définir */
}

[data-theme="dark"] {
  --bg: #111110;
  --bg-alt: #1c1c1a;
  --text: #f0ede8;
  --text-muted: #9a9690;
}
```

### Animations (CSS uniquement — pas de GSAP, pas de bibliothèque JS d'animation)
Règles strictes :
- **Fade-in** : `opacity: 0 → 1`, durée 0.4–0.6s, easing `ease-out`
- **Slide-up** : `translateY(24px) → 0`, combiné avec fade-in
- **Stagger** : `animation-delay` croissant entre éléments d'une liste ou grille
- **Déclenchement au scroll** : `IntersectionObserver` JS minimal, classe `.is-visible` ajoutée à l'entrée dans le viewport
- Respecter impérativement `prefers-reduced-motion` : désactiver toutes les animations si la préférence est activée

### Aspect visuel
Le site doit être **visuellement fort**, en s'appuyant en priorité sur le **catalogue photographique de Luc Lagasquie** :
- Paysages du Lot et de voyage pour les fonds de section, le hero, et les transitions visuelles
- Portraits pour la page À propos
- Photos de reportage pour illustrer les réalisations si disponibles
- Éviter tout visuel de stock — l'authenticité des photos personnelles est un atout différenciant

Autres principes visuels :
- Grande typographie pour les titres de section
- Captures d'écran des réalisations mises en scène (mockups sur fond sombre ou contexte device)
- Espaces négatifs généreux
- Icônes SVG inline ou bibliothèque légère (Phosphor Icons ou Lucide)

### Dossier Inspiration
Un dossier `inspiration/` contenant des références visuelles a été fourni.  
**→ Consulter ce dossier avant toute décision de design.**

**Référence principale : `inspiration/spread.webp`**  
C'est le fichier de référence le plus important — il définit l'ambiance générale du site. Le design final doit s'en inspirer directement : typographie, espacements, palette, hiérarchie visuelle, traitement des images. À analyser en priorité absolue avant de poser la moindre variable CSS ou choix typographique.

Emplacement attendu : `inspiration/` à la racine du dépôt (non versionné si souhaité — ajouter à `.gitignore`).

---

## Architecture technique

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Navigation.astro
│   ├── home/
│   │   ├── Hero.astro
│   │   ├── ServicesGrid.astro
│   │   ├── ClientLogos.astro
│   │   └── CtaSection.astro
│   ├── services/
│   │   ├── ServiceCard.astro
│   │   └── TechTable.astro
│   ├── realisations/
│   │   ├── ProjectCard.astro
│   │   └── CaseStudy.astro
│   ├── about/
│   │   └── CollaboratorCard.astro
│   └── ui/
│       ├── Button.astro
│       ├── Badge.astro
│       ├── SectionTitle.astro
│       └── ThemeToggle.astro
├── layouts/
│   ├── BaseLayout.astro
│   ├── PageLayout.astro
│   └── LegalLayout.astro
├── pages/
│   ├── index.astro
│   ├── services.astro
│   ├── a-propos.astro
│   ├── realisations/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── contact.astro
│   ├── mentions-legales.md
│   └── politique-confidentialite.md
├── content/
│   └── projets/
│       └── [slug].mdx         ← Content Collections Astro
├── data/
│   ├── services.json
│   └── clients.json
├── styles/
│   ├── global.css             ← variables CSS, reset, typographie, thèmes
│   └── animations.css         ← classes utilitaires d'animation
└── assets/
    ├── about/                 ← portraits, photo Luc Lagasquie
    ├── hero/                  ← photographies plein écran (paysages, voyage)
    ├── sections/              ← photos d'ambiance pour fonds de sections
    └── projets/
        └── [slug]/            ← captures et visuels par projet
```

### Cloudflare Pages Functions
Fichier `functions/contact.js` : traitement du formulaire de contact côté serveur.  
Prévoir : validation des champs, vérification du honeypot, envoi email.

---

## Composants prioritaires

1. `BaseLayout.astro` — head, meta SEO, variables CSS, gestion thème sombre/clair
2. `Header.astro` + `Navigation.astro` — responsive, `ThemeToggle.astro`
3. `Hero.astro` — section d'accroche avec animation d'entrée CSS
4. `ServicesGrid.astro` + `ServiceCard.astro` — animation stagger au scroll
5. `ProjectCard.astro` + `/realisations/[slug].astro`
6. `ContactForm.astro` + Cloudflare Pages Function associée
7. `Footer.astro` — liens légaux, copyright

---

## SEO & performances

- Balises `<title>` et `<meta description>` uniques par page (prop dans le layout)
- Sitemap avec `@astrojs/sitemap`
- Images optimisées avec le composant `<Image>` Astro (WebP/AVIF)
- Score Lighthouse cible : 95+ sur toutes les pages
- JSON-LD : `LocalBusiness`, `WebSite`, `BreadcrumbList`
- Mots-clés prioritaires : "création site web Lot", "agence web Cahors", "développeur WordPress Lot", "site Astro France"
- `robots.txt` et `sitemap.xml` générés automatiquement au build

---

## Ton éditorial & copywriting

### Valeurs à mettre en avant en priorité
Le site doit incarner ces valeurs dans chaque page, chaque section, chaque formulation :

- **L'artisanat** : chaque site est conçu avec soin, pensé dans ses détails, pas industrialisé. On ne livre pas un template rempli, on construit quelque chose.
- **L'humain** : derrière Studio We Are, il y a des personnes — Luc, Céline, les partenaires. Le client sait à qui il parle et qui travaille pour lui.
- **La proximité** : disponibilité, écoute, conseil personnalisé. Pas un ticket de support anonyme — une relation de travail directe.
- **Le conseil** : l'expertise technique est mise au service de décisions éclairées. On aide le client à choisir la bonne solution, pas la plus complexe.

### L'IA comme outil, pas comme finalité
L'intelligence artificielle est utilisée pour accélérer certaines étapes du développement et de la production. Elle reste un outil au service du travail humain — elle n'en définit ni la qualité ni l'intention. Cette nuance mérite d'être exprimée clairement si le sujet est abordé sur le site, sans en faire un argument marketing central.

### Règles de rédaction
- **Clair et direct** — le client non-technique doit tout comprendre sans effort
- **Concret** — chiffres, exemples, résultats tangibles plutôt que formules vagues
- **Chaleureux sans être familier** — ton professionnel, accessible, qui inspire confiance
- **Précis pour les profils tech** — encarts ou tableaux dédiés avec termes spécifiques
- À éviter : "solutions innovantes", "digital", "synergie", "clé en main" utilisé seul, "à votre écoute", "nous vous accompagnons dans votre transformation"
- À privilégier : verbes d'action, bénéfices concrets, première personne assumée ("je", "nous")

---

## Notes de développement

- Utiliser les **Content Collections** Astro avec validation de schéma Zod pour les projets
- Le formulaire doit fonctionner **sans JavaScript côté client** (progressive enhancement)
- Accessibilité : WCAG 2.1 AA minimum — contrastes suffisants en mode sombre ET clair, navigation clavier, attributs ARIA
- Respecter `prefers-reduced-motion` pour toutes les animations
- Tester le thème clair et le thème sombre sur toutes les pages avant mise en production
- Les textes des études de cas sont provisoires au lancement — frontmatter `draft: true` pour les projets incomplets

---

*Dernière mise à jour : mars 2026*
