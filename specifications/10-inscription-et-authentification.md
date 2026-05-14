# Inscription et authentification

## Définition

L'authentification couvre l'ensemble des flux permettant à un utilisateur de créer un compte, de s'identifier sur la plateforme, et de récupérer l'accès à son compte. L'inscription est **ouverte** : tout utilisateur peut créer un compte sans intervention préalable de l'admin. Le compte créé est **inactif** jusqu'à activation.

---

## Acteurs concernés

| Rôle | Implication |
|------|-------------|
| Utilisateur non inscrit | Peut s'inscrire via le formulaire public |
| Admin | Peut créer un compte pour quelqu'un, activer un compte, débloquer un compte |
| Utilisateur sans équipe | Accède à la plateforme en lecture seule, peut rejoindre ou créer une équipe |
| Coach | Valide les demandes d'adhésion à son équipe |

---

## Flux d'inscription

### Champs du formulaire

| Champ | Obligatoire | Remarques |
|-------|-------------|-----------|
| Prénom | ✅ | |
| Nom | ✅ | |
| Email | ✅ | Doit être unique en base |
| Mot de passe | ✅ | Voir règles ci-dessous |
| Équipe (rejoindre ou créer) | ❌ | Optionnel à l'inscription, disponible depuis le profil après |

### Règles de validation du mot de passe

- Longueur minimale : **8 caractères**
- Au moins **1 chiffre**
- Au moins **1 majuscule**
- Les caractères spéciaux sont autorisés (non obligatoires)

### Activation du compte

Un compte nouvellement créé est **inactif**. Deux chemins pour l'activer :

1. **Lien d'activation par email** — un email est envoyé à l'adresse fournie à l'inscription. Le lien active le compte en un clic.
2. **Activation manuelle par l'Admin** — depuis le panel utilisateurs, l'admin peut activer un compte sans passer par l'email.

**Contenu de l'email d'activation :**

- Un lien d'activation unique
- Pas d'autres informations pour l'instant (i18n et contenu enrichi spécifiés dans une phase ultérieure)

> L'implémentation de l'envoi d'email est différée (Phase ultérieure). La règle métier est posée dès maintenant.

---

## Flux de connexion

L'utilisateur saisit son **email** et son **mot de passe**.

### Cas : compte inactif

Un message d'erreur s'affiche :

> "Votre compte n'est pas encore activé. Vérifiez votre boîte email ou demandez un renvoi du lien d'activation."

Un lien / formulaire permet de **renvoyer l'email d'activation** à l'adresse enregistrée.

### Cas : mauvais mot de passe — blocage progressif

| Tentatives échouées | Comportement |
|---------------------|--------------|
| 1 à 4 | Message d'erreur générique ("email ou mot de passe incorrect") |
| 5 | Compte **bloqué** — message spécifique, connexion impossible |

Un compte bloqué ne peut être débloqué que par **l'Admin**. L'utilisateur doit contacter l'admin pour en faire la demande.

### Redirect post-connexion

Après connexion réussie, l'utilisateur est redirigé vers `/dashboard`. Le dashboard s'adapte selon le(s) rôle(s) de l'utilisateur (voir `profiles/*/overview.md`).

---

## Mot de passe oublié

1. L'utilisateur saisit son **email** sur la page de récupération.
2. Un email contenant un **lien de reset** est envoyé (si l'adresse existe en base).
3. Le lien est valide **7 jours**.
4. Le lien pointe vers un formulaire permettant de saisir un nouveau mot de passe (soumis aux mêmes règles de validation).
5. Après reset réussi, l'utilisateur est redirigé vers la page de connexion.

**Règles :**

- Le flow fonctionne pour les comptes **inactifs** (permet de récupérer l'accès avant activation).
- Le flow fonctionne pour les comptes **bloqués** — un reset réussi **débloque** automatiquement le compte.
- L'email envoyé est identique qu'une adresse soit trouvée ou non (éviter l'énumération d'emails).

---

## Première connexion — onboarding sans équipe

À la première connexion d'un utilisateur sans équipe associée, un **écran d'onboarding** est affiché (avant le dashboard).

L'écran propose deux actions :

| Action | Description |
|--------|-------------|
| Rejoindre une équipe | Soumettre une demande d'adhésion à une équipe existante |
| Créer une équipe | Soumettre une demande de création d'une nouvelle équipe |

L'utilisateur peut aussi **passer cette étape** et accéder directement au dashboard en lecture seule. Les deux actions restent disponibles depuis son profil.

---

## Rejoindre une équipe existante

Disponible : à l'onboarding et depuis la page profil.

**Flow :**

1. L'utilisateur choisit une équipe dans la liste des équipes existantes.
2. Une **demande d'adhésion** est soumise.
3. La demande est envoyée au **coach de l'équipe** et à l'**admin**.
4. **Une seule validation suffit** — le coach est prioritaire, l'admin peut également valider.
5. En cas d'**approbation** → création du `UserTeam(PLAYER, teamId)` + `Player`.
6. En cas de **refus** → aucun enregistrement créé. L'utilisateur peut soumettre une nouvelle demande.

Tant que la demande est en attente, l'utilisateur reste sans équipe (lecture seule).

---

## Créer une équipe

Disponible : à l'onboarding et depuis la page profil.

**Champs du formulaire de création :**

| Champ | Obligatoire | Remarques |
|-------|-------------|-----------|
| Nom de l'équipe | ✅ | |
| Catégorie d'âge | ✅ | U9, U11, U13, U15, U18, Senior (voir `02-championship.md`) |
| Couleur de la tenue | ✅ | |
| Terrain(s) | ✅ | Un ou plusieurs terrains où l'équipe joue à domicile |

**Flow :**

1. L'utilisateur soumet le formulaire de création.
2. L'équipe est créée immédiatement et l'utilisateur devient automatiquement **Coach** (`UserTeam(COACH, teamId)`).
3. L'utilisateur est redirigé vers son dashboard avec son nouveau rôle coach actif.

---

## Matrice de permissions

| Action | Non inscrit | Sans équipe | Admin |
| ------ | ----------- | ----------- | ----- |
| S'inscrire | ✅ | — | — |
| Se connecter | ✅ | ✅ | ✅ |
| Réinitialiser son mot de passe | ✅ | ✅ | ✅ |
| Renvoyer l'email d'activation | ✅ (compte inactif) | — | — |
| Activer un compte (email) | ✅ | — | — |
| Activer un compte (panel) | ❌ | ❌ | ✅ |
| Débloquer un compte | ❌ | ❌ | ✅ |
| Rejoindre une équipe | — | ✅ | — |
| Créer une équipe | — | ✅ | ✅ |
| Valider une demande d'adhésion | — | ❌ | ✅ |

---

## Cas limites et contraintes

- Un email déjà utilisé ne peut pas être réutilisé pour un second compte. Message d'erreur à l'inscription (sans confirmer si l'email existe — voir sécurité).
- Un lien d'activation ou de reset expiré ou déjà utilisé affiche une page d'erreur avec option de renvoi.
- L'utilisateur ne peut pas avoir deux demandes d'adhésion en attente pour la **même** équipe simultanément.
- L'utilisateur peut avoir des demandes en attente pour plusieurs équipes différentes.
- Un compte bloqué ne peut pas se connecter même avec le bon mot de passe.

---

## Questions ouvertes

- Contenu enrichi de l'email d'activation (langue, nom de l'utilisateur, branding) à spécifier lors de la phase i18n.
