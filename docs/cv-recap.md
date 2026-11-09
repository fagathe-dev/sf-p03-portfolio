# Recap CV : points forts, points faibles, pistes d'amélioration

Fichier analysé : `public/assets/files/cv_agathe_frederick.pdf` (2 pages).
Comparé avec les données du portfolio (`data/projects.json`, `data/skills.json`).

---

## Points forts

1. **Parcours cohérent et stable.** Environ 7 ans dans le développement web PHP (alternance CGI en 2017, puis 3 CDI/stage), dont 4 ans chez Meilleurtaux. On comprend tout de suite que tu es développeur PHP/Symfony.
2. **Des migrations, très recherchées par les recruteurs :**
   - PHP 7 → 8.0 → 8.3 (Meilleurtaux)
   - Zend Framework 2.4 → Symfony 6 (Softia)
   Ce sont tes meilleurs arguments. Beaucoup d'entreprises ont du legacy à moderniser.
3. **Profil complet, pas seulement du code :** documentation technique et fonctionnelle, audit technique, tests automatisés, tickets, Docker, serveur Linux. Ça montre que tu as de l'autonomie et que tu fais attention à la qualité.
4. **Expérience avec plusieurs frameworks :** Symfony, Laravel, Zend, React, VueJS, Flask. Tu peux t'adapter à des bases de code variées.
5. **Mise en page propre et lisible :** deux colonnes, titres clairs, ordre chronologique inversé, coordonnées visibles en haut.
6. **Des références connues :** CGI et Meilleurtaux sont des noms qui rassurent un recruteur.

---

## Points faibles

### Forme et mise en page

| Problème | Détail |
|---|---|
| **Le CV fait 2 pages et la 2ᵉ est presque vide** | La page 2 ne contient que la formation. Avec ton niveau d'expérience, il faut **1 seule page**. |
| **Une ligne est en double** | « Api pour un blog en Python (Flask) » apparaît à la fin de la page 1 **et** en haut de la page 2. C'est un bug de mise en page, et ça se voit. |
| **La colonne de droite est vide** sous « Langues » | Il reste de la place pour les liens, les projets perso ou la formation. |
| **Typographie pas uniforme** | Tirets « - » et « — » mélangés, « à » et « À » mélangés, mois écrits parfois avec une majuscule et parfois sans. |

### Fautes et coquilles

- « Maintien en condition opérationnel**le** » (×2) : c'est « la condition », donc « opérationnelle ».
- « Typescript - Intermédiaire**s** » → « TypeScript - Intermédiaire ».
- « Rédaction**s** test unitaires » → « Rédaction de tests unitaires ».
- « ReactJS, **php** » → « PHP ». « **Api** » → « API ». « Openclassrooms » → « OpenClassrooms ». « Typescript » → « TypeScript ». « NodeJs(Cli) » → « Node.js (CLI) ».
- « (Bac +¾) » ne veut rien dire. Écrire plutôt : « Titre RNCP niveau 6 (Bac+3/4) ».

### Contenu

1. **Pas d'accroche ni de résumé.** Le titre « Développeur PHP/Symfony React Python » ne précise ni ton niveau ni ce que tu cherches. Il manque 2 ou 3 lignes du type : *« Développeur PHP/Symfony, 7 ans d'expérience, spécialisé dans la modernisation d'applications (migrations PHP 8, Symfony) »*.
2. **Le titre et les compétences se contredisent.** Le titre met « Python » en avant, mais la section compétences dit « Python - Débutant ». Un recruteur le remarque tout de suite.
3. **Tu décris des tâches, pas des résultats.** « Maintenance d'application Symfony », « Rédaction et suivi de tickets »… Ce sont des activités. On ne voit ni l'impact, ni la taille, ni le contexte : quel produit ? combien d'utilisateurs ? quelle équipe ? quel gain ? Aucun chiffre.
4. **Aucun lien.** Pas de GitHub (`fagathe-dev`), pas de LinkedIn, pas de portfolio (`frederickagathe.fr`). C'est le plus gros manque : tu as un portfolio avec 9 projets solides et le CV n'en parle pas.
5. **Tes projets personnels n'apparaissent pas.** Budget App, CMS en monorepo, Gather (Next.js), Design System, core-php/core-ts/core-react… Ils montrent des compétences que tes postes ne mettent pas en valeur : React 19/TypeScript, architecture SOLID, monorepo, JWT, Storybook, tests Vitest/PHPUnit, design system.
6. **Section compétences trop pauvre et pas à jour :**
   - Il manque des technos que tu cites dans tes expériences : Docker, Node.js, Laravel, Zend, VueJS, Linux/Debian, MySQL.
   - Il manque des outils de base : Git, Composer, Doctrine, PHPUnit, CI/CD, API REST, JWT.
   - Rien sur l'IA (Claude Code, prompting), alors que le portfolio en parle et que c'est un vrai plus en 2026.
   - Les niveaux ne sont pas les mêmes que sur le portfolio : TypeScript « Intermédiaire » sur le CV et « confirmé » sur le portfolio, Python « Débutant » sur le CV et « intermédiaire » sur le portfolio.
   - Les niveaux « Solide / Intermédiaire » ne disent pas grand-chose. Il vaut mieux **grouper par catégorie** (Back-end / Front-end / DevOps / Outils) et laisser les expériences prouver le niveau.
