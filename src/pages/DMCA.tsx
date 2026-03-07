import { Link } from "react-router-dom";
import PublicNavigation from "@/components/layout/PublicNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DMCA = () => (
  <div className="min-h-screen bg-background">
    <PublicNavigation />
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-playfair">DMCA Copyright Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-6">
          <p>
            JamJournal.com respects the intellectual property rights of others and expects users, contributors, and content submitters to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we respond promptly to valid claims of copyright infringement that are reported to us.
          </p>

          <h2 className="text-xl font-semibold mt-8">1. Copyright Ownership</h2>
          <p>All original editorial content published on JamJournal.com is the intellectual property of JamJournal unless otherwise stated. Music players, videos, cover artwork, and other media included in our articles are typically embedded or referenced from legitimate third-party platforms. JamJournal does not host or store copyrighted music files on its servers.</p>

          <h2 className="text-xl font-semibold mt-8">2. Reporting Copyright Infringement</h2>
          <p>Your DMCA takedown notice must include:</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Your full name and contact information (email address and phone number)</li>
            <li>Identification of the copyrighted work you claim has been infringed</li>
            <li>The exact URL or location on JamJournal.com where the allegedly infringing content appears</li>
            <li>A statement that you have a good-faith belief that the disputed use is not authorized</li>
            <li>A statement that the information in the notice is accurate and that you are authorized to act on behalf of the copyright owner</li>
            <li>Your physical or electronic signature</li>
          </ol>

          <h2 className="text-xl font-semibold mt-8">3. Submission of DMCA Notices</h2>
          <p>DMCA notices should be sent to: <strong>Jamjournalofficial@gmail.com</strong> with Subject Line: <strong>DMCA Takedown Request</strong>. Upon receiving a valid notice, we will review the request and take appropriate action.</p>

          <h2 className="text-xl font-semibold mt-8">4. Counter Notification</h2>
          <p>If you believe that content removed from JamJournal.com was removed in error, you may submit a counter-notification including your name and contact information, identification of the removed material, a statement under penalty of perjury that you believe the removal was a mistake, your consent to the jurisdiction of a U.S. federal court, and your physical or electronic signature.</p>

          <h2 className="text-xl font-semibold mt-8">5. Contact Information</h2>
          <p>Email: Jamjournalofficial@gmail.com | Website: JamJournal.com</p>
        </CardContent>
      </Card>
      <p className="mt-6 text-center">
        <Link to="/" className="text-primary hover:underline">Back to Home</Link>
      </p>
    </main>
  </div>
);

export default DMCA;
