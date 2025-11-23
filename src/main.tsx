import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

/**
 * Initialize the application
 * - Registers/unregisters service worker based on environment
 * - Mounts React root to DOM
 */
async function init(): Promise<void> {
  // Service worker management: important for PWA functionality
  if ('serviceWorker' in navigator) {
    try {
      // During development, avoid registering the service worker to prevent stale cached bundles
      if (import.meta.env.DEV) {
        // Unregister any existing registrations from earlier runs
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (const registration of registrations) {
          console.log('Unregistering service worker (DEV):', registration)
          await registration.unregister()
        }
      } else {
        // In production, register the service worker for offline support
        await navigator.serviceWorker.register('/service-worker.js')
        console.log('Service worker registered (PROD)')
      }
    } catch (error) {
      console.warn('Service worker registration/unregistration failed:', error)
    }
  }

  // Mount React application to DOM
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found in HTML')
  }

  const root = createRoot(rootElement)
  root.render(<App />)
}

// Execute initialization
init().catch((error) => {
  console.error('Application initialization failed:', error)
})
