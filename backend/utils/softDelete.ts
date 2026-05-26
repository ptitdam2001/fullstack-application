// Prisma v6 + MongoDB : `{ deletedAt: null }` ne matche que les docs avec le champ
// explicitement stocké à null. Les docs sans le champ (champ absent) sont exclus.
// Ce helper couvre les deux cas : champ null OU champ absent.
export const notDeleted = { OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] }
