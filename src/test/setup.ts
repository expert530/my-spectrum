import '@testing-library/jest-dom'

// Mock IntersectionObserver for tests
class MockIntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  
  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {
    // Store for potential use in tests
  }
  
  observe(): void {
    // No-op
  }
  
  unobserve(): void {
    // No-op
  }
  
  disconnect(): void {
    // No-op
  }
  
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
