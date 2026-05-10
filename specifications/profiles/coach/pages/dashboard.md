# Coach — Tableau de bord

## URL

`/dashboard`

## Description

Page d'accueil après login. Layout deux colonnes : sidebar de navigation à gauche, contenu principal à droite.

## Layout

### Sidebar

- **VUE GLOBALE**
  - Tableau de bord (actif)
  - Agenda
- **MES ÉQUIPES (n)** — liste des équipes du coach avec :
  - Avatar 2 lettres + couleur d'équipe
  - Nom de l'équipe + championnat associé
  - Bouton « + » pour créer une nouvelle équipe
- **SAISON**
  - Paramètres club
- Footer : avatar utilisateur + nom + email

### Contenu principal

#### KPI Cards — grille 2×2

| Carte            | Valeur affichée                        |
| ---------------- | -------------------------------------- |
| Équipes actives  | Nombre d'équipes dont il est coach     |
| Joueurs          | Nombre total de joueurs (toutes équipes) |
| Matchs cette semaine | Matchs à venir dans les 7 jours   |
| Bilan saison     | Victoires / Défaites (toutes équipes)  |

#### Agenda — prochains matchs

- Liste des prochains matchs des équipes du coach (triés par date)
- Informations par match : date, heure, équipes, lieu, statut
- Badge « Mon équipe » sur les équipes du coach
- Lien « Tout voir → » vers `/matches` avec filtre Mes équipes actif
- Si aucun match : message « Aucun match prévu »

## Actions disponibles

- Clic sur une équipe (sidebar) → `/teams/{id}`
- Clic sur « + » (sidebar) → création d'équipe (modal ou page dédiée)
- Clic sur un match (agenda) → détail du match (lecture seule)
- Lien « Tout voir → » → `/matches`

## Maquette

![Tableau de bord Coach](./mockups/dashboard.png)