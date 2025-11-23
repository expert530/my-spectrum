/**
 * @file TermsOfService.tsx
 * @description Terms of Service page component
 */

import { useEffect } from 'react'

interface TermsOfServiceProps {
  onBack: () => void
}

export default function TermsOfService({ onBack }: TermsOfServiceProps): JSX.Element {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="legal-page">
      <button onClick={onBack} className="legal-back-btn">
        ← Back to app
      </button>
      
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: February 2026</p>
      
      <section className="legal-section">
        <h2>Agreement to Terms</h2>
        <p>
          By accessing or using My Spectrum, you agree to be bound by these Terms of 
          Service. If you disagree with any part of these terms, you may not use the application.
        </p>
      </section>

      <section className="legal-section">
        <h2>Description of Service</h2>
        <p>
          My Spectrum is a free, open-source web application that helps users document 
          and share their neurodiversity profile. The service is provided "as is" without any 
          warranties or guarantees.
        </p>
      </section>

      <section className="legal-section">
        <h2>Not Medical Advice</h2>
        <p>
          <strong>Important:</strong> My Spectrum is an informational and communication 
          tool only. It is not intended to provide medical, psychological, or therapeutic advice, 
          diagnosis, or treatment.
        </p>
        <ul>
          <li>The content and recommendations are for informational purposes only</li>
          <li>Always consult qualified healthcare professionals for medical decisions</li>
          <li>Do not disregard professional advice based on information from this tool</li>
          <li>The tool does not diagnose any conditions or disorders</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>User Responsibilities</h2>
        <p>When using My Spectrum, you agree to:</p>
        <ul>
          <li>Use the service for lawful purposes only</li>
          <li>Take responsibility for how you share your profile information</li>
          <li>Understand that shared URLs may be accessible to anyone with the link</li>
          <li>Not use the service to harm or discriminate against others</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Intellectual Property</h2>
        <p>
          My Spectrum is open-source software. The source code is available under the 
          terms of its license. You are free to use, modify, and distribute the code in 
          accordance with that license.
        </p>
        <p>
          Any content you create (your profile settings, exported data) belongs to you.
        </p>
      </section>

      <section className="legal-section">
        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, the creators and contributors of My Spectrum 
          Settings shall not be liable for any indirect, incidental, special, consequential, or 
          punitive damages, or any loss of profits or revenues, whether incurred directly or 
          indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
        </p>
        <ul>
          <li>Your use or inability to use the service</li>
          <li>Any errors or omissions in the content</li>
          <li>Unauthorized access to or alteration of your data</li>
          <li>Any third-party conduct on the service</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Disclaimer of Warranties</h2>
        <p>
          The service is provided on an "as is" and "as available" basis. We make no warranties, 
          expressed or implied, regarding:
        </p>
        <ul>
          <li>The accuracy or completeness of any content</li>
          <li>The reliability or availability of the service</li>
          <li>The suitability of recommendations for any particular purpose</li>
          <li>The security of your locally stored data</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Changes to Service</h2>
        <p>
          We reserve the right to modify, suspend, or discontinue any part of the service at 
          any time without notice. As this is a client-side application, you can continue using 
          any previously loaded version.
        </p>
      </section>

      <section className="legal-section">
        <h2>Changes to Terms</h2>
        <p>
          We may update these Terms of Service from time to time. Changes will be reflected 
          by an updated "Last updated" date. Continued use of the service after changes 
          constitutes acceptance of the new terms.
        </p>
      </section>

      <section className="legal-section">
        <h2>Contact</h2>
        <p>
          If you have questions about these Terms of Service, please use the contact form in 
          the "About This Tool" section of the main application.
        </p>
      </section>
    </div>
  )
}
