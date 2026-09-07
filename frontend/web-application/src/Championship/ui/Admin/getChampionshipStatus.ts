export type ChampionshipStatus = 'draft' | 'inProgress' | 'finished'

export const getChampionshipStatus = (isDraft: boolean, isFinished: boolean): ChampionshipStatus => {
  if (isDraft) {
    return 'draft'
  }
  if (isFinished) {
    return 'finished'
  }
  return 'inProgress'
}
