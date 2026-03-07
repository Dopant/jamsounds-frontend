import { Link } from "react-router-dom";
import PublicNavigation from "@/components/layout/PublicNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <PublicNavigation />
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-playfair">Contact Us</CardTitle>
          <p className="text-muted-foreground">
            Get in touch with the JamJournal team for submissions, partnerships, or inquiries.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Email</p>
              <a href="mailto:Jamjournalofficial@gmail.com" className="text-primary hover:underline">
                Jamjournalofficial@gmail.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Phone</p>
              <a href="tel:+12404139709" className="text-primary hover:underline">
                (+1) 2404139709
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-muted-foreground">
                1395 Winder Hwy, Dacula GA 30019, United States
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="mt-6 text-center">
        <Link to="/" className="text-primary hover:underline">Back to Home</Link>
      </p>
    </main>
  </div>
);

export default Contact;
