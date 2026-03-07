import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Music,
  Calendar,
  Globe,
  Mail,
  Star,
  Flag,
  MessageSquare,
  Copy,
  ExternalLink,
  AlertTriangle,
  Shield,
  Eye,
  Download
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminSubmissionReview = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [reviewAction, setReviewAction] = useState("");
  const [curatorAssignment, setCuratorAssignment] = useState("");
  const [priority, setPriority] = useState("");
  const [genre, setGenre] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  // Mock submission data - in real app, fetch by ID
  const submission = {
    id: id || "SUB-001",
    artistName: "Arctic Waves",
    trackTitle: "Digital Dreams",
    email: "arctic@waves.com",
    country: "Canada",
    submissionDate: "2024-01-15",
    releaseDate: "2024-01-20",
    genre: "Electronic",
    selectedGenres: ["Electronic", "Ambient", "Chillwave"],
    description: "Digital Dreams is an exploration of synthetic soundscapes that blend nostalgic synth-pop elements with modern electronic production. The track features ethereal vocals layered over driving arpeggios and warm analog-style pads, creating an immersive sonic experience that transports listeners to a digital utopia.",
    musicUrl: "https://soundcloud.com/arctic-waves/digital-dreams",
    socialLinks: {
      spotify: "https://open.spotify.com/artist/arcticwaves",
      instagram: "@arcticwaves",
      website: "https://arcticwaves.com"
    },
    pressCoverage: "Featured in Electronic Music Blog, Synth Weekly review",
    status: "pending",
    qualityScore: 8.5,
    duplicateCheck: false,
    technicalQuality: {
      audioQuality: 9.2,
      mixingQuality: 8.8,
      masteringQuality: 8.5,
      overallScore: 8.8
    },
    previousSubmissions: [
      { title: "Neon Nights", date: "2023-11-15", status: "approved" },
      { title: "Midnight Drive", date: "2023-08-22", status: "approved" }
    ]
  };

  const curators = [
    { id: "1", name: "Sarah Johnson", specialty: "Electronic", available: true },
    { id: "2", name: "Mike Chen", specialty: "Indie Rock", available: false },
    { id: "3", name: "Emma Davis", specialty: "Folk", available: true },
    { id: "4", name: "Alex Rodriguez", specialty: "Hip-Hop", available: true }
  ];

  const handleReviewDecision = (action: string) => {
    setReviewAction(action);
    toast({
      title: "Review Decision",
      description: `Submission ${action} successfully`,
    });
  };

  const handleCuratorAssignment = () => {
    if (!curatorAssignment) return;
    
    toast({
      title: "Curator Assigned",
      description: `Submission assigned to ${curators.find(c => c.id === curatorAssignment)?.name}`,
    });
  };

  const handleSaveNotes = () => {
    toast({
      title: "Notes Saved",
      description: "Review notes and internal comments have been saved",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Submission Review</h1>
            <p className="text-muted-foreground">
              Review submission {submission.id} - {submission.trackTitle}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-orange-600">
              <Clock className="w-3 h-3 mr-1" />
              {submission.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview Page
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Review Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Player */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  Audio Player
                </CardTitle>
                <CardDescription>
                  Listen and analyze the submitted track
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{submission.trackTitle}</h3>
                        <p className="text-muted-foreground">by {submission.artistName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-1/3 transition-all duration-300"></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1:23</span>
                      <span>3:45</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in SoundCloud
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submission Details */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="quality">Quality Check</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Basic Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Artist:</span>
                            <span>{submission.artistName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Track:</span>
                            <span>{submission.trackTitle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Genre:</span>
                            <span>{submission.genre}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Release Date:</span>
                            <span>{submission.releaseDate}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span>{submission.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Country:</span>
                            <span>{submission.country}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Submission Date:</span>
                            <span>{submission.submissionDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {submission.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Genres</h4>
                      <div className="flex flex-wrap gap-2">
                        {submission.selectedGenres.map((genre) => (
                          <Badge key={genre} variant="outline">{genre}</Badge>
                        ))}
                      </div>
                    </div>

                    {submission.pressCoverage && (
                      <div>
                        <h4 className="font-medium mb-2">Press Coverage</h4>
                        <p className="text-sm text-muted-foreground">{submission.pressCoverage}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="quality" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-3">Technical Quality</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Audio Quality</span>
                                <span>{submission.technicalQuality.audioQuality}/10</span>
                              </div>
                              <div className="bg-muted h-2 rounded">
                                <div 
                                  className="bg-green-500 h-full rounded" 
                                  style={{ width: `${submission.technicalQuality.audioQuality * 10}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Mixing Quality</span>
                                <span>{submission.technicalQuality.mixingQuality}/10</span>
                              </div>
                              <div className="bg-muted h-2 rounded">
                                <div 
                                  className="bg-blue-500 h-full rounded" 
                                  style={{ width: `${submission.technicalQuality.mixingQuality * 10}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Mastering Quality</span>
                                <span>{submission.technicalQuality.masteringQuality}/10</span>
                              </div>
                              <div className="bg-muted h-2 rounded">
                                <div 
                                  className="bg-purple-500 h-full rounded" 
                                  style={{ width: `${submission.technicalQuality.masteringQuality * 10}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-3">Compliance Checks</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Duplicate Detection</span>
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Passed
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Content Guidelines</span>
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Compliant
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Technical Standards</span>
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Meets Standards
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Plagiarism Check</span>
                              <Badge className="bg-green-100 text-green-800">
                                <Shield className="w-3 h-3 mr-1" />
                                Original
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Previous Submissions</h4>
                      <div className="space-y-2">
                        {submission.previousSubmissions.map((prev, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium">{prev.title}</p>
                              <p className="text-sm text-muted-foreground">{prev.date}</p>
                            </div>
                            <Badge className={prev.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {prev.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            {/* Review Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Review Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Review Decision</label>
                  <div className="space-y-2">
                    <Button 
                      className="w-full justify-start" 
                      variant={reviewAction === 'approve' ? 'default' : 'outline'}
                      onClick={() => handleReviewDecision('approve')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Submission
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant={reviewAction === 'reject' ? 'destructive' : 'outline'}
                      onClick={() => handleReviewDecision('reject')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Submission
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant={reviewAction === 'request_changes' ? 'secondary' : 'outline'}
                      onClick={() => handleReviewDecision('request_changes')}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Request Changes
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Assign Curator</label>
                  <Select value={curatorAssignment} onValueChange={setCuratorAssignment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select curator" />
                    </SelectTrigger>
                    <SelectContent>
                      {curators.map((curator) => (
                        <SelectItem 
                          key={curator.id} 
                          value={curator.id}
                          disabled={!curator.available}
                        >
                          {curator.name} ({curator.specialty})
                          {!curator.available && " - Unavailable"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="sm" 
                    className="w-full mt-2" 
                    onClick={handleCuratorAssignment}
                    disabled={!curatorAssignment}
                  >
                    Assign Curator
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority Level</label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Set priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Adjust Genre</label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger>
                      <SelectValue placeholder="Correct genre if needed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronic">Electronic</SelectItem>
                      <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                      <SelectItem value="indie-rock">Indie Rock</SelectItem>
                      <SelectItem value="folk">Folk</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Communication Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Notes & Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Review Notes (for artist)</label>
                  <Textarea
                    placeholder="Add notes that will be shared with the artist..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Internal Notes (admin only)</label>
                  <Textarea
                    placeholder="Add internal notes for admin team..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button onClick={handleSaveNotes} className="w-full">
                  Save Notes
                </Button>
              </CardContent>
            </Card>

            {/* Artist Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Artist Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <h3 className="font-medium">{submission.artistName}</h3>
                  <p className="text-sm text-muted-foreground">{submission.country}</p>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    {submission.email}
                  </Button>
                  {submission.socialLinks.website && (
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </Button>
                  )}
                  {submission.socialLinks.instagram && (
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Instagram
                    </Button>
                  )}
                </div>

                <div className="text-center pt-2 border-t">
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Quality Score: {submission.qualityScore}/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSubmissionReview;