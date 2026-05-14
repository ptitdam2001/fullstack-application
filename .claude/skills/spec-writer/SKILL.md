---
name: spec-writer
description: Conduit une interview structurée pour créer un document de spécification fonctionnelle dans specifications/. Invoquer dès que l'utilisateur veut décrire une nouvelle fonctionnalité, rédiger une spec, documenter un besoin métier, ou ajouter un fichier de spécification. Triggers : "écrire une spec", "nouvelle fonctionnalité", "créer une spec", "documenter la fonctionnalité", "spec pour X", "create spec", "functional spec", "spécification fonctionnelle", "décrire la feature".
---

## Contexte utilisateur

L'utilisateur est **product manager**. Il pense en termes de valeur métier, parcours utilisateur et besoins fonctionnels — pas en termes d'implémentation technique. Adapte ton interview et ta rédaction en conséquence :

- Formule les questions en langage métier, pas en jargon technique
- Accepte des réponses en format "user story", besoin, ou description libre — traduis-les toi-même dans le format spec
- Déduis les contraintes techniques implicites (ex. : si le PM dit "seulement les coachs peuvent faire ça", tu en déduis la règle de permission)
- Ne demande jamais "quel type de données ?" ou "quel endpoint ?" — c'est ton rôle de le dériver
- Si une réponse est incomplète sur les cas limites, pose des questions de clarification métier ("que se passe-t-il si l'équipe n'existe plus ?", pas "quel HTTP status code ?")

## Objectif

Conduire une interview structurée pour capturer le besoin métier, puis générer un document de spécification fonctionnelle dans `specifications/` au format cohérent avec les specs existantes du projet.

## Processus

### Étape 1 — Interview

Pose les questions suivantes dans cet ordre. Si l'utilisateur a déjà fourni une réponse dans son message, ne pas reposer la question — passe directement à la suivante.

**Q1 — Fonctionnalité**
"Quelle est la fonctionnalité que nous décrivons ? (titre + description courte)"

**Q2 — Acteurs**
"Qui bénéficie de cette fonctionnalité, et qui peut l'utiliser ? (plusieurs réponses possibles)
- Admin (gestionnaire de la plateforme)
- Coach (responsable d'une équipe)
- Arbitre (officiel d'un match)
- Joueur (membre d'une équipe)
- Utilisateur sans équipe (inscrit mais sans rôle)"

**Q3 — Règles métier**
"Comment ça marche ? Décris les comportements attendus, les conditions, et ce qui ne devrait pas être possible."

Si les règles sont vagues, relance avec des questions métier :
- "Que se passe-t-il si [situation limite observée] ?"
- "Y a-t-il des cas où ça ne devrait pas fonctionner ?"
- "Est-ce que quelqu'un d'autre peut annuler ou modifier cette action ?"

Attends les réponses aux trois questions avant de passer à l'étape suivante.

### Étape 2 — Lecture du contexte

Avant de rédiger, lis systématiquement :
- `specifications/01-domain-glossary.md` — termes canoniques du domaine à réutiliser
- Les autres fichiers `specifications/0*.md` — pour trouver le prochain numéro et valider le style

### Étape 3 — Rédaction

Génère le document en suivant cette structure. Adapte les sections selon le contenu : supprime les sections vides, ajoute des sous-sections si la complexité le justifie.

```markdown
# [Nom de la fonctionnalité]

## Définition

[Description claire en 2–4 phrases. Répond à "qu'est-ce que c'est ?" et "quel problème ça résout ?"]

---

## Acteurs concernés

| Rôle | Implication |
|------|-------------|
| Admin | [accès ou action] |
| Coach | [accès ou action] |
| Arbitre | [accès ou action] |
| Joueur | [accès ou action] |
| Sans équipe | [accès ou action] |

> N'inclure que les rôles avec une implication réelle.

---

## Règles métier

### [Nom de la règle 1]

[Description précise. Formule à l'affirmative. Ex : "Un match ne peut être modifié que si son statut est SCHEDULED."]

### [Nom de la règle 2]

...

---

## Matrice de permissions

| Action | Admin | Coach | Arbitre | Joueur | Sans équipe |
|--------|-------|-------|---------|--------|-------------|
| [Action 1] | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Action 2] | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## Cas limites et contraintes

- [Cas limite 1]
- [Cas limite 2]

---

## Questions ouvertes

[Décisions non encore tranchées. Supprimer si tout est clair.]
```

### Étape 4 — Nommage et création du fichier

Format du nom : `[N+1]-[nom-en-kebab-case].md`

Exemple : si le dernier fichier est `09-implementation-roadmap.md`, le nouveau fichier sera `10-[nom].md`.

Crée le fichier dans `specifications/` à la racine du projet (remonte depuis le répertoire courant si besoin, ou utilise le chemin absolu connu du dépôt).

### Étape 5 — Confirmation

Après création, affiche :
- Chemin du fichier créé
- Résumé en 2–3 bullets de ce qui a été documenté
- "Y a-t-il des règles ou cas limites à ajouter ?"

---

## Bonnes pratiques de rédaction

- **Terminologie** : utilise exclusivement les termes du glossaire. Jamais de synonymes inventés — le glossaire fait loi. Si le PM utilise un terme différent ("rencontre" au lieu de "match"), traduis dans le doc.
- **Traduction PM → spec** : reformule les descriptions en langage PM ("les coachs voient leurs matchs") en règles précises ("Un coach ne peut consulter que les matchs des équipes dont il est coach via `UserTeam(COACH, teamId)`").
- **Tables** : préfère les tables pour attributs, permissions, et états. Même style que les specs existantes (pipes alignés, header séparé par `---`).
- **Règles** : formule chaque règle à l'affirmative et de façon précise. Évite le flou ("on peut", "il est possible de").
- **Rôles** : n'inclure dans la matrice que les rôles avec une implication réelle. Un rôle absent = non concerné, pas une colonne de ❌.
- **Langue** : français uniquement, tout le document.
- **Cohérence avec l'existant** : si une règle touche un domaine déjà spécifié (match, classement, équipe…), référence le fichier concerné plutôt que de dupliquer.
