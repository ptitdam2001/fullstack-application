import { useGetArea } from '@Sdk/area/area'

export const AreaBreadcrumb = ({ areaId }: { areaId: string }) => {
  const { data: area } = useGetArea(areaId, { query: { enabled: !!areaId } })
  return <>{area?.name ?? areaId}</>
}
