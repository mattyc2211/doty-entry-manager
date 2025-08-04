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
                  <p className="text-muted-foreground">March 15-17, 2025</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Registration Deadline</h4>
                  <p className="text-muted-foreground">February 28, 2025</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Entry Fees</h4>
                  <p className="text-muted-foreground">$30 per event</p>
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
                  <p className="text-muted-foreground">Auckland Showgrounds<br />217 Green Lane West, Epsom</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Facilities</h4>
                  <p className="text-muted-foreground">Indoor rings, grooming areas, parking available</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Competition Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Confirmation</h4>
                  <p className="text-sm text-muted-foreground">Assessment of breed standards and conformation</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Movement</h4>
                  <p className="text-sm text-muted-foreground">Evaluation of gait and athletic ability</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Temperament</h4>
                  <p className="text-sm text-muted-foreground">Assessment of character and behavior</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Show History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                The NZ Premier Show Dog of the Year has been New Zealand's most prestigious canine event since 1985. 
                Each year, the finest dogs from across the country compete for the ultimate title. Our show celebrates 
                the beauty, athleticism, and temperament that make each breed unique, while promoting responsible 
                breeding practices and the human-canine bond.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                With over 200 breeds eligible to compete and judges from around the world, this event showcases 
                the very best of New Zealand's dog breeding community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutShow;