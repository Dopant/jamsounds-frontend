import { Link } from "react-router-dom";
import PublicNavigation from "@/components/layout/PublicNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Disclaimer = () => (
  <div className="min-h-screen bg-background">
    <PublicNavigation />
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-playfair">Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-6">
          <p>
            JamJournal.com provides music reviews, editorial commentary, and promotional content for informational and entertainment purposes only. All opinions expressed on this website are those of the writers and do not guarantee commercial success, streaming performance, or audience growth for any featured artist or release.
          </p>
          <p>
            JamJournal.com does not own or host music files. All embedded music, videos, and media are provided through legitimate third-party platforms such as Spotify, YouTube, and other authorized streaming services. We are not responsible for the content, availability, or privacy practices of these external platforms.
          </p>
          <p>
            While we strive to provide accurate information, JamJournal.com makes no warranties regarding the completeness, reliability, or accuracy of published content. Users engage with this website at their own risk.
          </p>
          <p>
            For legal or copyright concerns, please contact us directly.
          </p>
        </CardContent>
      </Card>
      <p className="mt-6 text-center">
        <Link to="/" className="text-primary hover:underline">Back to Home</Link>
      </p>
    </main>
  </div>
);

export default Disclaimer;
