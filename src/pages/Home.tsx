import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Calendar, Trophy, Users, Phone, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FormHeader from '@/components/FormHeader';
const Home = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FormHeader />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section - 2025 Show Dog of the Year */}
          <div className="text-center mb-20">
            {/* Year Badge */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full mb-8 shadow-lg">
              <span className="text-2xl font-bold text-primary-foreground">2025</span>
            </div>
            
            {/* Main Title */}
            
            
            {/* Subtitle */}
            
            
            {/* Competition Image */}
            <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden my-10">
              <img src="/lovable-uploads/5f3a049a-ea83-488a-82c1-3554b63b2466.png" alt="2025 Show Dog of the Year - Royal Canin New Zealand Premier Show" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            
            {/* Key Details */}
            <div className="mb-10">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-4">
                13 December 2025
              </div>
              <div className="text-xl md:text-2xl text-muted-foreground mb-6">
                Ardmore Exhibition Centre, Auckland
              </div>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                New Zealand's most prestigious dog show competition. 
                Where champions are crowned and legends are born.
              </p>
            </div>
            
            {/* Main CTA */}
            <Button size="lg" className="text-xl px-12 py-6 shadow-lg hover:shadow-xl transition-all duration-300" onClick={() => navigate('/entry')}>
              <Trophy className="w-6 h-6 mr-3" />
              Enter the Competition
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>

          {/* Competition Highlights */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Ultimate Championship</CardTitle>
                <CardDescription className="text-base">
                  Compete for New Zealand's most prestigious dog show title
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Elite Recognition</CardTitle>
                <CardDescription className="text-base">
                  Join the ranks of New Zealand's finest show dogs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Expert Judging</CardTitle>
                <CardDescription className="text-base">
                  Evaluated by renowned international judges
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Essential Information */}
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
    </div>;
};
export default Home;