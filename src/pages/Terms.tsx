import { Link } from "react-router-dom";
import PublicNavigation from "@/components/layout/PublicNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <PublicNavigation />
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-playfair">Terms and Conditions</CardTitle>
          <p className="text-muted-foreground">Welcome to JamJournal.com</p>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-6">
          <p>These Terms and Conditions outline the rules and regulations for the use of our website. By accessing and using JamJournal.com, you accept and agree to comply with these Terms and Conditions. If you do not agree with any part of these terms, you should not use this website.</p>

          <h2 className="text-xl font-semibold mt-8">1. About JamJournal</h2>
          <p>JamJournal is an Atlanta-based music publication that provides editorial coverage of artists, songs, albums, and music videos. Our platform focuses on music discovery, artist promotion, and cultural commentary across the United States and beyond. All articles, reviews, and editorial content published on JamJournal represent independent opinions and commentary.</p>

          <h2 className="text-xl font-semibold mt-8">2. Intellectual Property Rights</h2>
          <p>Unless otherwise stated, JamJournal.com owns the intellectual property rights for all original content published on this website, including but not limited to written articles, reviews and commentary, website design and layout, and graphics created by JamJournal. You may not reproduce, republish, distribute, or exploit any content from this website without prior written permission. Embedded media such as music players, music videos, and cover artwork remain the property of their respective owners and copyright holders.</p>

          <h2 className="text-xl font-semibold mt-8">3. Embedded Music and Third-Party Platforms</h2>
          <p>JamJournal articles may include embedded music players and videos hosted on third-party platforms such as Spotify, YouTube, SoundCloud, Apple Music, and Audiomack. These services operate independently from JamJournal.com and may collect data according to their own privacy policies. JamJournal does not host or store the music files directly. We are not responsible for the availability, accuracy, or content of these external platforms.</p>

          <h2 className="text-xl font-semibold mt-8">4. Artist Submissions</h2>
          <p>Artists, managers, labels, or publicists may submit music, press materials, and promotional content for consideration on JamJournal.com. By submitting content, you confirm that you own or have authorization to share the submitted material, the material does not infringe on any third-party rights, and you grant JamJournal permission to review, publish, and promote the submitted content on our website and affiliated social media platforms. Submission does not guarantee publication. JamJournal reserves the right to accept, decline, or edit submissions at its sole discretion.</p>

          <h2 className="text-xl font-semibold mt-8">5. Editorial Independence</h2>
          <p>JamJournal maintains editorial independence in all music reviews and features. Opinions expressed in reviews reflect the views of the writer and are intended for informational and entertainment purposes. Publication on JamJournal does not imply endorsement or guarantee commercial success for the artist or music being featured.</p>

          <h2 className="text-xl font-semibold mt-8">6. Advertising and Monetization</h2>
          <p>JamJournal.com may display advertisements, sponsored content, or affiliate links. Sponsored content will be clearly identified where applicable. JamJournal is not responsible for the products, services, or claims made by third-party advertisers.</p>

          <h2 className="text-xl font-semibold mt-8">7. Limitation of Liability</h2>
          <p>JamJournal.com is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties or guarantees regarding the completeness or reliability of website content, uninterrupted website access, or third-party services embedded on the site. JamJournal shall not be held liable for any losses, damages, or disputes arising from the use of this website or reliance on its content.</p>

          <h2 className="text-xl font-semibold mt-8">8. Copyright and Intellectual Property Complaints</h2>
          <p>JamJournal respects intellectual property rights. If you believe any content on this website infringes upon your copyright, you may submit a notice requesting removal. Please include your name and contact information, a description of the copyrighted work, the URL of the allegedly infringing content, and a statement confirming your good faith belief that the use is unauthorized.</p>

          <h2 className="text-xl font-semibold mt-8">9. Changes to These Terms</h2>
          <p>JamJournal.com reserves the right to update or modify these Terms and Conditions at any time. Continued use of the website after changes indicates acceptance of the updated terms.</p>

          <h2 className="text-xl font-semibold mt-8">10. Governing Law</h2>
          <p>These Terms and Conditions are governed by the laws of the United States and the State of Georgia.</p>

          <h2 className="text-xl font-semibold mt-8">11. Contact Information</h2>
          <p>For questions regarding these Terms and Conditions, please contact: jamjournalofficial@gmail.com | Website: JamJournal.com</p>
        </CardContent>
      </Card>
      <p className="mt-6 text-center">
        <Link to="/" className="text-primary hover:underline">Back to Home</Link>
      </p>
    </main>
  </div>
);

export default Terms;
