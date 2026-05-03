import type { Meta, StoryObj } from '@storybook/react-vite'
import { TriangleAlertIcon, CircleCheckIcon, InfoIcon, XCircleIcon } from 'lucide-react'

import { Alert, AlertTitle, AlertDescription } from './Alert'

const meta = {
  component: Alert,
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Alert>
      <InfoIcon />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>Une nouvelle version est disponible.</AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <XCircleIcon />
      <AlertTitle>Erreur</AlertTitle>
      <AlertDescription>Impossible de se connecter au serveur. Vérifiez votre connexion.</AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  render: () => (
    <Alert className="border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-500">
      <CircleCheckIcon />
      <AlertTitle>Succès</AlertTitle>
      <AlertDescription>Le match a été enregistré avec succès.</AlertDescription>
    </Alert>
  ),
}

export const Warning: Story = {
  render: () => (
    <Alert className="border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-500">
      <TriangleAlertIcon />
      <AlertTitle>Attention</AlertTitle>
      <AlertDescription>Ce match n&apos;a pas encore de score enregistré.</AlertDescription>
    </Alert>
  ),
}

export const WithoutIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Note</AlertTitle>
      <AlertDescription>Les classements sont mis à jour chaque lundi matin.</AlertDescription>
    </Alert>
  ),
}

export const DescriptionOnly: Story = {
  render: () => (
    <Alert>
      <AlertDescription>Session expirée. Veuillez vous reconnecter.</AlertDescription>
    </Alert>
  ),
}
