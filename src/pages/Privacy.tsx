import { Link } from "react-router-dom";
import PublicNavigation from "@/components/layout/PublicNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <PublicNavigation />
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-playfair">Privacy Policy</CardTitle>
          <p className="text-muted-foreground">Last updated: March 2025</p>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-6">
          <p>
            We are an Atlanta-based music publication dedicated to reviewing and promoting artists, songs, and music videos across the United States and beyond. We are committed to protecting your privacy and handling your information with transparency and responsibility.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit JamJournal.com. By accessing or using this website, you agree to the terms outlined below.
          </p>

          <h2 className="text-xl font-semibold mt-8">1. Information We Collect</h2>
          <h3 className="text-lg font-medium mt-4">Information You Provide Voluntarily</h3>
          <p>We may collect personal information that you voluntarily provide, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name</li>
            <li>Email address</li>
            <li>Artist or company name</li>
            <li>Social media handles</li>
            <li>Press materials and promotional content</li>
            <li>Any information submitted through contact forms or email</li>
          </ul>
          <p>This typically occurs when artists, managers, or representatives submit music for review or contact us for collaboration.</p>

          <h3 className="text-lg font-medium mt-4">Automatically Collected Information</h3>
          <p>When you visit JamJournal.com, certain information may be collected automatically, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device information</li>
            <li>Pages visited</li>
            <li>Time spent on pages</li>
            <li>Referral sources</li>
          </ul>
          <p>This data helps us analyze traffic, improve performance, and better understand our audience.</p>

          <h2 className="text-xl font-semibold mt-8">2. How We Use Your Information</h2>
          <p>We may use collected information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Review and publish music submissions</li>
            <li>Communicate with artists and industry professionals</li>
            <li>Improve website functionality and user experience</li>
            <li>Analyze website traffic and engagement trends</li>
            <li>Promote reviewed content across our social media platforms</li>
            <li>Support advertising and monetization efforts</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>We do not sell personal information to third parties.</p>

          <h2 className="text-xl font-semibold mt-8">3. Embedded Third-Party Content</h2>
          <p>Our editorial articles frequently include embedded music players and videos from platforms such as Spotify, Apple Music, YouTube, SoundCloud, and Audiomack. Embedded content operates as if you visited those platforms directly. These third-party services may collect data, use cookies, and track interactions according to their own privacy policies. JamJournal.com does not control or assume responsibility for their data practices.</p>

          <h2 className="text-xl font-semibold mt-8">4. Cookies and Tracking Technologies</h2>
          <p>JamJournal.com may use cookies and similar technologies to enhance site functionality, measure performance, analyze visitor behavior, and deliver relevant advertising. You may disable cookies through your browser settings; however, some features of the site may not function properly.</p>

          <h2 className="text-xl font-semibold mt-8">5. Advertising and Monetization</h2>
          <p>We may display advertisements or participate in affiliate marketing programs. Advertising partners and analytics providers, such as Google AdSense, Google Analytics, and Meta, may collect certain usage data in accordance with their own privacy policies. Sponsored content, when applicable, will be clearly identified.</p>

          <h2 className="text-xl font-semibold mt-8">6. Artist Submissions</h2>
          <p>By submitting music, artwork, press releases, or promotional materials to JamJournal.com, you confirm that you own or have authorization to share the content. You grant us permission to publish, review, and promote the material on our website and affiliated social media platforms. We do not claim ownership of submitted content.</p>

          <h2 className="text-xl font-semibold mt-8">7. Data Security</h2>
          <p>We implement reasonable administrative and technical safeguards to protect your information. However, no online transmission or storage system is guaranteed to be completely secure.</p>

          <h2 className="text-xl font-semibold mt-8">8. Your Privacy Rights</h2>
          <p>Depending on your location, including certain U.S. states, you may have the right to request access to your personal information, request correction or deletion of your data, and withdraw consent where applicable. To exercise these rights, please contact us at (+1) 2404139709 or Jamjournalofficial@gmail.com.</p>

          <h2 className="text-xl font-semibold mt-8">9. Children&apos;s Privacy</h2>
          <p>JamJournal.com does not knowingly collect personal information from children under the age of 13.</p>

          <h2 className="text-xl font-semibold mt-8">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. Any changes will be reflected by updating the effective date above.</p>

          <h2 className="text-xl font-semibold mt-8">11. Contact Us</h2>
          <p>For questions regarding this Privacy Policy, please contact:</p>
          <p>Email: Jamjournalofficial@gmail.com</p>
          <p>Contact: (+1) 2404139709</p>
          <p>Website: JamJournal.com</p>
        </CardContent>
      </Card>
      <p className="mt-6 text-center">
        <Link to="/" className="text-primary hover:underline">Back to Home</Link>
      </p>
    </main>
  </div>
);

export default Privacy;
