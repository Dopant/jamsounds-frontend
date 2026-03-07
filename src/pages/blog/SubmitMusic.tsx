import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavigation from "@/components/layout/PublicNavigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Music, 
  Upload, 
  Link as LinkIcon, 
  Calendar,
  Globe,
  CheckCircle,
  X,
  Plus,
  FileText,
  Star,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "Netherlands", "Sweden", "Norway", "Denmark", "Finland", "Japan", "South Korea",
  "Brazil", "Mexico", "Spain", "Italy", "Belgium", "Switzerland", "Austria",
  "Ireland", "New Zealand", "South Africa", "Argentina", "Chile", "India", "China"
];

const genres = [
  "Electronic", "Hip-Hop", "Indie Rock", "Folk", "Pop", "Rock", "Jazz", "R&B",
  "Alternative", "Classical", "Country", "Reggae", "Punk", "Metal", "Ambient",
  "House", "Techno", "Drum & Bass", "Dubstep", "Trap", "Indie Pop", "Experimental"
];

const SubmitMusic = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    artistName: "",
    releaseTitle: "",
    email: "",
    country: "",
    releaseDate: "",
    selectedGenres: [] as string[],
    musicUrl: "",
    uploadedFile: null as File | null,
    description: "",
    pressKit: null as File | null,
    socialLinks: {
      spotify: "",
      instagram: "",
      twitter: "",
      youtube: "",
      tiktok: "",
      website: ""
    },
    pressCoverage: "",
    termsAccepted: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Validation
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.artistName.trim()) newErrors.artistName = "Artist/Band name is required";
      if (!formData.releaseTitle.trim()) newErrors.releaseTitle = "Release title is required";
      if (!formData.email.trim()) newErrors.email = "Email address is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
      if (!formData.country) newErrors.country = "Country/Region is required";
    }

    if (step === 2) {
      if (!formData.releaseDate) newErrors.releaseDate = "Release date is required";
      else {
        const releaseDate = new Date(formData.releaseDate);
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 90);
        
        if (releaseDate > maxDate) {
          newErrors.releaseDate = "Release date cannot be more than 90 days in the future";
        }
      }
      if (formData.selectedGenres.length === 0) newErrors.genres = "Please select at least one genre";
      if (!formData.musicUrl.trim() && !formData.uploadedFile) {
        newErrors.music = "Please provide either a music URL or upload a file";
      }
    }

    if (step === 3) {
      if (formData.description.length > 500) {
        newErrors.description = "Description must be 500 characters or less";
      }
    }

    if (step === 4) {
      if (!formData.termsAccepted) {
        newErrors.terms = "You must accept the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      selectedGenres: prev.selectedGenres.includes(genre)
        ? prev.selectedGenres.filter(g => g !== genre)
        : [...prev.selectedGenres, genre]
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'music' | 'pressKit') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'music') {
        setFormData(prev => ({ ...prev, uploadedFile: file }));
      } else {
        setFormData(prev => ({ ...prev, pressKit: file }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    
    try {
      // Track button click with country info
      const clickData = {
        timestamp: new Date().toISOString(),
        country: formData.country,
        artistName: formData.artistName,
        genre: formData.selectedGenres[0] || 'Unknown',
        id: Math.random().toString(36).substr(2, 9).toUpperCase()
      };
      
      // Store click analytics
      const existingClicks = JSON.parse(localStorage.getItem('submissionClickAnalytics') || '[]');
      existingClicks.push(clickData);
      localStorage.setItem('submissionClickAnalytics', JSON.stringify(existingClicks));
      
      // Fetch redirect URL from backend
      const res = await fetch('/api/auth/settings/submit-redirect-url');
      const data = await res.json();
      const redirectUrl = data.url || 'https://example.com';
      
      // Generate submission ID
      const id = 'SUB-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      toast({
        title: "Submission Successful!",
        description: `Your music has been submitted with ID: ${id}`,
      });
      
      // Redirect to admin-configured URL (external redirect)
      window.location.href = redirectUrl;
    } catch (e) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your music. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNavigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8 animate-scale-in">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-4xl font-playfair font-bold mb-4">Submission Complete!</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Thank you for submitting your music to RhythmScribe
              </p>
            </div>

            <Card className="p-8 bg-gradient-card shadow-elevated animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4">What happens next?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Review Process</p>
                    <p className="text-sm text-muted-foreground">Our curators will review your submission within 5-7 business days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Curator Assignment</p>
                    <p className="text-sm text-muted-foreground">We'll match your music with the most suitable curator for your genre</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Publication</p>
                    <p className="text-sm text-muted-foreground">If approved, your review will be published on our blog</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Your Submission ID</p>
                <p className="text-2xl font-mono font-bold text-primary">{submissionId}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Save this ID to track your submission status
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Button onClick={() => navigate("/blog")} className="w-full">
                  Read Our Blog
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Submit Another Track
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
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-playfair font-bold mb-6">
              Submit Your Music
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get your music reviewed by our expert curators and featured on RhythmScribe
            </p>
            
            {/* Progress Indicator */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-elevated">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Basic Information</h2>
                  <p className="text-muted-foreground">Tell us about your release</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="artistName">Artist/Band Name *</Label>
                    <Input
                      id="artistName"
                      value={formData.artistName}
                      onChange={(e) => setFormData(prev => ({ ...prev, artistName: e.target.value }))}
                      placeholder="Enter your artist or band name"
                      className={errors.artistName ? "border-destructive" : ""}
                    />
                    {errors.artistName && <p className="text-sm text-destructive mt-1">{errors.artistName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="releaseTitle">Release Title *</Label>
                    <Input
                      id="releaseTitle"
                      value={formData.releaseTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, releaseTitle: e.target.value }))}
                      placeholder="Song title, EP name, or album title"
                      className={errors.releaseTitle ? "border-destructive" : ""}
                    />
                    {errors.releaseTitle && <p className="text-sm text-destructive mt-1">{errors.releaseTitle}</p>}
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

                  <div>
                    <Label htmlFor="country">Country/Region *</Label>
                    <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                      <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                        <Globe className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && <p className="text-sm text-destructive mt-1">{errors.country}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Release Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Release Details</h2>
                  <p className="text-muted-foreground">When and how can we listen?</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="releaseDate">Release Date *</Label>
                    <Input
                      id="releaseDate"
                      type="date"
                      value={formData.releaseDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                      min={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className={errors.releaseDate ? "border-destructive" : ""}
                    />
                    {errors.releaseDate && <p className="text-sm text-destructive mt-1">{errors.releaseDate}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      Release date can be in the past or up to 90 days in the future
                    </p>
                  </div>

                  <div>
                    <Label>Genres * (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {genres.map((genre) => (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => toggleGenre(genre)}
                          className={`p-2 text-sm rounded-lg border transition-all ${
                            formData.selectedGenres.includes(genre)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border hover:border-primary"
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                    {errors.genres && <p className="text-sm text-destructive mt-1">{errors.genres}</p>}
                    {formData.selectedGenres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.selectedGenres.map((genre) => (
                          <Badge key={genre} variant="secondary" className="text-xs">
                            {genre}
                            <button
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
                    <Label>Music Access *</Label>
                    <div className="space-y-4 mt-2">
                      <div>
                        <Label htmlFor="musicUrl" className="text-sm font-normal">
                          <LinkIcon className="w-4 h-4 inline mr-2" />
                          Music URL (Spotify, SoundCloud, YouTube, etc.)
                        </Label>
                        <Input
                          id="musicUrl"
                          value={formData.musicUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, musicUrl: e.target.value }))}
                          placeholder="https://open.spotify.com/track/..."
                        />
                      </div>
                      
                      <div className="text-center">
                        <span className="text-sm text-muted-foreground">OR</span>
                      </div>

                      <div>
                        <Label htmlFor="fileUpload" className="text-sm font-normal">
                          <Upload className="w-4 h-4 inline mr-2" />
                          Upload Audio File
                        </Label>
                        <Input
                          id="fileUpload"
                          type="file"
                          accept="audio/*"
                          onChange={(e) => handleFileUpload(e, 'music')}
                          className="cursor-pointer"
                        />
                        {formData.uploadedFile && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Selected: {formData.uploadedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                    {errors.music && <p className="text-sm text-destructive mt-1">{errors.music}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Information */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Additional Information</h2>
                  <p className="text-muted-foreground">Help us understand your music better</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Brief Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Tell us about your release, inspiration, or anything that helps us understand your music..."
                      rows={4}
                      maxLength={500}
                      className={errors.description ? "border-destructive" : ""}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{errors.description || ""}</span>
                      <span>{formData.description.length}/500</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pressKit">Press Kit (Optional)</Label>
                    <Input
                      id="pressKit"
                      type="file"
                      accept=".pdf,.doc,.docx,.zip"
                      onChange={(e) => handleFileUpload(e, 'pressKit')}
                      className="cursor-pointer"
                    />
                    {formData.pressKit && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {formData.pressKit.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload your press kit, EPK, or any additional materials (PDF, DOC, ZIP)
                    </p>
                  </div>

                  <div>
                    <Label>Social Media Links (Optional)</Label>
                    <div className="space-y-3 mt-2">
                      {Object.entries(formData.socialLinks).map(([platform, url]) => (
                        <div key={platform}>
                          <Label htmlFor={platform} className="text-sm font-normal capitalize">
                            {platform}
                          </Label>
                          <Input
                            id={platform}
                            value={url}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              socialLinks: { ...prev.socialLinks, [platform]: e.target.value }
                            }))}
                            placeholder={`https://${platform === 'website' ? 'your-website.com' : `${platform}.com/yourprofile`}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pressCoverage">Previous Press Coverage (Optional)</Label>
                    <Textarea
                      id="pressCoverage"
                      value={formData.pressCoverage}
                      onChange={(e) => setFormData(prev => ({ ...prev, pressCoverage: e.target.value }))}
                      placeholder="List any previous features, reviews, or press coverage..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Review & Submit</h2>
                  <p className="text-muted-foreground">Please review your submission before sending</p>
                </div>

                <div className="space-y-6">
                  {/* Summary */}
                  <Card className="p-4 bg-muted/50">
                    <h3 className="font-semibold mb-3">Submission Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Artist:</span>
                        <span className="font-medium">{formData.artistName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Release:</span>
                        <span className="font-medium">{formData.releaseTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Country:</span>
                        <span className="font-medium">{formData.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Release Date:</span>
                        <span className="font-medium">{new Date(formData.releaseDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span>Genres:</span>
                        <div className="flex flex-wrap gap-1 max-w-48">
                          {formData.selectedGenres.map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, termsAccepted: checked as boolean }))
                        }
                      />
                      <div className="flex-1">
                        <Label htmlFor="terms" className="text-sm leading-relaxed">
                          I agree to the <button className="text-primary hover:underline">Terms and Conditions</button> and 
                          confirm that I have the rights to submit this music for review. I understand that:
                        </Label>
                        <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-4">
                          <li>• Submissions are reviewed within 5-7 business days</li>
                          <li>• Not all submissions will be selected for review</li>
                          <li>• Reviews remain property of RhythmScribe</li>
                          <li>• I will be credited as the artist in any published content</li>
                        </ul>
                      </div>
                    </div>
                    {errors.terms && <p className="text-sm text-destructive">{errors.terms}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              
              <div className="ml-auto">
                {currentStep < totalSteps ? (
                  <Button onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="min-w-32"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      "Submit for Review"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmitMusic;