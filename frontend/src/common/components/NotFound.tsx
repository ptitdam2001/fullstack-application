import { memo } from 'react';
import { useRouteError } from 'react-router-dom'

type ErrorOutput = { statusText?: string; message?: string }

export const NotFound = memo(() => {
  const { statusText = '', message = '' }: ErrorOutput = useRouteError() as ErrorOutput

  return (
    <span>
      <p>Page not found!</p>
      <p>
        <i>{statusText || message}</i>
      </p>
    </span>
  )
})
