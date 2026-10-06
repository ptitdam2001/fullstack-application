import reactConfig from '@repo/eslint-config/react'

export default [{ ignores: ['public/mockServiceWorker.js', 'src/sdk/generated/**'] }, ...reactConfig]
