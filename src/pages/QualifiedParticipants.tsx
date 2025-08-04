import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FormHeader from '@/components/FormHeader';
import { Calendar, Trophy, Info } from 'lucide-react';
import { QUALIFICATION_REQUIREMENTS, QUALIFICATION_PERIOD, EVENT_TYPES } from '@/types/form';

const QualifiedParticipants = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <FormHeader />
      
      <div className="pt-40 pb-8 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Qualified Participants</h1>
            <p className="text-xl text-muted-foreground">Dogs qualified for the 2025 Premier Show</p>
          </div>

          <div className="space-y-8">
            {/* Qualification Period */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Calendar className="w-6 h-6" />
                  Qualification Period
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground mb-2">
                  October 14, 2024 - October 14, 2025
                </p>
                <p className="text-muted-foreground">
                  Dogs must have achieved their qualifying wins during this period to be eligible for the 2025 Premier Show.
                </p>
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
                <div className="space-y-6">
                  {EVENT_TYPES.map((eventType) => (
                    <div key={eventType} className="border-l-4 border-primary pl-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{eventType}</h3>
                      <p className="text-muted-foreground">
                        {QUALIFICATION_REQUIREMENTS[eventType]}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Participant List Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Info className="w-6 h-6" />
                  Qualified Participants List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The list of qualified participants will be updated regularly as entries are received and processed. 
                  Please check back periodically to see the latest qualified dogs for each category.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualifiedParticipants;