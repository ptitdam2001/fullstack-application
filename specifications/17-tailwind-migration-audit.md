# 17 — Audit de migration Tailwind CSS (web-application)

## 1. Résumé exécutif

**Objectif** : Supprimer `@import 'tailwindcss'` de `frontend/web-application/` et ne conserver Tailwind que dans `@repo/design-system`.

**Périmètre** : 88 fichiers `.tsx`/`.ts` dans `web-application/src/` utilisent des classes Tailwind (~440 usages).

**Répartition par catégorie** :

| Catégorie      | %   | Description                                |
| -------------- | --- | ------------------------------------------ |
| Layout/spacing | 60% | flex, grid, gap, p-\*, m-\*, w-\*, h-\*    |
| Typographie    | 24% | text-sm, font-bold, tracking-\*, uppercase |
| Couleurs/fonds | 10% | bg-\*, text-color-\*, border-\*            |
| Interactif     | 3%  | hover:\*, transition-\*, animate-\*        |
| Responsive     | <1% | sm:\*, md:\*, lg:\*                        |
| Autre          | 2%  | scrollbar-thin, dark:\*                    |

**Effort estimé** :

| Effort         | Fichiers | Description                                           |
| -------------- | -------- | ----------------------------------------------------- |
| S (1-3 usages) | ~49      | Remplacement direct par composants DS existants       |
| M (4-8 usages) | ~33      | Mix composants existants + nouveaux primitives        |
| L (9+ usages)  | ~6       | Refactoring significatif (formulaires, tables custom) |

---

## 2. Patterns récurrents & analyse des gaps DS

### 2.1 Patterns récurrents

| Pattern            | Classes Tailwind                                                      | Fréquence    | Remplacement DS                                  |
| ------------------ | --------------------------------------------------------------------- | ------------ | ------------------------------------------------ |
| VStack             | `flex flex-col gap-*`                                                 | 28+ fichiers | **Stack** (nouveau)                              |
| HStack             | `flex items-center gap-*`                                             | 20+ fichiers | **Stack direction="horizontal"** (nouveau)       |
| Section container  | `flex flex-1 flex-col gap-* p-*`                                      | 12+          | Stack + prop padding                             |
| Card-like panel    | `bg-card rounded-lg border p-4`                                       | 8            | Card (existant)                                  |
| Muted text         | `text-muted-foreground text-{xs,sm}`                                  | 32           | Typography.BodySmall / Typography.Caption        |
| Page heading       | `text-2xl font-bold`                                                  | 8            | Typography.Title2                                |
| Section label      | `mb-3 text-sm font-semibold uppercase tracking-wider`                 | 6+           | **SectionLabel** (nouveau ou variant Typography) |
| Center             | `flex items-center justify-center`                                    | 14+          | **Center** (nouveau)                             |
| Icon size          | `h-4 w-4` / `h-5 w-5`                                                 | 19           | Taille par défaut icônes ou prop `size`          |
| Status badge       | `rounded bg-{color}-100 px-1.5 py-0.5 font-semibold text-{color}-700` | 6            | Badge avec variants couleur (enrichir)           |
| Form field wrapper | `relative grid w-full max-w-sm items-center gap-1.5 pb-6`             | 6            | FormField (form-factory)                         |
| Auth page layout   | `flex min-h-screen items-center justify-center p-4`                   | 2            | Layout dédié ou Center                           |
| Spinner            | `animate-spin` (sur Loader2)                                          | 13           | **Spinner** (nouveau)                            |
| Scrollbar          | `scrollbar-thin scrollbar-track-* scrollbar-thumb-*`                  | 5            | CSS module ou plugin DS                          |
| Dialog override    | `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ...`        | 3            | Dialog DS (variant ou suppression override)      |

### 2.2 Composants DS à créer

| Composant        | Justification                                                 | Fichiers impactés |
| ---------------- | ------------------------------------------------------------- | ----------------- |
| **Stack**        | Remplace `flex flex-col/row gap-*` — pattern le plus fréquent | ~48 fichiers      |
| **Center**       | Remplace `flex items-center justify-center`                   | ~14 fichiers      |
| **Spinner**      | Remplace `<Loader2 className="animate-spin" />`               | ~13 fichiers      |
| **SectionLabel** | Remplace `text-sm font-semibold uppercase tracking-wider`     | ~6 fichiers       |

### 2.3 Composants DS à enrichir

| Composant  | Enrichissement                                                | Fichiers impactés |
| ---------- | ------------------------------------------------------------- | ----------------- |
| **Badge**  | Variants couleur sémantiques (success, warning, danger, info) | ~6 fichiers       |
| **Dialog** | Supprimer le besoin d'override de positionnement              | 3 fichiers        |

### 2.4 Duplication identifiée

`Common/Table/*` (9 fichiers) duplique intégralement le composant Table du DS. Migration = remplacement direct.

---

## 3. Inventaire par fichier

### 3.1 Common (22 fichiers)

#### `Common/Table/Body.tsx`

| Catégorie | Classes                   |
| --------- | ------------------------- |
| Décoratif | table-row-group, border-0 |

**Remplacement** : Table DS (Body) — remplacement direct
**Effort** : S
**Deps DS** : aucune

#### `Common/Table/Caption.tsx`

| Catégorie | Classes                        |
| --------- | ------------------------------ |
| Typo      | text-muted-foreground, text-sm |
| Layout    | mt-4                           |

**Remplacement** : Table DS (Caption)
**Effort** : S
**Deps DS** : aucune

#### `Common/Table/Cell.tsx`

| Catégorie | Classes                                    |
| --------- | ------------------------------------------ |
| Layout    | p-2, align-middle, pr-0, translate-y-[2px] |
| Décoratif | table-cell                                 |

**Remplacement** : Table DS (Cell)
**Effort** : S
**Deps DS** : aucune

#### `Common/Table/Container.tsx`

| Catégorie | Classes                          |
| --------- | -------------------------------- |
| Layout    | w-full, overflow-auto, relative  |
| Autre     | scrollbar-thin                   |
| Décoratif | table, caption-bottom, outline-0 |

**Remplacement** : Table DS (Root) — scrollbar-thin à gérer via CSS module
**Effort** : S
**Deps DS** : aucune

#### `Common/Table/Footer.tsx`

| Catégorie | Classes                                   |
| --------- | ----------------------------------------- |
| Décoratif | table-footer-group, table-row, table-cell |
| Layout    | border-t, font-medium, border-b-0         |

**Remplacement** : Table DS (Footer)
**Effort** : S
**Deps DS** : aucune

#### `Common/Table/Head.tsx`

| Catégorie | Classes                                                |
| --------- | ------------------------------------------------------ |
| Layout    | sticky, top-0, z-10, h-10, px-2, pr-0, translate-y-0.5 |
| Décoratif | table-cell, bg-primary, font-medium                    |
| Typo      | text-muted-foreground                                  |

**Remplacement** : Table DS (Head)
**Effort** : S
**Deps DS** : aucune

#### `Common/Table/Header.tsx`

| Catégorie | Classes                                 |
| --------- | --------------------------------------- |
| Décoratif | table-header-group, table-row, border-b |

**Remplacement** : Table DS (Header)
**Effort** : S
**Deps DS** : aucune

#### `Common/Table/Row.tsx`

| Catégorie  | Classes                                                              |
| ---------- | -------------------------------------------------------------------- |
| Interactif | hover:bg-muted/50, data-[state=selected]:bg-muted, transition-colors |
| Décoratif  | table-row, border-b, outline-0                                       |

**Remplacement** : Table DS (Row)
**Effort** : S
**Deps DS** : aucune

#### `Common/Table/TablePagination.tsx`

| Catégorie | Classes                                                                  |
| --------- | ------------------------------------------------------------------------ |
| Layout    | flex, max-w-sm, items-center, justify-between, p-4, rounded, border, p-2 |

**Remplacement** : Pagination DS + Select DS
**Effort** : M
**Deps DS** : aucune

#### `Common/Calendar/CalendarContainer/CalendarContainer.tsx`

| Catégorie | Classes                               |
| --------- | ------------------------------------- |
| Layout    | flex, h-full, w-full, flex-col, gap-2 |

**Remplacement** : Stack (nouveau)
**Effort** : S
**Deps DS** : Stack

#### `Common/Calendar/CalendarContent/CalendarContent.tsx`

| Catégorie | Classes                                                                       |
| --------- | ----------------------------------------------------------------------------- |
| Layout    | grid, grid-cols-7, gap-2, min-h-16, items-center, justify-center, text-center |
| Typo      | font-bold, text-sm, text-gray-500                                             |

**Remplacement** : Grid DS + Typography
**Effort** : M
**Deps DS** : aucune

#### `Common/Calendar/CalendarNavigation/CalendarNavigation.tsx`

| Catégorie | Classes                   |
| --------- | ------------------------- |
| Layout    | flex, items-center, gap-2 |

**Remplacement** : Stack horizontal (nouveau)
**Effort** : S
**Deps DS** : Stack

#### `Common/ErrorBoundary.tsx`

| Catégorie  | Classes                                                                       |
| ---------- | ----------------------------------------------------------------------------- |
| Layout     | rounded-lg, border, p-4, mb-2, mb-3, rounded, px-4, py-2                      |
| Typo       | font-semibold, text-sm                                                        |
| Couleurs   | border-red-200, bg-red-50, text-red-800, text-red-600, bg-red-600, text-white |
| Interactif | hover:bg-red-700                                                              |

**Remplacement** : Alert DS
**Effort** : M
**Deps DS** : aucune

#### `Common/Input/ColorInput/ColorInput.tsx`

| Catégorie | Classes                                                      |
| --------- | ------------------------------------------------------------ |
| Layout    | flex, content-center, gap-2, py-2, h-9, w-9, h-52, w-52, p-2 |
| Décoratif | border-rounded, rounded-lg, border, border-black             |

**Remplacement** : Popover DS déjà utilisé — classes résiduelles à CSS module
**Effort** : S
**Deps DS** : aucune

#### `Common/Input/TextInput/ControlledTextInput.tsx`

| Catégorie  | Classes                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------- |
| Layout     | relative, grid, w-full, max-w-sm, items-center, gap-1.5, pb-6, absolute, bottom-1, h-4, h-0   |
| Typo       | text-sm, font-medium, leading-none                                                            |
| Couleurs   | text-red-500                                                                                  |
| Interactif | transition-[height], duration-300, peer-disabled:cursor-not-allowed, peer-disabled:opacity-70 |

**Remplacement** : FormField (form-factory) + Label DS + Input DS
**Effort** : M
**Deps DS** : aucune

#### `Common/Loading/Empty.tsx`

| Catégorie | Classes                                                                |
| --------- | ---------------------------------------------------------------------- |
| Layout    | flex, min-h-screen, items-center, justify-center, p-4, flex-row, gap-2 |

**Remplacement** : Center (nouveau) + Card DS
**Effort** : S
**Deps DS** : Center

#### `Common/Loading/LinearProgress.tsx`

| Catégorie | Classes                      |
| --------- | ---------------------------- |
| Layout    | h-full, w-full, rounded-full |

**Remplacement** : Skeleton DS déjà utilisé
**Effort** : S
**Deps DS** : aucune

#### `Common/Loading/ListLoader.tsx`

| Catégorie | Classes                                               |
| --------- | ----------------------------------------------------- |
| Layout    | flex, w-full, flex-col, gap-4, py-1, h-10, rounded-md |

**Remplacement** : Stack (nouveau) + Skeleton DS
**Effort** : S
**Deps DS** : Stack

#### `Common/Loading/PageLoader.tsx`

| Catégorie  | Classes                                                                |
| ---------- | ---------------------------------------------------------------------- |
| Layout     | flex, min-h-screen, items-center, justify-center, p-4, flex-row, gap-2 |
| Interactif | animate-spin                                                           |

**Remplacement** : Center (nouveau) + Spinner (nouveau)
**Effort** : S
**Deps DS** : Center, Spinner

#### `Common/Loading/TableLoader.tsx`

| Catégorie | Classes                                                                                     |
| --------- | ------------------------------------------------------------------------------------------- |
| Layout    | flex, w-full, flex-col, gap-4, items-center, justify-between, gap-2, h-10, h-12, rounded-md |

**Remplacement** : Stack (nouveau) + Skeleton DS
**Effort** : S
**Deps DS** : Stack

#### `Common/MenuBar/MenuBar.tsx`

| Catégorie | Classes                                                                  |
| --------- | ------------------------------------------------------------------------ |
| Layout    | flex, w-full, flex-row, gap-1, px-1.5, py-1, gap-0.5, items-center, px-1 |

**Remplacement** : Stack horizontal (nouveau)
**Effort** : S
**Deps DS** : Stack

---

### 3.2 Layouts (7 fichiers)

#### `Layouts/AnonymousLayout.tsx`

| Catégorie  | Classes               |
| ---------- | --------------------- |
| Layout     | p-1                   |
| Interactif | dark (class modifier) |

**Remplacement** : Layout DS déjà utilisé — padding en prop ou CSS module
**Effort** : S
**Deps DS** : aucune

#### `Layouts/ConnectedLayout.tsx`

| Catégorie | Classes                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| Layout    | h-svh, min-w-0, px-2, py-2                                                                                         |
| Autre     | scrollbar-track-background, scrollbar-thumb-gray-600, dark:scrollbar-track-gray-800, dark:scrollbar-thumb-gray-500 |

**Remplacement** : SidebarProvider/SidebarInset DS — scrollbar via CSS module
**Effort** : S
**Deps DS** : aucune

#### `Layouts/TopBar.tsx`

| Catégorie  | Classes                                               |
| ---------- | ----------------------------------------------------- |
| Layout     | flex, shrink-0, items-center, gap-2, grow, mx-2, pr-4 |
| Interactif | transition-[width], ease-linear                       |

**Remplacement** : Stack horizontal (nouveau)
**Effort** : S
**Deps DS** : Stack

#### `Layouts/components/AppSidebarFooter.tsx`

| Catégorie | Classes  |
| --------- | -------- |
| Layout    | h-5, w-5 |

**Remplacement** : Avatar DS déjà utilisé — taille icône à standardiser
**Effort** : S
**Deps DS** : aucune

#### `Layouts/components/CoachAppSidebar.tsx`

| Catégorie | Classes                                                                |
| --------- | ---------------------------------------------------------------------- |
| Layout    | flex, h-5, w-5, shrink-0, items-center, justify-center, rounded        |
| Typo      | font-semibold, text-white, text-muted-foreground, text-xs, text-[10px] |

**Remplacement** : Sidebar DS — badge équipe custom → Badge DS avec variant couleur
**Effort** : M
**Deps DS** : Badge (enrichir)

#### `Layouts/components/ConnectedAppSidebar.tsx`

| Catégorie | Classes    |
| --------- | ---------- |
| Layout    | px-1, pt-1 |

**Remplacement** : Sidebar DS — padding résiduel à CSS module
**Effort** : S
**Deps DS** : aucune

#### `Layouts/components/PlayerAppSidebar.tsx`

| Catégorie | Classes                                                                |
| --------- | ---------------------------------------------------------------------- |
| Layout    | flex, h-5, w-5, shrink-0, items-center, justify-center, rounded        |
| Typo      | font-semibold, text-white, text-muted-foreground, text-xs, text-[10px] |

**Remplacement** : Sidebar DS — badge équipe custom → Badge DS avec variant couleur
**Effort** : M
**Deps DS** : Badge (enrichir)

---

### 3.3 Auth (13 fichiers)

#### `Auth/pages/ActivatePage.tsx`

| Catégorie | Classes                |
| --------- | ---------------------- |
| Layout    | w-full, max-w-sm, py-8 |

**Remplacement** : Layout DS déjà utilisé
**Effort** : S
**Deps DS** : aucune

#### `Auth/pages/ForgottenPasswordPage.tsx`

| Catégorie  | Classes                                                        |
| ---------- | -------------------------------------------------------------- |
| Layout     | w-full, max-w-sm, space-y-6, py-8, block, text-center, text-sm |
| Couleurs   | text-blue-600                                                  |
| Interactif | hover:underline                                                |

**Remplacement** : Stack (nouveau) + Typography
**Effort** : S
**Deps DS** : Stack

#### `Auth/pages/LoginPage.tsx`

| Catégorie  | Classes                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| Layout     | grid, flex-1, flex, items-center, justify-center, p-8, w-full, max-w-sm, space-y-6, text-center, text-sm |
| Couleurs   | text-slate-500, text-blue-600                                                                            |
| Interactif | hover:underline                                                                                          |
| Responsive | md:grid-cols-2                                                                                           |

**Remplacement** : Grid DS + Center (nouveau) + Stack (nouveau) + Typography
**Effort** : M
**Deps DS** : Stack, Center

#### `Auth/pages/MyProfile.tsx`

| Catégorie | Classes                      |
| --------- | ---------------------------- |
| Layout    | p-6, mt-4, space-y-1         |
| Typo      | text-2xl, font-bold, text-sm |
| Couleurs  | text-slate-600               |

**Remplacement** : Typography.Title2 + Typography.BodySmall
**Effort** : S
**Deps DS** : aucune

#### `Auth/pages/RegisterPage.tsx`

| Catégorie  | Classes                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| Layout     | grid, flex-1, flex, items-center, justify-center, p-8, w-full, max-w-sm, space-y-6, text-center, text-sm |
| Couleurs   | text-slate-500, text-blue-600                                                                            |
| Interactif | hover:underline                                                                                          |
| Responsive | md:grid-cols-2                                                                                           |

**Remplacement** : Grid DS + Center (nouveau) + Stack (nouveau) + Typography
**Effort** : M
**Deps DS** : Stack, Center

#### `Auth/pages/ResetPasswordPage.tsx`

| Catégorie | Classes                |
| --------- | ---------------------- |
| Layout    | w-full, max-w-sm, py-8 |

**Remplacement** : Layout DS
**Effort** : S
**Deps DS** : aucune

#### `Auth/ui/ActivateForm/ActivateForm.tsx`

| Catégorie  | Classes                                                     |
| ---------- | ----------------------------------------------------------- |
| Layout     | flex, flex-col, gap-4, gap-6, w-full, max-w-sm              |
| Typo       | font-medium, text-2xl, font-bold, text-sm                   |
| Couleurs   | text-red-600, text-green-600, text-slate-600, text-blue-600 |
| Interactif | hover:underline, animate-spin                               |

**Remplacement** : Stack (nouveau) + Typography + Spinner (nouveau)
**Effort** : M
**Deps DS** : Stack, Spinner

#### `Auth/ui/AuthLeftPanel/AuthLeftPanel.tsx`

| Catégorie  | Classes                                                                        |
| ---------- | ------------------------------------------------------------------------------ |
| Layout     | hidden, h-full, flex-col, justify-between, p-10, text-white                    |
| Typo       | text-2xl, font-bold, tracking-tight, text-3xl, space-y-2, text-xs              |
| Couleurs   | bg-gradient-to-b, from-slate-900, to-slate-700, text-slate-300, text-slate-400 |
| Responsive | md:flex                                                                        |

**Remplacement** : Layout DS + Typography — gradient en CSS module
**Effort** : M
**Deps DS** : aucune

#### `Auth/ui/ForgottenPasswordForm/ForgottenPasswordForm.tsx`

| Catégorie  | Classes                                        |
| ---------- | ---------------------------------------------- |
| Layout     | flex, flex-col, gap-4, gap-6, w-full, max-w-sm |
| Typo       | font-medium, text-2xl, text-sm                 |
| Interactif | animate-spin                                   |

**Remplacement** : Stack (nouveau) + Typography + Spinner (nouveau)
**Effort** : M
**Deps DS** : Stack, Spinner

#### `Auth/ui/OnboardingScreen/OnboardingScreen.tsx`

| Catégorie  | Classes                                                                                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout     | w-full, max-w-lg, space-y-8, py-8, space-y-2, space-y-4, rounded-lg, border, p-6, space-y-3, rounded-md, border, px-3, py-2, flex, items-center, justify-between |
| Typo       | text-3xl, font-bold, font-semibold, text-sm, text-xs                                                                                                             |
| Couleurs   | text-slate-500, text-slate-400                                                                                                                                   |
| Interactif | animate-spin                                                                                                                                                     |

**Remplacement** : Stack (nouveau) + Card DS + Typography + Select DS + Spinner (nouveau) + SectionLabel (nouveau)
**Effort** : L
**Deps DS** : Stack, Spinner, SectionLabel

#### `Auth/ui/RegisterForm/RegisterForm.tsx`

| Catégorie  | Classes                                                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout     | flex, flex-col, gap-4, gap-6, relative, grid, w-full, max-w-sm, items-center, gap-1.5, pb-6, mb-4, mt-1, flex, gap-1, h-1, flex-1, rounded-full, ml-2 |
| Typo       | font-medium, text-sm, leading-none, text-xs                                                                                                           |
| Couleurs   | text-red-500, text-green-600, text-slate-500, bg-red-400, bg-orange-400, bg-yellow-400, bg-green-500, bg-slate-200                                    |
| Interactif | animate-spin                                                                                                                                          |

**Remplacement** : Stack (nouveau) + FormField + Typography + Progress DS + Spinner (nouveau)
**Effort** : L
**Deps DS** : Stack, Spinner

#### `Auth/ui/ResetPasswordForm/ResetPasswordForm.tsx`

| Catégorie  | Classes                                                                              |
| ---------- | ------------------------------------------------------------------------------------ |
| Layout     | flex, flex-col, gap-6, relative, grid, w-full, max-w-sm, items-center, gap-1.5, pb-6 |
| Typo       | text-2xl, font-bold, text-sm, leading-none, font-medium                              |
| Couleurs   | text-red-500                                                                         |
| Interactif | animate-spin                                                                         |

**Remplacement** : Stack (nouveau) + FormField + Typography + Spinner (nouveau)
**Effort** : M
**Deps DS** : Stack, Spinner

#### `Auth/ui/SigninForm/SigninForm.tsx`

| Catégorie  | Classes                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------ |
| Layout     | flex, flex-col, gap-6, relative, grid, w-full, max-w-sm, items-center, gap-1.5, pb-6, mb-4 |
| Typo       | text-2xl, font-bold, text-sm, leading-none, font-medium                                    |
| Couleurs   | text-red-500, text-blue-600                                                                |
| Interactif | hover:underline, animate-spin                                                              |

**Remplacement** : Stack (nouveau) + FormField + Typography + Spinner (nouveau)
**Effort** : M
**Deps DS** : Stack, Spinner

---

### 3.4 Dashboard (23 fichiers)

#### `Dashboard/ui/AdminDashboard/AdminDashboard.tsx`

| Catégorie  | Classes                            |
| ---------- | ---------------------------------- |
| Layout     | flex, flex-1, flex-col, gap-4, p-4 |
| Responsive | lg:grid-cols-2                     |

**Remplacement** : Stack (nouveau) + Grid DS
**Effort** : S
**Deps DS** : Stack

#### `Dashboard/ui/AdminDashboard/AdminKpiCards.tsx`

| Catégorie  | Classes                                                                         |
| ---------- | ------------------------------------------------------------------------------- |
| Layout     | flex, flex-col, gap-2, gap-4, mb-6, grid, grid-cols-2, items-center, gap-1.5    |
| Typo       | text-xs, font-medium, text-2xl, font-semibold, tracking-tight                   |
| Couleurs   | bg-card, border, border-destructive/40, text-muted-foreground, text-destructive |
| Décoratif  | rounded-lg, p-4                                                                 |
| Interactif | hover:bg-accent, transition-colors                                              |
| Responsive | sm:grid-cols-4                                                                  |

**Remplacement** : Card DS + Grid DS + Stack (nouveau) + Typography
**Effort** : M
**Deps DS** : Stack

#### `Dashboard/ui/AdminDashboard/AdminLiveFeed.tsx`

| Catégorie | Classes                                |
| --------- | -------------------------------------- |
| Layout    | flex, flex-col, gap-2, mb-3, p-4       |
| Typo      | text-sm, font-semibold                 |
| Couleurs  | bg-card, border, text-muted-foreground |
| Décoratif | rounded-lg                             |

**Remplacement** : Card DS + Stack (nouveau) + SectionLabel (nouveau)
**Effort** : S
**Deps DS** : Stack, SectionLabel

#### `Dashboard/ui/AdminDashboard/AdminLiveFeedEvent.tsx`

| Catégorie  | Classes                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Layout     | flex, items-center, gap-3, flex-1, p-3                                                                                              |
| Typo       | text-sm, text-xs, font-medium                                                                                                       |
| Couleurs   | bg-card, border, border-l-4, border-l-amber-400, border-l-blue-400, border-l-destructive, border-l-green-400, text-muted-foreground |
| Décoratif  | rounded-md, rounded, px-2, py-0.5                                                                                                   |
| Interactif | hover:text-foreground, hover:bg-primary/90, transition-colors                                                                       |

**Remplacement** : Card DS + Badge DS + Stack (nouveau)
**Effort** : M
**Deps DS** : Stack, Badge (enrichir)

#### `Dashboard/ui/AdminDashboard/AdminLiveFeedEventLabel.tsx`

| Catégorie | Classes  |
| --------- | -------- |
| Layout    | flex-col |

**Remplacement** : Stack (nouveau) — Typography DS déjà utilisé
**Effort** : S
**Deps DS** : Stack

#### `Dashboard/ui/AdminDashboard/AdminQuickActions.tsx`

| Catégorie  | Classes                                                        |
| ---------- | -------------------------------------------------------------- |
| Layout     | flex, flex-wrap, gap-2, mb-6, inline-flex, items-center, gap-2 |
| Typo       | text-sm, font-medium                                           |
| Couleurs   | bg-secondary, text-secondary-foreground                        |
| Décoratif  | rounded-md, px-3, py-1.5                                       |
| Interactif | hover:bg-secondary/80, transition-colors                       |

**Remplacement** : Button DS + Stack (nouveau)
**Effort** : S
**Deps DS** : Stack

#### `Dashboard/ui/AdminDashboard/AdminUserPieChart.tsx`

| Catégorie | Classes                                             |
| --------- | --------------------------------------------------- |
| Layout    | flex, h-48, items-center, justify-center, mb-3, p-4 |
| Typo      | text-sm, font-semibold                              |
| Couleurs  | bg-card, border, text-muted-foreground              |
| Décoratif | rounded-lg                                          |

**Remplacement** : Card DS + Center (nouveau) + SectionLabel (nouveau)
**Effort** : S
**Deps DS** : Center, SectionLabel

#### `Dashboard/ui/CoachDashboard/CoachAgenda.tsx`

| Catégorie | Classes                       |
| --------- | ----------------------------- |
| Layout    | space-y-1, py-10, text-center |
| Typo      | text-sm                       |
| Couleurs  | text-muted-foreground         |

**Remplacement** : Stack (nouveau) + Typography
**Effort** : S
**Deps DS** : Stack

#### `Dashboard/ui/CoachDashboard/CoachAgendaRow.tsx`

| Catégorie  | Classes                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| Layout     | grid, grid-cols-[48px_1fr_auto], items-center, gap-3, px-3, py-2.5, min-w-0, truncate, mt-0.5, gap-1.5         |
| Typo       | text-base, leading-tight, font-semibold, text-[9px], font-medium, tracking-widest, uppercase, text-xs, text-sm |
| Couleurs   | bg-secondary, bg-background, border, text-muted-foreground                                                     |
| Décoratif  | rounded-lg, cursor-pointer                                                                                     |
| Interactif | hover:bg-secondary                                                                                             |

**Remplacement** : Card DS + Grid DS + SectionLabel (nouveau)
**Effort** : M
**Deps DS** : SectionLabel

#### `Dashboard/ui/CoachDashboard/CoachKpiCards.tsx`

| Catégorie  | Classes                                                                      |
| ---------- | ---------------------------------------------------------------------------- |
| Layout     | flex, flex-col, gap-2, gap-4, mb-6, grid, grid-cols-2, items-center, gap-1.5 |
| Typo       | text-xs, font-medium, text-2xl, font-semibold, tracking-tight                |
| Couleurs   | bg-card, border, text-muted-foreground                                       |
| Décoratif  | rounded-lg, p-4                                                              |
| Responsive | sm:grid-cols-4                                                               |

**Remplacement** : Card DS + Grid DS + Stack (nouveau) + Typography
**Effort** : M
**Deps DS** : Stack

#### `Dashboard/ui/CoachDashboard/CoachTeamTile.tsx`

| Catégorie  | Classes                                                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Layout     | flex, cursor-pointer, items-center, gap-3, p-3, h-9, w-9, flex-shrink-0, items-center, justify-center, min-w-0, truncate, mt-0.5 |
| Typo       | text-xs, font-semibold, text-white, text-sm                                                                                      |
| Couleurs   | bg-background, text-muted-foreground                                                                                             |
| Décoratif  | rounded-lg, border                                                                                                               |
| Interactif | hover:bg-secondary, cursor-pointer                                                                                               |

**Remplacement** : Card DS + Button DS + Stack (nouveau)
**Effort** : M
**Deps DS** : Stack

#### `Dashboard/ui/DashboardTabs/CoachTab/CoachStandingCompact.tsx`

| Catégorie  | Classes                             |
| ---------- | ----------------------------------- |
| Typo       | text-xs, font-semibold              |
| Couleurs   | text-muted-foreground, text-primary |
| Interactif | hover:underline                     |

**Remplacement** : Typography.Caption + Link
**Effort** : S
**Deps DS** : aucune

#### `Dashboard/ui/DashboardTabs/CoachTab/CoachTab.tsx`

| Catégorie  | Classes                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| Layout     | flex, flex-1, flex-col, gap-6, p-4, pt-0, items-center, justify-between, px-4, py-2, gap-4, grid, gap-6, mb-3 |
| Typo       | text-sm, font-semibold, tracking-wider, uppercase, font-medium                                                |
| Couleurs   | bg-card, border, text-muted-foreground                                                                        |
| Décoratif  | rounded-lg                                                                                                    |
| Responsive | lg:grid-cols-[280px_1fr]                                                                                      |

**Remplacement** : Card DS + Stack (nouveau) + Grid DS + SectionLabel (nouveau) + Typography
**Effort** : M
**Deps DS** : Stack, SectionLabel

#### `Dashboard/ui/DashboardTabs/CoachTab/CoachWDLBadges.tsx`

| Catégorie | Classes                                                                            |
| --------- | ---------------------------------------------------------------------------------- |
| Layout    | flex, gap-1                                                                        |
| Typo      | text-xs, font-semibold                                                             |
| Couleurs  | bg-green-100, text-green-700, bg-gray-100, text-gray-600, bg-red-100, text-red-700 |
| Décoratif | rounded, px-1.5, py-0.5                                                            |

**Remplacement** : Badge DS avec variants couleur (success/neutral/danger)
**Effort** : S
**Deps DS** : Badge (enrichir)

#### `Dashboard/ui/DashboardTabs/DashboardTabs.tsx`

| Catégorie  | Classes                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------- |
| Layout     | flex, flex-1, flex-col, items-center, justify-center, gap-4, p-8, text-center, mb-4, w-fit, gap-0 |
| Typo       | text-sm, font-medium                                                                              |
| Couleurs   | text-muted-foreground, text-primary                                                               |
| Interactif | hover:underline                                                                                   |

**Remplacement** : Tabs DS + Stack (nouveau) + Center (nouveau)
**Effort** : M
**Deps DS** : Stack, Center

#### `Dashboard/ui/DashboardTabs/PlayerTab/PlayerRecentResults.tsx`

| Catégorie  | Classes                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------ |
| Layout     | mb-2, flex, flex-col, gap-1, items-center, gap-2, h-5, w-5, shrink-0, flex-1, truncate, shrink-0 |
| Typo       | text-xs, font-semibold, tracking-wider, uppercase, font-mono, font-bold, text-[10px]             |
| Couleurs   | bg-green-500, bg-muted-foreground, bg-red-500, text-white, text-muted-foreground                 |
| Décoratif  | rounded                                                                                          |
| Interactif | hover:text-foreground                                                                            |

**Remplacement** : List DS + Badge DS + Stack (nouveau) + SectionLabel (nouveau)
**Effort** : M
**Deps DS** : Stack, SectionLabel, Badge (enrichir)

#### `Dashboard/ui/DashboardTabs/PlayerTab/PlayerStandingsTable.tsx`

| Catégorie | Classes                                                        |
| --------- | -------------------------------------------------------------- |
| Layout    | overflow-x-auto, mb-2, w-full, text-center, py-1, pr-3, py-1.5 |
| Typo      | text-sm, font-semibold, text-xs, font-bold                     |
| Couleurs  | text-muted-foreground, bg-primary/10                           |
| Décoratif | border-b, last:border-0                                        |

**Remplacement** : Table DS (remplacement complet)
**Effort** : M
**Deps DS** : aucune

#### `Dashboard/ui/DashboardTabs/PlayerTab/PlayerTab.tsx`

| Catégorie | Classes                                  |
| --------- | ---------------------------------------- |
| Layout    | flex, flex-1, flex-col, gap-4, p-4, pt-0 |
| Typo      | text-sm                                  |
| Couleurs  | text-muted-foreground                    |

**Remplacement** : Stack (nouveau) + Layout DS
**Effort** : S
**Deps DS** : Stack

#### `Dashboard/ui/DashboardTabs/PlayerTab/PlayerTeamCard.tsx`

| Catégorie  | Classes                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Layout     | flex, flex-col, gap-4, items-center, gap-3, size-4, shrink-0, flex-1, justify-between, mb-2, gap-1 |
| Typo       | font-semibold, text-xs, tracking-wider, uppercase                                                  |
| Couleurs   | bg-card, border, text-primary, text-muted-foreground                                               |
| Décoratif  | rounded-lg, p-4, rounded-full                                                                      |
| Interactif | hover:underline, hover:text-foreground                                                             |

**Remplacement** : Card DS + Stack (nouveau) + List DS + SectionLabel (nouveau) + Typography
**Effort** : M
**Deps DS** : Stack, SectionLabel

#### `Dashboard/ui/DashboardTabs/RefereeTab/RefereeTab.tsx`

| Catégorie | Classes                                                                     |
| --------- | --------------------------------------------------------------------------- |
| Layout    | flex, flex-1, flex-col, items-center, justify-center, p-8, gap-6, p-4, pt-0 |
| Typo      | text-sm                                                                     |
| Couleurs  | text-muted-foreground                                                       |

**Remplacement** : Stack (nouveau) + Center (nouveau)
**Effort** : S
**Deps DS** : Stack, Center

#### `Dashboard/ui/DashboardTabs/RefereeTab/RefereeUpcomingMatches.tsx`

| Catégorie  | Classes                                                                         |
| ---------- | ------------------------------------------------------------------------------- |
| Layout     | mb-3, flex, flex-col, gap-2, items-center, justify-between, px-4, py-3, gap-0.5 |
| Typo       | text-sm, font-semibold, tracking-wider, uppercase, font-medium, text-xs         |
| Couleurs   | bg-card, border, text-muted-foreground, text-primary                            |
| Décoratif  | rounded-lg                                                                      |
| Interactif | hover:underline                                                                 |

**Remplacement** : Card DS + List DS + Stack (nouveau) + SectionLabel (nouveau)
**Effort** : M
**Deps DS** : Stack, SectionLabel

#### `Dashboard/ui/DashboardTabs/RefereeTab/RefereeUrgentMatches.tsx`

| Catégorie  | Classes                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| Layout     | mb-3, flex, flex-col, gap-2, items-center, justify-between, px-4, py-3, gap-0.5, gap-2                       |
| Typo       | text-sm, font-semibold, tracking-wider, uppercase, font-medium, text-xs                                      |
| Couleurs   | border-red-500, bg-red-50, dark:bg-red-950/20, bg-red-100, text-red-700, text-muted-foreground, text-primary |
| Décoratif  | rounded-lg, rounded, px-1.5, py-0.5                                                                          |
| Interactif | hover:underline                                                                                              |

**Remplacement** : Card DS + Alert DS + Badge DS + Stack (nouveau) + SectionLabel (nouveau)
**Effort** : M
**Deps DS** : Stack, SectionLabel, Badge (enrichir)

---

### 3.5 Teams (17 fichiers)

#### `Teams/TeamLayout.tsx`

| Catégorie | Classes                        |
| --------- | ------------------------------ |
| Layout    | flex, h-full, w-full, flex-col |

**Remplacement** : Layout DS (Root/Content)
**Effort** : S
**Deps DS** : aucune

#### `Teams/pages/TeamCreatePage.tsx`

| Catégorie  | Classes                                                                            |
| ---------- | ---------------------------------------------------------------------------------- |
| Layout     | fixed, top-1/2, left-1/2, flex, flex-col, -translate-x-1/2, -translate-y-1/2, grow |
| Couleurs   | dark:bg-gray-600                                                                   |
| Décoratif  | rounded-md, shadow-(--shadow-6), p-6.25                                            |
| Responsive | w-[90vw], max-h-[85vh], max-w-125                                                  |
| Interactif | data-[state=open]:animate-contentShow, focus:outline-none                          |

**Remplacement** : Dialog DS déjà utilisé — supprimer override de positionnement
**Effort** : M
**Deps DS** : aucune

#### `Teams/pages/TeamEditPage.tsx`

| Catégorie  | Classes                                                                            |
| ---------- | ---------------------------------------------------------------------------------- |
| Layout     | fixed, top-1/2, left-1/2, flex, flex-col, -translate-x-1/2, -translate-y-1/2, grow |
| Couleurs   | dark:bg-gray-600                                                                   |
| Décoratif  | rounded-md, shadow-(--shadow-6), p-6.25                                            |
| Responsive | w-[90vw], max-h-[85vh], max-w-125                                                  |
| Interactif | data-[state=open]:animate-contentShow, focus:outline-none                          |

**Remplacement** : Dialog DS déjà utilisé — supprimer override de positionnement
**Effort** : M
**Deps DS** : aucune

#### `Teams/pages/TeamPage.tsx`

| Catégorie | Classes                                                                       |
| --------- | ----------------------------------------------------------------------------- |
| Layout    | flex, h-full, w-full, gap-1, grow, flex-col, gap-1.5, overflow-auto, h-[80vh] |
| Typo      | text-lg                                                                       |
| Autre     | scrollbar-thin                                                                |
| Spacing   | p-2, px-2, py-2                                                               |

**Remplacement** : Layout DS + Card DS + Stack (nouveau) — scrollbar via CSS module
**Effort** : M
**Deps DS** : Stack

#### `Teams/pages/TeamsPage.tsx`

| Catégorie | Classes     |
| --------- | ----------- |
| Layout    | flex, gap-1 |

**Remplacement** : Layout DS déjà utilisé + Stack (nouveau)
**Effort** : S
**Deps DS** : Stack

#### `Teams/ui/TeamCalendarView/TeamCalendarView.tsx`

| Catégorie | Classes                                                    |
| --------- | ---------------------------------------------------------- |
| Layout    | flex, h-full, w-full, flex-col, gap-2, overflow-auto, grow |
| Décoratif | rounded-md, shadow-md, py-1                                |

**Remplacement** : Stack (nouveau) + Card DS
**Effort** : S
**Deps DS** : Stack

#### `Teams/ui/TeamCard/TeamCard.tsx`

| Catégorie | Classes                                              |
| --------- | ---------------------------------------------------- |
| Layout    | flex-row, items-center, gap-2, flex, flex-col, gap-2 |
| Typo      | text-base, font-bold                                 |
| Décoratif | inline-block, h-3, w-3, shrink-0, rounded-full       |
| Spacing   | gap-2, py-3, px-3                                    |

**Remplacement** : Card DS déjà utilisé + Badge DS + Stack (nouveau)
**Effort** : M
**Deps DS** : Stack

#### `Teams/ui/TeamCard/TeamCardVenue.tsx`

| Catégorie | Classes                     |
| --------- | --------------------------- |
| Layout    | flex, items-center, gap-1.5 |
| Typo      | text-sm                     |
| Couleurs  | text-muted-foreground       |
| Décoratif | h-4, w-4, shrink-0          |

**Remplacement** : Stack horizontal (nouveau) + Typography
**Effort** : S
**Deps DS** : Stack

#### `Teams/ui/TeamCardGrid/TeamCardGrid.tsx`

| Catégorie | Classes                                                                                |
| --------- | -------------------------------------------------------------------------------------- |
| Layout    | h-full, items-center, gap-4, text-center, flex, flex-col, gap-3, justify-center, gap-1 |

**Remplacement** : Grid DS + Card DS déjà utilisés + Stack (nouveau)
**Effort** : M
**Deps DS** : Stack

#### `Teams/ui/TeamCardList/TeamCardList.tsx`

| Catégorie | Classes                                                                                        |
| --------- | ---------------------------------------------------------------------------------------------- |
| Layout    | w-full, flex-row, items-center, gap-0, overflow-hidden, shrink-0, min-w-0, flex-1, flex, gap-1 |
| Typo      | truncate, text-sm                                                                              |
| Couleurs  | text-muted-foreground                                                                          |
| Décoratif | rounded-none                                                                                   |
| Spacing   | py-4, px-6, mt-1                                                                               |

**Remplacement** : List DS déjà utilisé + Card DS + Stack (nouveau)
**Effort** : L
**Deps DS** : Stack

#### `Teams/ui/TeamCardSkeleton/TeamCardSkeleton.tsx`

| Catégorie | Classes                    |
| --------- | -------------------------- |
| Spacing   | gap-1.5, py-2, h-4, w-full |

**Remplacement** : Card DS + Skeleton DS déjà utilisés
**Effort** : S
**Deps DS** : aucune

#### `Teams/ui/TeamForm/CreateTeamForm.tsx`

| Catégorie  | Classes                |
| ---------- | ---------------------- |
| Layout     | flex, flex-row-reverse |
| Spacing    | py-1, h-full           |
| Interactif | animate-spin           |

**Remplacement** : Stack (nouveau) + Spinner (nouveau)
**Effort** : S
**Deps DS** : Stack, Spinner

#### `Teams/ui/TeamForm/TeamForm.tsx`

**Pas de classes Tailwind directes.**
**Effort** : S
**Deps DS** : aucune

#### `Teams/ui/TeamForm/UpdateTeamForm.tsx`

| Catégorie  | Classes                |
| ---------- | ---------------------- |
| Layout     | flex, flex-row-reverse |
| Spacing    | py-1, h-full           |
| Interactif | animate-spin           |

**Remplacement** : Stack (nouveau) + Spinner (nouveau)
**Effort** : S
**Deps DS** : Stack, Spinner

#### `Teams/ui/TeamList/TeamList.tsx`

| Catégorie | Classes   |
| --------- | --------- |
| Spacing   | p-2, py-1 |

**Remplacement** : Layout DS + Separator DS déjà utilisés
**Effort** : S
**Deps DS** : aucune

#### `Teams/ui/TeamListPagination/TeamListPagination.tsx`

| Catégorie  | Classes                         |
| ---------- | ------------------------------- |
| Interactif | pointer-events-none, opacity-50 |

**Remplacement** : Pagination DS déjà utilisé — états disabled via CSS module
**Effort** : S
**Deps DS** : aucune

#### `Teams/ui/TeamSelect/TeamSelect.tsx`

**Pas de classes Tailwind directes** (Select DS déjà utilisé).
**Effort** : S
**Deps DS** : aucune

---

### 3.6 Settings (5 fichiers)

#### `Settings/SettingsLayout.tsx`

| Catégorie | Classes                                       |
| --------- | --------------------------------------------- |
| Layout    | flex, h-full, w-full, flex-col, overflow-auto |

**Remplacement** : Layout DS + Stack (nouveau)
**Effort** : S
**Deps DS** : Stack

#### `Settings/pages/AreaEditPage.tsx`

| Catégorie  | Classes                                                                                 |
| ---------- | --------------------------------------------------------------------------------------- |
| Layout     | fixed, top-1/2, left-1/2, flex, flex-col, -translate-x-1/2, -translate-y-1/2, flex-grow |
| Couleurs   | dark:bg-gray-600                                                                        |
| Décoratif  | rounded-md, shadow-[var(--shadow-6)]                                                    |
| Responsive | w-[90vw], max-h-[85vh], max-w-[500px]                                                   |
| Interactif | data-[state=open]:animate-contentShow, focus:outline-none                               |

**Remplacement** : Dialog DS déjà utilisé — supprimer override positionnement
**Effort** : M
**Deps DS** : aucune

#### `Settings/pages/AreasPage.tsx`

| Catégorie | Classes                                     |
| --------- | ------------------------------------------- |
| Layout    | flex, h-full, w-full, flex-col, gap-1, px-1 |
| Spacing   | p-2                                         |

**Remplacement** : Layout DS + Stack (nouveau)
**Effort** : S
**Deps DS** : Stack

#### `Settings/ui/AreaForm.tsx`

| Catégorie  | Classes                |
| ---------- | ---------------------- |
| Layout     | flex, flex-row-reverse |
| Spacing    | py-1, h-full           |
| Interactif | animate-spin           |

**Remplacement** : Stack (nouveau) + Spinner (nouveau)
**Effort** : S
**Deps DS** : Stack, Spinner

#### `Settings/ui/AreaList.tsx`

| Catégorie | Classes                                             |
| --------- | --------------------------------------------------- |
| Layout    | flex, h-full, w-full, flex-col, gap-0.5, text-right |
| Spacing   | min-h-10, w-full                                    |

**Remplacement** : Layout DS + Table DS déjà utilisé
**Effort** : S
**Deps DS** : aucune

---

### 3.7 Modules restants (6 fichiers)

#### `Game/ui/GameList.tsx`

| Catégorie | Classes                        |
| --------- | ------------------------------ |
| Layout    | flex, h-full, flex-col, w-full |

**Remplacement** : Layout DS
**Effort** : S
**Deps DS** : aucune

#### `Game/ui/GameListRaw.tsx`

| Catégorie | Classes                                                |
| --------- | ------------------------------------------------------ |
| Layout    | flex, flex-1, flex-col, gap-2, overflow-y-scroll, px-2 |

**Remplacement** : Stack (nouveau)
**Effort** : S
**Deps DS** : Stack

#### `Game/ui/GameShortDescription.tsx`

| Catégorie | Classes                                                                   |
| --------- | ------------------------------------------------------------------------- |
| Layout    | flex, flex-col, items-center, w-full, flex-row, gap-3, w-1/3, text-center |

**Remplacement** : Card DS + Stack (nouveau)
**Effort** : M
**Deps DS** : Stack

#### `Player/pages/TeamPlayersPage.tsx`

| Catégorie | Classes                                     |
| --------- | ------------------------------------------- |
| Layout    | flex, h-full, w-full, flex-1, overflow-auto |
| Autre     | scrollbar-thin                              |

**Remplacement** : Layout DS — scrollbar via CSS module
**Effort** : S
**Deps DS** : aucune

#### `Player/ui/PlayerList.tsx`

| Catégorie | Classes                                             |
| --------- | --------------------------------------------------- |
| Layout    | h-full, w-full, overflow-y-scroll, flex, py-2, px-4 |
| Typo      | text-sm                                             |
| Couleurs  | text-muted-foreground                               |

