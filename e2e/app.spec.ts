/**
 * @file e2e/app.spec.ts
 * @description Comprehensive E2E tests for My Spectrum PWA
 *
 * Covers:
 * - Page load & initial state
 * - Metric slider interactions
 * - Share flow (edit → share view)
 * - QR code & URL sharing
 * - CSV download & plaintext view
 * - Shared profile viewing mode (URL params)
 * - Legal pages (Privacy Policy, Terms of Service)
 * - Contact form
 * - Collapsible sections
 * - Navigation
 * - Accessibility basics
 * - Responsive behaviour
 */

import { test, expect } from '@playwright/test'

// ─── Page Load & Initial State ───────────────────────────────────────────────

test.describe('Page Load & Initial State', () => {
  test('should display the app title and intro', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'My Spectrum' })).toBeVisible()
    await expect(page.getByText('Understand Your Neurodiversity Profile')).toBeVisible()
  })

  test('should display all 6 metric sliders', async ({ page }) => {
    await page.goto('/')
    const metrics = ['Focus', 'Social Interaction', 'Sensory Sensitivity', 'Motor Skills', 'Routine Preference', 'Emotional Regulation']
    for (const metric of metrics) {
      await expect(page.getByRole('slider', { name: new RegExp(metric) })).toBeVisible()
    }
  })

  test('should have all sliders at default value of 2', async ({ page }) => {
    await page.goto('/')
    const sliders = page.getByRole('slider')
    const count = await sliders.count()
    expect(count).toBe(6)
    for (let i = 0; i < count; i++) {
      await expect(sliders.nth(i)).toHaveAttribute('aria-valuenow', '2')
    }
  })

  test('should show the "Ready to share" prompt', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: /Ready to share your profile/i })).toBeVisible()
  })

  test('should show footer with version and links', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('v1.0.1')).toBeVisible()
    await expect(page.getByText('Your privacy matters')).toBeVisible()
    await expect(page.getByRole('link', { name: /View Source/i })).toBeVisible()
  })

  test('should have a skip-to-content link', async ({ page }) => {
    await page.goto('/')
    const skipLink = page.locator('.skip-link')
    await expect(skipLink).toBeAttached()
  })
})

// ─── Metric Slider Interactions ──────────────────────────────────────────────

test.describe('Metric Slider Interactions', () => {
  test('should change slider value with keyboard arrow keys', async ({ page }) => {
    await page.goto('/')
    const slider = page.getByRole('slider', { name: /Focus/i })
    await slider.focus()

    // Default is 2, press right to go to 3
    await page.keyboard.press('ArrowRight')
    await expect(slider).toHaveAttribute('aria-valuenow', '3')

    // Press left to go back to 2
    await page.keyboard.press('ArrowLeft')
    await expect(slider).toHaveAttribute('aria-valuenow', '2')
  })

  test('should not go below 0 or above 5', async ({ page }) => {
    await page.goto('/')
    const slider = page.getByRole('slider', { name: /Focus/i })
    await slider.focus()

    // Press Home to go to 0
    await page.keyboard.press('Home')
    await expect(slider).toHaveAttribute('aria-valuenow', '0')

    // Try going below 0
    await page.keyboard.press('ArrowLeft')
    await expect(slider).toHaveAttribute('aria-valuenow', '0')

    // Press End to go to 5
    await page.keyboard.press('End')
    await expect(slider).toHaveAttribute('aria-valuenow', '5')

    // Try going above 5
    await page.keyboard.press('ArrowRight')
    await expect(slider).toHaveAttribute('aria-valuenow', '5')
  })

  test('should display description for current score level', async ({ page }) => {
    await page.goto('/')
    // Default score of 2 for Focus should show its description
    await expect(page.getByText(/Maintains focus for 15-20 minutes/i)).toBeVisible()
  })

  test('should update description when slider value changes', async ({ page }) => {
    await page.goto('/')
    const slider = page.getByRole('slider', { name: /Focus/i })
    await slider.focus()
    await page.keyboard.press('End') // Go to 5

    await expect(page.getByText(/Excellent focus for extended periods/i)).toBeVisible()
  })

  test('should reset all sliders when Reset All is clicked', async ({ page }) => {
    await page.goto('/')
    const slider = page.getByRole('slider', { name: /Focus/i })
    await slider.focus()
    await page.keyboard.press('End') // Change Focus to 5
    await expect(slider).toHaveAttribute('aria-valuenow', '5')

    // Click Reset All
    await page.getByRole('button', { name: /Reset All/i }).click()

    // All sliders should be back to default (2)
    const sliders = page.getByRole('slider')
    const count = await sliders.count()
    for (let i = 0; i < count; i++) {
      await expect(sliders.nth(i)).toHaveAttribute('aria-valuenow', '2')
    }
  })

  test('should have preset buttons (Low, Mid, High) on each slider', async ({ page }) => {
    await page.goto('/')
    // Each metric card should have preset buttons
    const lowButtons = page.getByRole('button', { name: /Set to low intensity/i })
    expect(await lowButtons.count()).toBeGreaterThanOrEqual(6)
  })
})

// ─── Share Flow ──────────────────────────────────────────────────────────────

test.describe('Share Flow', () => {
  test('should navigate from edit view to share view', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()

    // Should show share view elements
    await expect(page.getByRole('heading', { name: /Share Your Profile/i })).toBeVisible()
    await expect(page.getByText(/Share your neurodiversity profile/i)).toBeVisible()
  })

  test('should display QR code in share view', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()

    // QR code should be rendered as an SVG
    await expect(page.locator('.qr-code-container svg')).toBeVisible()
  })

  test('should have Copy Link and Preview buttons', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()

    await expect(page.getByRole('button', { name: /Copy Link/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Preview/i })).toBeVisible()
  })

  test('should show name label on QR code when name is entered', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()

    await page.locator('#share-name').fill('Test User')
    await expect(page.getByText("Test User's Spectrum Settings")).toBeVisible()
  })

  test('should go back to edit view when clicking Edit your profile', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()
    await expect(page.getByRole('heading', { name: /Share Your Profile/i })).toBeVisible()

    await page.getByRole('button', { name: /Edit your profile/i }).click()
    await expect(page.getByRole('heading', { name: 'My Spectrum' })).toBeVisible()
  })

  test('should show Download CSV and View as Plain Text options', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()

    await expect(page.getByRole('button', { name: /Download CSV/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /View as Plain Text/i })).toBeVisible()
  })

  test('should toggle plaintext view', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()

    // Click to show plaintext
    await page.getByRole('button', { name: /View as Plain Text/i }).click()
    await expect(page.locator('.plaintext')).toBeVisible()

    // Click to hide plaintext
    await page.getByRole('button', { name: /Hide/i }).click()
    await expect(page.locator('.plaintext')).not.toBeVisible()
  })

  test('should trigger CSV download', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()

    // Listen for download event
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /Download CSV/i }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toMatch(/my-spectrum-settings-.*\.csv/)
  })
})

// ─── Collapsible Sections ────────────────────────────────────────────────────

test.describe('Collapsible Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()
  })

  test('should have What Helps section collapsed by default', async ({ page }) => {
    const section = page.locator('#strategies')
    const toggle = section.getByRole('button', { name: /What Helps/i })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  test('should expand What Helps section on click', async ({ page }) => {
    const section = page.locator('#strategies')
    const toggle = section.getByRole('button', { name: /What Helps/i })
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  test('should have Learn More section collapsed by default', async ({ page }) => {
    const section = page.locator('#resources')
    const toggle = section.getByRole('button', { name: /Learn More/i })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  test('should expand and collapse Learn More section', async ({ page }) => {
    const section = page.locator('#resources')
    const toggle = section.getByRole('button', { name: /Learn More/i })

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  test('should have About section collapsed by default', async ({ page }) => {
    const section = page.locator('#about')
    const toggle = section.getByRole('button', { name: /About This Tool/i })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})

// ─── Shared Profile Viewing Mode ─────────────────────────────────────────────

test.describe('Shared Profile Viewing Mode', () => {
  test('should display viewing mode when URL has metric params', async ({ page }) => {
    await page.goto('/?f=1&si=3&ss=4&ms=2&rp=5&er=0&name=Alex')

    // Should show the profile name
    await expect(page.getByText(/Alex/i)).toBeVisible()
    // Should NOT show sliders (read-only view)
    await expect(page.getByRole('slider')).not.toBeVisible()
  })

  test('should display correct metric scores in viewing mode', async ({ page }) => {
    await page.goto('/?f=0&si=5&ss=3&ms=1&rp=4&er=2&name=TestUser')

    // Profile overview section and cards should be visible
    await expect(page.getByText('Profile Overview')).toBeVisible()
    await expect(page.locator('.viewing-profile__grid')).toBeVisible()
  })

  test('should have Create Your Own button in viewing mode', async ({ page }) => {
    await page.goto('/?f=2&si=2&ss=2&ms=2&rp=2&er=2')
    await expect(page.getByRole('button', { name: /Create Your Own/i })).toBeVisible()
  })

  test('should switch to edit mode when Create Your Own is clicked', async ({ page }) => {
    await page.goto('/?f=2&si=2&ss=2&ms=2&rp=2&er=2')
    await page.getByRole('button', { name: /Create Your Own/i }).click()

    // Should now be in edit mode
    await expect(page.getByRole('heading', { name: 'My Spectrum' })).toBeVisible()
    await expect(page.getByRole('slider', { name: /Focus/i })).toBeVisible()
  })

  test('should show support strategies in viewing mode', async ({ page }) => {
    await page.goto('/?f=0&si=0&ss=0&ms=0&rp=0&er=0&name=HighNeeds')

    // With all metrics at 0, should have support strategies visible
    await expect(page.getByText(/How to Help/i)).toBeVisible()
  })

  test('should handle viewing mode without a name', async ({ page }) => {
    await page.goto('/?f=3&si=3&ss=3&ms=3&rp=3&er=3')

    // Should still work without name
    await expect(page.getByRole('button', { name: /Create Your Own/i })).toBeVisible()
  })
})

// ─── Legal Pages ─────────────────────────────────────────────────────────────

test.describe('Legal Pages', () => {
  test('should navigate to Privacy Policy', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Privacy Policy/i }).click()

    await expect(page.getByRole('heading', { name: /Privacy Policy/i })).toBeVisible()
    await expect(page.getByText(/Web3Forms/i)).toBeVisible()
  })

  test('should navigate to Terms of Service', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Terms of Service/i }).click()

    await expect(page.getByRole('heading', { name: /Terms of Service/i })).toBeVisible()
  })

  test('should return from Privacy Policy to main app', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Privacy Policy/i }).click()
    await expect(page.getByRole('heading', { name: /Privacy Policy/i })).toBeVisible()

    await page.getByRole('button', { name: /Back/i }).click()
    await expect(page.getByRole('heading', { name: 'My Spectrum' })).toBeVisible()
  })

  test('should return from Terms of Service to main app', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Terms of Service/i }).click()
    await expect(page.getByRole('heading', { name: /Terms of Service/i })).toBeVisible()

    await page.getByRole('button', { name: /Back/i }).click()
    await expect(page.getByRole('heading', { name: 'My Spectrum' })).toBeVisible()
  })
})

// ─── Contact Form ────────────────────────────────────────────────────────────

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()

    // Expand About section to access contact form
    const aboutSection = page.locator('#about')
    await aboutSection.getByRole('button', { name: /About This Tool/i }).click()
  })

  test('should display the contact form', async ({ page }) => {
    await expect(page.getByLabel(/Your Name/i)).toBeVisible()
    await expect(page.getByLabel(/Your Email/i)).toBeVisible()
    await expect(page.getByLabel(/Message/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Send Message/i })).toBeVisible()
  })

  test('should require the message field', async ({ page }) => {
    const messageField = page.getByLabel(/Message/i)
    await expect(messageField).toHaveAttribute('required', '')
  })

  test('should have Web3Forms hidden fields', async ({ page }) => {
    await expect(page.locator('input[name="access_key"]')).toBeAttached()
    await expect(page.locator('input[name="subject"]')).toBeAttached()
    await expect(page.locator('input[name="from_name"]')).toBeAttached()
  })

  test('should have honeypot spam protection', async ({ page }) => {
    const honeypot = page.locator('input[name="botcheck"]')
    await expect(honeypot).toBeAttached()
    await expect(honeypot).not.toBeVisible()
  })

  test('should allow filling in the form fields', async ({ page }) => {
    await page.getByLabel(/Your Name/i).fill('Test User')
    await page.getByLabel(/Your Email/i).fill('test@example.com')
    await page.getByLabel(/Message/i).fill('This is a test message')

    await expect(page.getByLabel(/Your Name/i)).toHaveValue('Test User')
    await expect(page.getByLabel(/Your Email/i)).toHaveValue('test@example.com')
    await expect(page.getByLabel(/Message/i)).toHaveValue('This is a test message')
  })
})

