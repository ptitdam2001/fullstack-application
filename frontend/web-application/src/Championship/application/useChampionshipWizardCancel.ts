import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useRemoveChampionship } from '../infrastructure/useChampionshipApi'
import type { ChampionshipWizard } from './useChampionshipWizard'

const REDIRECT_ON_CANCEL = '/app/admin/championships'

export const useChampionshipWizardCancel = (wizard: ChampionshipWizard) => {
  const navigate = useNavigate()
  const removeChampionship = useRemoveChampionship()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCancelPress = () => {
    if (!wizard.championshipId) {
      navigate(REDIRECT_ON_CANCEL)
      return
    }
    setIsDialogOpen(true)
  }

  const handleKeepForLater = () => {
    setIsDialogOpen(false)
    navigate(REDIRECT_ON_CANCEL)
  }

  const handleDeletePermanently = () => {
    if (!wizard.championshipId) {
      return
    }
    removeChampionship.mutate({ id: wizard.championshipId }, { onSuccess: () => navigate(REDIRECT_ON_CANCEL) })
  }

  return {
    isDialogOpen,
    setIsDialogOpen,
    handleCancelPress,
    handleKeepForLater,
    handleDeletePermanently,
    isDeleting: removeChampionship.isPending,
    deleteError: removeChampionship.isError,
  }
}