7. **« Distinctions : Permis B ».** Le permis n'est pas une distinction. Mets-le dans une ligne « Infos », ou retire-le s'il n'est pas utile pour le poste.
8. **« Langues : Anglais » sans niveau.** Précise : « Anglais : lu/écrit technique (B1/B2) » ou ton vrai niveau.
9. **Adresse complète inutile.** « Le Raincy (93) » suffit. L'adresse précise n'apporte rien et expose des données personnelles.
10. **Formation mal ordonnée et peu claire :**
    - Elle n'est pas en ordre chronologique inversé : le BTS 2019 est avant OpenClassrooms 2021.
    - On ne voit pas le lien entre le BTS (2019) et l'alternance CGI (2017-2019). Écrire « en alternance chez CGI ».
    - Les puces « Bases du réseau / Bases de la programmation » n'apportent rien. Il vaut mieux les supprimer.
11. **Il y a un trou entre novembre 2019 et janvier 2021**, sans explication. C'est sans doute la période de la formation OpenClassrooms : il faut l'indiquer pour que la chronologie se suive.
12. **L'intitulé CGI ne correspond pas au contenu.** Le titre dit « Symfony/Laravel », mais les puces parlent seulement de Laravel et de WordPress.
13. **Les intitulés de poste sont modestes.** « Développeur d'application PHP » chez Meilleurtaux ne montre pas tes 4 ans d'ancienneté ni ton côté fullstack (React, Node, Docker).

---

## Pistes d'amélioration (par priorité)

### Priorité 1 : rapide, gros impact
- [ ] Faire tenir le CV sur **1 page** et supprimer la ligne en double.
- [ ] Corriger les fautes et uniformiser la typographie.
- [ ] Ajouter **GitHub, LinkedIn et portfolio** dans l'en-tête.
- [ ] Remplacer l'adresse complète par « Le Raincy (93) ».
- [ ] Revoir le titre : « Développeur Fullstack PHP/Symfony & React — 7 ans d'expérience ». Retirer Python du titre.

### Priorité 2 : contenu
- [ ] Écrire une **accroche** de 2 ou 3 lignes : ta spécialité (Symfony, modernisation de legacy), ton côté fullstack (React/TypeScript) et ce que tu cherches.
- [ ] Réécrire les puces avec **verbe d'action + contexte + résultat**. Par exemple :
  - « Migration de PHP 7 vers 8.0 puis 8.3 » → « Pilotage de la migration PHP 7 → 8.3 de X applications, sans interruption de service »
  - « Création d'environnement Docker » → « Mise en place d'environnements Docker : onboarding d'un nouveau développeur réduit de X jours à X heures »
  - Ajouter le contexte métier de Meilleurtaux (courtage, simulateurs, back-offices ?) et la taille de l'équipe.
- [ ] Ajouter une section **Projets personnels** avec 2 ou 3 projets phares (Budget App, CMS monorepo, Design System), en une ligne chacun avec la stack et le lien.
- [ ] Refaire les **compétences par catégorie**, alignées avec le portfolio, IA comprise.

### Priorité 3 : finitions
- [ ] Remettre la formation dans l'ordre (OpenClassrooms 2021 avant BTS 2019) et écrire « Titre RNCP niveau 6 ».
- [ ] Expliquer la période 2019-2021 (formation OpenClassrooms).
- [ ] Donner le niveau d'anglais.
- [ ] Déplacer le « Permis B » dans une ligne d'infos.
- [ ] Rendre le PDF compatible ATS : texte sélectionnable (c'est déjà le cas), titres de section standards, pas d'infos importantes dans des images.

---

## Questions à régler avant la réécriture

- Quel poste vises-tu ? Fullstack Symfony/React, back-end Symfony pur, lead dev ? L'accroche et l'ordre des compétences en dépendent.
- As-tu des **chiffres** pour Meilleurtaux et Softia : nombre d'applications, d'utilisateurs, taille d'équipe, gains de performance ?
- Quel est ton niveau réel en anglais ?
- As-tu un profil LinkedIn à jour à ajouter ?
