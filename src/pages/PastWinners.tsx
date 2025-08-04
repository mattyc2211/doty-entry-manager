import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FormHeader from '@/components/FormHeader';
import { Trophy, Calendar, User } from 'lucide-react';

const PastWinners = () => {
  const winners = [
    {
      year: 2024,
      dogName: "Ch. Royal Thunder",
      breed: "German Shepherd",
      owner: "Emma Thompson",
      handler: "Michael Davis",
      achievements: ["Best in Show", "Working Group Winner", "People's Choice"]
    },
    {
      year: 2023,
      dogName: "Ch. Golden Dawn",
      breed: "Golden Retriever", 
      owner: "Sarah Wilson",
      handler: "Sarah Wilson",
      achievements: ["Best in Show", "Sporting Group Winner", "Best Movement"]
    },
    {
      year: 2022,
      dogName: "Ch. Midnight Express",
      breed: "Border Collie",
      owner: "David Chen",
      handler: "Lisa Rodriguez",
      achievements: ["Best in Show", "Herding Group Winner", "Best Temperament"]
    },
    {
      year: 2021,
      dogName: "Ch. Crimson Rose",
      breed: "Standard Poodle",
      owner: "Jennifer Adams",
      handler: "Robert Taylor",
      achievements: ["Best in Show", "Non-Sporting Group Winner"]
    }
  ];

  const groupWinners2024 = [
    { group: "Sporting Group", dog: "Ch. Field Marshal", breed: "Labrador Retriever" },
    { group: "Hound Group", dog: "Ch. Swift Arrow", breed: "Greyhound" },
    { group: "Working Group", dog: "Ch. Royal Thunder", breed: "German Shepherd" },
    { group: "Terrier Group", dog: "Ch. Brave Heart", breed: "Jack Russell Terrier" },
    { group: "Toy Group", dog: "Ch. Little Star", breed: "Papillon" },
    { group: "Non-Sporting Group", dog: "Ch. Noble Spirit", breed: "Dalmatian" },
    { group: "Herding Group", dog: "Ch. Storm Chaser", breed: "Australian Cattle Dog" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <FormHeader />
      
      <div className="pt-40 pb-8 container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Past Winners</h1>
            <p className="text-xl text-muted-foreground">Celebrating our champions through the years</p>
          </div>

          <div className="space-y-6">
            {winners.map((winner, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{winner.dogName}</CardTitle>
                        <p className="text-muted-foreground">{winner.breed}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                      <Calendar className="w-3 h-3" />
                      {winner.year} Champion
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-medium">Owner:</span>
                        <span className="text-muted-foreground">{winner.owner}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-medium">Handler:</span>
                        <span className="text-muted-foreground">{winner.handler}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Achievements</h4>
                      <div className="flex flex-wrap gap-1">
                        {winner.achievements.map((achievement, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                2024 Group Winners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupWinners2024.map((winner, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 bg-card">
                    <h4 className="font-semibold text-primary mb-1">{winner.group}</h4>
                    <p className="font-medium text-foreground">{winner.dog}</p>
                    <p className="text-sm text-muted-foreground">{winner.breed}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Hall of Fame Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">40</div>
                  <div className="text-sm text-muted-foreground">Years Running</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">156</div>
                  <div className="text-sm text-muted-foreground">Breeds Represented</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">2,800+</div>
                  <div className="text-sm text-muted-foreground">Dogs Competed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">15</div>
                  <div className="text-sm text-muted-foreground">Countries Represented</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PastWinners;