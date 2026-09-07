import { useChampionshipBreadcrumb } from '../../application/useChampionshipBreadcrumb'

export const ChampionshipBreadcrumb = ({ championshipId }: { championshipId: string }) => {
  const { data: championship } = useChampionshipBreadcrumb(championshipId)
  return <>{championship?.name ?? championshipId}</>
}
