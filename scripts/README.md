# Scripts utilitaires

Ce dossier contient tous les scripts utilitaires du projet : seed de données, setup de stack, configuration initiale, etc.

Chaque script est accessible via `make <target>` depuis la racine du monorepo.

---

## Prérequis

- Node.js ≥ 18
- pnpm ≥ 10
- Variables d'environnement `backend/.env` configurées (notamment `DATABASE_URL`)
- Dépendances backend installées : `cd backend && pnpm install`

---

## Commandes disponibles

| Commande    | Description                                    |
|-------------|------------------------------------------------|
| `make seed` | Crée le jeu de données de test en base         |
| `make help` | Affiche toutes les commandes disponibles       |

---

## Scripts

### `seed/` — Jeu de données de test

**Fichier** : `scripts/seed/index.ts`
**Commande** : `make seed`

Crée un jeu de données minimal pour tester l'application avec un utilisateur par type de rôle.

**Ce que le script crée** :

| Email                 | Rôle              | Détails                              |
|-----------------------|-------------------|--------------------------------------|
| `admin@seed.local`    | Admin plateforme  | `isAdmin: true`                      |
| `coach@seed.local`    | Coach             | Rattaché à "Équipe Test" (COACH)     |
| `player@seed.local`   | Joueur            | Rattaché à "Équipe Test" (jersey #10)|
| `referee@seed.local`  | Arbitre           | `isReferee: true`                    |
| `user@seed.local`     | Sans affiliation  | Compte activé, aucune équipe         |

Mot de passe commun : **`Seed@1234`**

Et en contexte métier :
- 1 **Championship** "Championnat Test" (Senior, saison 2025-2026)
- 1 **Team** "Équipe Test" inscrite au championship via Phase > Groupe A

**Le script est idempotent** : on peut le relancer sans erreur, il nettoie les données précédentes avant de recréer.

**Fonctionnement technique** :
Le script TypeScript est exécuté depuis `backend/` via `tsx`. Node résout les modules depuis l'**emplacement du fichier** (pas le cwd), donc `@prisma/client` et `bcrypt` ne seraient pas trouvés sans aide. La variable `NODE_PATH=$$(pwd)/node_modules` dans le Makefile pointe explicitement vers `backend/node_modules` — Node la consulte en dernier recours avant d'échouer. Zéro `package.json` supplémentaire.

```
cleanup()       → supprime les données *@seed.local existantes
seedUsers()     → crée les 5 users (bcrypt, salt 10)
seedContext()   → championship → phase → group → team
seedRelations() → UserTeam (COACH, PLAYER) + Player (jersey)
```

---

## Ajouter un nouveau script

1. Créer un dossier `scripts/<nom>/`
2. Y placer le script principal (ex: `index.ts` ou `setup.sh`)
3. Ajouter une target dans le `Makefile` racine avec un commentaire `## Description`
4. Documenter ici dans la section **Scripts**

Exemple pour un script shell Docker :
```makefile
## Configure la stack Docker pour la première installation
install:
	./scripts/install/setup.sh
```

---

## Structure

```
scripts/
  seed/
    index.ts    ← seed TypeScript (users + team + championship)
  README.md     ← ce fichier
Makefile        ← à la racine du monorepo
```
