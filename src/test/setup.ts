import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// The suite runs without Vitest globals, so Testing Library's automatic cleanup
// is not registered for us. Unmount between tests so queries never see a
// previous test's DOM.
afterEach(() => {
  cleanup()
})
