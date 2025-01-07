import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { SpotifyProvider } from '@Spotify/SpotifyProvider'

import './index.css'

const queryClient = new QueryClient()
const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENTID
const spotifyClientSecret = import.meta.env.VITE_SPOTIFY_SECRET

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <React.Suspense fallback="loading">
      <QueryClientProvider client={queryClient}>
        <SpotifyProvider clientId={spotifyClientId} clientSecret={spotifyClientSecret}>
          Hello spotify
        </SpotifyProvider>
      </QueryClientProvider>
    </React.Suspense>
  </StrictMode>
)
