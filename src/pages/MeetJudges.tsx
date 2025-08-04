import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FormHeader from '@/components/FormHeader';
import { Award, Globe, MapPin } from 'lucide-react';

const MeetJudges = () => {
  const judges = [
    {
      name: "Linda Stevens",
      country: "Australia"
    },
    {
      name: "Yogesh Tuteja", 
      country: "India"
    },
    {
      name: "Kim Tosi",
      country: "Australia"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <FormHeader />
      
      <div className="pt-40 pb-8 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Meet Our Judges</h1>
            <p className="text-xl text-muted-foreground">World-class expertise from internationally recognized judges</p>
          </div>


          <Card className="shadow-card mb-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Judge Information Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed information about our international judges will be available shortly. 
                  Please check back for updates on their experience, specialties, and achievements.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {judges.map((judge, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{judge.name}</CardTitle>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {judge.country}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-muted-foreground italic">More details to follow</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-card mt-8">
            <CardHeader>
              <CardTitle>Judging Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Individual Examination</h4>
                  <p className="text-sm text-muted-foreground">Each dog is examined individually for breed standards</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Movement Assessment</h4>
                  <p className="text-sm text-muted-foreground">Evaluation of gait and movement patterns</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Final Comparison</h4>
                  <p className="text-sm text-muted-foreground">Direct comparison and final placement decisions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MeetJudges;