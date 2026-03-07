import { Link } from "react-router-dom";
import PublicNavigation from "@/components/layout/PublicNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => (
  <div className="min-h-screen bg-background">
    <PublicNavigation />
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-playfair">About JamJournal</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-6">
          <p>
            JamJournal is an Atlanta-based music publication spotlighting rising and established artists across the United States and beyond.
          </p>
          <p>
            Rooted in one of America&apos;s most influential music cities, JamJournal was created to provide artists with authentic editorial coverage and meaningful exposure. We believe music deserves thoughtful storytelling, not just quick posts or automated promotion.
          </p>
          <p>Our platform focuses on:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>In-depth music reviews</li>
            <li>Song and video features</li>
            <li>Artist spotlights</li>
            <li>Emerging talent discovery</li>
            <li>Cultural commentary</li>
          </ul>
          <p>Every article is crafted with attention to detail, ensuring that artists are represented professionally and respectfully.</p>

          <h2 className="text-xl font-semibold mt-8">Our Mission</h2>
          <p>Our mission is simple: To amplify independent voices and bridge the gap between artists and new audiences.</p>
          <p>We understand how important visibility is in today&apos;s music landscape. That&apos;s why we go beyond publishing—we actively promote featured artists across our social media platforms to maximize reach and engagement.</p>

          <h2 className="text-xl font-semibold mt-8">What Makes JamJournal Different</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>We embed official music links from legitimate streaming platforms.</li>
            <li>We maintain editorial integrity in every review.</li>
            <li>We support both independent and established artists.</li>
            <li>We operate with professionalism, transparency, and industry respect.</li>
          </ul>
          <p>We are proudly Atlanta-based, but our reach extends nationwide, connecting music lovers to new sounds regardless of location.</p>

          <h2 className="text-xl font-semibold mt-8">Work With Us</h2>
          <p>Artists, managers, labels, and publicists are welcome to submit music for consideration. While submission does not guarantee publication, we carefully review every entry.</p>
          <p>For submissions, partnerships, or inquiries, please contact: <a href="mailto:Jamjournalofficial@gmail.com" className="text-primary hover:underline">Jamjournalofficial@gmail.com</a></p>
        </CardContent>
      </Card>
      <p className="mt-6 text-center">
        <Link to="/" className="text-primary hover:underline">Back to Home</Link>
      </p>
    </main>
  </div>
);

export default About;
