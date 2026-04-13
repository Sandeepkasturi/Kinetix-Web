import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Kinetix',
  description: 'Learn how Kinetix collects, uses, and protects your personal data.',
};

const EFFECTIVE_DATE = 'April 13, 2026';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-[#f1f5f9]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-40" />
        <div className="hero-orb-cyan absolute -top-40 left-1/2 -translate-x-1/2 opacity-30" />
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <div className="badge badge-cyan inline-flex mb-6">Legal</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-[#94a3b8]">
            Effective Date: <strong className="text-white">{EFFECTIVE_DATE}</strong>
          </p>
          <p className="text-[#94a3b8] mt-2 leading-relaxed">
            Your privacy is important to us. This policy explains what data we collect, why we collect it,
            and how we keep it safe.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="glass-card p-8 md:p-12 legal-prose">

            <h2>1. Who We Are</h2>
            <p>
              Kinetix is a product of <strong>SKAV TECH</strong>, operated by Sandeep Kasturi.
              We are the data controller for information collected through this Service.
              Contact: <a href="mailto:privacy@kinetixapp.com">privacy@kinetixapp.com</a>
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Information You Provide</h3>
            <ul>
              <li><strong>Website URL</strong> — The URL you wish to convert to a native app</li>
              <li><strong>App Name</strong> — The name you assign to your generated application</li>
              <li><strong>Email Address</strong> — Optional, used for build notifications and CRM communications</li>
              <li><strong>App Icon</strong> — An optional image file uploaded for branding purposes</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <ul>
              <li><strong>IP Address</strong> — For security, rate limiting, and abuse prevention</li>
              <li><strong>Browser / User Agent</strong> — For analytics and compatibility</li>
              <li><strong>Build Metadata</strong> — Build ID, timestamp, platform selection, build outcome</li>
              <li><strong>Usage Analytics</strong> — Aggregated, anonymized session data via privacy-first analytics</li>
            </ul>

            <h3>2.3 What We Do NOT Collect</h3>
            <ul>
              <li>We do not scan or read the content of your website</li>
              <li>We do not collect payment information (Kinetix free tier requires no payment)</li>
              <li>We do not sell your data to third parties</li>
              <li>We do not track users across third-party websites</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use collected data to:</p>
            <ul>
              <li>Generate and build your Android APK or iOS IPA from the provided URL</li>
              <li>Send transactional emails (build ready, download link, errors) via <strong>Resend</strong></li>
              <li>Rate-limit requests to prevent abuse and protect service availability</li>
              <li>Improve platform performance and debug build failures</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Data Retention</h2>
            <ul>
              <li><strong>Build artifacts (APK/IPA)</strong> — Deleted automatically after 72 hours</li>
              <li><strong>Uploaded icons</strong> — Deleted immediately after the build completes or fails</li>
              <li><strong>Build logs</strong> — Retained for up to 30 days for debugging support</li>
              <li><strong>Email addresses</strong> — Retained until you request deletion or unsubscribe</li>
              <li><strong>IP/request logs</strong> — Retained for up to 7 days for security monitoring</li>
            </ul>

            <h2>5. Third-Party Services</h2>
            <p>We use the following third parties, each with their own privacy policies:</p>
            <ul>
              <li>
                <strong>GitHub</strong> — Cloud build execution via GitHub Actions.
                Your URL and app name are passed to GitHub Actions runners.{' '}
                <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noreferrer">GitHub Privacy Policy</a>
              </li>
              <li>
                <strong>Resend</strong> — Email delivery platform for transactional notifications.
                Your email address is shared with Resend only to deliver your build notification.{' '}
                <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noreferrer">Resend Privacy Policy</a>
              </li>
              <li>
                <strong>Vercel</strong> — Hosting platform for the Kinetix web application.{' '}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel Privacy Policy</a>
              </li>
            </ul>

            <h2>6. Security</h2>
            <p>We implement multiple layers of security to protect your data:</p>
            <ul>
              <li>All data in transit is encrypted using TLS 1.3</li>
              <li>API endpoints are rate-limited to prevent brute-force and DoS attacks</li>
              <li>Input validation and sanitization on all user-supplied data</li>
              <li>HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)</li>
              <li>Generated APKs are signed with unique RSA-2048 keystores</li>
              <li>No sensitive credentials are stored in application code (all via environment variables)</li>
            </ul>

            <h2>7. Cookies</h2>
            <p>
              Kinetix uses only <strong>strictly necessary cookies</strong> required for the Service to
              function. We do not use tracking cookies, advertising cookies, or third-party analytics
              cookies. No cookie consent banner is required as we do not use non-essential cookies.
            </p>

            <h2>8. Your Rights (GDPR & CCPA)</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li><strong>Right of Access</strong> — Request a copy of data we hold about you</li>
              <li><strong>Right to Erasure</strong> — Request deletion of your personal data</li>
              <li><strong>Right to Rectification</strong> — Request correction of inaccurate data</li>
              <li><strong>Right to Object</strong> — Object to processing of your data</li>
              <li><strong>Right to Portability</strong> — Request your data in a portable format</li>
            </ul>
            <p>
              To exercise these rights, email <a href="mailto:privacy@kinetixapp.com">privacy@kinetixapp.com</a>.
              We will respond within 30 days.
            </p>

            <h2>9. Children&apos;s Privacy</h2>
            <p>
              The Service is not directed to children under 13. We do not knowingly collect personal
              information from children under 13. If you believe we have collected such information,
              please contact us and we will delete it immediately.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant changes
              via email (if provided) or a prominent notice on our website. The &quot;Effective Date&quot; at the
              top of this page will always reflect the latest version.
            </p>

            <h2>11. Contact</h2>
            <p>
              For any privacy-related inquiries, please contact:<br />
              <strong>Email:</strong> <a href="mailto:privacy@kinetixapp.com">privacy@kinetixapp.com</a><br />
              <strong>Address:</strong> SKAV TECH, Hyderabad, Telangana, India
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
