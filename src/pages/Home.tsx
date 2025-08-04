import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Calendar, Camera, CreditCard, Trophy, Users, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FormHeader from '@/components/FormHeader';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FormHeader />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <Award className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Welcome to New Zealand's Premier Dog Show
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join us for the most prestigious canine competition in New Zealand. 
              Register your champion today and compete for the title of Show Dog of the Year 2025.
            </p>
            
            {/* Main Action Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg cursor-pointer"
                    onClick={() => navigate('/entry')}>
                <CardHeader className="text-center pb-4">
                  <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-2xl">Competition Entry</CardTitle>
                  <CardDescription className="text-base">
                    Register your dog for the full competition experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-muted-foreground">• Full judging in all categories</p>
                    <p className="text-sm text-muted-foreground">• Professional photography</p>
                    <p className="text-sm text-muted-foreground">• Awards ceremony participation</p>
                    <p className="text-sm text-muted-foreground">• Show catalogue inclusion</p>
                  </div>
                  <Button size="lg" className="w-full">
                    Enter Competition
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-muted-foreground/20 hover:border-muted-foreground/40 transition-all duration-300 hover:shadow-lg cursor-pointer"
                    onClick={() => navigate('/entry')}>
                <CardHeader className="text-center pb-4">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="text-2xl">Catering & Catalogues</CardTitle>
                  <CardDescription className="text-base">
                    Join us for the day with catering and merchandise only
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-muted-foreground">• Spectator access</p>
                    <p className="text-sm text-muted-foreground">• Catering packages</p>
                    <p className="text-sm text-muted-foreground">• Official catalogues</p>
                    <p className="text-sm text-muted-foreground">• Merchandise available</p>
                  </div>
                  <Button variant="outline" size="lg" className="w-full">
                    Catering Only
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Calendar className="w-5 h-5 text-primary mr-2" />
                <CardTitle className="text-lg">Important Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Event Date:</span>
                  <span className="text-sm font-medium">March 15, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Registration Deadline:</span>
                  <span className="text-sm font-medium">March 8, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Entry Fee:</span>
                  <span className="text-sm font-medium">$45 per dog</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Camera className="w-5 h-5 text-primary mr-2" />
                <CardTitle className="text-lg">Photo Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  High-quality photos required for all entries
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Minimum 300 DPI resolution</p>
                  <p>• Clear, well-lit images</p>
                  <p>• Dog in show stance preferred</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CreditCard className="w-5 h-5 text-primary mr-2" />
                <CardTitle className="text-lg">Payment Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Secure online payment processing
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Credit/Debit cards accepted</p>
                  <p>• PayPal available</p>
                  <p>• Immediate confirmation</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 text-primary mr-2" />
                Key Rules & Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <p>• All dogs must be registered with NZKC</p>
                  <p>• Vaccination certificates required</p>
                  <p>• Professional grooming recommended</p>
                  <p>• Handler must be present for judging</p>
                </div>
                <div className="space-y-2">
                  <p>• Judging begins at 9:00 AM</p>
                  <p>• Awards ceremony at 4:00 PM</p>
                  <p>• Professional photography included</p>
                  <p>• Catering available throughout the day</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Need assistance with your entry? Contact our team at{' '}
              <a href="mailto:entries@nzpremierdogshow.co.nz" className="text-primary hover:underline">
                entries@nzpremierdogshow.co.nz
              </a>{' '}
              or call <span className="font-medium">0800-DOG-SHOW</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;