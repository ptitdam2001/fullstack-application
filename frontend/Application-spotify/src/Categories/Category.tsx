import { useGetACategoriesPlaylists, useGetACategory } from '@Spotify/generated/sdk'
import { useParams } from 'react-router-dom'

export const Category = () => {
  const { category } = useParams()
  const { data: currentCategory, isLoading: isLoadingCategory } = useGetACategory(category ?? '', undefined, {
    query: { enabled: Boolean(category) },
  })
  const { data: playlist, isLoading: isLoadingPlaylist } = useGetACategoriesPlaylists(category ?? '', undefined, {
    query: { enabled: Boolean(category) },
  })

  console.log('category:', currentCategory, isLoadingCategory)
  console.log('playlist:', playlist, isLoadingPlaylist)

  return <div>Category {category}</div>
}
