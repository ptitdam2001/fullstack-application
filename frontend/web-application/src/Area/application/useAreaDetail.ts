import { useGetArea } from '../infrastructure/useAreaApi'

export const useAreaDetail = (areaId: string) => useGetArea(areaId)
