# Arbitre — Mes matchs

## URLs

| Page         | URL                |
| ------------ | ------------------ |
| Liste        | `/my-matches`      |
| Détail       | `/my-matches/:id`  |

## Liste — Mes matchs

- Uniquement les matchs où l'arbitre est assigné via `UserMatch`
- Filtres : par statut (à venir / score à saisir / terminé)
- Informations par ligne : date, équipes, lieu, statut, score (si saisi)

## Détail d'un match assigné

### Informations

- Équipes (domicile / extérieur), date, lieu
- Statut actuel du match
- Co-arbitres assignés (lecture seule)

### Saisie de score

- Formulaire : buts équipe domicile, buts équipe extérieur
- Bouton « Saisir le score » (si score non encore saisi)
- Bouton « Modifier le score » (si score saisi mais non validé)
- Bouton « Valider le score » (action finale — irréversible sans intervention admin)

### Déclaration de forfait

Disponible uniquement si le match est **en cours** (statut `IN_PROGRESS`) :

- Bouton « Déclarer un forfait »
- Sélecteur : équipe forfait (domicile ou extérieur)
- Confirmation requise — l'arbitre constate le forfait sur le terrain
- Action irréversible sans intervention admin
- Le score n'est pas saisi manuellement — le résultat est calculé selon la `PointsConfig` du championnat

### Après validation

- Score figé (ou résultat de forfait appliqué), affiché en lecture seule
- Bouton « Valider » remplacé par badge « Score validé » ou « Forfait »

## Maquette — Liste

![Mes matchs (Arbitre)](./mockups/my-matches-list.png)

## Maquette — Détail avec saisie

![Détail match avec saisie de score](./mockups/my-match-detail.png)
