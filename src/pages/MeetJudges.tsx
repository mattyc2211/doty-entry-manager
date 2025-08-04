import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FormHeader from '@/components/FormHeader';
import { Award, Globe, MapPin } from 'lucide-react';
import lindaStevens from '@/assets/linda-stevens.jpg';
import yogeshTuteja from '@/assets/yogesh-tuteja.jpg';
import kimTosi from '@/assets/kim-tosi.jpg';

const MeetJudges = () => {
  const judges = [
    {
      name: "Linda Stevens",
      country: "Australia",
      flag: "🇦🇺",
      image: lindaStevens
    },
    {
      name: "Yogesh Tuteja", 
      country: "India",
      flag: "🇮🇳",
      image: yogeshTuteja
    },
    {
      name: "Kim Tosi",
      country: "Australia",
      flag: "🇦🇺",
      image: kimTosi
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



          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {judges.map((judge, index) => (
              <Card key={index} className="shadow-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4">
                    <img 
                      src={judge.image} 
                      alt={`${judge.name} - Judge`}
                      className="w-32 h-32 rounded-full object-cover mx-auto shadow-md"
                    />
                  </div>
                  <CardTitle className="text-xl mb-2">{judge.name}</CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit mx-auto">
                    <span className="text-lg">{judge.flag}</span>
                    <MapPin className="w-3 h-3" />
                    {judge.country}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    International dog show judge with extensive experience in breed standards and conformation.
                  </p>
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