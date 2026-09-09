import '@testing-library/jest-dom'

// next-themes requires matchMedia — jsdom doesn't implement it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// react-aria SharedElementTransition (SelectionIndicator, TabPanels) calls getAnimations — jsdom doesn't implement it
if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => []
}
