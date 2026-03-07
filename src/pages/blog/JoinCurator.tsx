import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavigation from "@/components/layout/PublicNavigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Upload, 
  CheckCircle,
  Star,
  Clock,
  Award,
  FileText,
  Music,
  X,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const genres = [
  "Electronic", "Hip-Hop", "Indie Rock", "Folk", "Pop", "Rock", "Jazz", "R&B",
  "Alternative", "Classical", "Country", "Reggae", "Punk", "Metal", "Ambient",
  "House", "Techno", "Drum & Bass", "Dubstep", "Trap", "Indie Pop", "Experimental"
];

const reviewFrequencies = [
  "1-2 reviews per week",
  "3-5 reviews per week", 
  "5-10 reviews per week",
  "10+ reviews per week",
  "Flexible/As needed"
];

const JoinCurator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    
    // Professional Background
    background: "",
    expertise: [] as string[],
    writingExperience: "",
    portfolioLinks: ["", "", ""],
    
    // Social Media
    socialMedia: {
      instagram: "",
      twitter: "",
      linkedin: "",
      tiktok: "",
      website: ""
    },
    
    // Preferences
    reviewFrequency: "",
    equipment: "",
    coverLetter: "",
    
    // Uploads
    portfolio: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.background.trim()) newErrors.background = "Professional background is required";
    if (formData.expertise.length === 0) newErrors.expertise = "Please select at least one genre";
    if (!formData.writingExperience.trim()) newErrors.writingExperience = "Writing experience is required";
    if (!formData.reviewFrequency) newErrors.reviewFrequency = "Please select review frequency";
    if (!formData.coverLetter.trim()) newErrors.coverLetter = "Cover letter is required";
    else if (formData.coverLetter.length < 100) newErrors.coverLetter = "Cover letter must be at least 100 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(genre)
        ? prev.expertise.filter(g => g !== genre)
        : [...prev.expertise, genre]
    }));
  };

  const updatePortfolioLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.map((link, i) => i === index ? value : link)
    }));
  };

  const addPortfolioLink = () => {
    setFormData(prev => ({
      ...prev,
      portfolioLinks: [...prev.portfolioLinks, ""]
    }));
  };

  const removePortfolioLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, portfolio: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const id = 'CUR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setApplicationId(id);
      setSubmitted(true);
      
      toast({
        title: "Application Submitted!",
        description: `Thank you for applying. Your application ID is: ${id}`,
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNavigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8 animate-scale-in">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-4xl font-playfair font-bold mb-4">Application Submitted!</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Thank you for your interest in becoming a RhythmScribe curator
              </p>
            </div>

            <Card className="p-8 bg-gradient-card shadow-elevated animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4">What's Next?</h2>
              
              <div className="space-y-4 text-left mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Application Review</p>
                    <p className="text-sm text-muted-foreground">Our team will review your application within 1-2 weeks</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Portfolio Assessment</p>
                    <p className="text-sm text-muted-foreground">We'll evaluate your writing samples and music expertise</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Interview Process</p>
                    <p className="text-sm text-muted-foreground">Qualified candidates will be invited for a brief interview</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <p className="font-medium">Onboarding</p>
                    <p className="text-sm text-muted-foreground">Welcome to the team! We'll provide training and resources</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg mb-6">
                <p className="text-sm text-muted-foreground mb-2">Your Application ID</p>
                <p className="text-2xl font-mono font-bold text-primary">{applicationId}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Save this ID to track your application status
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={() => navigate("/blog")} className="w-full">
                  Read Our Blog
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/curator/login")}
                  className="w-full"
                >
                  Curator Login
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />
      
      {/* Header */}
      <section className="py-16 bg-gradient-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-playfair font-bold mb-6">
              Join Our Curator Team
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Help discover the next generation of musical talent and shape the future of music journalism
            </p>
            
            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 bg-background rounded-lg shadow-card">
                <Star className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Expert Recognition</h3>
                <p className="text-sm text-muted-foreground">Build your reputation as a respected music critic</p>
              </div>
              <div className="p-6 bg-background rounded-lg shadow-card">
                <Award className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Flexible Earnings</h3>
                <p className="text-sm text-muted-foreground">Earn competitive rates for quality reviews</p>
              </div>
              <div className="p-6 bg-background rounded-lg shadow-card">
                <Music className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Early Access</h3>
                <p className="text-sm text-muted-foreground">Discover amazing music before it hits mainstream</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <Card className="p-8 shadow-elevated">
              <div className="space-y-8">
                {/* Personal Information */}
                <section className="animate-fade-in">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <Users className="w-6 h-6 mr-3" />
                    Personal Information
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Your full name"
                        className={errors.fullName ? "border-destructive" : ""}
                      />
                      {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Your phone number"
                    />
                  </div>
                </section>

                {/* Professional Background */}
                <section className="animate-slide-up stagger-1">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <FileText className="w-6 h-6 mr-3" />
                    Professional Background
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="background">Professional Background *</Label>
                      <Textarea
                        id="background"
                        value={formData.background}
                        onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
                        placeholder="Tell us about your professional background, education, and relevant experience..."
                        rows={4}
                        className={errors.background ? "border-destructive" : ""}
                      />
                      {errors.background && <p className="text-sm text-destructive mt-1">{errors.background}</p>}
                    </div>

                    <div>
                      <Label>Music Expertise/Preferred Genres * (Select all that apply)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {genres.map((genre) => (
                          <button
                            key={genre}
                            type="button"
                            onClick={() => toggleGenre(genre)}
                            className={`p-2 text-sm rounded-lg border transition-all ${
                              formData.expertise.includes(genre)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background border-border hover:border-primary"
                            }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                      {errors.expertise && <p className="text-sm text-destructive mt-1">{errors.expertise}</p>}
                      {formData.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formData.expertise.map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-xs">
                              {genre}
                              <button
                                type="button"
                                onClick={() => toggleGenre(genre)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="writingExperience">Writing Experience & Portfolio Links *</Label>
                      <Textarea
                        id="writingExperience"
                        value={formData.writingExperience}
                        onChange={(e) => setFormData(prev => ({ ...prev, writingExperience: e.target.value }))}
                        placeholder="Describe your writing experience, publications, blogs, or any relevant content creation..."
                        rows={3}
                        className={errors.writingExperience ? "border-destructive" : ""}
                      />
                      {errors.writingExperience && <p className="text-sm text-destructive mt-1">{errors.writingExperience}</p>}
                    </div>

                    <div>
                      <Label>Portfolio Links</Label>
                      <div className="space-y-2 mt-2">
                        {formData.portfolioLinks.map((link, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={link}
                              onChange={(e) => updatePortfolioLink(index, e.target.value)}
                              placeholder="https://your-portfolio-link.com"
                              className="flex-1"
                            />
                            {formData.portfolioLinks.length > 3 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removePortfolioLink(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addPortfolioLink}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Link
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Social Media & Online Presence */}
                <section className="animate-slide-up stagger-2">
                  <h2 className="text-2xl font-semibold mb-6">Social Media Presence</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(formData.socialMedia).map(([platform, url]) => (
                      <div key={platform}>
                        <Label htmlFor={platform} className="capitalize">
                          {platform}
                        </Label>
                        <Input
                          id={platform}
                          value={url}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, [platform]: e.target.value }
                          }))}
                          placeholder={`https://${platform === 'website' ? 'your-website.com' : `${platform}.com/yourprofile`}`}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Preferences & Commitment */}
                <section className="animate-slide-up stagger-3">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <Clock className="w-6 h-6 mr-3" />
                    Preferences & Commitment
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reviewFrequency">Review Frequency Preference *</Label>
                      <Select 
                        value={formData.reviewFrequency} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, reviewFrequency: value }))}
                      >
                        <SelectTrigger className={errors.reviewFrequency ? "border-destructive" : ""}>
                          <SelectValue placeholder="How many reviews can you commit to?" />
                        </SelectTrigger>
                        <SelectContent>
                          {reviewFrequencies.map((frequency) => (
                            <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.reviewFrequency && <p className="text-sm text-destructive mt-1">{errors.reviewFrequency}</p>}
                    </div>

                    <div>
                      <Label htmlFor="equipment">Equipment/Tools Used</Label>
                      <Textarea
                        id="equipment"
                        value={formData.equipment}
                        onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                        placeholder="What equipment do you use for listening? (headphones, monitors, audio interface, etc.)"
                        rows={2}
                      />
                    </div>
                  </div>
                </section>

                {/* Cover Letter */}
                <section className="animate-slide-up stagger-4">
                  <h2 className="text-2xl font-semibold mb-6">Cover Letter</h2>
                  
                  <div>
                    <Label htmlFor="coverLetter">Why do you want to join RhythmScribe? *</Label>
                    <Textarea
                      id="coverLetter"
                      value={formData.coverLetter}
                      onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                      placeholder="Tell us why you're passionate about music curation and what you'd bring to our team..."
                      rows={6}
                      className={errors.coverLetter ? "border-destructive" : ""}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{errors.coverLetter || "Minimum 100 characters"}</span>
                      <span>{formData.coverLetter.length} characters</span>
                    </div>
                  </div>
                </section>

                {/* Portfolio Upload */}
                <section className="animate-slide-up stagger-5">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <Upload className="w-6 h-6 mr-3" />
                    Portfolio Upload
                  </h2>
                  
                  <div>
                    <Label htmlFor="portfolio">Upload Portfolio (Optional)</Label>
                    <Input
                      id="portfolio"
                      type="file"
                      accept=".pdf,.doc,.docx,.zip"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                    {formData.portfolio && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {formData.portfolio.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload additional writing samples, press kit, or portfolio (PDF, DOC, ZIP - Max 10MB)
                    </p>
                  </div>
                </section>

                {/* Submit Button */}
                <div className="pt-6 border-t border-border">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full text-lg py-3"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                        Submitting Application...
                      </div>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinCurator;