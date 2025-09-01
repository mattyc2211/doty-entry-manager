import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Calendar, CalendarCheck, Trophy, Users, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FormHeader from '@/components/FormHeader';
import AdminNavButton from '@/components/AdminNavButton';
const Home = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FormHeader />
      
      {/* Admin Nav Button */}
      <div className="fixed top-4 right-4 z-50">
        <AdminNavButton />
      </div>
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-20">
            {/* Competition Image */}
            <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden mb-10">
              <img src="/lovable-uploads/5f3a049a-ea83-488a-82c1-3554b63b2466.png" alt="2025 Show Dog of the Year - Royal Canin New Zealand Premier Show" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            
              {/* Key Details */}
              <div className="mb-10">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  Saturday - 13 December 2025
                </div>
                <div className="text-xl md:text-2xl text-muted-foreground mb-6">
                  Purina Pro Plan Auckland Exhibition Centre<br />
                  743 Papakura-Clevedon Road, Ardmore
                </div>
                <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                  New Zealand's most prestigious dog show competition. 
                  Where champions are crowned and legends are born.
                </p>
                
                {/* Important Dates */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <p className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Show Date:</span>
                    Saturday - 13 December 2025
                  </p>
                  <p className="flex items-center gap-2 text-lg">
                    <CalendarCheck className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Entries Closed:</span>
                    17 October 2025
                  </p>
                </div>
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
          <div className="grid md:grid-cols-1 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 text-primary mr-2" />
                  Qualification Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Only qualified dogs can compete.</strong> Dogs must have won at shows between 14 October 2024 - 14 October 2025.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/qualified-participants')}
                  className="w-full"
                >
                  View Qualified Participants
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default Home;