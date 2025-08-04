import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Calendar, Trophy, Users, Phone, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FormHeader from '@/components/FormHeader';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FormHeader />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section with Image */}
          <div className="text-center mb-16">
            <div className="relative h-[200px] md:h-[250px] rounded-lg overflow-hidden mb-8">
              <img 
                src="/lovable-uploads/5f3a049a-ea83-488a-82c1-3554b63b2466.png" 
                alt="Royal Canin New Zealand Premier Show featuring our international judges"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Key Information */}
            <div className="mb-8">
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ardmore Exhibition Centre, Auckland
              </div>
              <div className="text-xl md:text-2xl text-muted-foreground mb-6">
                13 December 2025
              </div>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Featuring the top dogs across the country
              </p>
            </div>
            
            {/* Main CTA */}
            <Button 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => navigate('/entry')}
            >
              Start Your Entry
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Quick Navigation */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/entry')}>
              <CardHeader className="text-center pb-2">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Entry Form</CardTitle>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/judges')}>
              <CardHeader className="text-center pb-2">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Meet Judges</CardTitle>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/winners')}>
              <CardHeader className="text-center pb-2">
                <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Past Winners</CardTitle>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/about')}>
              <CardHeader className="text-center pb-2">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">About Show</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Essential Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 text-primary mr-2" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Show Date:</span>
                  <span className="font-medium">13 December 2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Entries Close:</span>
                  <span className="font-medium">22 September 2025</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 text-primary mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href="mailto:nzdoty@gmail.com" className="text-primary hover:underline">
                    nzdoty@gmail.com
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">
                  Contact us for any questions about entries or the show
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;