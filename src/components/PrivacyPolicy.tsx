/**
 * @file PrivacyPolicy.tsx
 * @description Privacy Policy page component
 */

import { useEffect } from 'react'

interface PrivacyPolicyProps {
  onBack: () => void
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps): JSX.Element {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="legal-page">
      <button onClick={onBack} className="legal-back-btn">
        ← Back to app
      </button>
      
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: February 2026</p>
      
      <section className="legal-section">
        <h2>Summary</h2>
        <p>
          <strong>My Spectrum does not collect, store, or transmit any of your personal data.</strong> 
          All information you enter stays entirely on your device. We have no servers, no databases, 
          and no way to access your data.
        </p>
      </section>

      <section className="legal-section">
        <h2>What Data We Collect</h2>
        <p>
          <strong>None.</strong> We do not collect any personal information. Your neurodiversity 
          profile settings, name, and any other data you enter are stored locally in your browser 
          and never leave your device.
        </p>
      </section>

      <section className="legal-section">
        <h2>How Your Data is Stored</h2>
        <p>
          Any data you create is stored in your browser's local storage. This data:
        </p>
        <ul>
          <li>Remains entirely on your device</li>
          <li>Is not transmitted to any server</li>
          <li>Is not accessible to us or any third party</li>
          <li>Can be cleared at any time by clearing your browser data</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Sharing Features</h2>
        <p>
          When you use the share feature, a URL is generated that contains your profile settings 
          encoded in the URL parameters. This URL:
        </p>
        <ul>
          <li>Is generated entirely in your browser</li>
          <li>Contains only the metric scores and optional name you choose to share</li>
          <li>Is shared directly by you (via copy/paste, QR code, etc.)</li>
          <li>Does not pass through our servers</li>
        </ul>
        <p>
          <strong>Important:</strong> Anyone you share this URL with will be able to see the 
          profile settings contained in it. Only share with people you trust.
        </p>
      </section>

      <section className="legal-section">
        <h2>Cookies and Tracking</h2>
        <p>
          We do not use cookies for tracking purposes. We do not use any analytics services. 
          We do not track your usage of this application in any way.
        </p>
      </section>

      <section className="legal-section">
        <h2>Third-Party Services</h2>
        <p>
          The contact form uses FormSubmit.co to deliver messages. If you choose to use the 
          contact form, your message and any information you provide will be processed by 
          FormSubmit according to their privacy policy. This is entirely optional.
        </p>
      </section>

      <section className="legal-section">
        <h2>Children's Privacy</h2>
        <p>
          This application is designed to be used by or on behalf of neurodivergent individuals, 
          including children. However, since we collect no data, there are no special provisions 
          needed—children's data is protected by the same principle: we simply don't have it.
        </p>
      </section>

      <section className="legal-section">
        <h2>Your Rights</h2>
        <p>
          Since we don't collect or store any of your data, traditional data rights (access, 
          deletion, portability) are exercised entirely through your own device:
        </p>
        <ul>
          <li><strong>Access:</strong> Your data is in your browser's local storage</li>
          <li><strong>Deletion:</strong> Clear your browser data to remove all stored information</li>
          <li><strong>Portability:</strong> Use the CSV export feature to download your profile</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Changes to This Policy</h2>
        <p>
          If we make changes to this privacy policy, we will update the "Last updated" date 
          at the top of this page. Since this is an open-source project, all changes are 
          visible in our version history.
        </p>
      </section>

      <section className="legal-section">
        <h2>Contact</h2>
        <p>
          If you have questions about this privacy policy, please use the contact form in 
          the "About This Tool" section of the main application.
        </p>
      </section>
    </div>
  )
}
