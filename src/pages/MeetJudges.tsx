import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FormHeader from '@/components/FormHeader';
import { Award, Globe, MapPin } from 'lucide-react';

const MeetJudges = () => {
  const judges = [
    {
      name: "Sarah Mitchell",
      country: "New Zealand",
      specialties: ["Working Group", "Herding Group"],
      experience: "25 years",
      achievements: ["FCI International Judge", "ANKC All Breeds Judge"],
      bio: "Sarah has been judging for over two decades and specializes in working and herding breeds. She has judged at prestigious shows across Australia and New Zealand."
    },
    {
      name: "Dr. James Robertson", 
      country: "Australia",
      specialties: ["Toy Group", "Non-Sporting Group"],
      experience: "30 years",
      achievements: ["AKC Licensed Judge", "Kennel Club International Judge"],
      bio: "A veterinarian by training, Dr. Robertson brings both medical expertise and breed knowledge to his judging. He has awarded Best in Show at major international events."
    },
    {
      name: "Helena Andersson",
      country: "Sweden", 
      specialties: ["Sporting Group", "Hound Group"],
      experience: "20 years",
      achievements: ["FCI Judge", "European Dog Show Judge"],
      bio: "Helena is renowned for her expertise in sporting and hound breeds. She has judged at Crufts and numerous European championship shows."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <FormHeader />
      
      <div className="pt-40 pb-8 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Meet Our Judges</h1>
            <p className="text-xl text-muted-foreground">World-class expertise from internationally recognized judges</p>
          </div>

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
                  <div>
                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-primary" />
                      Experience
                    </h4>
                    <p className="text-muted-foreground">{judge.experience}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      {judge.specialties.map((specialty, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-primary" />
                      Achievements
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {judge.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></div>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">About</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{judge.bio}</p>
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