import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FormHeader from '@/components/FormHeader';
import { Calendar, MapPin, Trophy, Users } from 'lucide-react';

const AboutShow = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <FormHeader />
      
      <div className="pt-40 pb-8 container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">About the Show</h1>
            <p className="text-xl text-muted-foreground">New Zealand's Premier Dog Show Competition</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground">Date</h4>
                  <p className="text-muted-foreground">Saturday - 13 December 2025</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Registration Deadline</h4>
                  <p className="text-muted-foreground">17 October 2025</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Entry Fees</h4>
                  <p className="text-muted-foreground">$30.00 per entry (catalogue included)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Venue Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground">Location</h4>
                  <p className="text-muted-foreground">Purina Pro Plan Auckland Exhibition Centre<br />743 Papakura-Clevedon Road, Ardmore, Auckland</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Dress Code</h4>
                  <p className="text-muted-foreground">Evening/Formal attire required for evening function. No jeans or jandals</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Competition Categories & Judging
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Show Dog</h4>
                  <p className="text-sm text-muted-foreground">Open to dogs that won "BEST IN SHOW" at qualifying shows</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Puppy</h4>
                  <p className="text-sm text-muted-foreground">Open to puppies that won "BABY/MINOR/PUPPY IN SHOW" at qualifying shows</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Neuter</h4>
                  <p className="text-sm text-muted-foreground">Open to neuters that won "NEUTER BEST/RESERVE IN SHOW" at qualifying shows</p>
                </div>
              </div>
              <div className="border-t pt-6">
                <h4 className="font-semibold text-foreground mb-3">Professional Judging Panel</h4>
                <p className="text-sm text-muted-foreground">Three highly experienced professional judges will evaluate each entry using a comprehensive baton system to ensure fair and consistent assessment.</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Evening Function Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground">Dinner</h4>
                  <p className="text-muted-foreground">Spit Roast - $45.00 per person</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">BYO Policy</h4>
                  <p className="text-muted-foreground">BYO beer and wine only</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground">Facilities</h4>
                  <p className="text-muted-foreground">Professional exhibition centre with indoor rings, grooming areas, and ample parking</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Schedule</h4>
                  <p className="text-muted-foreground">Competition during the day followed by awards ceremony and evening function</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutShow;