import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FormHeader from '@/components/FormHeader';
import { Calendar, Trophy, MapPin, DollarSign, Phone } from 'lucide-react';
import { QUALIFICATION_REQUIREMENTS, QUALIFICATION_PERIOD, EVENT_TYPES } from '@/types/form';

const QualifiedParticipants = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <FormHeader />
      
      <div className="pt-40 pb-8 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Qualification Requirements</h1>
            <p className="text-xl text-muted-foreground">Eligibility criteria for the 2025 NZ Premier Dog Show</p>
          </div>

          <div className="space-y-8">
            {/* Important Dates */}
            <Card className="shadow-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Calendar className="w-6 h-6" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-foreground mb-2">
                    Qualification Period: October 14, 2024 - October 14, 2025
                  </p>
                  <p className="text-muted-foreground">
                    All qualifying wins must be achieved during this period.
                  </p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-foreground mb-2">
                    Entries Close: October 17, 2025
                  </p>
                  <p className="text-muted-foreground">
                    All entries must be submitted by this date.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Qualification Requirements */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Trophy className="w-6 h-6" />
                  Qualification Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {EVENT_TYPES.map((eventType) => {
                    const requirements = QUALIFICATION_REQUIREMENTS[eventType];
                    return (
                      <div key={eventType} className="border border-border rounded-lg p-6">
                        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-primary" />
                          {requirements.title}
                        </h3>
                        <div className="space-y-3">
                          <p className="text-muted-foreground leading-relaxed">
                            {requirements.requirement}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Entry Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <DollarSign className="w-6 h-6" />
                  Entry Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Entry Fee</p>
                    <p className="text-muted-foreground">$30 per dog per event</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Dinner Tickets</p>
                    <p className="text-muted-foreground">$45 per person</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Venue Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <MapPin className="w-6 h-6" />
                  Venue Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-foreground">Papakura Exhibition Centre</p>
                    <p className="text-muted-foreground">243 Papakura Clevedon Road, Ardmore, Auckland</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Phone className="w-6 h-6" />
                  Questions About Qualification?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about whether your dog qualifies or need clarification on the requirements, please visit:
                </p>
                <a 
                  href="https://www.nzdogoftheyear.info" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-medium underline"
                >
                  www.nzdogoftheyear.info
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualifiedParticipants;