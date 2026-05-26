import { PrismaClient, AgeCategory, TeamRole, PhaseType, MatchMode } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// ─── Configuration ──────────────────────────────────────────────────────────

const SEED_PASSWORD = 'Seed@1234'
const SALT_ROUNDS = 10
const SEED_CHAMPIONSHIP_NAME = 'Championnat Test'
const SEED_TEAM_NAME = 'Équipe Test'

const SEED_USERS = [
  { email: 'admin@seed.local', firstName: 'Admin', lastName: 'Seed', isAdmin: true, isActive: true },
  { email: 'coach@seed.local', firstName: 'Coach', lastName: 'Seed', isActive: true },
  { email: 'player@seed.local', firstName: 'Player', lastName: 'Seed', isActive: true },
  { email: 'referee@seed.local', firstName: 'Referee', lastName: 'Seed', isReferee: true, isActive: true },
  { email: 'user@seed.local', firstName: 'User', lastName: 'Seed', isActive: true },
] as const

type SeedUserRecord = Record<(typeof SEED_USERS)[number]['email'], { id: string; email: string }>

// ─── Étape 1 : Nettoyage ─────────────────────────────────────────────────────
// Supprime toutes les données seed existantes pour rendre le script idempotent.
// Ordre important : supprimer les relations avant les entités parentes.

async function cleanup() {
  console.log('🧹 Cleanup des données seed...')

  const seedEmails = SEED_USERS.map((u) => u.email)

  await prisma.userTeam.deleteMany({ where: { user: { email: { in: [...seedEmails] } } } })
  await prisma.player.deleteMany({ where: { user: { email: { in: [...seedEmails] } } } })
  await prisma.teamJoinRequest.deleteMany({ where: { user: { email: { in: [...seedEmails] } } } })
  await prisma.user.deleteMany({ where: { email: { in: [...seedEmails] } } })
  await prisma.team.deleteMany({ where: { name: SEED_TEAM_NAME } })
  // Championship cascade supprime automatiquement Phase et Group (Prisma onDelete: Cascade)
  await prisma.championship.deleteMany({ where: { name: SEED_CHAMPIONSHIP_NAME } })

  console.log('  ✓ Nettoyage terminé')
}

// ─── Étape 2 : Utilisateurs ───────────────────────────────────────────────────
// Un seul hash bcrypt partagé pour tous les users (même mot de passe).
// bcrypt est intentionnellement lent (salt rounds = 10) pour résister aux attaques brute-force.

async function seedUsers(): Promise<SeedUserRecord> {
  console.log('\n👤 Création des utilisateurs...')

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS)
  const users: Partial<SeedUserRecord> = {}

  for (const { email, firstName, lastName, ...flags } of SEED_USERS) {
    const user = await prisma.user.create({
      data: { email, firstName, lastName, password: hashedPassword, ...flags },
      select: { id: true, email: true },
    })
    users[email as keyof SeedUserRecord] = user
    console.log(`  ✓ ${email}`)
  }

  return users as SeedUserRecord
}

// ─── Étape 3 : Contexte métier ───────────────────────────────────────────────
// Championship → Phase → Group → teamIds
// Les équipes ne sont pas directement liées au championship dans le schéma.
// L'inscription passe par Group.teamIds (tableau d'IDs).

async function seedContext() {
  console.log('\n🏆 Création du championship et de l\'équipe...')

  const championship = await prisma.championship.create({
    data: {
      name: SEED_CHAMPIONSHIP_NAME,
      ageCategory: AgeCategory.Senior,
      season: '2025-2026',
      pointsConfig: { win: 3, draw: 1, loss: 0, forfeit: -1 },
    },
  })
  console.log(`  ✓ Championship "${championship.name}" (${championship.season})`)

  const team = await prisma.team.create({
    data: { name: SEED_TEAM_NAME, ageCategory: AgeCategory.Senior },
  })
  console.log(`  ✓ Team "${team.name}"`)

  const phase = await prisma.phase.create({
    data: {
      championshipId: championship.id,
      type: PhaseType.GROUP,
      order: 1,
      name: 'Phase de groupes',
    },
  })

  const group = await prisma.group.create({
    data: {
      phaseId: phase.id,
      name: 'Groupe A',
      matchMode: MatchMode.SINGLE,
    },
  })

  await prisma.groupTeam.create({
    data: { groupId: group.id, teamId: team.id },
  })
  console.log(`  ✓ Team inscrite au championship (Phase > Groupe A)`)

  return { team }
}

// ─── Étape 4 : Relations utilisateurs ────────────────────────────────────────
// UserTeam relie un user à une équipe avec un rôle contextuel (COACH ou PLAYER).
// Player stocke les infos de profil joueur (maillot, poste) pour un user dans une équipe.

async function seedRelations(users: SeedUserRecord, teamId: string) {
  console.log('\n🔗 Création des relations...')

  await prisma.userTeam.create({
    data: { userId: users['coach@seed.local'].id, teamId, role: TeamRole.COACH },
  })
  console.log(`  ✓ coach@seed.local → COACH de "${SEED_TEAM_NAME}"`)

  await prisma.userTeam.create({
    data: { userId: users['player@seed.local'].id, teamId, role: TeamRole.PLAYER },
  })
  await prisma.player.create({
    data: { userId: users['player@seed.local'].id, teamId, jersey: 10 },
  })
  console.log(`  ✓ player@seed.local → PLAYER de "${SEED_TEAM_NAME}" (jersey #10)`)
}

// ─── Orchestration ───────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Démarrage du seed...\n')

  await cleanup()
  const users = await seedUsers()
  const { team } = await seedContext()
  await seedRelations(users, team.id)

  console.log('\n✅ Seed terminé !')
  console.log('\n📋 Comptes disponibles (mot de passe : ' + SEED_PASSWORD + ') :')
  console.log('   admin@seed.local   → Admin plateforme')
  console.log('   coach@seed.local   → Coach de "Équipe Test"')
  console.log('   player@seed.local  → Joueur de "Équipe Test" (jersey #10)')
  console.log('   referee@seed.local → Arbitre')
  console.log('   user@seed.local    → Utilisateur sans affiliation\n')
}

main()
  .catch((err) => {
    console.error('❌ Erreur lors du seed :', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())