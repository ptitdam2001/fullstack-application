import type { Decorator, StoryContext } from '@storybook/react-vite'

export const localStorageDecorator: Decorator = (Story, context: StoryContext) => {
  // Reset avant chaque story
  localStorage.clear()

  // Merge des paramètres définis par story
  const { localStorage: localStorageMock } = context.parameters
  if (localStorageMock) {
    Object.entries(localStorageMock).forEach(([key, value]) => {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    })
  }

  return <Story />
}
