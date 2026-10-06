import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// Blog Routes (Public)
import Index from "./pages/Index";
import Blog from "./pages/blog/Blog";
import BlogPost from "./pages/blog/BlogPost";
import SubmitMusic from "./pages/blog/SubmitMusic";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Terms from "./pages/Terms";
import DMCA from "./pages/DMCA";
import Disclaimer from "./pages/Disclaimer";


// Admin Routes
import AdminLogin from "./pages/admin/AdminLogin";
import AdminContent from "./pages/admin/AdminContent";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

import NotFound from "./pages/NotFound";
import Unsubscribe from "./pages/Unsubscribe";
import { RequireAdmin } from "./components/RequireAdmin";
import { PageMetadata } from "./components/PageMetadata";

const queryClient = new QueryClient();

console.log('App.tsx loaded');

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageMetadata />
          <Routes>
          {/* Blog Routes (Public Access) */}
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/post/:id" element={<BlogPost />} />
          <Route path="/blog/submit" element={<SubmitMusic />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/dmca" element={<DMCA />} />
          <Route path="/disclaimer" element={<Disclaimer />} />


          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/content" element={<RequireAdmin><AdminContent /></RequireAdmin>} />
          <Route path="/admin/settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
          <Route path="/admin/analytics" element={<RequireAdmin><AdminAnalytics /></RequireAdmin>} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
