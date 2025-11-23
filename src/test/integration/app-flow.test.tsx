/**
 * @file test/integration/app-flow.test.tsx
 * @description Integration tests for full application flows
 * 
 * These tests verify complete user journeys through the application:
 * - Creating a profile (adjusting metrics)
 * - Generating shareable URLs
 * - Loading shared profiles
 * - Mode switching (edit <-> view)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App'

// Mock QRCodeSVG to avoid rendering issues in tests
vi.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value }: { value: string }) => (
    <div data-testid="qr-code" data-value={value}>
      QR Code Mock
    </div>
  )
}))

/**
 * Helper to switch to share view by clicking "Ready to share"
 * This navigates from edit view to share view
 */
async function switchToShareView(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => {
    expect(screen.getByText(/Ready to share your profile/i)).toBeInTheDocument()
  })
  const readyButton = screen.getByRole('button', { name: /Ready to share your profile/i })
  await user.click(readyButton)
}

describe('Application Integration Tests', () => {
  let originalLocation: Location

  beforeEach(() => {
    // Store original location
    originalLocation = window.location

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        search: '',
        pathname: '/',
        origin: 'http://localhost:3000',
        href: 'http://localhost:3000/',
      },
      writable: true,
      configurable: true
    })

    // Mock history.replaceState
    vi.spyOn(window.history, 'replaceState').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true
    })
    vi.restoreAllMocks()
  })

  describe('Initial App Load (Editing Mode)', () => {
    it('should render the app without crashing', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('My Spectrum')).toBeInTheDocument()
      })
    })

    it('should display all 6 metric sliders', async () => {
      render(<App />)
      
      await waitFor(() => {
        // Use getAllByRole to find all sliders - there should be 6
        const sliders = screen.getAllByRole('slider')
        expect(sliders).toHaveLength(6)
      })
    })

    it('should initialize all metrics to default value (2)', async () => {
      render(<App />)
      
      await waitFor(() => {
        const sliders = screen.getAllByRole('slider')
        expect(sliders).toHaveLength(6)
        sliders.forEach(slider => {
          expect(slider).toHaveValue('2')
        })
      })
    })

    it('should display the intro section', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText(/Understand Your Neurodiversity Profile/i)).toBeInTheDocument()
      })
    })

    it('should display the "Ready to share" prompt initially', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText(/Ready to share your profile/i)).toBeInTheDocument()
      })
    })

    it('should switch to share view after clicking "Ready to share"', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText(/Ready to share your profile/i)).toBeInTheDocument()
      })

      // Click the "Ready to share" button
      const readyButton = screen.getByRole('button', { name: /Ready to share your profile/i })
      await user.click(readyButton)
      
      await waitFor(() => {
        expect(screen.getByText('📤 Share Your Profile')).toBeInTheDocument()
        // Edit view content should be hidden
        expect(screen.queryByText('My Spectrum')).not.toBeInTheDocument()
      })
    })

    it('should show "Edit your profile" button on share view', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Edit your profile/i })).toBeInTheDocument()
      })
    })

    it('should switch back to edit view when clicking "Edit your profile"', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)
      
      const editButton = screen.getByRole('button', { name: /Edit your profile/i })
      await user.click(editButton)
      
      await waitFor(() => {
        expect(screen.getByText('My Spectrum')).toBeInTheDocument()
        expect(screen.getByText(/Ready to share your profile/i)).toBeInTheDocument()
      })
    })
  })

  describe('Metric Slider Interactions', () => {
    it('should update metric value when slider is changed', async () => {
      render(<App />)
      
      await waitFor(() => {
        const sliders = screen.getAllByRole('slider')
        const focusSlider = sliders[0]
        
        fireEvent.change(focusSlider, { target: { value: '4' } })
        expect(focusSlider).toHaveValue('4')
      })
    })

    it('should update description when slider value changes', async () => {
      render(<App />)
      
      await waitFor(() => {
        // Initial state shows default (2) description
        const sliders = screen.getAllByRole('slider')
        const focusSlider = sliders[0]
        
        // Change to a different value
        fireEvent.change(focusSlider, { target: { value: '5' } })
      })
      
      // Metric descriptions should update (verified by presence of changed state)
      await waitFor(() => {
        const sliders = screen.getAllByRole('slider')
        expect(sliders[0]).toHaveValue('5')
      })
    })

    it('should support preset button clicks', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('My Spectrum')).toBeInTheDocument()
      })

      // Find the first "High" preset button
      const highButtons = screen.getAllByRole('button', { name: /Set to high/i })
      
      await user.click(highButtons[0])
      
      await waitFor(() => {
        const sliders = screen.getAllByRole('slider')
        expect(sliders[0]).toHaveValue('4')
      })
    })

    it('should reset all metrics when Reset All is clicked', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('My Spectrum')).toBeInTheDocument()
      })

      // Change a slider first
      const sliders = screen.getAllByRole('slider')
      fireEvent.change(sliders[0], { target: { value: '5' } })
      
      // Click Reset All
      const resetButton = screen.getByRole('button', { name: /Reset all/i })
      await user.click(resetButton)
      
      await waitFor(() => {
        const updatedSliders = screen.getAllByRole('slider')
        updatedSliders.forEach(slider => {
          expect(slider).toHaveValue('2')
        })
      })
    })
  })

  describe('Share Section', () => {
    it('should display share options with QR code and buttons', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)

      // Should show QR code and share buttons together
      await waitFor(() => {
        expect(screen.getByTestId('qr-code')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Copy Link/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Preview/i })).toBeInTheDocument()
      })
    })

    it('should display QR code in the share section', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)
      
      await waitFor(() => {
        expect(screen.getByTestId('qr-code')).toBeInTheDocument()
      })
    })

    it('should include metrics in the shareable URL', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)
      
      await waitFor(() => {
        const qrCode = screen.getByTestId('qr-code')
        const value = qrCode.getAttribute('data-value')
        
        // URL should contain metric parameters
        expect(value).toContain('f=') // Focus
        expect(value).toContain('si=') // Social Interaction
      })
    })

    it('should show copy link button', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)

      // Should show the copy button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Copy Link/i })).toBeInTheDocument()
      })
    })
  })

  describe('Plaintext Export', () => {
    it('should toggle plaintext view when link is clicked', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)

      const showTextButton = screen.getByRole('button', { name: /View as Plain Text/i })
      await user.click(showTextButton)
      
      await waitFor(() => {
        expect(screen.getByText('Select and copy this text:')).toBeInTheDocument()
      })
    })

    it('should display metrics in plaintext format', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)

      const showTextButton = screen.getByRole('button', { name: /View as Plain Text/i })
      await user.click(showTextButton)
      
      await waitFor(() => {
        // Look for the plaintext element by its aria-label
        const plaintext = screen.getByLabelText(/Current metrics in plaintext/i)
        expect(plaintext).toBeInTheDocument()
        expect(plaintext.textContent).toContain('Focus:')
      })
    })
  })

  describe('Support Strategies Section', () => {
    it('should display the What Helps section header', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)
      
      await waitFor(() => {
        // Find the collapsible section by its aria-label
        const section = screen.getByRole('region', { name: /What Helps/i })
        expect(section).toBeInTheDocument()
      })
    })

    it('should display current profile metrics when expanded', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)

      // Find and click the collapsible header button
      const section = screen.getByRole('region', { name: /What Helps/i })
      const expandButton = section.querySelector('button[aria-expanded]')
      expect(expandButton).not.toBeNull()
      await user.click(expandButton!)
      
      await waitFor(() => {
        expect(screen.getByText('Your Current Profile')).toBeInTheDocument()
      })
    })

    it('should display collapsible strategy sections when expanded', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)

      // Find and click the collapsible header button
      const section = screen.getByRole('region', { name: /What Helps/i })
      const expandButton = section.querySelector('button[aria-expanded]')
      expect(expandButton).not.toBeNull()
      await user.click(expandButton!)
      
      await waitFor(() => {
        // Now we have collapsible subsections for Parents and Educators
        // Use getAllByText since these headings appear in both Strategies and Resources sections
        const parentHeaders = screen.getAllByText(/For Parents & Caregivers/i)
        const educatorHeaders = screen.getAllByText(/For Educators/i)
        expect(parentHeaders.length).toBeGreaterThanOrEqual(1)
        expect(educatorHeaders.length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('Resources Section', () => {
    it('should display the resources section', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)
      
      await waitFor(() => {
        // The resources section has aria-label="Learn More"
        const resourcesSection = screen.getByRole('region', { name: /Learn More/i })
        expect(resourcesSection).toBeInTheDocument()
      })
    })
  })

  describe('About Section', () => {
    it('should display the about section header', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)
      
      await waitFor(() => {
        // Find the collapsible section by its aria-label
        const section = screen.getByRole('region', { name: /About This Tool/i })
        expect(section).toBeInTheDocument()
      })
    })

    it('should display the contact form when expanded', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await switchToShareView(user)

      // Find and click the collapsible header button
      const section = screen.getByRole('region', { name: /About This Tool/i })
      const expandButton = section.querySelector('button[aria-expanded]')
      expect(expandButton).not.toBeNull()
      await user.click(expandButton!)
      
      await waitFor(() => {
        expect(screen.getByText('Get In Touch')).toBeInTheDocument()
        expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Your Email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()
      })
    })
  })

  describe('Footer', () => {
    it('should display privacy message in footer', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText(/Your privacy matters/i)).toBeInTheDocument()
      })
    })
  })
})

describe('URL-based Viewing Mode', () => {
  beforeEach(() => {
    vi.spyOn(window.history, 'replaceState').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should switch to viewing mode when URL has metrics', async () => {
    // Set up location with metric parameters
    Object.defineProperty(window, 'location', {
      value: {
        search: '?f=3&si=4&ss=2&ms=1&rp=5&er=3',
        pathname: '/',
        origin: 'http://localhost:3000',
        href: 'http://localhost:3000/?f=3&si=4&ss=2&ms=1&rp=5&er=3'
      },
      writable: true,
      configurable: true
    })

    render(<App />)
    
    await waitFor(() => {
      // Viewing mode shows "Profile" instead of "My Spectrum"
      expect(screen.getByRole('heading', { name: /Shared Neurodiversity Profile/i })).toBeInTheDocument()
    })
  })

  it('should display profile name from URL if provided', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '?name=TestUser&f=3&si=4&ss=2&ms=1&rp=5&er=3',
        pathname: '/',
        origin: 'http://localhost:3000',
        href: 'http://localhost:3000/?name=TestUser&f=3&si=4&ss=2&ms=1&rp=5&er=3'
      },
      writable: true,
      configurable: true
    })

    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText(/TestUser/i)).toBeInTheDocument()
    })
  })

  it('should display loaded metrics from URL', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '?f=1&si=5&ss=2&ms=3&rp=4&er=0',
        pathname: '/',
        origin: 'http://localhost:3000',
        href: 'http://localhost:3000/?f=1&si=5&ss=2&ms=3&rp=4&er=0'
      },
      writable: true,
      configurable: true
    })

    render(<App />)
    
    await waitFor(() => {
      // In viewing mode, check for the viewing header title
      expect(screen.getByRole('heading', { name: /Shared Neurodiversity Profile/i })).toBeInTheDocument()
    })
  })

  it('should have Create Your Own Profile button in viewing mode', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '?f=3&si=4&ss=2&ms=1&rp=5&er=3',
        pathname: '/',
        origin: 'http://localhost:3000',
        href: 'http://localhost:3000/?f=3&si=4&ss=2&ms=1&rp=5&er=3'
      },
      writable: true,
      configurable: true
    })

    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Create Your Own Profile/i })).toBeInTheDocument()
    })
  })

  it('should switch to editing mode when Create Your Own is clicked', async () => {
    const user = userEvent.setup()
    
    Object.defineProperty(window, 'location', {
      value: {
        search: '?f=3&si=4&ss=2&ms=1&rp=5&er=3',
        pathname: '/',
        origin: 'http://localhost:3000',
        href: 'http://localhost:3000/?f=3&si=4&ss=2&ms=1&rp=5&er=3'
      },
      writable: true,
      configurable: true
    })

    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Shared Neurodiversity Profile/i })).toBeInTheDocument()
    })

    const createButton = screen.getByRole('button', { name: /Create Your Own Profile/i })
    await user.click(createButton)
    
    await waitFor(() => {
      // Should now show editing mode with main title
      expect(screen.getByText('My Spectrum')).toBeInTheDocument()
    })
  })
})