**Remplacement** : Tooltip DS + Avatar DS déjà utilisés + Stack (nouveau)
**Effort** : M
**Deps DS** : Stack

#### `Calendar/ui/CalendarView.tsx`

| Catégorie | Classes                                          |
| --------- | ------------------------------------------------ |
| Layout    | flex, h-15, w-full, items-center, justify-center |
| Couleurs  | border-orange-700, bg-amber-500, text-orange-700 |
| Décoratif | rounded-sm, border                               |

**Remplacement** : Center (nouveau) — couleurs custom en CSS module ou tokens sémantiques
**Effort** : S
**Deps DS** : Center

#### `I18n/components/LanguageSwitcher.tsx`

| Catégorie | Classes                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------- |
| Layout    | relative, absolute, -right-2, -bottom-2, w-40, m-0, list-none, p-0, flex, cursor-pointer, items-center, gap-2, flex-1 |

**Remplacement** : Button DS + Popover DS + List DS
**Effort** : S
**Deps DS** : aucune

---

## 4. Ordre de migration recommandé

### Phase 0 — Créer les primitives DS manquants

| Composant        | Props principales                                       | Fichiers débloqués |
| ---------------- | ------------------------------------------------------- | ------------------ |
| **Stack**        | `direction`, `gap`, `align`, `justify`, `padding`, `as` | ~48                |
| **Center**       | `padding`, `minHeight`, `as`                            | ~14                |
| **Spinner**      | `size`, `label` (accessibility)                         | ~13                |
| **SectionLabel** | enfants texte, `className`                              | ~6                 |

Enrichissements : Badge (variants `success`, `warning`, `danger`, `info`, `neutral`).

### Phase 1 — Common (22 fichiers, quick win)

**Table (9 fichiers)** : remplacement direct par imports de `@repo/design-system` Table. Suppression complète de `Common/Table/`.

**Loading (5 fichiers)** : Stack + Center + Spinner.

**Calendar (3 fichiers)** : Stack + Grid DS.

**Inputs (2 fichiers)** : FormField + Label DS.

**ErrorBoundary, MenuBar** : Alert DS, Stack.

### Phase 2 — Layouts (7 fichiers)

Peu de Tailwind — essentiellement padding/scrollbar. Sidebar DS déjà en place.

### Phase 3 — Auth (13 fichiers)

Patterns très répétitifs (Stack + FormField + Typography + Spinner). AuthLeftPanel = seul fichier avec gradient custom → CSS module.

### Phase 4 — Dashboard (23 fichiers)

Plus gros module mais patterns uniformes : Card + Stack + SectionLabel + Grid + Badge.

### Phase 5 — Teams (17 fichiers)

Card/List DS déjà utilisés. Dialog overrides (3 fichiers) à nettoyer.

### Phase 6 — Restants (11 fichiers)

Settings (5), Game (3), Player (2), Calendar (1), I18n (1). Effort minimal.

### Phase finale — Nettoyage

1. Supprimer `@import 'tailwindcss'` et `@source` de `web-application/src/index.css`
2. Supprimer `@tailwindcss/vite` de `vite.config.ts`
3. Supprimer `tailwindcss`, `@tailwindcss/vite`, `tailwind-scrollbar` de `package.json`
4. Supprimer `cn()` des imports si plus utilisé (ou le garder pour composer les className DS)

---

## 5. Tableau récapitulatif d'effort

| Module    | Fichiers | S      | M      | L     | Deps DS nouvelles                             |
| --------- | -------- | ------ | ------ | ----- | --------------------------------------------- |
| Common    | 22       | 16     | 5      | 1     | Stack, Center, Spinner                        |
| Layouts   | 7        | 5      | 2      | 0     | Stack, Badge (enrichir)                       |
| Auth      | 13       | 4      | 7      | 2     | Stack, Center, Spinner, SectionLabel          |
| Dashboard | 23       | 9      | 13     | 0     | Stack, Center, SectionLabel, Badge (enrichir) |
| Teams     | 17       | 11     | 5      | 1     | Stack, Spinner                                |
| Settings  | 5        | 4      | 1      | 0     | Stack, Spinner                                |
| Game      | 3        | 2      | 1      | 0     | Stack                                         |
| Player    | 2        | 1      | 1      | 0     | Stack                                         |
| Calendar  | 1        | 1      | 0      | 0     | Center                                        |
| I18n      | 1        | 1      | 0      | 0     | aucune                                        |
| **Total** | **94**   | **54** | **35** | **4** |                                               |

---

## 6. Risques & décisions à prendre

### 6.1 `className` Tailwind passés aux composants DS

Nombreux fichiers passent des classes Tailwind en `className` à des composants DS (ex: `<Card className="gap-2 py-3">`). Si Tailwind est retiré de web-app, ces classes ne seront plus générées par le processeur CSS.

**Options** :

- (a) Ajouter des props aux composants DS pour couvrir ces cas (gap, padding)
- (b) Garder Tailwind uniquement pour les overrides className (ne résout pas le problème)
- (c) Utiliser des CSS modules ou `style={{}}` pour les overrides ponctuels

### 6.2 `cn()` dans web-application

`cn()` utilise `tailwind-merge` en interne. Sans Tailwind dans web-app, `tailwind-merge` est inutile. Mais `cn()` reste utile pour composer des className conditionnels via `clsx`.

**Décision** : Garder `cn()` importé depuis `@repo/design-system` — il fonctionne même sans Tailwind côté consommateur.

### 6.3 Couleurs hardcodées

Plusieurs fichiers utilisent des couleurs Tailwind brutes : `text-slate-500`, `bg-amber-500`, `text-red-600`, `border-orange-700`, `bg-green-100`, etc.

**Décision** : Créer des tokens sémantiques dans le DS (`--color-success`, `--color-warning`, `--color-danger`, `--color-info`) et les utiliser via CSS modules ou variants de composants.

### 6.4 Plugin `scrollbar-thin`

5 fichiers utilisent `scrollbar-thin`, `scrollbar-track-*`, `scrollbar-thumb-*`.

**Options** :

- (a) Déplacer le plugin vers le DS et exposer un composant `ScrollArea`
- (b) Remplacer par du CSS standard (`scrollbar-width: thin`)
- (c) CSS module dédié dans web-app

### 6.5 CSS custom properties app-spécifiques

`--auth-accent`, `--chart-color-admin/coach/player/referee/other` sont définis dans `web-application/src/index.css`.

**Décision** : Ces variables restent dans web-app — elles sont spécifiques au métier, pas au design system.

### 6.6 `dark:` modifiers

Quelques fichiers utilisent `dark:bg-gray-600`, `dark:bg-red-950/20`, `dark:scrollbar-*`. Sans Tailwind, ces modifiers ne fonctionneront plus.

**Décision** : Migrer vers des tokens CSS qui changent automatiquement en dark mode (déjà supporté par le ThemeProvider DS).
