import { useGetArea } from '../infrastructure/useAreaApi'

export const AreaBreadcrumb = ({ areaId }: { areaId: string }) => {
  const { data: area } = useGetArea(areaId, { query: { enabled: !!areaId } })
  return <>{area?.name ?? areaId}</>
}