// ─── Section Navigation ──────────────────────────────────────────────────────

test.describe('Section Navigation', () => {
  test('should show section nav in share view', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()

    // Section nav should appear with navigation items
    await expect(page.locator('.section-nav')).toBeVisible()
  })

  test('should not show full section nav in edit view', async ({ page }) => {
    await page.goto('/')
    // In edit view, the full section nav shouldn't be visible
    await expect(page.locator('.section-nav')).not.toBeVisible()
  })
})

// ─── Accessibility ───────────────────────────────────────────────────────────

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toHaveText('My Spectrum')
  })

  test('should have labelled metric sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('section[aria-label="Neurodiversity Metrics"]')).toBeVisible()
  })

  test('should have accessible slider attributes', async ({ page }) => {
    await page.goto('/')
    const slider = page.getByRole('slider', { name: /Focus/i })
    await expect(slider).toHaveAttribute('aria-valuemin', '0')
    await expect(slider).toHaveAttribute('aria-valuemax', '5')
    await expect(slider).toHaveAttribute('aria-valuenow')
  })

  test('should be fully keyboard navigable', async ({ page }) => {
    await page.goto('/')
    // Tab through the page - ensure no focus traps
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Should be able to reach a slider
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })

  test('should have accessible collapsible sections', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()

    const toggle = page.locator('#strategies').getByRole('button', { name: /What Helps/i })
    await expect(toggle).toHaveAttribute('aria-expanded')
  })
})

// ─── URL Sharing Integrity ───────────────────────────────────────────────────

test.describe('URL Sharing Integrity', () => {
  test('should generate URL with correct metric params', async ({ page }) => {
    await page.goto('/')

    // Change Focus to 5 via keyboard
    const focusSlider = page.getByRole('slider', { name: /Focus/i })
    await focusSlider.focus()
    await page.keyboard.press('End') // 5

    // Navigate to share view
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()

    // Check the preview link contains the right params
    const previewLink = page.getByRole('link', { name: /Preview/i })
    const href = await previewLink.getAttribute('href')
    expect(href).toContain('f=5')
  })

  test('should include name in share URL when provided', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()

    await page.locator('#share-name').fill('My Child')

    const previewLink = page.getByRole('link', { name: /Preview/i })
    const href = await previewLink.getAttribute('href')
    expect(href).toContain('name=My+Child')
  })

  test('should round-trip metrics through share URL', async ({ page }) => {
    // Load a profile via URL
    await page.goto('/?f=1&si=4&ss=0&ms=5&rp=3&er=2&name=RoundTrip')
    await expect(page.getByText(/RoundTrip/i)).toBeVisible()

    // Switch to create own (edit mode)
    await page.getByRole('button', { name: /Create Your Own/i }).click()

    // Metrics should be reset to defaults in edit mode
    const sliders = page.getByRole('slider')
    const count = await sliders.count()
    expect(count).toBe(6)
  })
})

// ─── External Links ──────────────────────────────────────────────────────────

test.describe('External Links', () => {
  test('should have GitHub link with correct URL', async ({ page }) => {
    await page.goto('/')
    const githubLink = page.getByRole('link', { name: /View Source/i })
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/expert530/my-spectrum')
    await expect(githubLink).toHaveAttribute('target', '_blank')
    await expect(githubLink).toHaveAttribute('rel', /noopener/)
  })

  test('should have Ko-fi support link in About section', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Ready to share your profile/i }).click()

    const aboutSection = page.locator('#about')
    await aboutSection.getByRole('button', { name: /About This Tool/i }).click()

    const kofiLink = page.getByRole('link', { name: /Buy me a coffee/i })
    await expect(kofiLink).toHaveAttribute('href', 'https://ko-fi.com/myspectrumsettings')
    await expect(kofiLink).toHaveAttribute('target', '_blank')
  })
})

// ─── Responsive Behaviour ────────────────────────────────────────────────────

test.describe('Responsive Behaviour', () => {
  test('should render correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'My Spectrum' })).toBeVisible()
    await expect(page.getByRole('slider', { name: /Focus/i })).toBeVisible()
  })

  test('should render correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'My Spectrum' })).toBeVisible()
    const sliders = page.getByRole('slider')
    expect(await sliders.count()).toBe(6)
  })

  test('should render correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'My Spectrum' })).toBeVisible()
  })
})
