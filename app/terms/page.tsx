import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Kinetix',
  description: 'Read the terms and conditions for using the Kinetix web-to-native app platform.',
};

const EFFECTIVE_DATE = 'April 13, 2026';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-[#f1f5f9]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-40" />
        <div className="hero-orb-purple absolute -top-40 left-1/2 -translate-x-1/2 opacity-30" />
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <div className="badge inline-flex mb-6">Legal</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Terms of Service</h1>
          <p className="text-[#94a3b8]">
            Effective Date: <strong className="text-white">{EFFECTIVE_DATE}</strong>
          </p>
          <p className="text-[#94a3b8] mt-2 leading-relaxed">
            Please read these terms carefully before using Kinetix. By accessing or using our platform,
            you agree to be bound by these Terms of Service.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="glass-card p-8 md:p-12 legal-prose">

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Kinetix platform (the &quot;Service&quot;), operated by SKAV TECH
              (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to be bound by these Terms of Service
              (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Kinetix is a web-to-native application converter that transforms publicly accessible
              websites into native Android APKs and iOS IPAs using Trusted Web Activity (TWA)
              technology, GitHub Actions cloud builds, and related tooling.
            </p>
            <p>The Service includes:</p>
            <ul>
              <li>Automated APK/IPA generation from user-supplied URLs</li>
              <li>App signing with unique RSA keystores</li>
              <li>Deep linking configuration (Android App Links / iOS Universal Links)</li>
              <li>Email build notifications via integrated CRM</li>
              <li>QR code download delivery</li>
            </ul>

            <h2>3. Eligibility</h2>
            <p>
              You must be at least 13 years of age to use this Service. If you are between 13 and 18,
              you must have parental or guardian consent. By using the Service, you represent that you
              meet these requirements.
            </p>

            <h2>4. User Responsibilities</h2>
            <p>You agree that you:</p>
            <ul>
              <li>Own or have the right to convert the website you submit to the Service</li>
              <li>Will not submit websites containing illegal, harmful, abusive, or fraudulent content</li>
              <li>Will not use the Service to create applications that violate Google Play Store or Apple App Store policies</li>
              <li>Are solely responsible for the content of generated applications</li>
              <li>Will not attempt to reverse-engineer, decompile, or tamper with the Service infrastructure</li>
              <li>Will not use automated scripts, bots, or scrapers to overload the Service</li>
            </ul>

            <h2>5. Intellectual Property</h2>
            <h3>5.1 Your Content</h3>
            <p>
              You retain all ownership rights to your website content and any branding assets you upload
              (e.g., app icons). By submitting content, you grant us a limited, non-exclusive license
              solely to process and generate your application.
            </p>
            <h3>5.2 Kinetix Intellectual Property</h3>
            <p>
              All platform code, design systems, algorithms, branding, and UI/UX are the exclusive
              property of SKAV TECH. You may not copy, redistribute, or create derivative works
              without explicit written permission.
            </p>

            <h2>6. Build Artifacts & Data Retention</h2>
            <p>
              Generated APK/IPA artifacts are temporarily stored for download and are automatically
              deleted after <strong>72 hours</strong> of generation. We do not permanently store your
              website content or icon images. Unique build keystores may be retained for up to 30 days
              for support purposes.
            </p>

            <h2>7. Deep Linking & App Store Compliance</h2>
            <p>
              Deep linking features (Android App Links, iOS Universal Links) require your website to host
              specific verification files (<code>/.well-known/assetlinks.json</code> and
              <code>/.well-known/apple-app-site-association</code>). You are responsible for deploying
              these files to your server. Kinetix provides the generated file content; deployment is
              your responsibility.
            </p>
            <p>
              Distribution of generated apps through public app stores (Google Play, Apple App Store)
              requires additional compliance with those platforms&apos; individual developer agreements.
              Kinetix does not guarantee app store approval.
            </p>

            <h2>8. Email Communications</h2>
            <p>
              If you provide your email address, you consent to receive transactional emails including
              build status updates, download links, and important service notifications. You may
              unsubscribe from marketing communications at any time. Transactional emails cannot
              be opted out of while an active build is in progress.
            </p>

            <h2>9. Disclaimers & Limitation of Liability</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND.
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT GENERATED
              APPLICATIONS WILL MEET YOUR SPECIFIC REQUIREMENTS.
            </p>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SKAV TECH SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS,
              DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
            </p>

            <h2>10. Prohibited Content</h2>
            <p>You may not use the Service to generate applications that:</p>
            <ul>
              <li>Contain malware, spyware, adware, or any malicious code</li>
              <li>Violate applicable laws or regulations</li>
              <li>Infringe on third-party intellectual property rights</li>
              <li>Promote violence, hate speech, or discrimination</li>
              <li>Facilitate phishing, fraud, or identity theft</li>
              <li>Contain adult content accessible to minors</li>
            </ul>

            <h2>11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time,
              with or without notice, for conduct that we believe violates these Terms or is harmful
              to other users, us, or third parties.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify users of material changes
              via email (if provided) or by posting a notice on our website. Continued use of the
              Service after changes constitutes acceptance of the revised Terms.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India, without regard to conflict of law
              principles. Any disputes shall be subject to the exclusive jurisdiction of courts
              located in Hyderabad, Telangana, India.
            </p>

            <h2>14. Contact Us</h2>
            <p>
              If you have questions about these Terms, please contact us at:{' '}
              <a href="mailto:legal@kinetixapp.com">legal@kinetixapp.com</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
